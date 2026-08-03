from googletrans import Translator
import os

def translate_md_file(input_file, output_file):
    # Read the content of the input Markdown file
    with open(input_file, 'r', encoding='utf-8') as file:
        content = file.read()

    # Initialize the translator
    translator = Translator()

    # Translate the content
    translated = translator.translate(content, src='en', dest='cs').text

    # Write the translated content to the output file
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(translated)

# Example usage
input_file = '"C:\Users\YourName\Documents\Origin v1.6.0\+Inbox\+ About Inbox ℹ️.md"'  # Replace with your input file path
output_file = '"C:\Users\YourName\Documents\Origin v1.6.0\+Inbox\translation_INBOX.md"'  # Replace with your desired output file path
translate_md_file(input_file, output_file)