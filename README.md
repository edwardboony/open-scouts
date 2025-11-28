# Open Scouts

Create AI scouts that continuously search the web and notify you when they find what you're looking for.

## About

Open Scouts is an AI-powered monitoring platform that lets you create "scouts" - automated tasks that run on a schedule to continuously search for and track information. Whether you're looking for new restaurants near you, monitoring AI news, or tracking any other updates, scouts work 24/7 to find what you need and notify you when they discover it.

## Tech Stack

- **Next.js 16** (with App Router & Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Supabase** (Database + Edge Functions)
- **pgvector** (Vector embeddings for semantic search)
- **Firecrawl SDK** (@mendable/firecrawl-js)
- **OpenAI API** (AI Agent + Embeddings)
- **Resend** (Email Notifications)

## Getting Started

### Prerequisites

- Node.js 18+
- bun (default), npm, or pnpm
- Supabase account ([supabase.com](https://supabase.com))
- OpenAI API key ([platform.openai.com](https://platform.openai.com))
- Firecrawl API key ([firecrawl.dev](https://firecrawl.dev))
- Resend API key ([resend.com](https://resend.com)) - for email notifications

### 1. Clone and Install

```bash
git clone https://github.com/leonardogrig/open-scout
cd open-scout
bun install  # or: npm install / pnpm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com/dashboard)
2. Create a new project
3. Wait for the project to finish provisioning

### 3. Enable Required Extensions

In your Supabase Dashboard:

1. Go to **Database → Extensions**
2. Search for and enable:
   - `pg_cron` (for scheduled jobs)
   - `pg_net` (for HTTP requests)
   - `vector` (for AI-powered semantic search on execution summaries)

### 4. Set Up Environment Variables

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Then fill in your actual values in the `.env` file.

**The `.env.example` file contains all required environment variables with detailed instructions and direct links for where to obtain each API key.**

### 5. Run Database Setup

```bash
bun run setup:db  # or: npm run setup:db / pnpm run setup:db
```

This will:
- Create all required tables (`scouts`, `scout_executions`, `scout_execution_steps`, etc.)
- Enable real-time subscriptions
- Set up vector embeddings for AI-generated execution summaries
- Set up the cron job for automatic scout execution (runs hourly)

**Note:** The setup script will check if the `vector` extension is enabled. If not, follow the instructions to enable it in the Supabase Dashboard before proceeding.

### 6. Deploy Edge Functions

Deploy the scout execution agent and email functions to Supabase Cloud:

```bash
# Link your Supabase project (if not already linked)
npx supabase link --project-ref your-project-ref

# Deploy the main scout cron function
npx supabase functions deploy scout-cron

# Deploy the test email function (for testing email notifications)
npx supabase functions deploy send-test-email
```

Set the required secrets for the edge functions:

```bash
npx supabase secrets set OPENAI_API_KEY=sk-proj-...
npx supabase secrets set FIRECRAWL_API_KEY=fc-...
npx supabase secrets set RESEND_API_KEY=re_...
```

**Note:** The RESEND_API_KEY is optional. If not set, scouts will still run but email notifications will be skipped.

### 7. Set Up Resend (Email Notifications)

To enable email notifications when scouts find results:

1. **Create a Resend account** at [resend.com](https://resend.com)
2. **Get your API key** from the Resend dashboard
3. **Set the secret** in Supabase:
   ```bash
   npx supabase secrets set RESEND_API_KEY=re_...
   ```

**Important - Free Tier Limitations:**
- On Resend's free tier without a verified domain, you can only send emails to your Resend account email address
- To send to any email, verify a custom domain at [resend.com/domains](https://resend.com/domains)
- Free tier includes 3,000 emails/month

**Testing Email Setup:**
1. Go to **Settings** in the app and add your email address
2. Click **Send Test Email** to verify the configuration
3. Check your inbox for the test email

### 8. Run the Development Server

```bash
bun run dev  # or: npm run dev / pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## How It Works

### Scout System

1. **Create a Scout**: Define what you want to monitor (e.g., "Scout for any recent Indian restaurants near me" or "Scout for any AI news")
2. **AI Agent Setup**: The system automatically configures search queries and strategies
3. **Set Frequency**: Choose how often to run (hourly, every 3 days, weekly)
4. **Configure Notifications**: Add your email in Settings to receive alerts when scouts find results
5. **Continuous Monitoring**: The cron job runs every hour and executes active scouts
6. **AI Summaries**: Each successful execution generates a concise one-sentence summary with semantic embeddings
7. **Get Notified**: Receive email alerts when scouts find new results (if email is configured)
8. **View Results**: See all findings with AI-generated summaries in real-time on the scout page

### Manual Execution

Click the **"Run Now"** button on any scout page to trigger execution immediately without waiting for the cron.

### Email Notifications

When scouts find results, you'll automatically receive email alerts:

- **Configure**: Go to **Settings** and add your email address
- **Automatic**: Emails are sent only when scouts successfully find results
- **Rich Content**: Beautiful HTML emails with scout results and links
- **Privacy**: Emails only send if you've set an email address (opt-in)

**Email Service**: Powered by Resend (free tier includes 3,000 emails/month)

**Note:** On Resend's free tier without a verified domain, test emails can only be sent to your Resend account email. To send to any email address, verify a custom domain at [resend.com/domains](https://resend.com/domains).

### Architecture

- **Frontend**: Next.js app with real-time updates via Supabase Realtime
- **Database**: PostgreSQL (Supabase) with pg_cron for scheduling and pgvector for semantic search
- **AI Agent**: OpenAI GPT-4 with function calling (search & scrape tools)
- **AI Summaries**: Auto-generated one-sentence summaries with vector embeddings for each successful execution
- **Edge Function**: Deno-based serverless function that orchestrates agent execution
- **Web Scraping**: Firecrawl API for search and content extraction

## Build for Production

```bash
bun run build  # or: npm run build / pnpm run build
bun start      # or: npm start / pnpm start
```

## License

MIT
