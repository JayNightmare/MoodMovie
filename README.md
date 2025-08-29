# Mood → Movie

A minimal, elegant React web app that asks a short, adaptive sequence of questions about your mood and preferences, then recommends the top 3 movies for you.

![Screenshot 1](screenshots/screenshot1.png)
![Screenshot 2](screenshots/screenshot2.png)

## Tech Stack

- **Frontend:** React (Vite), JavaScript
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Backend:** Cloudflare Worker (serverless functions)
- **AI:** OpenRouter
- **Movie Data:** OMDb & TMDb

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm
- A Cloudflare account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/movie-picker.git
    cd movie-picker
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    -   **Web App:** Copy `apps/web/.env.example` to `apps/web/.env` and set the `VITE_API_BASE` to your Cloudflare Worker's local development URL (`http://127.0.0.1:8787`).

    -   **Cloudflare Worker:**
        -   Copy `apps/worker/.env.example` to `apps/worker/.env`.
        -   You'll need API keys from [OpenRouter](https://openrouter.ai/), [OMDb](http://www.omdbapi.com/apikey.aspx), and [TMDb](https://www.themoviedb.org/settings/api).
        -   You'll also need a [Discord Webhook URL](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks).
        -   Set these secrets for your worker using the `wrangler secret put` command:
            ```bash
            pnpm --filter worker wrangler secret put OPENROUTER_API_KEY
            pnpm --filter worker wrangler secret put OMDB_API_KEY
            pnpm --filter worker wrangler secret put TMDB_API_KEY
            pnpm --filter worker wrangler secret put DISCORD_WEBHOOK_URL
            ```

### Running Locally

1.  **Start the Cloudflare Worker:**
    ```bash
    pnpm worker:dev
    ```

2.  **In a new terminal, start the React app:**
    ```bash
    pnpm dev
    ```

    The app will be available at `http://localhost:3000`.

## Deployment

### Cloudflare Worker

Deploy the worker to your Cloudflare account:

```bash
pnpm worker:deploy
```

Update `apps/web/.env.production` with your production worker URL.

### GitHub Pages

The repository includes a GitHub Action workflow in `.github/workflows/deploy-gh-pages.yml` to automatically build and deploy the React app to GitHub Pages when you push to the `main` branch.

You will need to:
1.  Enable GitHub Pages in your repository settings for the `gh-pages` branch.
2.  Update the `base` property in `apps/web/vite.config.js` to match your repository name (e.g., `/your-repo-name/`).
3.  **Important**: Manually edit `apps/web/index.html` and replace `YOUR_WORKER_URL_HERE` in the `Content-Security-Policy` meta tag with your production Cloudflare Worker URL.
4.  Update the `ALLOWED_ORIGINS` variable in your production Cloudflare Worker environment to include your GitHub Pages URL.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
