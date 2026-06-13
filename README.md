# Campaign Rocket

Self-Hosted Outbound Campaign Automation

Campaign Rocket is a workflow-driven outbound automation system that converts campaign objectives into real decision-makers, scored prospects, and personalized cold email drafts. It uses n8n for workflow orchestration, self-hosted local LLMs (Ollama) for text generation, Apify for LinkedIn and search data collection, and Google Workspace integrations for email delivery and calendar workflows. The frontend is deployed on Lovable and connects to a backend n8n instance via webhooks.

## Key components

- **Workflow engine:** n8n (backend workflows and orchestration)
- **Local LLMs / Hosted models:** Ollama (self-hosted option for on-host inference) and OpenRouter (Deepseek) for deployed/hosted model inference
- **Data collection:** Apify (LinkedIn/search scrapers)
- **Email & G Suite:** Google Workspace integrations for sending, tracking, and calendar actions
- **Hosting:** Backend n8n hosted on Render; frontend deployed on Lovable
- **Frontend-backend connectivity:** Webhooks (n8n ↔ frontend)

## Features

- Convert campaign objectives into action plans and prospect lists
- Scored prospecting using configurable scoring rules and enrichment
- Generate personalized cold email drafts using local LLMs
- Privacy-safe, self-hosted model option to control costs and data exposure
- Integrations for scraping, enrichment, and sending via Google Workspace

## Quick start (developer)

1. Clone the repository:

```sh
git clone <YOUR_GIT_URL>
cd campaign-rocket
```

2. Install frontend dependencies and run locally (if applicable):

```sh
npm install
npm run dev
```

3. Backend n8n workflows are hosted on Render in this setup. If you need to run n8n locally, follow n8n's docs and update webhook URLs to point to your local tunnel (ngrok/localtunnel) or your Render instance.

4. Configure integrations:
	- Ollama (optional self-hosted): ensure your local Ollama instance is running and reachable by n8n if you choose on-host inference.
	- OpenRouter / Deepseek (deployed models): if using hosted models, configure API keys/endpoints in n8n credentials.
	- Apify: set your Apify token and any actor IDs in n8n credentials.
	- Google Workspace: add OAuth credentials / service account details in n8n credentials.

5. Webhooks: the frontend expects the n8n webhook endpoints. Update `WEBHOOK_URL` (or similar env var) in the frontend config to point to your n8n instance.

## Deployment notes

- Backend: n8n workflows are deployed on Render. Manage workflows and credentials in the Render-hosted environment.
- Frontend: deployed via Lovable (see your Lovable project dashboard).
- When testing locally, use a tunnel (ngrok) and register the tunneled URL in n8n webhook nodes.

## Privacy & cost

- Self-hosted option — Ollama: keeps inference on-host for privacy and predictable costs.
- Deployed/hosted models — OpenRouter (Deepseek): may be used for hosted inference; evaluate privacy and cost tradeoffs when using hosted models.
- Apify scraping and Google Workspace API usage may incur third-party costs; follow each provider's usage limits and best practices.

## Contributing

Contributions are welcome. Open issues or PRs with clear descriptions of the change and rationale.

## Where to edit

- Frontend code: edit files in the `src/` folder and run `npm run dev`.
- Backend workflows: edit n8n flows in the Render-hosted n8n instance (or run n8n locally to edit and export flows).

## Support

If you need help setting up integrations, running n8n locally, or configuring Ollama, open an issue or contact the maintainers.

---
_This README was updated to reflect the project's architecture: n8n backend (Render), Lovable frontend, Ollama, Apify, and Google Workspace integrations._
