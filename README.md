# Muscord

A Discord bot built with TypeScript and deployed on Cloudflare Workers. Muscord
handles slash commands, interactive buttons, and modals, with integrations for
AI-powered responses (via Gemini) and Rule34 content search.

## Features

- **`/ask`** — Ask a question and get a streamed AI response powered by Gemini
  2.5 Flash, formatted in Discord Markdown
- **`/ping`** — Basic connectivity test; replies with "Pong!"
- **`/countdown`** — Starts a live countdown timer for a given number of seconds
- **`/r34`** — Search Rule34 posts by tags with autocomplete, with optional tag
  presets and configurable result limits (NSFW-only channels)
- **`/r34_presets`** — Create, search, update, and delete saved tag preset
  groups for use with `/r34`
- **`/r34_show_one`** — Display a single Rule34 post by ID
- **Interactive buttons** — Inline "show one" buttons on `/r34` results for
  fetching individual post details

## Tech Stack

| Layer                | Technology                                                                                                                                                                              |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime              | [Cloudflare Workers](https://workers.cloudflare.com/)                                                                                                                                   |
| Web framework        | [Hono](https://hono.dev/)                                                                                                                                                               |
| Discord interactions | [disteractions](https://github.com/tuasananh/disteractions), [@discordjs/builders](https://github.com/discordjs/discord.js), [@discordjs/rest](https://github.com/discordjs/discord.js) |
| AI                   | [Google Gemini](https://ai.google.dev/) via `@google/genai`                                                                                                                             |
| Database             | Cloudflare D1 (SQLite)                                                                                                                                                                  |
| KV storage           | Cloudflare KV                                                                                                                                                                           |
| Language             | TypeScript                                                                                                                                                                              |
| Package manager      | pnpm                                                                                                                                                                                    |
| Testing              | Vitest with `@cloudflare/vitest-pool-workers`                                                                                                                                           |
| Linting / formatting | ESLint + Prettier                                                                                                                                                                       |

## Project Structure

```plaintext
src/
├── index.ts                        # Hono app entry point; wires up middleware and interaction handler
├── register.ts                     # CLI script to register slash commands with Discord
├── apis/
│   └── rule34/                     # Rule34Client: fetch posts, autocomplete tags, format responses
├── interactions/
│   ├── commands/                   # Slash command definitions (ask, countdown, ping, r34, r34_presets, r34_show_one, register_commands)
│   ├── buttons/                    # Button interaction handlers (r34_show_one button)
│   └── modals/                     # Modal handlers for r34_presets create/update/delete
├── scripts/
│   ├── codegen.ts                  # Entry point for the codegen script
│   └── generator.ts                # Auto-generates index barrels for commands, buttons, and modals
├── types/
│   └── environment.ts              # MuscordEnv interface (Hono env with Cloudflare bindings + typed variables)
└── utils/
    └── index.ts                    # Shared DisteractionsFactory instance and helpers

migrations/
└── 0001_create_r34_presets_table.sql   # D1 migration: r34_presets table

test/
└── index.spec.ts                   # Vitest integration test (Cloudflare Workers pool)
```

## Setup

### Prerequisites

- Node.js 25+
- pnpm 11+
- A [Cloudflare account](https://dash.cloudflare.com/) with Workers, D1, and KV
  access
- A [Discord application](https://discord.com/developers/applications) with a
  bot user
- A [Google AI Studio](https://aistudio.google.com/) API key (for `/ask`)
- A Rule34 API key and user ID (for `/r34` commands)

### Installation

```bash
git clone https://github.com/tuasananh/muscord.git
cd muscord
pnpm install
```

### Environment Variables

Copy the example env file and fill in your values:

```bash
cp example.dev.vars .dev.vars
```

| Variable                       | Description                                               | Required             |
| ------------------------------ | --------------------------------------------------------- | -------------------- |
| `DISCORD_APPLICATION_ID`       | Discord application ID                                    | Yes                  |
| `DISCORD_APPLICATION_OWNER_ID` | Owner's Discord user ID (for admin commands)              | Yes                  |
| `DISCORD_PUBLIC_KEY`           | Discord application public key (for request verification) | Yes                  |
| `DISCORD_TOKEN`                | Discord bot token                                         | Yes                  |
| `DISCORD_GUILD_ID`             | Guild ID for registering guild-scoped commands            | Yes (for `register`) |
| `RULE34_API_KEY`               | Rule34 API key                                            | Yes                  |
| `RULE34_USER_ID`               | Rule34 user ID                                            | Yes                  |
| `GEMINI_API_KEY`               | Google Gemini API key                                     | Yes                  |

### Discord Application Setup

1. Go to the
   [Discord Developer Portal](https://discord.com/developers/applications) and
   create an application.
2. Under **Bot**, create a bot user and copy the token.
3. Under **OAuth2**, generate an invite URL with the `applications.commands`
   scope and invite the bot to your server.
4. Copy the **Public Key** and **Application ID** from the General Information
   page.

### Database Setup

Run the D1 migration to create the `r34_presets` table:

```bash
wrangler d1 migrations apply prod-muscord
```

## Development

Start the local development server (runs Prettier, ESLint, then `wrangler dev`):

```bash
pnpm dev
```

The bot will be available at `http://localhost:8787`. Use ngrok (or any tunnel)
to expose it to Discord:

```bash
pnpm ngrok
```

Then set the tunnel URL as the **Interactions Endpoint URL** in your Discord
application settings.

## Registering Commands

Register commands to a specific guild (faster for development):

```bash
pnpm register
```

Register commands globally (takes up to an hour to propagate):

```bash
pnpm register -- --global
```

## Available Scripts

| Script                    | Description                                                    |
| ------------------------- | -------------------------------------------------------------- |
| `pnpm dev` / `pnpm start` | Format, lint, and start the local Wrangler dev server          |
| `pnpm deploy`             | Deploy to Cloudflare Workers                                   |
| `pnpm register`           | Register slash commands with Discord (guild-scoped by default) |
| `pnpm codegen`            | Auto-generate index barrels for commands, buttons, and modals  |
| `pnpm build`              | Runs `pnpm register` (used in CI)                              |
| `pnpm test`               | Run the Vitest test suite                                      |
| `pnpm lint`               | Run ESLint across all files                                    |
| `pnpm format`             | Format all files with Prettier                                 |
| `pnpm format:check`       | Check formatting without writing                               |
| `pnpm cf-typegen`         | Generate TypeScript types from Wrangler bindings               |
| `pnpm ngrok`              | Open an ngrok tunnel on port 8787                              |

## Codegen

Commands, buttons, and modals are auto-discovered at build time. When you add a
new file to `src/interactions/commands/`, `src/interactions/buttons/`, or
`src/interactions/modals/`, run:

```bash
pnpm codegen
```

This regenerates the `_generated_*.ts` barrel files. CI will fail if these files
are out of date.

## CI

GitHub Actions runs on every push and pull request to `main`. The pipeline:

1. Installs dependencies (with pnpm cache)
2. Checks formatting with Prettier
3. Runs ESLint
4. Type-checks with `tsc --noEmit`
5. Runs codegen and verifies no uncommitted changes
6. Builds the project

Dependency updates are managed automatically via Dependabot (npm weekly, GitHub
Actions monthly).

## Testing

Tests run inside a Cloudflare Workers runtime pool via
`@cloudflare/vitest-pool-workers`, so they reflect the actual edge environment.

```bash
pnpm test
```

## License

Private — not licensed for public use.
