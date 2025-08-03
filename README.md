# AI Persons - Character Generator (Vue Edition)

This is a character generator application built with Vue 3, Vite, and Bootstrap. It allows users to create detailed fictional characters, generate random attributes, and optionally create an AI-generated portrait using the DALL-E 3 API.

This project is a Vue-based migration of the original Alpine.js project, `aipersonsnft`.

## Features

- **Dynamic Form**: A multi-tab form to edit various aspects of a character (identity, family, appearance, etc.).
- **Random Character Generation**: Uses `@faker-js/faker` to generate realistic random data for a new character with a single click.
- **AI Portrait Generation**: Integrates with OpenAI's DALL-E 3 to generate a photorealistic portrait based on the character's attributes.
- **Multi-language Support**: Supports both English and Persian (Farsi) with an easy-to-extend localization setup.
- **JSON Output**: Displays the complete character data as a clean JSON object, ready to be copied or downloaded.

## Project Setup

First, install the dependencies:

```sh
npm install
```
