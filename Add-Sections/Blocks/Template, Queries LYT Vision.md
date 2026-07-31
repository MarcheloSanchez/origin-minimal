RENAME - SOURCE and TAG
> [!Venetian]+ Unrequited notes
> These notes point directly to this note. But this note doesn't point back (yet). This is the strongest contextual query. **Outlinks + Tags**.
> 
> ```dataview
> LIST
> 
> FROM SOURCE
> and !outgoing(SOURCE)
> and -#TAG
> 
> SORT file.mtime desc
> ```

> [!Venetian]- Unmentioned notes in common
> These notes share the tag `#TAG` and are not mentioned above.
> 
> ```dataview
> LIST
> 
> FROM x#TAG
> and !outgoing(SOURCE)
> 
> SORT file.name asc
> ```

---

⬆️ [[🏡Home]]  *| `= this.file.mtime`*