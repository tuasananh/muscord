# Muscord

A Discord bot built with TypeScript and Cloudflare Workers, featuring various utility commands and interactive features.

## Features

-   **Ping Command**: Basic connectivity test
-   **Dictionary Command**: Word definition lookup
-   **Timer Command**: Countdown functionality
-   **Rule34 Integration**: Content filtering and display commands
-   **Interactive Modals**: Custom forms and user input handling
-   **Button Components**: Interactive message components

## Tech Stack

-   **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/)
-   **Framework**: [Hono](https://hono.dev/) - Fast web framework for edge computing
-   **Discord API**: [@discordjs/core](https://github.com/discordjs/discord.js) and [@discordjs/rest](https://github.com/discordjs/discord.js)
-   **Language**: TypeScript
-   **Package Manager**: pnpm
-   **Testing**: Vitest with Cloudflare Workers pool

## Commands

| Command            | Description                   | Options                                     |
| ------------------ | ----------------------------- | ------------------------------------------- |
| `/ping`            | Responds with "Pong!"         | None                                        |
| `/dict <word>`     | Finds definitions of a word   | `word` - The word to define                 |
| `/timer <seconds>` | Countdown timer               | `seconds` - Number of seconds to count down |
| `/r34-filters`     | Manage rule34 content filters | `action` - Action to perform                |
| `/r34`             | Rule34 content search         | Various search parameters                   |
| `/r34-show-one`    | Display single rule34 result  | Search parameters                           |

## Setup

### Prerequisites

-   Node.js 18+
-   pnpm
-   Cloudflare account
-   Discord application

### Installation

1. Clone the repository:

```bash
git clone https://github.com/tuasananh/muscord.git
cd muscord
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
# Copy example environment file
cp example.dev.vars .dev.vars
```

4. Configure your `.dev.vars` file with:

```
DISCORD_TOKEN=your_bot_token_here
DISCORD_APPLICATION_ID=your_application_id_here
DISCORD_APPLICATION_OWNER_ID=your_user_id_here
```

### Discord Application Setup

1. Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a bot user and copy the token
3. Enable necessary intents (Message Content Intent if needed)
4. Generate OAuth2 URL with `applications.commands` scope

### Development

Start the development server:

```bash
pnpm dev
# or
pnpm start
```

The bot will be available at `http://localhost:8787`

### Deployment

Deploy to Cloudflare Workers:

```bash
pnpm deploy
```

## Configuration

### Wrangler Configuration

The bot is configured via `wrangler.toml`:

-   **Runtime**: Cloudflare Workers with Node.js compatibility
-   **Entry Point**: `src/index.ts`
-   **Environment Variables**: Defined in `[vars]` section

### Environment Variables

| Variable                       | Description                      | Required |
| ------------------------------ | -------------------------------- | -------- |
| `DISCORD_TOKEN`                | Discord bot token                | Yes      |
| `DISCORD_APPLICATION_ID`       | Discord application ID           | Yes      |
| `DISCORD_APPLICATION_OWNER_ID` | Owner user ID for admin commands | Yes      |

## Development Commands

```bash
# Start development server
pnpm dev

# Deploy to production
pnpm deploy

# Generate TypeScript types from Wrangler
pnpm cf-typegen

# Run tests
pnpm test

# Register Discord commands
pnpm register

# Start ngrok tunnel (for development)
pnpm ngrok
```

## Project Structure

```
src/
├── api.ts                 # Discord API client setup
├── index.ts              # Main Hono application
├── register.ts           # Command registration utility
├── commands/             # Slash command implementations
├── handlers/             # Interaction handlers
├── middlewares/          # Request middleware (Discord verification)
├── modals/              # Modal interaction handlers
├── buttons/             # Button interaction handlers
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Architecture

The bot uses a modular architecture:

1. **Hono Framework**: Handles HTTP requests and routing
2. **Interaction Handlers**: Process different Discord interaction types
3. **Command System**: Modular slash command implementation
4. **Middleware**: Discord request verification and API setup
5. **Type Safety**: Full TypeScript support with Discord API types

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## Testing

Run the test suite:

```bash
pnpm test
```

Tests are written using Vitest with Cloudflare Workers pool for realistic edge runtime testing.

## License

This project is private and not licensed for public use.

## Acknowledgments

This project was made possible with Cloudflare Workers and the Discord.js ecosystem.
