export const codes = {
  scrape: {
    python: `# pip install firecrawl-py
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR_API_KEY")

# Scrape a website:
app.scrape('firecrawl.dev')


    `,
    javascript: `// npm install @mendable/firecrawl-js
import Firecrawl from '@mendable/firecrawl-js';

const app = new Firecrawl({ apiKey: "fc-YOUR_API_KEY"  });

// Perform a search:
app.scrape('firecrawl.dev')


`,
    curl: `curl -X POST 'https://api.firecrawl.dev/v2/scrape' ${`\\`}
-H 'Authorization: Bearer fc-YOUR_API_KEY' ${`\\`}
-H 'Content-Type: application/json' ${`\\`}
-d $'{
  "url": "firecrawl.dev"
}'



`,
  },

  crawl: {
    python: `# pip install firecrawl-py
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR_API_KEY")

# Crawl a website:
app.crawl(
   'docs.firecrawl.dev', exclude_paths=['blog/.+'], limit=5
)
   `,
    javascript: `// npm install @mendable/firecrawl-js
import Firecrawl from '@mendable/firecrawl-js';

const app = new Firecrawl({apiKey: "fc-YOUR_API_KEY"});

// Crawl a website:
await app.crawl('docs.firecrawl.dev', { 
  excludePaths: ['blog/.+'], 
  limit: 5 
});`,
    curl: `curl -X POST 'https://api.firecrawl.dev/v2/crawl' ${`\\`}
-H 'Authorization: Bearer fc-YOUR_API_KEY' ${`\\`}
-H 'Content-Type: application/json' ${`\\`}
-d $'{
  "url": "firecrawl.dev",
  "excludePaths": [
    "blog/.+"
  ],
  "limit": 5
}'`,
  },

  search: {
    python: `# pip install firecrawl-py
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR_API_KEY")
  
# Perform a search:
search_result = app.search("firecrawl web scraping", limit=5)


`,
    javascript: `// npm install @mendable/firecrawl-js
import Firecrawl from '@mendable/firecrawl-js';
  
const app = new Firecrawl({apiKey: "fc-YOUR_API_KEY"});
    
// Perform a search:
app.search("firecrawl web scraping", { limit: 5 })


`,

    curl: `curl -X POST 'https://api.firecrawl.dev/v2/crawl' ${`\\`}
-H 'Authorization: Bearer fc-YOUR_API_KEY' ${`\\`}
-H 'Content-Type: application/json' ${`\\`}
-d $'{
  "url": "https://firecrawl.dev",
  "excludePaths": [
    "blog/.+"
  ],
  "limit": 5
}'`,
  },
};

export const outputs = {
  scrape: `# Firecrawl

Firecrawl is a powerful web scraping
library that makes it easy to extract
data from websites.

## Installation

To install Firecrawl, run:

`,
  crawl: `# Firecrawl (/home)

A powerful web scraping library for
extracting data from websites.

# About (/about)

Built for developers, Firecrawl makes it
easy to turn any website into structured,
LLM-ready content.`,
  search: `{
    "web" : [
    {
      "title": "Firecrawl - Web Scraping API",
      "url": "https://firecrawl.dev/",
      "description": "Turn any website into clean data"
    },
    {
      "title": "Documentation - Firecrawl",
      "url": "https://docs.firecrawl.dev/",
      "description": "Learn how to use Firecrawl"
`,
};
