/**
 * Maturity Promotion Suggester for Origin PKM
 *
 * Analyzes notes and suggests maturity stage promotions based on:
 * - Outbound links count
 * - Inbound links (backlinks) count
 * - Days since last modification (stability)
 *
 * Usage (Templater):
 *   const promoter = await tp.user.maturity_promoter();
 *   const suggestions = promoter.getSuggestions(dv);
 *
 * Created: 2026-02-05
 */

module.exports = () => {
  // ============================================
  // MATURITY STAGE CONFIGURATION
  // ============================================

  // Canonical emoji values — keep in sync with metrics-core.js MATURITY_STAGES.
  // Change emoji here only; STAGES below references these via variables.
  const MV = {
    SEED:      '📤seed',
    SEEDLING:  '🌱seedling',
    SAPLING:   '🪴sapling',
    EVERGREEN: '🌲evergreen',
    FRUIT:     '🍓fruit'
  };

  const STAGES = {
    seed: {
      value: MV.SEED,
      rank: 1,
      next: MV.SEEDLING,
      criteria: {
        description: 'Raw capture, minimal context',
        exitCriteria: 'Basic metadata + folder move + 1 link'
      }
    },
    seedling: {
      value: MV.SEEDLING,
      rank: 2,
      next: MV.SAPLING,
      criteria: {
        minOutlinks: 2,
        minInlinks: 1,
        description: 'Early development, some links',
        exitCriteria: '5+ outlinks, 2+ backlinks, structured content'
      }
    },
    sapling: {
      value: MV.SAPLING,
      rank: 3,
      next: MV.EVERGREEN,
      criteria: {
        minOutlinks: 5,
        minInlinks: 2,
        minStabilityDays: 30,
        description: 'Growing content, rich connections',
        exitCriteria: '10+ outlinks, 5+ backlinks, 90+ days stable'
      }
    },
    evergreen: {
      value: MV.EVERGREEN,
      rank: 4,
      next: MV.FRUIT,
      criteria: {
        minOutlinks: 10,
        minInlinks: 5,
        minStabilityDays: 90,
        description: 'Stable, foundational knowledge',
        exitCriteria: 'Published externally, real-world application'
      }
    },
    fruit: {
      value: MV.FRUIT,
      rank: 5,
      next: null,
      criteria: {
        description: 'Original insight, external value',
        exitCriteria: 'Published, shared, or productized'
      }
    }
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Get stage configuration by value
   */
  const getStageByValue = (value) => {
    if (!value) return STAGES.seed;
    const normalized = String(value).toLowerCase();
    return Object.values(STAGES).find(s =>
      s.value.toLowerCase() === normalized ||
      normalized.includes(s.value.split('').pop()) // Match emoji or text
    ) || STAGES.seed;
  };

  /**
   * Get rank number from maturity value
   */
  const getRank = (maturity) => {
    const stage = getStageByValue(maturity);
    return stage.rank;
  };

  /**
   * Calculate suggested maturity based on metrics
   */
  const calculateSuggestedMaturity = (page, today) => {
    const outlinks = page.file.outlinks?.length ?? 0;
    const inlinks = page.file.inlinks?.length ?? 0;
    const daysSinceModified = today.diff(page.file.mtime, 'days')?.days ?? 0;

    // Check from highest to lowest
    if (outlinks >= 10 && inlinks >= 5 && daysSinceModified >= 90) {
      return STAGES.evergreen.value;
    }
    if (outlinks >= 5 && inlinks >= 2 && daysSinceModified >= 30) {
      return STAGES.sapling.value;
    }
    if (outlinks >= 2 && inlinks >= 1) {
      return STAGES.seedling.value;
    }
    return STAGES.seed.value;
  };

  /**
   * Generate reason string for promotion
   */
  const getPromotionReason = (page, suggested, today) => {
    const outlinks = page.file.outlinks?.length ?? 0;
    const inlinks = page.file.inlinks?.length ?? 0;
    const daysSinceModified = Math.round(today.diff(page.file.mtime, 'days')?.days ?? 0);

    return `${outlinks} outlinks, ${inlinks} backlinks, ${daysSinceModified} days stable`;
  };

  // ============================================
  // MAIN FUNCTIONS
  // ============================================

  /**
   * Get all promotion suggestions
   * @param {object} dv - Dataview API object
   * @param {object} options - Optional filters
   * @returns {array} - Array of suggestion objects
   */
  const getSuggestions = (dv, options = {}) => {
    try {
      const today = dv.date('today');
      const folder = options.folder || '"02-Knowledge"';
      const limit = options.limit || 20;

      const pages = dv.pages(folder).where(p =>
        p.type === 'atomic' && p.maturity
      );

      const suggestions = [];

      pages.forEach(p => {
        const currentMaturity = p.maturity;
        const suggestedMaturity = calculateSuggestedMaturity(p, today);

        const currentRank = getRank(currentMaturity);
        const suggestedRank = getRank(suggestedMaturity);

        // Only suggest promotions (higher rank), not demotions
        if (suggestedRank > currentRank) {
          suggestions.push({
            file: p.file.link,
            path: p.file.path,
            currentMaturity,
            suggestedMaturity,
            reason: getPromotionReason(p, suggestedMaturity, today),
            outlinks: p.file.outlinks?.length ?? 0,
            inlinks: p.file.inlinks?.length ?? 0,
            daysSinceModified: Math.round(today.diff(p.file.mtime, 'days')?.days ?? 0)
          });
        }
      });

      // Sort by highest potential first
      return suggestions
        .sort((a, b) => getRank(b.suggestedMaturity) - getRank(a.suggestedMaturity))
        .slice(0, limit);
    } catch (e) {
      console.error('maturity-promoter: getSuggestions error:', e);
      return [];
    }
  };

  /**
   * Render suggestions as Dataview table
   * @param {object} dv - Dataview API object
   * @param {object} options - Optional filters
   */
  const renderSuggestionsTable = (dv, options = {}) => {
    try {
      const suggestions = getSuggestions(dv, options);

      if (suggestions.length === 0) {
        dv.paragraph("✅ No maturity promotions suggested at this time.");
        return;
      }

      dv.header(3, `🌱 Suggested Maturity Promotions (${suggestions.length})`);

      dv.table(
        ["Note", "Current", "Suggested", "Reason"],
        suggestions.map(s => [
          s.file,
          s.currentMaturity,
          s.suggestedMaturity,
          s.reason
        ])
      );

      dv.paragraph(`\n*Tip: Run YAML Orchestrator to batch-update maturity fields*`);
    } catch (e) {
      dv.paragraph(`⚠️ Error rendering suggestions: ${e.message}`);
    }
  };

  /**
   * Get maturity distribution statistics
   * @param {object} dv - Dataview API object
   * @returns {object}
   */
  const getDistribution = (dv) => {
    try {
      const pages = dv.pages('"02-Knowledge"').where(p => p.maturity);
      const distribution = {};

      Object.values(STAGES).forEach(stage => {
        distribution[stage.value] = pages.where(p =>
          p.maturity === stage.value
        ).length ?? 0;
      });

      const total = Object.values(distribution).reduce((a, b) => a + b, 0);

      return {
        distribution,
        total,
        percentages: Object.fromEntries(
          Object.entries(distribution).map(([k, v]) => [
            k,
            total > 0 ? Math.round(v / total * 100) : 0
          ])
        )
      };
    } catch (e) {
      console.error('maturity-promoter: getDistribution error:', e);
      return { distribution: {}, total: 0, percentages: {} };
    }
  };

  // ============================================
  // PUBLIC API
  // ============================================

  return {
    STAGES,
    getRank,
    getStageByValue,
    calculateSuggestedMaturity,
    getSuggestions,
    renderSuggestionsTable,
    getDistribution
  };
};
