import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.62patakhashop.com'

  const aiScrapersAndBots = [
    'GPTBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-Web',
    'Anthropic-AI',
    'Bytespider',
    'CCBot',
    'Google-Extended',
    'meta-externalagent',
    'Meta-ExternalFetcher',
    'FacebookBot',
    'Amazonbot',
    'Applebot-Extended',
    'PerplexityBot',
    'YouBot',
    'Cohere-ai',
    'Diffbot',
    'Omegabot',
    'Scrapy',
    'ImagesiftBot',
    'DataForSeoBot',
  ]

  return {
    rules: [
      {
        // Allow legitimate search engine crawlers for maximum SEO
        userAgent: ['Googlebot', 'Googlebot-Image', 'Bingbot', 'DuckDuckBot'],
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/checkout',
          '/order-success',
          '/order-success/*',
          '/api/*',
        ],
      },
      {
        // Block all AI data scrapers and LLM training bots
        userAgent: aiScrapersAndBots,
        disallow: ['/'],
      },
      {
        // Default rules for general web visitors
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/checkout',
          '/order-success',
          '/order-success/*',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
