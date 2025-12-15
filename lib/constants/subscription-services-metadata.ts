interface SubscriptionService {
  name: string;
  category: string;
  merchantName: string;
  websiteUrl: string;
  cancellationUrl: string;
  tags: string[];
  plans: {
    name: string;
    billingCycle: "WEEKLY"|"MONTHLY" |"QUARTERLY"| "YEARLY";
    amount: number;
    currency: string;
    description?: string;
  }[];
}

export const SUBSCRIPTION_SERVICES: SubscriptionService[] = [
  {
    "name": "Netflix",
    "category": "Streaming",
    "merchantName": "Netflix, Inc.",
    "websiteUrl": "https://www.netflix.com",
    "cancellationUrl": "https://www.netflix.com/cancelplan",
    "tags": ["video", "entertainment", "streaming", "movies", "tv"],
    "plans": [
      {
        "name": "Standard with Ads",
        "billingCycle": "MONTHLY",
        "amount": 6.99,
        "currency": "USD"
      },
      {
        "name": "Standard",
        "billingCycle": "MONTHLY",
        "amount": 15.49,
        "currency": "USD"
      },
      {
        "name": "Premium",
        "billingCycle": "MONTHLY",
        "amount": 22.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Spotify Premium",
    "category": "Music",
    "merchantName": "Spotify AB",
    "websiteUrl": "https://www.spotify.com",
    "cancellationUrl": "https://www.spotify.com/account/subscription/",
    "tags": ["music", "audio", "streaming", "podcasts"],
    "plans": [
      {
        "name": "Individual",
        "billingCycle": "MONTHLY",
        "amount": 10.99,
        "currency": "USD"
      },
      {
        "name": "Student",
        "billingCycle": "MONTHLY",
        "amount": 5.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Amazon Prime",
    "category": "Shopping & Streaming",
    "merchantName": "Amazon.com, Inc.",
    "websiteUrl": "https://www.amazon.com/prime",
    "cancellationUrl": "https://www.amazon.com/gp/help/customer/display.html?nodeId=GKMQC26VQQMM8XSW",
    "tags": ["shopping", "delivery", "video", "music", "reading"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 14.99,
        "currency": "USD"
      },
      {
        "name": "Annual",
        "billingCycle": "YEARLY",
        "amount": 139.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Disney+",
    "category": "Streaming",
    "merchantName": "The Walt Disney Company",
    "websiteUrl": "https://www.disneyplus.com",
    "cancellationUrl": "https://www.disneyplus.com/account",
    "tags": ["movies", "tv", "family", "streaming", "disney"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 7.99,
        "currency": "USD"
      },
      {
        "name": "Annual",
        "billingCycle": "YEARLY",
        "amount": 79.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Hulu (No Ads)",
    "category": "Streaming",
    "merchantName": "Disney Streaming Services",
    "websiteUrl": "https://www.hulu.com",
    "cancellationUrl": "https://secure.hulu.com/account/cancel",
    "tags": ["tv", "streaming", "entertainment", "originals"],
    "plans": [
      {
        "name": "No Ads",
        "billingCycle": "MONTHLY",
        "amount": 17.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "YouTube Premium",
    "category": "Streaming",
    "merchantName": "Google LLC",
    "websiteUrl": "https://www.youtube.com/premium",
    "cancellationUrl": "https://myaccount.google.com/subscriptions",
    "tags": ["video", "music", "ad-free", "background play"],
    "plans": [
      {
        "name": "Individual",
        "billingCycle": "MONTHLY",
        "amount": 13.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Apple Music",
    "category": "Music",
    "merchantName": "Apple Inc.",
    "websiteUrl": "https://music.apple.com",
    "cancellationUrl": "https://support.apple.com/en-us/HT202039",
    "tags": ["music", "audio", "streaming", "lossless"],
    "plans": [
      {
        "name": "Individual",
        "billingCycle": "MONTHLY",
        "amount": 10.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Microsoft 365 Personal",
    "category": "Productivity",
    "merchantName": "Microsoft Corporation",
    "websiteUrl": "https://www.microsoft.com/microsoft-365",
    "cancellationUrl": "https://account.microsoft.com/services",
    "tags": ["office", "productivity", "cloud", "word", "excel"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 7.99,
        "currency": "USD"
      },
      {
        "name": "Annual",
        "billingCycle": "YEARLY",
        "amount": 79.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Adobe Creative Cloud All Apps",
    "category": "Design & Creativity",
    "merchantName": "Adobe Inc.",
    "websiteUrl": "https://www.adobe.com/creativecloud.html",
    "cancellationUrl": "https://account.adobe.com/plans",
    "tags": ["design", "photo", "video", "creative", "software"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 54.99,
        "currency": "USD"
      },
      {
        "name": "Annual (Paid Monthly)",
        "billingCycle": "MONTHLY",
        "amount": 54.99,
        "currency": "USD"
      },
      {
        "name": "Annual (Prepaid)",
        "billingCycle": "YEARLY",
        "amount": 599.88,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Dropbox Plus",
    "category": "Cloud Storage",
    "merchantName": "Dropbox, Inc.",
    "websiteUrl": "https://www.dropbox.com",
    "cancellationUrl": "https://www.dropbox.com/account/billing",
    "tags": ["cloud", "storage", "backup", "files", "sync"],
    "plans": [
      {
        "name": "Plus",
        "billingCycle": "MONTHLY",
        "amount": 9.99,
        "currency": "USD"
      },
      {
        "name": "Plus Annual",
        "billingCycle": "YEARLY",
        "amount": 99.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Canva Pro",
    "category": "Design",
    "merchantName": "Canva Pty Ltd",
    "websiteUrl": "https://www.canva.com",
    "cancellationUrl": "https://www.canva.com/account/billing/",
    "tags": ["design", "graphics", "templates", "social media"],
    "plans": [
      {
        "name": "Pro Monthly",
        "billingCycle": "MONTHLY",
        "amount": 12.99,
        "currency": "USD"
      },
      {
        "name": "Pro Annual",
        "billingCycle": "YEARLY",
        "amount": 119.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Notion Plus",
    "category": "Productivity",
    "merchantName": "Notion Labs, Inc.",
    "websiteUrl": "https://www.notion.so",
    "cancellationUrl": "https://www.notion.so/account/settings/billing",
    "tags": ["notes", "tasks", "wiki", "collaboration"],
    "plans": [
      {
        "name": "Plus Monthly",
        "billingCycle": "MONTHLY",
        "amount": 10.0,
        "currency": "USD"
      },
      {
        "name": "Plus Annual",
        "billingCycle": "YEARLY",
        "amount": 96.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Grammarly Premium",
    "category": "Writing",
    "merchantName": "Grammarly, Inc.",
    "websiteUrl": "https://www.grammarly.com",
    "cancellationUrl": "https://www.grammarly.com/account/billing",
    "tags": ["writing", "grammar", "editing", "productivity"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 12.0,
        "currency": "USD"
      },
      {
        "name": "Quarterly",
        "billingCycle": "QUARTERLY",
        "amount": 24.0,
        "currency": "USD"
      },
      {
        "name": "Annual",
        "billingCycle": "YEARLY",
        "amount": 144.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "NordVPN",
    "category": "Security",
    "merchantName": "Nord Security",
    "websiteUrl": "https://nordvpn.com",
    "cancellationUrl": "https://my.nordaccount.com/dashboard/billing/",
    "tags": ["vpn", "privacy", "security", "encryption"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 12.99,
        "currency": "USD"
      },
      {
        "name": "1-Year Plan",
        "billingCycle": "YEARLY",
        "amount": 59.88,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "HBO Max",
    "category": "Streaming",
    "merchantName": "Warner Bros. Discovery",
    "websiteUrl": "https://www.max.com",
    "cancellationUrl": "https://www.max.com/account",
    "tags": ["movies", "tv", "hbo", "streaming", "originals"],
    "plans": [
      {
        "name": "With Ads",
        "billingCycle": "MONTHLY",
        "amount": 9.99,
        "currency": "USD"
      },
      {
        "name": "Ad-Free",
        "billingCycle": "MONTHLY",
        "amount": 15.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Paramount+",
    "category": "Streaming",
    "merchantName": "Paramount Global",
    "websiteUrl": "https://www.paramountplus.com",
    "cancellationUrl": "https://www.paramountplus.com/account/profile/subscription/",
    "tags": ["tv", "sports", "movies", "cbs", "streaming"],
    "plans": [
      {
        "name": "Essential",
        "billingCycle": "MONTHLY",
        "amount": 5.99,
        "currency": "USD"
      },
      {
        "name": "Premium",
        "billingCycle": "MONTHLY",
        "amount": 11.99,
        "currency": "USD"
      },
      {
        "name": "Premium Annual",
        "billingCycle": "YEARLY",
        "amount": 119.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Apple TV+",
    "category": "Streaming",
    "merchantName": "Apple Inc.",
    "websiteUrl": "https://tv.apple.com",
    "cancellationUrl": "https://support.apple.com/en-us/HT209459",
    "tags": ["movies", "tv", "originals", "streaming", "apple"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 9.99,
        "currency": "USD"
      },
      {
        "name": "Annual",
        "billingCycle": "YEARLY",
        "amount": 99.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Audible",
    "category": "Audio",
    "merchantName": "Amazon.com, Inc.",
    "websiteUrl": "https://www.audible.com",
    "cancellationUrl": "https://www.audible.com/account/details/membership",
    "tags": ["audiobooks", "audio", "books", "entertainment"],
    "plans": [
      {
        "name": "Premium Plus",
        "billingCycle": "MONTHLY",
        "amount": 14.95,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "HelloFresh",
    "category": "Meal Kit",
    "merchantName": "HelloFresh SE",
    "websiteUrl": "https://www.hellofresh.com",
    "cancellationUrl": "https://www.hellofresh.com/account/settings/subscription",
    "tags": ["food", "meal kit", "cooking", "groceries"],
    "plans": [
      {
        "name": "Classic Plan (2 meals/week)",
        "billingCycle": "WEEKLY",
        "amount": 9.99,
        "currency": "USD",
        "description": "Per serving, billed weekly"
      }
    ]
  },
  {
    "name": "Peloton App",
    "category": "Fitness",
    "merchantName": "Peloton Interactive, Inc.",
    "websiteUrl": "https://www.onepeloton.com/app",
    "cancellationUrl": "https://www.onepeloton.com/account/membership",
    "tags": ["fitness", "workout", "yoga", "cycling", "training"],
    "plans": [
      {
        "name": "App Membership",
        "billingCycle": "MONTHLY",
        "amount": 12.99,
        "currency": "USD"
      },
      {
        "name": "App Annual",
        "billingCycle": "YEARLY",
        "amount": 129.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Tubi Premium",
    "category": "Streaming",
    "merchantName": "Fox Corporation",
    "websiteUrl": "https://tubitv.com",
    "cancellationUrl": "https://tubitv.com/account",
    "tags": ["streaming", "movies", "tv"],
    "plans": [
      {
        "name": "Premium",
        "billingCycle": "MONTHLY",
        "amount": 5.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Plex Pass",
    "category": "Media",
    "merchantName": "Plex Inc.",
    "websiteUrl": "https://www.plex.tv",
    "cancellationUrl": "https://app.plex.tv/desktop/#!/settings/subscription",
    "tags": ["media server", "streaming", "organization"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 4.99,
        "currency": "USD"
      },
      {
        "name": "Quarterly",
        "billingCycle": "QUARTERLY",
        "amount": 11.99,
        "currency": "USD"
      },
      {
        "name": "Yearly",
        "billingCycle": "YEARLY",
        "amount": 39.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Tidal HiFi",
    "category": "Music",
    "merchantName": "Tidal",
    "websiteUrl": "https://tidal.com",
    "cancellationUrl": "https://tidal.com/my-account",
    "tags": ["music", "hi-res", "audio", "streaming"],
    "plans": [
      {
        "name": "HiFi",
        "billingCycle": "MONTHLY",
        "amount": 10.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Calendly Premium",
    "category": "Productivity",
    "merchantName": "Calendly LLC",
    "websiteUrl": "https://calendly.com",
    "cancellationUrl": "https://calendly.com/dashboard/settings/billing",
    "tags": ["scheduling", "calendar", "meetings"],
    "plans": [
      {
        "name": "Premium Monthly",
        "billingCycle": "MONTHLY",
        "amount": 10.0,
        "currency": "USD"
      },
      {
        "name": "Premium Annual",
        "billingCycle": "YEARLY",
        "amount": 120.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Todoist Premium",
    "category": "Productivity",
    "merchantName": "Doist Inc.",
    "websiteUrl": "https://todoist.com",
    "cancellationUrl": "https://todoist.com/app/settings/billing",
    "tags": ["tasks", "to-do", "productivity"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 4.0,
        "currency": "USD"
      },
      {
        "name": "Yearly",
        "billingCycle": "YEARLY",
        "amount": 36.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Evernote Personal",
    "category": "Productivity",
    "merchantName": "Evernote Corporation",
    "websiteUrl": "https://evernote.com",
    "cancellationUrl": "https://evernote.com/account/billing",
    "tags": ["notes", "organization", "productivity"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 7.99,
        "currency": "USD"
      },
      {
        "name": "Annual",
        "billingCycle": "YEARLY",
        "amount": 69.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Proton Mail Plus",
    "category": "Email & Security",
    "merchantName": "Proton AG",
    "websiteUrl": "https://proton.me/mail",
    "cancellationUrl": "https://account.proton.me/u/0/settings/subscription",
    "tags": ["email", "privacy", "security", "encrypted"],
    "plans": [
      {
        "name": "Plus Monthly",
        "billingCycle": "MONTHLY",
        "amount": 5.0,
        "currency": "USD"
      },
      {
        "name": "Plus Annual",
        "billingCycle": "YEARLY",
        "amount": 48.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "1Password Personal",
    "category": "Security",
    "merchantName": "AgileBits Inc.",
    "websiteUrl": "https://1password.com",
    "cancellationUrl": "https://my.1password.com/account",
    "tags": ["password", "security", "vault", "2fa"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 2.99,
        "currency": "USD"
      },
      {
        "name": "Annual",
        "billingCycle": "YEARLY",
        "amount": 35.88,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Dashlane Premium",
    "category": "Security",
    "merchantName": "Dashlane Inc.",
    "websiteUrl": "https://www.dashlane.com",
    "cancellationUrl": "https://www.dashlane.com/account/billing",
    "tags": ["password", "security", "vault"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 4.99,
        "currency": "USD"
      },
      {
        "name": "Annual",
        "billingCycle": "YEARLY",
        "amount": 59.88,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "ExpressVPN",
    "category": "Security",
    "merchantName": "Express VPN International Ltd",
    "websiteUrl": "https://www.expressvpn.com",
    "cancellationUrl": "https://www.expressvpn.com/account",
    "tags": ["vpn", "privacy", "security"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 12.95,
        "currency": "USD"
      },
      {
        "name": "12-Month",
        "billingCycle": "YEARLY",
        "amount": 99.95,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Surfshark",
    "category": "Security",
    "merchantName": "Surfshark B.V.",
    "websiteUrl": "https://surfshark.com",
    "cancellationUrl": "https://account.surfshark.com",
    "tags": ["vpn", "privacy", "security"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 12.99,
        "currency": "USD"
      },
      {
        "name": "2-Year Plan",
        "billingCycle": "YEARLY",
        "amount": 47.88,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Figma Professional",
    "category": "Design",
    "merchantName": "Figma, Inc.",
    "websiteUrl": "https://www.figma.com",
    "cancellationUrl": "https://www.figma.com/settings/billing",
    "tags": ["design", "ui", "prototyping", "collaboration"],
    "plans": [
      {
        "name": "Professional Monthly",
        "billingCycle": "MONTHLY",
        "amount": 12.0,
        "currency": "USD"
      },
      {
        "name": "Professional Annual",
        "billingCycle": "YEARLY",
        "amount": 144.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Trello Standard",
    "category": "Productivity",
    "merchantName": "Atlassian",
    "websiteUrl": "https://trello.com",
    "cancellationUrl": "https://trello.com/account",
    "tags": ["project management", "kanban", "tasks"],
    "plans": [
      {
        "name": "Standard Monthly",
        "billingCycle": "MONTHLY",
        "amount": 5.0,
        "currency": "USD"
      },
      {
        "name": "Standard Annual",
        "billingCycle": "YEARLY",
        "amount": 60.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Asana Premium",
    "category": "Productivity",
    "merchantName": "Asana, Inc.",
    "websiteUrl": "https://asana.com",
    "cancellationUrl": "https://asana.com/account/billing",
    "tags": ["tasks", "projects", "teamwork"],
    "plans": [
      {
        "name": "Premium Monthly",
        "billingCycle": "MONTHLY",
        "amount": 10.99,
        "currency": "USD"
      },
      {
        "name": "Premium Annual",
        "billingCycle": "YEARLY",
        "amount": 119.88,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Zoom Pro",
    "category": "Communication",
    "merchantName": "Zoom Video Communications, Inc.",
    "websiteUrl": "https://zoom.us",
    "cancellationUrl": "https://zoom.us/profile/plan",
    "tags": ["video call", "meeting", "webinar", "remote"],
    "plans": [
      {
        "name": "Pro Monthly",
        "billingCycle": "MONTHLY",
        "amount": 14.99,
        "currency": "USD"
      },
      {
        "name": "Pro Annual",
        "billingCycle": "YEARLY",
        "amount": 149.90,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Slack Pro",
    "category": "Communication",
    "merchantName": "Salesforce, Inc.",
    "websiteUrl": "https://slack.com",
    "cancellationUrl": "https://my.slack.com/account/billing",
    "tags": ["chat", "team", "collaboration", "workspace"],
    "plans": [
      {
        "name": "Pro Monthly",
        "billingCycle": "MONTHLY",
        "amount": 7.25,
        "currency": "USD"
      },
      {
        "name": "Pro Annual",
        "billingCycle": "YEARLY",
        "amount": 72.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "GitHub Pro",
    "category": "Developer Tools",
    "merchantName": "GitHub, Inc.",
    "websiteUrl": "https://github.com",
    "cancellationUrl": "https://github.com/settings/billing",
    "tags": ["coding", "git", "repository", "developer"],
    "plans": [
      {
        "name": "Pro Monthly",
        "billingCycle": "MONTHLY",
        "amount": 4.0,
        "currency": "USD"
      },
      {
        "name": "Pro Annual",
        "billingCycle": "YEARLY",
        "amount": 48.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Mailchimp Standard",
    "category": "Marketing",
    "merchantName": "Intuit Inc.",
    "websiteUrl": "https://mailchimp.com",
    "cancellationUrl": "https://mailchimp.com/account/billing/",
    "tags": ["email marketing", "automation", "crm"],
    "plans": [
      {
        "name": "Standard Monthly",
        "billingCycle": "MONTHLY",
        "amount": 13.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Shopify Basic",
    "category": "E-commerce",
    "merchantName": "Shopify Inc.",
    "websiteUrl": "https://www.shopify.com",
    "cancellationUrl": "https://admin.shopify.com/settings/plan",
    "tags": ["store", "online shop", "ecommerce", "retail"],
    "plans": [
      {
        "name": "Basic Shopify",
        "billingCycle": "MONTHLY",
        "amount": 29.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Wix Unlimited",
    "category": "Website Builder",
    "merchantName": "Wix.com Ltd.",
    "websiteUrl": "https://www.wix.com",
    "cancellationUrl": "https://www.wix.com/account/billing",
    "tags": ["website", "builder", "hosting", "design"],
    "plans": [
      {
        "name": "Unlimited Monthly",
        "billingCycle": "MONTHLY",
        "amount": 27.0,
        "currency": "USD"
      },
      {
        "name": "Unlimited Annual",
        "billingCycle": "YEARLY",
        "amount": 204.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Squarespace Personal",
    "category": "Website Builder",
    "merchantName": "Squarespace, Inc.",
    "websiteUrl": "https://www.squarespace.com",
    "cancellationUrl": "https://account.squarespace.com/billing",
    "tags": ["website", "portfolio", "blog", "design"],
    "plans": [
      {
        "name": "Personal Monthly",
        "billingCycle": "MONTHLY",
        "amount": 16.0,
        "currency": "USD"
      },
      {
        "name": "Personal Annual",
        "billingCycle": "YEARLY",
        "amount": 144.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Ancestry.com",
    "category": "Genealogy",
    "merchantName": "Ancestry.com LLC",
    "websiteUrl": "https://www.ancestry.com",
    "cancellationUrl": "https://www.ancestry.com/cs/account/subscription",
    "tags": ["family history", "dna", "genealogy", "records"],
    "plans": [
      {
        "name": "World Explorer Monthly",
        "billingCycle": "MONTHLY",
        "amount": 39.99,
        "currency": "USD"
      },
      {
        "name": "World Explorer Annual",
        "billingCycle": "YEARLY",
        "amount": 299.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Headspace",
    "category": "Health & Wellness",
    "merchantName": "Headspace Inc.",
    "websiteUrl": "https://www.headspace.com",
    "cancellationUrl": "https://www.headspace.com/account/subscription",
    "tags": ["meditation", "mindfulness", "sleep", "mental health"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 12.99,
        "currency": "USD"
      },
      {
        "name": "Annual",
        "billingCycle": "YEARLY",
        "amount": 69.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Calm Premium",
    "category": "Health & Wellness",
    "merchantName": "Calm.com, Inc.",
    "websiteUrl": "https://www.calm.com",
    "cancellationUrl": "https://www.calm.com/account/subscription",
    "tags": ["meditation", "sleep", "relaxation", "mindfulness"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 14.99,
        "currency": "USD"
      },
      {
        "name": "Annual",
        "billingCycle": "YEARLY",
        "amount": 69.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "MyFitnessPal Premium",
    "category": "Health & Fitness",
    "merchantName": "MyFitnessPal, Inc.",
    "websiteUrl": "https://www.myfitnesspal.com",
    "cancellationUrl": "https://www.myfitnesspal.com/account/subscription",
    "tags": ["nutrition", "calorie counter", "fitness", "diet"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 19.99,
        "currency": "USD"
      },
      {
        "name": "Annual",
        "billingCycle": "YEARLY",
        "amount": 79.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Strava Summit",
    "category": "Fitness",
    "merchantName": "Strava, Inc.",
    "websiteUrl": "https://www.strava.com",
    "cancellationUrl": "https://www.strava.com/settings/subscription",
    "tags": ["running", "cycling", "workout", "gps"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 7.99,
        "currency": "USD"
      },
      {
        "name": "Annual",
        "billingCycle": "YEARLY",
        "amount": 79.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Duolingo Super",
    "category": "Education",
    "merchantName": "Duolingo, Inc.",
    "websiteUrl": "https://www.duolingo.com",
    "cancellationUrl": "https://www.duolingo.com/settings/subscription",
    "tags": ["language", "learning", "education", "courses"],
    "plans": [
      {
        "name": "Super Monthly",
        "billingCycle": "MONTHLY",
        "amount": 12.99,
        "currency": "USD"
      },
      {
        "name": "Super Annual",
        "billingCycle": "YEARLY",
        "amount": 79.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Babbel",
    "category": "Education",
    "merchantName": "Babbel GmbH",
    "websiteUrl": "https://www.babbel.com",
    "cancellationUrl": "https://www.babbel.com/en/my-account",
    "tags": ["language", "learning", "education", "speaking"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 13.95,
        "currency": "USD"
      },
      {
        "name": "3-Month",
        "billingCycle": "QUARTERLY",
        "amount": 29.85,
        "currency": "USD"
      },
      {
        "name": "Annual",
        "billingCycle": "YEARLY",
        "amount": 83.40,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "MasterClass",
    "category": "Education",
    "merchantName": "MasterClass.com, Inc.",
    "websiteUrl": "https://www.masterclass.com",
    "cancellationUrl": "https://www.masterclass.com/account/membership",
    "tags": ["courses", "celebrity", "learning", "skills"],
    "plans": [
      {
        "name": "Annual",
        "billingCycle": "YEARLY",
        "amount": 180.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "The New York Times Digital",
    "category": "News",
    "merchantName": "The New York Times Company",
    "websiteUrl": "https://www.nytimes.com",
    "cancellationUrl": "https://myaccount.nytimes.com/membercenter/subscription",
    "tags": ["news", "journalism", "articles", "digital"],
    "plans": [
      {
        "name": "Basic Monthly",
        "billingCycle": "MONTHLY",
        "amount": 4.0,
        "currency": "USD"
      },
      {
        "name": "All Access Annual",
        "billingCycle": "YEARLY",
        "amount": 229.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "The Washington Post",
    "category": "News",
    "merchantName": "Nash Holdings LLC",
    "websiteUrl": "https://www.washingtonpost.com",
    "cancellationUrl": "https://subscribe.washingtonpost.com/account/",
    "tags": ["news", "politics", "journalism", "digital"],
    "plans": [
      {
        "name": "Digital Monthly",
        "billingCycle": "MONTHLY",
        "amount": 10.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Wall Street Journal",
    "category": "News",
    "merchantName": "Dow Jones & Company",
    "websiteUrl": "https://www.wsj.com",
    "cancellationUrl": "https://id.wsj.com/account/subscription",
    "tags": ["finance", "business", "news", "markets"],
    "plans": [
      {
        "name": "Digital Monthly",
        "billingCycle": "MONTHLY",
        "amount": 12.99,
        "currency": "USD"
      },
      {
        "name": "Digital Annual",
        "billingCycle": "YEARLY",
        "amount": 149.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "LinkedIn Premium Career",
    "category": "Professional",
    "merchantName": "Microsoft Corporation",
    "websiteUrl": "https://www.linkedin.com/premium",
    "cancellationUrl": "https://www.linkedin.com/help/linkedin/answer/34593",
    "tags": ["career", "networking", "jobs", "professional"],
    "plans": [
      {
        "name": "Career Monthly",
        "billingCycle": "MONTHLY",
        "amount": 39.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Salesforce Essentials",
    "category": "Business",
    "merchantName": "Salesforce, Inc.",
    "websiteUrl": "https://www.salesforce.com",
    "cancellationUrl": "https://help.salesforce.com/s/articleView?id=sf.account_cancel.htm&type=5",
    "tags": ["crm", "sales", "business", "cloud"],
    "plans": [
      {
        "name": "Essentials Monthly",
        "billingCycle": "MONTHLY",
        "amount": 25.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "QuickBooks Online Simple Start",
    "category": "Finance",
    "merchantName": "Intuit Inc.",
    "websiteUrl": "https://quickbooks.intuit.com",
    "cancellationUrl": "https://quickbooks.intuit.com/cancel/",
    "tags": ["accounting", "finance", "small business", "invoicing"],
    "plans": [
      {
        "name": "Simple Start Monthly",
        "billingCycle": "MONTHLY",
        "amount": 30.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "TurboTax Live Basic",
    "category": "Finance",
    "merchantName": "Intuit Inc.",
    "websiteUrl": "https://turbotax.intuit.com",
    "cancellationUrl": "https://turbotax.intuit.com/support/cancel-subscription",
    "tags": ["taxes", "filing", "finance", "refund"],
    "plans": [
      {
        "name": "Annual (Tax Season)",
        "billingCycle": "YEARLY",
        "amount": 59.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Hinge Preferred",
    "category": "Dating",
    "merchantName": "Match Group, Inc.",
    "websiteUrl": "https://hinge.co",
    "cancellationUrl": "https://hinge.co/settings/subscription",
    "tags": ["dating", "relationships", "matchmaking"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 29.99,
        "currency": "USD"
      },
      {
        "name": "3-Month",
        "billingCycle": "QUARTERLY",
        "amount": 59.99,
        "currency": "USD"
      },
      {
        "name": "6-Month",
        "billingCycle": "YEARLY",
        "amount": 89.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Tinder Plus",
    "category": "Dating",
    "merchantName": "Match Group, Inc.",
    "websiteUrl": "https://tinder.com",
    "cancellationUrl": "https://tinder.com/app/settings/subscription",
    "tags": ["dating", "swipe", "matches", "social"],
    "plans": [
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 19.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Bumble Boost",
    "category": "Dating",
    "merchantName": "Bumble Inc.",
    "websiteUrl": "https://bumble.com",
    "cancellationUrl": "https://bumble.com/account/subscription",
    "tags": ["dating", "women first", "relationships"],
    "plans": [
      {
        "name": "Weekly",
        "billingCycle": "WEEKLY",
        "amount": 8.99,
        "currency": "USD"
      },
      {
        "name": "Monthly",
        "billingCycle": "MONTHLY",
        "amount": 24.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "OnlyFans Creator",
    "category": "Content",
    "merchantName": "OnlyFans.com Ltd",
    "websiteUrl": "https://onlyfans.com",
    "cancellationUrl": "https://onlyfans.com/subscriptions",
    "tags": ["creator", "content", "subscription", "adult"],
    "plans": [
      {
        "name": "Standard",
        "billingCycle": "MONTHLY",
        "amount": 9.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Patreon",
    "category": "Crowdfunding",
    "merchantName": "Patreon, Inc.",
    "websiteUrl": "https://www.patreon.com",
    "cancellationUrl": "https://www.patreon.com/settings/memberships",
    "tags": ["creator", "support", "membership", "art"],
    "plans": [
      {
        "name": "Creator Monthly Fee",
        "billingCycle": "MONTHLY",
        "amount": 0.0,
        "currency": "USD",
        "description": "Free for creators; patrons pay per creator"
      }
    ]
  },
  {
    "name": "Substack Pro",
    "category": "Publishing",
    "merchantName": "Substack, Inc.",
    "websiteUrl": "https://substack.com",
    "cancellationUrl": "https://substack.com/account/billing",
    "tags": ["newsletter", "writing", "publishing", "blog"],
    "plans": [
      {
        "name": "Pro (10% fee)",
        "billingCycle": "MONTHLY",
        "amount": 0.0,
        "currency": "USD",
        "description": "Free platform; revenue share model"
      }
    ]
  },
  {
    "name": "Etsy Plus",
    "category": "E-commerce",
    "merchantName": "Etsy, Inc.",
    "websiteUrl": "https://www.etsy.com",
    "cancellationUrl": "https://www.etsy.com/your/shops/YourShopName/settings/billing",
    "tags": ["handmade", "crafts", "selling", "marketplace"],
    "plans": [
      {
        "name": "Etsy Plus",
        "billingCycle": "MONTHLY",
        "amount": 10.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "GoDaddy Website Builder",
    "category": "Website Builder",
    "merchantName": "GoDaddy Operating Company, LLC",
    "websiteUrl": "https://www.godaddy.com",
    "cancellationUrl": "https://account.godaddy.com/subscriptions",
    "tags": ["website", "domain", "hosting", "builder"],
    "plans": [
      {
        "name": "Basic Monthly",
        "billingCycle": "MONTHLY",
        "amount": 9.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Cloudflare Pro",
    "category": "Web Infrastructure",
    "merchantName": "Cloudflare, Inc.",
    "websiteUrl": "https://www.cloudflare.com",
    "cancellationUrl": "https://dash.cloudflare.com/profile/billing",
    "tags": ["cdn", "security", "dns", "performance"],
    "plans": [
      {
        "name": "Pro Monthly",
        "billingCycle": "MONTHLY",
        "amount": 20.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "DigitalOcean Basic",
    "category": "Cloud Hosting",
    "merchantName": "DigitalOcean, LLC",
    "websiteUrl": "https://www.digitalocean.com",
    "cancellationUrl": "https://cloud.digitalocean.com/account/billing",
    "tags": ["cloud", "server", "developer", "hosting"],
    "plans": [
      {
        "name": "Basic Droplet",
        "billingCycle": "MONTHLY",
        "amount": 6.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Vercel Pro",
    "category": "Developer Tools",
    "merchantName": "Vercel Inc.",
    "websiteUrl": "https://vercel.com",
    "cancellationUrl": "https://vercel.com/dashboard/billing",
    "tags": ["frontend", "deployment", "nextjs", "serverless"],
    "plans": [
      {
        "name": "Pro Monthly",
        "billingCycle": "MONTHLY",
        "amount": 20.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Netlify Pro",
    "category": "Developer Tools",
    "merchantName": "Netlify, Inc.",
    "websiteUrl": "https://www.netlify.com",
    "cancellationUrl": "https://app.netlify.com/account/billing",
    "tags": ["jamstack", "hosting", "ci/cd", "serverless"],
    "plans": [
      {
        "name": "Pro Monthly",
        "billingCycle": "MONTHLY",
        "amount": 19.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Auth0",
    "category": "Developer Tools",
    "merchantName": "Auth0, Inc. (Okta)",
    "websiteUrl": "https://auth0.com",
    "cancellationUrl": "https://manage.auth0.com/dashboard/account/billing",
    "tags": ["authentication", "identity", "security", "oauth"],
    "plans": [
      {
        "name": "Free Tier",
        "billingCycle": "MONTHLY",
        "amount": 0.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Stripe",
    "category": "Payments",
    "merchantName": "Stripe, Inc.",
    "websiteUrl": "https://stripe.com",
    "cancellationUrl": "https://dashboard.stripe.com/account",
    "tags": ["payments", "checkout", "ecommerce", "api"],
    "plans": [
      {
        "name": "Pay-as-you-go",
        "billingCycle": "MONTHLY",
        "amount": 0.0,
        "currency": "USD",
        "description": "No monthly fee; transaction-based pricing"
      }
    ]
  },
  {
    "name": "Twilio",
    "category": "Communications",
    "merchantName": "Twilio Inc.",
    "websiteUrl": "https://www.twilio.com",
    "cancellationUrl": "https://console.twilio.com/us1/account/billing",
    "tags": ["sms", "voice", "api", "messaging"],
    "plans": [
      {
        "name": "Pay-as-you-go",
        "billingCycle": "MONTHLY",
        "amount": 0.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "SendGrid",
    "category": "Email",
    "merchantName": "Twilio Inc.",
    "websiteUrl": "https://sendgrid.com",
    "cancellationUrl": "https://app.sendgrid.com/settings/billing",
    "tags": ["email api", "transactional", "marketing", "smtp"],
    "plans": [
      {
        "name": "Free Tier",
        "billingCycle": "MONTHLY",
        "amount": 0.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "MongoDB Atlas",
    "category": "Database",
    "merchantName": "MongoDB, Inc.",
    "websiteUrl": "https://www.mongodb.com/atlas",
    "cancellationUrl": "https://cloud.mongodb.com/v2#/org/organizationId/billing",
    "tags": ["database", "nosql", "cloud", "developer"],
    "plans": [
      {
        "name": "Free Tier",
        "billingCycle": "MONTHLY",
        "amount": 0.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Firebase",
    "category": "Developer Tools",
    "merchantName": "Google LLC",
    "websiteUrl": "https://firebase.google.com",
    "cancellationUrl": "https://console.firebase.google.com/project/_/settings/usage",
    "tags": ["backend", "database", "auth", "mobile"],
    "plans": [
      {
        "name": "Spark (Free)",
        "billingCycle": "MONTHLY",
        "amount": 0.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "AWS Free Tier",
    "category": "Cloud",
    "merchantName": "Amazon Web Services, Inc.",
    "websiteUrl": "https://aws.amazon.com",
    "cancellationUrl": "https://console.aws.amazon.com/billing/home",
    "tags": ["cloud", "compute", "storage", "developer"],
    "plans": [
      {
        "name": "Free Tier",
        "billingCycle": "MONTHLY",
        "amount": 0.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Google Workspace Business Starter",
    "category": "Productivity",
    "merchantName": "Google LLC",
    "websiteUrl": "https://workspace.google.com",
    "cancellationUrl": "https://admin.google.com/ac/billing",
    "tags": ["email", "docs", "drive", "meet", "business"],
    "plans": [
      {
        "name": "Business Starter Monthly",
        "billingCycle": "MONTHLY",
        "amount": 6.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Zapier Starter",
    "category": "Automation",
    "merchantName": "Zapier Inc.",
    "websiteUrl": "https://zapier.com",
    "cancellationUrl": "https://zapier.com/app/billing",
    "tags": ["automation", "integrations", "workflow", "tools"],
    "plans": [
      {
        "name": "Starter Monthly",
        "billingCycle": "MONTHLY",
        "amount": 19.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Airtable Plus",
    "category": "Productivity",
    "merchantName": "Airtable, Inc.",
    "websiteUrl": "https://airtable.com",
    "cancellationUrl": "https://airtable.com/account/billing",
    "tags": ["database", "spreadsheet", "crm", "projects"],
    "plans": [
      {
        "name": "Plus Monthly",
        "billingCycle": "MONTHLY",
        "amount": 10.0,
        "currency": "USD"
      },
      {
        "name": "Plus Annual",
        "billingCycle": "YEARLY",
        "amount": 120.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Monday.com Basic",
    "category": "Project Management",
    "merchantName": "monday.com Ltd.",
    "websiteUrl": "https://monday.com",
    "cancellationUrl": "https://monday.com/account/billing",
    "tags": ["tasks", "team", "workflow", "kanban"],
    "plans": [
      {
        "name": "Basic Monthly",
        "billingCycle": "MONTHLY",
        "amount": 8.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "ClickUp Unlimited",
    "category": "Productivity",
    "merchantName": "ClickUp Inc.",
    "websiteUrl": "https://clickup.com",
    "cancellationUrl": "https://app.clickup.com/settings/billing",
    "tags": ["tasks", "docs", "goals", "chat", "whiteboard"],
    "plans": [
      {
        "name": "Unlimited Monthly",
        "billingCycle": "MONTHLY",
        "amount": 7.0,
        "currency": "USD"
      },
      {
        "name": "Unlimited Annual",
        "billingCycle": "YEARLY",
        "amount": 60.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Miro Standard",
    "category": "Collaboration",
    "merchantName": "Miro Inc.",
    "websiteUrl": "https://miro.com",
    "cancellationUrl": "https://miro.com/app/settings/billing/",
    "tags": ["whiteboard", "collaboration", "design", "brainstorming"],
    "plans": [
      {
        "name": "Standard Monthly",
        "billingCycle": "MONTHLY",
        "amount": 8.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Loom Business",
    "category": "Communication",
    "merchantName": "Loom, Inc.",
    "websiteUrl": "https://www.loom.com",
    "cancellationUrl": "https://www.loom.com/account/billing",
    "tags": ["video messaging", "async", "screen recording"],
    "plans": [
      {
        "name": "Business Monthly",
        "billingCycle": "MONTHLY",
        "amount": 12.5,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Notion AI Add-on",
    "category": "Productivity",
    "merchantName": "Notion Labs, Inc.",
    "websiteUrl": "https://www.notion.so",
    "cancellationUrl": "https://www.notion.so/account/settings/billing",
    "tags": ["ai", "writing", "productivity", "notes"],
    "plans": [
      {
        "name": "AI Monthly",
        "billingCycle": "MONTHLY",
        "amount": 10.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Midjourney Basic",
    "category": "AI & Creativity",
    "merchantName": "Midjourney, Inc.",
    "websiteUrl": "https://www.midjourney.com",
    "cancellationUrl": "https://www.midjourney.com/account",
    "tags": ["ai", "image generation", "art", "creative"],
    "plans": [
      {
        "name": "Basic Monthly",
        "billingCycle": "MONTHLY",
        "amount": 10.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Stability AI",
    "category": "AI & Creativity",
    "merchantName": "Stability AI Ltd",
    "websiteUrl": "https://stability.ai",
    "cancellationUrl": "https://platform.stability.ai/account/billing",
    "tags": ["ai", "image generation", "api", "stable diffusion"],
    "plans": [
      {
        "name": "Pay-as-you-go",
        "billingCycle": "MONTHLY",
        "amount": 0.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Runway ML Standard",
    "category": "AI & Video",
    "merchantName": "Runway ML, Inc.",
    "websiteUrl": "https://runwayml.com",
    "cancellationUrl": "https://runwayml.com/account/billing",
    "tags": ["ai video", "editing", "generation", "creative"],
    "plans": [
      {
        "name": "Standard Monthly",
        "billingCycle": "MONTHLY",
        "amount": 15.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Descript Pro",
    "category": "Audio & Video",
    "merchantName": "Descript, Inc.",
    "websiteUrl": "https://www.descript.com",
    "cancellationUrl": "https://www.descript.com/account/billing",
    "tags": ["podcast", "editing", "transcription", "video"],
    "plans": [
      {
        "name": "Pro Monthly",
        "billingCycle": "MONTHLY",
        "amount": 15.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "CapCut Pro",
    "category": "Video Editing",
    "merchantName": "Bytedance Ltd.",
    "websiteUrl": "https://www.capcut.com",
    "cancellationUrl": "https://www.capcut.com/account/subscription",
    "tags": ["video", "editing", "templates", "mobile"],
    "plans": [
      {
        "name": "Pro Monthly",
        "billingCycle": "MONTHLY",
        "amount": 7.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Adobe Express Premium",
    "category": "Design",
    "merchantName": "Adobe Inc.",
    "websiteUrl": "https://express.adobe.com",
    "cancellationUrl": "https://account.adobe.com/plans",
    "tags": ["design", "social media", "templates", "quick edit"],
    "plans": [
      {
        "name": "Premium Monthly",
        "billingCycle": "MONTHLY",
        "amount": 9.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Vimeo Basic",
    "category": "Video Hosting",
    "merchantName": "Vimeo, Inc.",
    "websiteUrl": "https://vimeo.com",
    "cancellationUrl": "https://vimeo.com/account/billing",
    "tags": ["video", "hosting", "privacy", "hd"],
    "plans": [
      {
        "name": "Basic Monthly",
        "billingCycle": "MONTHLY",
        "amount": 12.0,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Dribbble Pro",
    "category": "Design",
    "merchantName": "Dribbble LLC",
    "websiteUrl": "https://dribbble.com",
    "cancellationUrl": "https://dribbble.com/account/billing",
    "tags": ["design", "portfolio", "jobs", "community"],
    "plans": [
      {
        "name": "Pro Monthly",
        "billingCycle": "MONTHLY",
        "amount": 9.99,
        "currency": "USD"
      }
    ]
  },
  {
    "name": "Behance ProSite",
    "category": "Design",
    "merchantName": "Adobe Inc.",
    "websiteUrl": "https://www.behance.net",
    "cancellationUrl": "https://account.adobe.com/plans",
    "tags": ["portfolio", "design", "creative", "website"],
    "plans": [
      {
        "name": "ProSite Annual",
        "billingCycle": "YEARLY",
        "amount": 99.99,
        "currency": "USD"
      }
    ]
  },
  
    {
      "name": "ClassPass",
      "category": "Fitness",
      "merchantName": "ClassPass, Inc.",
      "websiteUrl": "https://classpass.com",
      "cancellationUrl": "https://classpass.com/account/membership",
      "tags": ["fitness", "gym", "yoga", "workout", "studio"],
      "plans": [
        {
          "name": "Basic",
          "billingCycle": "MONTHLY",
          "amount": 19.99,
          "currency": "USD"
        },
        {
          "name": "Premium",
          "billingCycle": "MONTHLY",
          "amount": 79.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Gymshark Training App",
      "category": "Fitness",
      "merchantName": "Gymshark Ltd",
      "websiteUrl": "https://www.gymshark.com/us/pages/training-app",
      "cancellationUrl": "https://support.gymshark.com/hc/en-us/articles/1500006351682-Cancelling-your-Gymshark-Training-App-subscription",
      "tags": ["workout", "fitness", "training", "plans"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        },
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 79.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Beachbody On Demand",
      "category": "Fitness",
      "merchantName": "Beachbody, LLC",
      "websiteUrl": "https://www.beachbody.com",
      "cancellationUrl": "https://www.beachbody.com/account/subscription",
      "tags": ["home workout", "fitness", "nutrition", "coaching"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 19.99,
          "currency": "USD"
        },
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 179.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Daily Harvest",
      "category": "Meal Kit",
      "merchantName": "Daily Harvest Inc.",
      "websiteUrl": "https://www.daily-harvest.com",
      "cancellationUrl": "https://www.daily-harvest.com/account/subscription",
      "tags": ["smoothies", "bowls", "plant-based", "meal prep"],
      "plans": [
        {
          "name": "9 Items/Week",
          "billingCycle": "WEEKLY",
          "amount": 69.75,
          "currency": "USD",
          "description": "Billed weekly based on delivery schedule"
        }
      ]
    },
    {
      "name": "Blue Apron",
      "category": "Meal Kit",
      "merchantName": "Blue Apron Holdings, Inc.",
      "websiteUrl": "https://www.blueapron.com",
      "cancellationUrl": "https://www.blueapron.com/account/subscription",
      "tags": ["cooking", "recipes", "ingredients", "dinner"],
      "plans": [
        {
          "name": "2-Serving Plan",
          "billingCycle": "WEEKLY",
          "amount": 59.94,
          "currency": "USD",
          "description": "Per week, billed per delivery"
        }
      ]
    },
    {
      "name": "Factor Meals",
      "category": "Meal Delivery",
      "merchantName": "Factor75, Inc.",
      "websiteUrl": "https://www.factor75.com",
      "cancellationUrl": "https://www.factor75.com/account/subscription",
      "tags": ["healthy", "prepared meals", "keto", "low carb"],
      "plans": [
        {
          "name": "6 Meals/Week",
          "billingCycle": "WEEKLY",
          "amount": 77.94,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Blinkist",
      "category": "Education",
      "merchantName": "Blinks Labs GmbH",
      "websiteUrl": "https://www.blinkist.com",
      "cancellationUrl": "https://www.blinkist.com/en/account/subscription",
      "tags": ["books", "summaries", "learning", "nonfiction"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 12.99,
          "currency": "USD"
        },
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 79.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Scribd",
      "category": "Reading",
      "merchantName": "Scribd Inc.",
      "websiteUrl": "https://www.scribd.com",
      "cancellationUrl": "https://www.scribd.com/account_settings",
      "tags": ["ebooks", "audiobooks", "documents", "magazines"],
      "plans": [
        {
          "name": "Standard",
          "billingCycle": "MONTHLY",
          "amount": 12.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Kindle Unlimited",
      "category": "Reading",
      "merchantName": "Amazon.com, Inc.",
      "websiteUrl": "https://www.amazon.com/kindle-unlimited",
      "cancellationUrl": "https://www.amazon.com/hz/subscribe/ku",
      "tags": ["ebooks", "audiobooks", "reading", "kindle"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 11.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Audible Plus",
      "category": "Audio",
      "merchantName": "Amazon.com, Inc.",
      "websiteUrl": "https://www.audible.com/plus",
      "cancellationUrl": "https://www.audible.com/account/details/membership",
      "tags": ["audiobooks", "podcasts", "audio", "entertainment"],
      "plans": [
        {
          "name": "Plus Catalog",
          "billingCycle": "MONTHLY",
          "amount": 7.95,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Skillshare",
      "category": "Education",
      "merchantName": "Skillshare, Inc.",
      "websiteUrl": "https://www.skillshare.com",
      "cancellationUrl": "https://www.skillshare.com/account/billing",
      "tags": ["courses", "creative", "design", "photography"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 16.49,
          "currency": "USD"
        },
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 168.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Udemy Pro",
      "category": "Education",
      "merchantName": "Udemy, Inc.",
      "websiteUrl": "https://www.udemy.com",
      "cancellationUrl": "https://www.udemy.com/instructor/subscription/",
      "tags": ["courses", "coding", "business", "personal development"],
      "plans": [
        {
          "name": "Personal Plan",
          "billingCycle": "MONTHLY",
          "amount": 39.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Coursera Plus",
      "category": "Education",
      "merchantName": "Coursera, Inc.",
      "websiteUrl": "https://www.coursera.org",
      "cancellationUrl": "https://www.coursera.org/account/subscriptions",
      "tags": ["courses", "certificates", "university", "degree"],
      "plans": [
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 399.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Brilliant Premium",
      "category": "Education",
      "merchantName": "Brilliant.org",
      "websiteUrl": "https://brilliant.org",
      "cancellationUrl": "https://brilliant.org/account/settings/billing/",
      "tags": ["math", "science", "logic", "interactive learning"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 24.99,
          "currency": "USD"
        },
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 149.88,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Khan Academy Kids",
      "category": "Education",
      "merchantName": "Khan Academy",
      "websiteUrl": "https://learn.khanacademy.org/khan-academy-kids/",
      "cancellationUrl": "https://learn.khanacademy.org/khan-academy-kids/subscription/",
      "tags": ["kids", "learning", "preschool", "reading", "math"],
      "plans": [
        {
          "name": "Premium",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Free for all users; no paid tier"
        }
      ]
    },
    {
      "name": "ABCmouse",
      "category": "Education",
      "merchantName": "Age of Learning, Inc.",
      "websiteUrl": "https://www.abcmouse.com",
      "cancellationUrl": "https://www.abcmouse.com/account/subscription",
      "tags": ["kids", "learning", "curriculum", "ages 2-8"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 12.99,
          "currency": "USD"
        },
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 59.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Outschool",
      "category": "Education",
      "merchantName": "Outschool, Inc.",
      "websiteUrl": "https://outschool.com",
      "cancellationUrl": "https://outschool.com/account/subscriptions",
      "tags": ["kids", "classes", "live", "homeschool", "interests"],
      "plans": [
        {
          "name": "Unlimited+",
          "billingCycle": "MONTHLY",
          "amount": 39.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Rosetta Stone",
      "category": "Education",
      "merchantName": "Rosetta Stone Ltd.",
      "websiteUrl": "https://www.rosettastone.com",
      "cancellationUrl": "https://www.rosettastone.com/account/subscription",
      "tags": ["language", "learning", "immersion", "speaking"],
      "plans": [
        {
          "name": "3-Month",
          "billingCycle": "QUARTERLY",
          "amount": 35.99,
          "currency": "USD"
        },
        {
          "name": "12-Month",
          "billingCycle": "YEARLY",
          "amount": 99.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Busuu Premium",
      "category": "Education",
      "merchantName": "Busuu Ltd",
      "websiteUrl": "https://www.busuu.com",
      "cancellationUrl": "https://www.busuu.com/en/account/subscription",
      "tags": ["language", "learning", "certification", "grammar"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 13.95,
          "currency": "USD"
        },
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 83.40,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Memrise Pro",
      "category": "Education",
      "merchantName": "Memrise Ltd",
      "websiteUrl": "https://www.memrise.com",
      "cancellationUrl": "https://www.memrise.com/account/subscription/",
      "tags": ["language", "vocabulary", "video clips", "learning"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        },
        {
          "name": "Pro Annual",
          "billingCycle": "YEARLY",
          "amount": 59.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "LingQ Premium",
      "category": "Education",
      "merchantName": "LingQ Languages Inc.",
      "websiteUrl": "https://www.lingq.com",
      "cancellationUrl": "https://www.lingq.com/en/account/subscription/",
      "tags": ["language", "reading", "listening", "comprehension"],
      "plans": [
        {
          "name": "Premium Monthly",
          "billingCycle": "MONTHLY",
          "amount": 12.99,
          "currency": "USD"
        },
        {
          "name": "Premium Annual",
          "billingCycle": "YEARLY",
          "amount": 129.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Tandem Pro",
      "category": "Education",
      "merchantName": "Tandem International Ltd",
      "websiteUrl": "https://www.tandem.net",
      "cancellationUrl": "https://www.tandem.net/account/subscription",
      "tags": ["language exchange", "conversation", "tutoring"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 12.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Preply Tutoring",
      "category": "Education",
      "merchantName": "Preply Inc.",
      "websiteUrl": "https://preply.com",
      "cancellationUrl": "https://preply.com/en/my-lessons/subscriptions",
      "tags": ["tutoring", "language", "academic", "1-on-1"],
      "plans": [
        {
          "name": "Subscription Plan",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Pay per lesson; no recurring subscription"
        }
      ]
    },
    {
      "name": "italki",
      "category": "Education",
      "merchantName": "italki HK Ltd",
      "websiteUrl": "https://www.italki.com",
      "cancellationUrl": "https://www.italki.com/account/wallet",
      "tags": ["language", "tutors", "conversation", "lessons"],
      "plans": [
        {
          "name": "Credit Top-Up",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Prepaid credits; no recurring fee"
        }
      ]
    },
    {
      "name": "Shipt",
      "category": "Delivery",
      "merchantName": "Shipt, Inc.",
      "websiteUrl": "https://shipt.com",
      "cancellationUrl": "https://shipt.com/account/membership",
      "tags": ["groceries", "delivery", "same-day", "shopping"],
      "plans": [
        {
          "name": "Annual Membership",
          "billingCycle": "YEARLY",
          "amount": 99.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Instacart+",
      "category": "Delivery",
      "merchantName": "Maplebear Inc.",
      "websiteUrl": "https://www.instacart.com",
      "cancellationUrl": "https://www.instacart.com/account/instacart_plus",
      "tags": ["groceries", "delivery", "membership", "fast"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        },
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 99.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "DoorDash DashPass",
      "category": "Food Delivery",
      "merchantName": "DoorDash, Inc.",
      "websiteUrl": "https://www.doordash.com/dashpass",
      "cancellationUrl": "https://www.doordash.com/account/dashpass",
      "tags": ["food", "delivery", "restaurant", "fee-free"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        },
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 84.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Uber One",
      "category": "Delivery & Ride",
      "merchantName": "Uber Technologies, Inc.",
      "websiteUrl": "https://www.uber.com/us/en/uber-one/",
      "cancellationUrl": "https://www.uber.com/profile/subscription/",
      "tags": ["rides", "food", "delivery", "membership"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Grubhub+",
      "category": "Food Delivery",
      "merchantName": "Grubhub Inc.",
      "websiteUrl": "https://www.grubhub.com/plus",
      "cancellationUrl": "https://www.grubhub.com/account/plus",
      "tags": ["food", "delivery", "restaurant", "free delivery"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Postmates Unlimited",
      "category": "Food Delivery",
      "merchantName": "Uber Technologies, Inc.",
      "websiteUrl": "https://postmates.com/unlimited",
      "cancellationUrl": "https://postmates.com/account/unlimited",
      "tags": ["food", "delivery", "convenience", "fast"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Rent the Runway",
      "category": "Fashion",
      "merchantName": "Rent the Runway, Inc.",
      "websiteUrl": "https://www.renttherunway.com",
      "cancellationUrl": "https://www.renttherunway.com/account/plan",
      "tags": ["clothing", "rental", "designer", "fashion"],
      "plans": [
        {
          "name": "Update",
          "billingCycle": "MONTHLY",
          "amount": 89.0,
          "currency": "USD"
        },
        {
          "name": "Unlimited",
          "billingCycle": "MONTHLY",
          "amount": 135.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Stitch Fix",
      "category": "Fashion",
      "merchantName": "Stitch Fix, Inc.",
      "websiteUrl": "https://www.stitchfix.com",
      "cancellationUrl": "https://www.stitchfix.com/account/subscription",
      "tags": ["clothing", "styling", "personal shopper", "box"],
      "plans": [
        {
          "name": "Fix Preview",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No subscription fee; $20 styling fee per fix"
        }
      ]
    },
    {
      "name": "Nuuly",
      "category": "Fashion",
      "merchantName": "URBN (Urban Outfitters)",
      "websiteUrl": "https://www.nuuly.com",
      "cancellationUrl": "https://www.nuuly.com/account/subscription",
      "tags": ["clothing rental", "sustainable", "boho", "urban"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 88.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "FabFitFun",
      "category": "Lifestyle",
      "merchantName": "FabFitFun, Inc.",
      "websiteUrl": "https://www.fabfitfun.com",
      "cancellationUrl": "https://www.fabfitfun.com/account/subscription",
      "tags": ["box", "beauty", "fitness", "lifestyle", "seasonal"],
      "plans": [
        {
          "name": "Seasonal Box",
          "billingCycle": "QUARTERLY",
          "amount": 49.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "BarkBox",
      "category": "Pet",
      "merchantName": "BARK",
      "websiteUrl": "https://www.barkbox.com",
      "cancellationUrl": "https://www.barkbox.com/account/subscription",
      "tags": ["dog", "toys", "treats", "subscription box"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 35.0,
          "currency": "USD"
        },
        {
          "name": "6-Month Plan",
          "billingCycle": "YEARLY",
          "amount": 174.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Chewy Autoship",
      "category": "Pet",
      "merchantName": "Chewy, Inc.",
      "websiteUrl": "https://www.chewy.com",
      "cancellationUrl": "https://www.chewy.com/account/autoship",
      "tags": ["pet food", "supplies", "delivery", "discount"],
      "plans": [
        {
          "name": "Autoship",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Free program; recurring delivery with 5% discount"
        }
      ]
    },
    {
      "name": "Petco Vital Care",
      "category": "Pet",
      "merchantName": "Petco Health and Wellness Company, Inc.",
      "websiteUrl": "https://www.petco.com/vitalcare",
      "cancellationUrl": "https://www.petco.com/shop/en/petcostore/vital-care",
      "tags": ["pet health", "vet", "discounts", "wellness"],
      "plans": [
        {
          "name": "Vital Care",
          "billingCycle": "MONTHLY",
          "amount": 19.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Whisker City (Litter-Robot)",
      "category": "Pet",
      "merchantName": "Whisker",
      "websiteUrl": "https://whisker.io",
      "cancellationUrl": "https://whisker.io/account/subscriptions",
      "tags": ["cat", "litter box", "smart", "cleaning"],
      "plans": [
        {
          "name": "Connect Premium",
          "billingCycle": "MONTHLY",
          "amount": 4.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Trupanion Pet Insurance",
      "category": "Pet",
      "merchantName": "Trupanion, Inc.",
      "websiteUrl": "https://www.trupanion.com",
      "cancellationUrl": "https://www.trupanion.com/contact-us",
      "tags": ["pet insurance", "vet bills", "coverage", "dog", "cat"],
      "plans": [
        {
          "name": "Monthly Premium",
          "billingCycle": "MONTHLY",
          "amount": 40.0,
          "currency": "USD",
          "description": "Average monthly cost; varies by pet"
        }
      ]
    },
    {
      "name": "Pawp Emergency Fund",
      "category": "Pet",
      "merchantName": "Pawp Inc.",
      "websiteUrl": "https://www.pawp.com",
      "cancellationUrl": "https://www.pawp.com/account/subscription",
      "tags": ["pet emergency", "telehealth", "vet", "insurance"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 24.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Care.com Premium",
      "category": "Family",
      "merchantName": "Care.com, Inc.",
      "websiteUrl": "https://www.care.com",
      "cancellationUrl": "https://www.care.com/account/subscription",
      "tags": ["childcare", "senior care", "pet care", "housekeeping"],
      "plans": [
        {
          "name": "Premium Monthly",
          "billingCycle": "MONTHLY",
          "amount": 29.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Sittercity Premium",
      "category": "Family",
      "merchantName": "Sittercity Inc.",
      "websiteUrl": "https://www.sittercity.com",
      "cancellationUrl": "https://www.sittercity.com/account/subscription",
      "tags": ["babysitter", "nanny", "childcare", "background check"],
      "plans": [
        {
          "name": "Premium Monthly",
          "billingCycle": "MONTHLY",
          "amount": 39.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Hinge Preferred (Extended)",
      "category": "Dating",
      "merchantName": "Match Group, Inc.",
      "websiteUrl": "https://hinge.co",
      "cancellationUrl": "https://hinge.co/settings/subscription",
      "tags": ["dating", "relationships", "matches", "premium"],
      "plans": [
        {
          "name": "6-Month",
          "billingCycle": "YEARLY",
          "amount": 89.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "OkCupid Premium",
      "category": "Dating",
      "merchantName": "Match Group, Inc.",
      "websiteUrl": "https://www.okcupid.com",
      "cancellationUrl": "https://www.okcupid.com/account/subscription",
      "tags": ["dating", "matching", "questions", "compatibility"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 29.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Match.com",
      "category": "Dating",
      "merchantName": "Match Group, Inc.",
      "websiteUrl": "https://www.match.com",
      "cancellationUrl": "https://www.match.com/account/subscription",
      "tags": ["dating", "serious relationships", "profile", "messaging"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 35.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "eHarmony",
      "category": "Dating",
      "merchantName": "eHarmony, Inc.",
      "websiteUrl": "https://www.eharmony.com",
      "cancellationUrl": "https://www.eharmony.com/account/subscription",
      "tags": ["dating", "compatibility", "long-term", "matching"],
      "plans": [
        {
          "name": "Premium 6-Month",
          "billingCycle": "YEARLY",
          "amount": 239.40,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Plenty of Fish Premium",
      "category": "Dating",
      "merchantName": "Match Group, Inc.",
      "websiteUrl": "https://www.pof.com",
      "cancellationUrl": "https://www.pof.com/account/subscription",
      "tags": ["dating", "free", "messaging", "upgraded"],
      "plans": [
        {
          "name": "Premium Monthly",
          "billingCycle": "MONTHLY",
          "amount": 19.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Coffee Meets Bagel Premium",
      "category": "Dating",
      "merchantName": "Coffee Meets Bagel, Inc.",
      "websiteUrl": "https://coffeemeetsbagel.com",
      "cancellationUrl": "https://coffeemeetsbagel.com/account/subscription",
      "tags": ["dating", "quality matches", "women-first", "daily"],
      "plans": [
        {
          "name": "Premium Monthly",
          "billingCycle": "MONTHLY",
          "amount": 34.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Raya",
      "category": "Dating",
      "merchantName": "Raya LLC",
      "websiteUrl": "https://www.raya.com",
      "cancellationUrl": "https://www.raya.com/account",
      "tags": ["exclusive", "celebrity", "creative", "dating"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 8.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Feeld",
      "category": "Dating",
      "merchantName": "Feeld Ltd",
      "websiteUrl": "https://feeld.co",
      "cancellationUrl": "https://feeld.co/account/subscription",
      "tags": ["open relationships", "polyamory", "exploration", "dating"],
      "plans": [
        {
          "name": "Majestic Monthly",
          "billingCycle": "MONTHLY",
          "amount": 11.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Grindr XTRA",
      "category": "Dating",
      "merchantName": "Grindr LLC",
      "websiteUrl": "https://www.grindr.com",
      "cancellationUrl": "https://www.grindr.com/account/subscription",
      "tags": ["gay", "dating", "location", "chat"],
      "plans": [
        {
          "name": "XTRA Monthly",
          "billingCycle": "MONTHLY",
          "amount": 19.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Lex",
      "category": "Dating",
      "merchantName": "Lex Community Inc.",
      "websiteUrl": "https://www.lex.app",
      "cancellationUrl": "https://www.lex.app/account",
      "tags": ["queer", "text-based", "community", "friendship"],
      "plans": [
        {
          "name": "Lex Plus",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Tastemade+",
      "category": "Streaming",
      "merchantName": "Tastemade, Inc.",
      "websiteUrl": "https://www.tastemade.com",
      "cancellationUrl": "https://www.tastemade.com/account/subscription",
      "tags": ["cooking", "travel", "food", "streaming"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 4.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "BritBox",
      "category": "Streaming",
      "merchantName": "BritBox International",
      "websiteUrl": "https://www.britbox.com",
      "cancellationUrl": "https://www.britbox.com/account/subscription",
      "tags": ["british tv", "drama", "classic", "bbc", "itv"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 7.99,
          "currency": "USD"
        },
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 79.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Crunchyroll",
      "category": "Streaming",
      "merchantName": "Crunchyroll, LLC",
      "websiteUrl": "https://www.crunchyroll.com",
      "cancellationUrl": "https://www.crunchyroll.com/acct/membership",
      "tags": ["anime", "manga", "japanese", "simulcast"],
      "plans": [
        {
          "name": "Fan",
          "billingCycle": "MONTHLY",
          "amount": 7.99,
          "currency": "USD"
        },
        {
          "name": "Mega Fan",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        },
        {
          "name": "Ultimate Fan",
          "billingCycle": "MONTHLY",
          "amount": 14.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Funimation",
      "category": "Streaming",
      "merchantName": "Crunchyroll, LLC",
      "websiteUrl": "https://www.funimation.com",
      "cancellationUrl": "https://www.funimation.com/account/membership",
      "tags": ["anime", "dubbed", "subbed", "collection"],
      "plans": [
        {
          "name": "Premium",
          "billingCycle": "MONTHLY",
          "amount": 5.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "MUBI",
      "category": "Streaming",
      "merchantName": "MUBI Ltd",
      "websiteUrl": "https://mubi.com",
      "cancellationUrl": "https://mubi.com/account/subscription",
      "tags": ["cinema", "arthouse", "international", "curated"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 12.99,
          "currency": "USD"
        },
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 129.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Criterion Channel",
      "category": "Streaming",
      "merchantName": "The Criterion Collection",
      "websiteUrl": "https://www.criterionchannel.com",
      "cancellationUrl": "https://www.criterionchannel.com/account/subscription",
      "tags": ["classic film", "restoration", "cinema", "essays"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 10.99,
          "currency": "USD"
        },
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 99.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Shudder",
      "category": "Streaming",
      "merchantName": "AMC Networks Inc.",
      "websiteUrl": "https://www.shudder.com",
      "cancellationUrl": "https://www.shudder.com/account/subscription",
      "tags": ["horror", "thriller", "scary", "originals"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 5.99,
          "currency": "USD"
        },
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 59.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "AMC+",
      "category": "Streaming",
      "merchantName": "AMC Networks Inc.",
      "websiteUrl": "https://www.amcplus.com",
      "cancellationUrl": "https://www.amcplus.com/account/subscription",
      "tags": ["tv", "movies", "originals", "amc", "shudder"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 8.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Discovery+",
      "category": "Streaming",
      "merchantName": "Warner Bros. Discovery",
      "websiteUrl": "https://www.discoveryplus.com",
      "cancellationUrl": "https://www.discoveryplus.com/account/subscription",
      "tags": ["reality", "documentary", "food", "home", "true crime"],
      "plans": [
        {
          "name": "With Ads",
          "billingCycle": "MONTHLY",
          "amount": 4.99,
          "currency": "USD"
        },
        {
          "name": "Ad-Free",
          "billingCycle": "MONTHLY",
          "amount": 6.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "CuriosityStream",
      "category": "Streaming",
      "merchantName": "CuriosityStream Inc.",
      "websiteUrl": "https://curiositystream.com",
      "cancellationUrl": "https://curiositystream.com/account/subscription",
      "tags": ["documentary", "science", "history", "nature"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 2.99,
          "currency": "USD"
        },
        {
          "name": "Standard Annual",
          "billingCycle": "YEARLY",
          "amount": 19.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Noggin",
      "category": "Streaming",
      "merchantName": "Paramount Global",
      "websiteUrl": "https://www.noggin.com",
      "cancellationUrl": "https://www.noggin.com/account/subscription",
      "tags": ["kids", "preschool", "nick jr", "learning", "cartoons"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 7.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "PBS Masterpiece",
      "category": "Streaming",
      "merchantName": "Public Broadcasting Service",
      "websiteUrl": "https://www.pbs.org/masterpiece",
      "cancellationUrl": "https://www.pbs.org/pass/subscription/",
      "tags": ["british drama", "period", "mystery", "public tv"],
      "plans": [
        {
          "name": "PBS Passport",
          "billingCycle": "YEARLY",
          "amount": 60.0,
          "currency": "USD",
          "description": "Donation-based access to full catalog"
        }
      ]
    },
    {
      "name": "Acorn TV",
      "category": "Streaming",
      "merchantName": "RLJ Entertainment, Inc.",
      "websiteUrl": "https://www.acorn.tv",
      "cancellationUrl": "https://www.acorn.tv/account/subscription",
      "tags": ["british", "mystery", "drama", "international"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 6.99,
          "currency": "USD"
        },
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 69.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Sundance Now",
      "category": "Streaming",
      "merchantName": "AMC Networks Inc.",
      "websiteUrl": "https://www.sundancenow.com",
      "cancellationUrl": "https://www.sundancenow.com/account/subscription",
      "tags": ["indie", "film", "drama", "crime", "international"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 6.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Hayu",
      "category": "Streaming",
      "merchantName": "Hayu Global",
      "websiteUrl": "https://www.hayu.com",
      "cancellationUrl": "https://www.hayu.com/account/subscription",
      "tags": ["reality tv", "keeping up", "vanderpump", "bravo"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 5.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "VRV",
      "category": "Streaming",
      "merchantName": "Crunchyroll, LLC",
      "websiteUrl": "https://vrv.co",
      "cancellationUrl": "https://vrv.co/account/subscription",
      "tags": ["anime", "geek", "nerd", "cartoon", "rooster teeth"],
      "plans": [
        {
          "name": "VRV Premium",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "FuboTV",
      "category": "Live TV",
      "merchantName": "fuboTV Inc.",
      "websiteUrl": "https://www.fubo.tv",
      "cancellationUrl": "https://www.fubo.tv/account/subscription",
      "tags": ["sports", "live tv", "soccer", "cable alternative"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 74.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Sling TV",
      "category": "Live TV",
      "merchantName": "Dish Network Corporation",
      "websiteUrl": "https://www.sling.com",
      "cancellationUrl": "https://www.sling.com/account/subscription",
      "tags": ["live tv", "cable", "entertainment", "sports"],
      "plans": [
        {
          "name": "Sling Orange",
          "billingCycle": "MONTHLY",
          "amount": 40.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Philo",
      "category": "Live TV",
      "merchantName": "Philo Inc.",
      "websiteUrl": "https://www.philo.com",
      "cancellationUrl": "https://www.philo.com/account/subscription",
      "tags": ["live tv", "entertainment", "lifestyle", "affordable"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 25.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "YouTube TV",
      "category": "Live TV",
      "merchantName": "Google LLC",
      "websiteUrl": "https://tv.youtube.com",
      "cancellationUrl": "https://tv.youtube.com/account",
      "tags": ["live tv", "cable", "cloud dvr", "sports", "news"],
      "plans": [
        {
          "name": "Base Plan",
          "billingCycle": "MONTHLY",
          "amount": 72.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Hulu + Live TV",
      "category": "Live TV",
      "merchantName": "Disney Streaming Services",
      "websiteUrl": "https://www.hulu.com/live-tv",
      "cancellationUrl": "https://secure.hulu.com/account/cancel",
      "tags": ["live tv", "streaming", "sports", "news", "on-demand"],
      "plans": [
        {
          "name": "With Ads",
          "billingCycle": "MONTHLY",
          "amount": 76.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "DirecTV Stream",
      "category": "Live TV",
      "merchantName": "AT&T Inc.",
      "websiteUrl": "https://www.directv.com/stream",
      "cancellationUrl": "https://www.directv.com/account/manage-subscription",
      "tags": ["live tv", "cable", "sports", "premium channels"],
      "plans": [
        {
          "name": "Entertainment",
          "billingCycle": "MONTHLY",
          "amount": 79.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "PlayStation Plus Essential",
      "category": "Gaming",
      "merchantName": "Sony Interactive Entertainment",
      "websiteUrl": "https://www.playstation.com/ps-plus",
      "cancellationUrl": "https://www.playstation.com/account/subscription/",
      "tags": ["gaming", "ps5", "online", "free games"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        },
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 79.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Xbox Game Pass Core",
      "category": "Gaming",
      "merchantName": "Microsoft Corporation",
      "websiteUrl": "https://www.xbox.com/game-pass",
      "cancellationUrl": "https://account.microsoft.com/services",
      "tags": ["gaming", "xbox", "online", "games"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Nintendo Switch Online",
      "category": "Gaming",
      "merchantName": "Nintendo Co., Ltd.",
      "websiteUrl": "https://www.nintendo.com/switch/online",
      "cancellationUrl": "https://accounts.nintendo.com/subscription",
      "tags": ["gaming", "switch", "online", "classic games"],
      "plans": [
        {
          "name": "Individual Monthly",
          "billingCycle": "MONTHLY",
          "amount": 3.99,
          "currency": "USD"
        },
        {
          "name": "Individual Annual",
          "billingCycle": "YEARLY",
          "amount": 19.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "EA Play",
      "category": "Gaming",
      "merchantName": "Electronic Arts Inc.",
      "websiteUrl": "https://www.ea.com/ea-play",
      "cancellationUrl": "https://www.ea.com/ea-play/account",
      "tags": ["gaming", "ea", "trials", "vault", "fifa", "madden"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 4.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Ubisoft+",
      "category": "Gaming",
      "merchantName": "Ubisoft Entertainment",
      "websiteUrl": "https://ubisoftplus.com",
      "cancellationUrl": "https://ubisoftplus.com/account/subscription",
      "tags": ["gaming", "assassin's creed", "far cry", "pc"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 17.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "GeForce NOW",
      "category": "Gaming",
      "merchantName": "NVIDIA Corporation",
      "websiteUrl": "https://www.nvidia.com/en-us/geforce-now/",
      "cancellationUrl": "https://www.nvidia.com/en-us/geforce-now/account/",
      "tags": ["cloud gaming", "streaming", "pc", "play anywhere"],
      "plans": [
        {
          "name": "Priority Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Boosteroid",
      "category": "Gaming",
      "merchantName": "Boosteroid Ltd",
      "websiteUrl": "https://boosteroid.com",
      "cancellationUrl": "https://boosteroid.com/account/subscription",
      "tags": ["cloud gaming", "xbox", "playstation", "steam"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Antstream Arcade",
      "category": "Gaming",
      "merchantName": "Antstream Ltd",
      "websiteUrl": "https://antstream.com",
      "cancellationUrl": "https://antstream.com/account/subscription",
      "tags": ["retro", "classic", "arcade", "console", "multiplayer"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Humble Choice",
      "category": "Gaming",
      "merchantName": "Humble Bundle, Inc.",
      "websiteUrl": "https://www.humblebundle.com/subscription",
      "cancellationUrl": "https://www.humblebundle.com/subscription/account",
      "tags": ["games", "bundle", "charity", "pc", "monthly"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 14.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "itch.io Membership",
      "category": "Gaming",
      "merchantName": "Leaf Corcoran",
      "websiteUrl": "https://itch.io",
      "cancellationUrl": "https://itch.io/user/subscription",
      "tags": ["indie", "games", "creators", "support", "downloads"],
      "plans": [
        {
          "name": "Supporter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 5.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Discord Nitro",
      "category": "Communication",
      "merchantName": "Discord Inc.",
      "websiteUrl": "https://discord.com/nitro",
      "cancellationUrl": "https://discord.com/developers/applications",
      "tags": ["chat", "gaming", "emoji", "server boost", "upload"],
      "plans": [
        {
          "name": "Nitro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        },
        {
          "name": "Nitro Annual",
          "billingCycle": "YEARLY",
          "amount": 99.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Twitch Turbo",
      "category": "Streaming",
      "merchantName": "Twitch Interactive, Inc.",
      "websiteUrl": "https://www.twitch.tv/turbo",
      "cancellationUrl": "https://www.twitch.tv/user/settings/subscription",
      "tags": ["streaming", "twitch", "ad-free", "emotes", "chat"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 8.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Patreon (Creator Pro)",
      "category": "Crowdfunding",
      "merchantName": "Patreon, Inc.",
      "websiteUrl": "https://www.patreon.com",
      "cancellationUrl": "https://www.patreon.com/settings/memberships",
      "tags": ["creator", "membership", "monetization", "content"],
      "plans": [
        {
          "name": "Pro (5% fee)",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Free for creators; revenue share model"
        }
      ]
    },
    {
      "name": "Buy Me a Coffee",
      "category": "Crowdfunding",
      "merchantName": "Buy Me a Coffee Ltd",
      "websiteUrl": "https://www.buymeacoffee.com",
      "cancellationUrl": "https://www.buymeacoffee.com/dashboard/membership",
      "tags": ["support", "creators", "coffee", "donations"],
      "plans": [
        {
          "name": "Membership",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Free platform; optional supporter tiers"
        }
      ]
    },
    {
      "name": "Ko-fi Gold",
      "category": "Crowdfunding",
      "merchantName": "Ko-fi.com Ltd",
      "websiteUrl": "https://ko-fi.com",
      "cancellationUrl": "https://ko-fi.com/dashboard/subscription",
      "tags": ["creators", "donations", "shop", "memberships"],
      "plans": [
        {
          "name": "Gold Monthly",
          "billingCycle": "MONTHLY",
          "amount": 6.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Etsy Ads",
      "category": "E-commerce",
      "merchantName": "Etsy, Inc.",
      "websiteUrl": "https://www.etsy.com/seller-handbook/article/etsy-ads",
      "cancellationUrl": "https://www.etsy.com/your/shops/YourShopName/settings/ads",
      "tags": ["handmade", "ads", "promotion", "selling"],
      "plans": [
        {
          "name": "Pay-per-click",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No subscription; pay only for clicks"
        }
      ]
    },
    {
      "name": "Square for Retail",
      "category": "Business",
      "merchantName": "Block, Inc.",
      "websiteUrl": "https://squareup.com/us/en/retail",
      "cancellationUrl": "https://squareup.com/dashboard/billing",
      "tags": ["pos", "retail", "inventory", "payments"],
      "plans": [
        {
          "name": "Plus Monthly",
          "billingCycle": "MONTHLY",
          "amount": 60.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Toast POS",
      "category": "Business",
      "merchantName": "Toast, Inc.",
      "websiteUrl": "https://pos.toasttab.com",
      "cancellationUrl": "https://toasttab.com/contact-sales",
      "tags": ["restaurant", "pos", "ordering", "payments"],
      "plans": [
        {
          "name": "Essentials",
          "billingCycle": "MONTHLY",
          "amount": 79.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Lightspeed Retail",
      "category": "Business",
      "merchantName": "Lightspeed Commerce Inc.",
      "websiteUrl": "https://www.lightspeedhq.com",
      "cancellationUrl": "https://www.lightspeedhq.com/contact/",
      "tags": ["pos", "retail", "ecommerce", "inventory"],
      "plans": [
        {
          "name": "Advanced Monthly",
          "billingCycle": "MONTHLY",
          "amount": 169.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Clover POS",
      "category": "Business",
      "merchantName": "Fiserv, Inc.",
      "websiteUrl": "https://www.clover.com",
      "cancellationUrl": "https://www.clover.com/support",
      "tags": ["pos", "payments", "small business", "hardware"],
      "plans": [
        {
          "name": "Register Monthly",
          "billingCycle": "MONTHLY",
          "amount": 14.95,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Wave Accounting",
      "category": "Finance",
      "merchantName": "Wave Financial Inc.",
      "websiteUrl": "https://www.waveapps.com",
      "cancellationUrl": "https://www.waveapps.com/account/billing",
      "tags": ["accounting", "invoicing", "small business", "free"],
      "plans": [
        {
          "name": "Free Plan",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "FreshBooks",
      "category": "Finance",
      "merchantName": "2ndSite Inc.",
      "websiteUrl": "https://www.freshbooks.com",
      "cancellationUrl": "https://www.freshbooks.com/account/billing",
      "tags": ["invoicing", "accounting", "time tracking", "freelancer"],
      "plans": [
        {
          "name": "Lite Monthly",
          "billingCycle": "MONTHLY",
          "amount": 17.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Xero",
      "category": "Finance",
      "merchantName": "Xero Limited",
      "websiteUrl": "https://www.xero.com",
      "cancellationUrl": "https://www.xero.com/us/account/billing/",
      "tags": ["accounting", "small business", "bookkeeping", "cloud"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 39.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Zoho Books",
      "category": "Finance",
      "merchantName": "Zoho Corporation",
      "websiteUrl": "https://www.zoho.com/books",
      "cancellationUrl": "https://www.zoho.com/books/settings/billing.html",
      "tags": ["accounting", "invoicing", "gst", "automation"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 15.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Coinbase One",
      "category": "Finance",
      "merchantName": "Coinbase, Inc.",
      "websiteUrl": "https://www.coinbase.com/one",
      "cancellationUrl": "https://www.coinbase.com/settings/subscription",
      "tags": ["crypto", "bitcoin", "trading", "fee-free"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 29.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "NerdWallet Premium",
      "category": "Finance",
      "merchantName": "NerdWallet, Inc.",
      "websiteUrl": "https://www.nerdwallet.com/premium",
      "cancellationUrl": "https://www.nerdwallet.com/account/subscription",
      "tags": ["credit", "loans", "personal finance", "advice"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Credit Karma Premium",
      "category": "Finance",
      "merchantName": "Credit Karma, LLC",
      "websiteUrl": "https://www.creditkarma.com",
      "cancellationUrl": "https://www.creditkarma.com/account/settings",
      "tags": ["credit score", "monitoring", "identity theft", "free"],
      "plans": [
        {
          "name": "Free Tier",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Rocket Money",
      "category": "Finance",
      "merchantName": "Rocket Money, Inc.",
      "websiteUrl": "https://www.rocketmoney.com",
      "cancellationUrl": "https://www.rocketmoney.com/account/subscription",
      "tags": ["budgeting", "cancel subscriptions", "negotiate bills"],
      "plans": [
        {
          "name": "Essential",
          "billingCycle": "MONTHLY",
          "amount": 3.0,
          "currency": "USD"
        },
        {
          "name": "Smart",
          "billingCycle": "MONTHLY",
          "amount": 12.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Truebill",
      "category": "Finance",
      "merchantName": "Rocket Money, Inc.",
      "websiteUrl": "https://www.truebill.com",
      "cancellationUrl": "https://www.truebill.com/account/subscription",
      "tags": ["budgeting", "subscriptions", "spending", "savings"],
      "plans": [
        {
          "name": "Premium Monthly",
          "billingCycle": "MONTHLY",
          "amount": 12.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Mint",
      "category": "Finance",
      "merchantName": "Intuit Inc.",
      "websiteUrl": "https://mint.intuit.com",
      "cancellationUrl": "https://mint.intuit.com/account/settings",
      "tags": ["budgeting", "finance", "tracking", "free"],
      "plans": [
        {
          "name": "Free",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Personal Capital",
      "category": "Finance",
      "merchantName": "Empower Retirement",
      "websiteUrl": "https://www.empower.com/personal-capital",
      "cancellationUrl": "https://www.empower.com/help",
      "tags": ["investing", "retirement", "net worth", "wealth"],
      "plans": [
        {
          "name": "Free Dashboard",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Acorns",
      "category": "Finance",
      "merchantName": "Acorns Grow Incorporated",
      "websiteUrl": "https://www.acorns.com",
      "cancellationUrl": "https://www.acorns.com/account/subscription",
      "tags": ["investing", "round-ups", "retirement", "spend"],
      "plans": [
        {
          "name": "Personal",
          "billingCycle": "MONTHLY",
          "amount": 3.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Stash",
      "category": "Finance",
      "merchantName": "Stash Financial, Inc.",
      "websiteUrl": "https://www.stash.com",
      "cancellationUrl": "https://www.stash.com/account/subscription",
      "tags": ["investing", "stocks", "etf", "learn"],
      "plans": [
        {
          "name": "Growth",
          "billingCycle": "MONTHLY",
          "amount": 3.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Betterment",
      "category": "Finance",
      "merchantName": "Betterment LLC",
      "websiteUrl": "https://www.betterment.com",
      "cancellationUrl": "https://www.betterment.com/account/settings",
      "tags": ["robo-advisor", "investing", "retirement", "goals"],
      "plans": [
        {
          "name": "Digital",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "0.25% annual fee; no monthly charge"
        }
      ]
    },
    {
      "name": "Wealthfront",
      "category": "Finance",
      "merchantName": "Wealthfront Corporation",
      "websiteUrl": "https://www.wealthfront.com",
      "cancellationUrl": "https://www.wealthfront.com/account/settings",
      "tags": ["robo-advisor", "investing", "cash account", "tax"],
      "plans": [
        {
          "name": "Automated Investing",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "0.25% annual fee; no monthly charge"
        }
      ]
    },
    {
      "name": "SoFi Invest",
      "category": "Finance",
      "merchantName": "SoFi Technologies, Inc.",
      "websiteUrl": "https://www.sofi.com/invest",
      "cancellationUrl": "https://www.sofi.com/account/invest",
      "tags": ["investing", "crypto", "active", "automated"],
      "plans": [
        {
          "name": "Free Investing",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Robinhood Gold",
      "category": "Finance",
      "merchantName": "Robinhood Markets, Inc.",
      "websiteUrl": "https://robinhood.com/gold",
      "cancellationUrl": "https://robinhood.com/account/subscription",
      "tags": ["stocks", "margin", "research", "crypto"],
      "plans": [
        {
          "name": "Gold Monthly",
          "billingCycle": "MONTHLY",
          "amount": 5.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Webflow CMS",
      "category": "Website Builder",
      "merchantName": "Webflow, Inc.",
      "websiteUrl": "https://webflow.com",
      "cancellationUrl": "https://webflow.com/dashboard/account/billing",
      "tags": ["web design", "cms", "no-code", "responsive"],
      "plans": [
        {
          "name": "CMS Monthly",
          "billingCycle": "MONTHLY",
          "amount": 14.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Squarespace Commerce",
      "category": "E-commerce",
      "merchantName": "Squarespace, Inc.",
      "websiteUrl": "https://www.squarespace.com/ecommerce-website",
      "cancellationUrl": "https://account.squarespace.com/billing",
      "tags": ["online store", "ecommerce", "website", "checkout"],
      "plans": [
        {
          "name": "Business Monthly",
          "billingCycle": "MONTHLY",
          "amount": 23.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "BigCommerce Standard",
      "category": "E-commerce",
      "merchantName": "BigCommerce Holdings, Inc.",
      "websiteUrl": "https://www.bigcommerce.com",
      "cancellationUrl": "https://www.bigcommerce.com/account/billing",
      "tags": ["ecommerce", "online store", "scalable", "b2b"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 29.95,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Volusion",
      "category": "E-commerce",
      "merchantName": "Volusion, LLC",
      "websiteUrl": "https://www.volusion.com",
      "cancellationUrl": "https://www.volusion.com/account/billing",
      "tags": ["ecommerce", "store builder", "shopping cart", "hosting"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 29.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Ecwid",
      "category": "E-commerce",
      "merchantName": "Ecwid Inc.",
      "websiteUrl": "https://www.ecwid.com",
      "cancellationUrl": "https://www.ecwid.com/account/billing",
      "tags": ["ecommerce", "store", "facebook", "instagram", "wordpress"],
      "plans": [
        {
          "name": "Venture Monthly",
          "billingCycle": "MONTHLY",
          "amount": 15.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Gumroad Pro",
      "category": "E-commerce",
      "merchantName": "Gumroad, Inc.",
      "websiteUrl": "https://gumroad.com",
      "cancellationUrl": "https://gumroad.com/account/subscription",
      "tags": ["creators", "digital products", "payments", "store"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 10.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Podia",
      "category": "E-commerce",
      "merchantName": "Podia Inc.",
      "websiteUrl": "https://www.podia.com",
      "cancellationUrl": "https://www.podia.com/account/billing",
      "tags": ["courses", "memberships", "digital products", "email"],
      "plans": [
        {
          "name": "Mover Monthly",
          "billingCycle": "MONTHLY",
          "amount": 39.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Teachable",
      "category": "E-commerce",
      "merchantName": "Teachable, Inc.",
      "websiteUrl": "https://www.teachable.com",
      "cancellationUrl": "https://www.teachable.com/account/billing",
      "tags": ["courses", "online school", "coaching", "membership"],
      "plans": [
        {
          "name": "Basic Monthly",
          "billingCycle": "MONTHLY",
          "amount": 39.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Thinkific",
      "category": "E-commerce",
      "merchantName": "Thinkific Labs Inc.",
      "websiteUrl": "https://www.thinkific.com",
      "cancellationUrl": "https://www.thinkific.com/account/billing",
      "tags": ["courses", "education", "membership", "coaching"],
      "plans": [
        {
          "name": "Start Monthly",
          "billingCycle": "MONTHLY",
          "amount": 36.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Kajabi",
      "category": "E-commerce",
      "merchantName": "Kajabi LLC",
      "websiteUrl": "https://kajabi.com",
      "cancellationUrl": "https://kajabi.com/account/billing",
      "tags": ["courses", "coaching", "membership", "marketing"],
      "plans": [
        {
          "name": "Basic Monthly",
          "billingCycle": "MONTHLY",
          "amount": 119.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "ConvertKit",
      "category": "Marketing",
      "merchantName": "ConvertKit LLC",
      "websiteUrl": "https://convertkit.com",
      "cancellationUrl": "https://convertkit.com/account/billing",
      "tags": ["email marketing", "creators", "automation", "landing pages"],
      "plans": [
        {
          "name": "Creator Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 29.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "MailerLite",
      "category": "Marketing",
      "merchantName": "MailerLite UAB",
      "websiteUrl": "https://www.mailerlite.com",
      "cancellationUrl": "https://app.mailerlite.com/account/billing",
      "tags": ["email marketing", "automation", "landing pages", "pop-ups"],
      "plans": [
        {
          "name": "Advanced Monthly",
          "billingCycle": "MONTHLY",
          "amount": 21.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "ActiveCampaign",
      "category": "Marketing",
      "merchantName": "ActiveCampaign, LLC",
      "websiteUrl": "https://www.activecampaign.com",
      "cancellationUrl": "https://www.activecampaign.com/account/billing",
      "tags": ["automation", "crm", "email", "sms", "machine learning"],
      "plans": [
        {
          "name": "Lite Monthly",
          "billingCycle": "MONTHLY",
          "amount": 29.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "HubSpot Marketing Hub",
      "category": "Marketing",
      "merchantName": "HubSpot, Inc.",
      "websiteUrl": "https://www.hubspot.com/products/marketing",
      "cancellationUrl": "https://app.hubspot.com/billing",
      "tags": ["crm", "marketing", "automation", "analytics", "seo"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 20.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Ahrefs",
      "category": "Marketing",
      "merchantName": "Ahrefs Pte Ltd",
      "websiteUrl": "https://ahrefs.com",
      "cancellationUrl": "https://ahrefs.com/account/billing",
      "tags": ["seo", "backlinks", "keywords", "content", "rank tracker"],
      "plans": [
        {
          "name": "Lite Monthly",
          "billingCycle": "MONTHLY",
          "amount": 99.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "SEMrush",
      "category": "Marketing",
      "merchantName": "SEMrush Holdings, Inc.",
      "websiteUrl": "https://www.semrush.com",
      "cancellationUrl": "https://www.semrush.com/account/billing",
      "tags": ["seo", "ppc", "content", "social", "competitive research"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 129.95,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Moz Pro",
      "category": "Marketing",
      "merchantName": "Moz, Inc.",
      "websiteUrl": "https://moz.com/products/pro",
      "cancellationUrl": "https://moz.com/products/pro/account",
      "tags": ["seo", "rankings", "keyword research", "site audit"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 99.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Ubersuggest",
      "category": "Marketing",
      "merchantName": "Neil Patel Digital LLC",
      "websiteUrl": "https://neilpatel.com/ubersuggest",
      "cancellationUrl": "https://app.neilpatel.com/account/billing",
      "tags": ["seo", "keyword", "traffic", "backlinks", "content"],
      "plans": [
        {
          "name": "Individual Monthly",
          "billingCycle": "MONTHLY",
          "amount": 29.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Buffer",
      "category": "Social Media",
      "merchantName": "Buffer, Inc.",
      "websiteUrl": "https://buffer.com",
      "cancellationUrl": "https://buffer.com/account/billing",
      "tags": ["social media", "scheduling", "analytics", "publishing"],
      "plans": [
        {
          "name": "Essential Monthly",
          "billingCycle": "MONTHLY",
          "amount": 6.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Hootsuite",
      "category": "Social Media",
      "merchantName": "Hootsuite Media Inc.",
      "websiteUrl": "https://www.hootsuite.com",
      "cancellationUrl": "https://www.hootsuite.com/account/billing",
      "tags": ["social media", "scheduling", "analytics", "team"],
      "plans": [
        {
          "name": "Professional Monthly",
          "billingCycle": "MONTHLY",
          "amount": 99.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Later",
      "category": "Social Media",
      "merchantName": "Later Media Inc.",
      "websiteUrl": "https://later.com",
      "cancellationUrl": "https://later.com/account/billing",
      "tags": ["instagram", "tiktok", "pinterest", "visual planner"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 18.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Sprout Social",
      "category": "Social Media",
      "merchantName": "Sprout Social, Inc.",
      "websiteUrl": "https://sproutsocial.com",
      "cancellationUrl": "https://sproutsocial.com/account/billing",
      "tags": ["social media", "engagement", "analytics", "crm"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 249.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Canva for Teams",
      "category": "Design",
      "merchantName": "Canva Pty Ltd",
      "websiteUrl": "https://www.canva.com/teams",
      "cancellationUrl": "https://www.canva.com/account/billing/",
      "tags": ["design", "collaboration", "brand kit", "templates"],
      "plans": [
        {
          "name": "Teams Monthly",
          "billingCycle": "MONTHLY",
          "amount": 12.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Adobe Stock",
      "category": "Design",
      "merchantName": "Adobe Inc.",
      "websiteUrl": "https://stock.adobe.com",
      "cancellationUrl": "https://stock.adobe.com/account/plans",
      "tags": ["stock photos", "videos", "templates", "assets"],
      "plans": [
        {
          "name": "10 Images/Month",
          "billingCycle": "MONTHLY",
          "amount": 29.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Shutterstock",
      "category": "Design",
      "merchantName": "Shutterstock, Inc.",
      "websiteUrl": "https://www.shutterstock.com",
      "cancellationUrl": "https://www.shutterstock.com/account/subscriptions",
      "tags": ["stock photos", "videos", "music", "editorial"],
      "plans": [
        {
          "name": "10 Images/Month",
          "billingCycle": "MONTHLY",
          "amount": 29.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Envato Elements",
      "category": "Design",
      "merchantName": "Envato Pty Ltd",
      "websiteUrl": "https://elements.envato.com",
      "cancellationUrl": "https://elements.envato.com/account/subscription",
      "tags": ["templates", "graphics", "fonts", "music", "photos"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 16.50,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Placeit",
      "category": "Design",
      "merchantName": "Envato Pty Ltd",
      "websiteUrl": "https://placeit.net",
      "cancellationUrl": "https://placeit.net/account/subscription",
      "tags": ["mockups", "logos", "videos", "design tools"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 14.95,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Remove.bg",
      "category": "Design",
      "merchantName": "Kaleido AI GmbH",
      "websiteUrl": "https://www.remove.bg",
      "cancellationUrl": "https://www.remove.bg/account/subscription",
      "tags": ["background removal", "ai", "photo editing", "api"],
      "plans": [
        {
          "name": "Premium Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Luminar Neo",
      "category": "Design",
      "merchantName": "Skylum Software",
      "websiteUrl": "https://skylum.com/luminar-neo",
      "cancellationUrl": "https://skylum.com/account/subscriptions",
      "tags": ["photo editing", "ai", "filters", "raw processing"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 11.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Affinity Designer",
      "category": "Design",
      "merchantName": "Serif Europe Ltd",
      "websiteUrl": "https://affinity.serif.com",
      "cancellationUrl": "https://affinity.serif.com/account/subscriptions",
      "tags": ["vector", "graphic design", "illustration", "desktop"],
      "plans": [
        {
          "name": "One-time Purchase",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No subscription; perpetual license"
        }
      ]
    },
    {
      "name": "CorelDRAW Graphics Suite",
      "category": "Design",
      "merchantName": "Corel Corporation",
      "websiteUrl": "https://www.coreldraw.com",
      "cancellationUrl": "https://www.coreldraw.com/account/subscriptions",
      "tags": ["vector", "illustration", "layout", "photo editing"],
      "plans": [
        {
          "name": "Annual Subscription",
          "billingCycle": "YEARLY",
          "amount": 249.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Procreate",
      "category": "Design",
      "merchantName": "Savage Interactive Pty Ltd",
      "websiteUrl": "https://procreate.art",
      "cancellationUrl": "https://procreate.art/support",
      "tags": ["digital art", "ipad", "painting", "illustration"],
      "plans": [
        {
          "name": "One-time Purchase",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No subscription; $12.99 one-time fee"
        }
      ]
    },
    {
      "name": "Clip Studio Paint",
      "category": "Design",
      "merchantName": "CELSYS, Inc.",
      "websiteUrl": "https://www.clipstudio.net",
      "cancellationUrl": "https://www.clipstudio.net/account/subscription",
      "tags": ["manga", "comics", "illustration", "animation"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 2.49,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Replit Core",
      "category": "Developer Tools",
      "merchantName": "Replit, Inc.",
      "websiteUrl": "https://replit.com",
      "cancellationUrl": "https://replit.com/account/billing",
      "tags": ["coding", "ide", "collaboration", "cloud", "ai"],
      "plans": [
        {
          "name": "Core Monthly",
          "billingCycle": "MONTHLY",
          "amount": 7.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Glitch Pro",
      "category": "Developer Tools",
      "merchantName": "Fastly, Inc.",
      "websiteUrl": "https://glitch.com",
      "cancellationUrl": "https://glitch.com/account/subscription",
      "tags": ["coding", "node.js", "full-stack", "collaboration"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 8.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "CodePen Pro",
      "category": "Developer Tools",
      "merchantName": "CodePen, Inc.",
      "websiteUrl": "https://codepen.io",
      "cancellationUrl": "https://codepen.io/pro/subscription",
      "tags": ["frontend", "html", "css", "javascript", "prototyping"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 8.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "StackBlitz Pro",
      "category": "Developer Tools",
      "merchantName": "StackBlitz Inc.",
      "websiteUrl": "https://stackblitz.com",
      "cancellationUrl": "https://stackblitz.com/account/billing",
      "tags": ["web containers", "vscode", "angular", "react", "dev"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 15.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Postman Pro",
      "category": "Developer Tools",
      "merchantName": "Postman, Inc.",
      "websiteUrl": "https://www.postman.com",
      "cancellationUrl": "https://www.postman.com/account/billing",
      "tags": ["api", "testing", "development", "documentation"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 12.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Raycast Pro",
      "category": "Productivity",
      "merchantName": "Raycast Technologies GmbH",
      "websiteUrl": "https://www.raycast.com",
      "cancellationUrl": "https://www.raycast.com/account/billing",
      "tags": ["macos", "launcher", "workflow", "shortcuts", "dev"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 10.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Alfred Powerpack",
      "category": "Productivity",
      "merchantName": "Running with Crayons Ltd",
      "websiteUrl": "https://www.alfredapp.com",
      "cancellationUrl": "https://www.alfredapp.com/powerpack/",
      "tags": ["macos", "launcher", "workflows", "clipboard", "snippets"],
      "plans": [
        {
          "name": "Powerpack (One-time)",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "One-time $34.99 fee; no recurring subscription"
        }
      ]
    },
    {
      "name": "CleanMyMac X",
      "category": "Utilities",
      "merchantName": "MacPaw Inc.",
      "websiteUrl": "https://macpaw.com/cleanmymac",
      "cancellationUrl": "https://macpaw.com/account/subscriptions",
      "tags": ["mac", "cleanup", "optimize", "malware", "privacy"],
      "plans": [
        {
          "name": "Setapp Membership",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Setapp",
      "category": "Utilities",
      "merchantName": "MacPaw Inc.",
      "websiteUrl": "https://setapp.com",
      "cancellationUrl": "https://setapp.com/account/subscriptions",
      "tags": ["mac apps", "productivity", "utilities", "all-in-one"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Parallels Desktop",
      "category": "Utilities",
      "merchantName": "Parallels International GmbH",
      "websiteUrl": "https://www.parallels.com",
      "cancellationUrl": "https://www.parallels.com/account/subscriptions",
      "tags": ["virtualization", "windows on mac", "development"],
      "plans": [
        {
          "name": "Annual Subscription",
          "billingCycle": "YEARLY",
          "amount": 99.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "1Password Families",
      "category": "Security",
      "merchantName": "AgileBits Inc.",
      "websiteUrl": "https://1password.com/families",
      "cancellationUrl": "https://my.1password.com/account",
      "tags": ["password", "family", "security", "vault", "2fa"],
      "plans": [
        {
          "name": "Families Monthly",
          "billingCycle": "MONTHLY",
          "amount": 4.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Bitwarden Families",
      "category": "Security",
      "merchantName": "Bitwarden Inc.",
      "websiteUrl": "https://bitwarden.com/families",
      "cancellationUrl": "https://vault.bitwarden.com/#/settings/subscription",
      "tags": ["password", "open source", "family", "security"],
      "plans": [
        {
          "name": "Families Organizer",
          "billingCycle": "MONTHLY",
          "amount": 4.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Malwarebytes Premium",
      "category": "Security",
      "merchantName": "Malwarebytes Inc.",
      "websiteUrl": "https://www.malwarebytes.com",
      "cancellationUrl": "https://www.malwarebytes.com/account/subscription",
      "tags": ["antivirus", "malware", "ransomware", "real-time"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 4.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Avast Premium Security",
      "category": "Security",
      "merchantName": "Gen Digital Inc.",
      "websiteUrl": "https://www.avast.com",
      "cancellationUrl": "https://id.avast.com/sign-in?target=https%3A%2F%2Fmy.avast.com%3A443%2F",
      "tags": ["antivirus", "firewall", "vpn", "passwords"],
      "plans": [
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 69.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Norton 360 Deluxe",
      "category": "Security",
      "merchantName": "Gen Digital Inc.",
      "websiteUrl": "https://us.norton.com",
      "cancellationUrl": "https://my.norton.com/account",
      "tags": ["antivirus", "cloud backup", "vpn", "password manager"],
      "plans": [
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 49.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "McAfee Total Protection",
      "category": "Security",
      "merchantName": "McAfee Corp.",
      "websiteUrl": "https://www.mcafee.com",
      "cancellationUrl": "https://service.mcafee.com",
      "tags": ["antivirus", "identity theft", "encryption", "safe browsing"],
      "plans": [
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 39.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Keeper Password Manager",
      "category": "Security",
      "merchantName": "Keeper Security, Inc.",
      "websiteUrl": "https://www.keepersecurity.com",
      "cancellationUrl": "https://keepersecurity.com/vault",
      "tags": ["password", "security", "encrypted", "dark web monitor"],
      "plans": [
        {
          "name": "Personal Monthly",
          "billingCycle": "MONTHLY",
          "amount": 2.91,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "RoboForm Everywhere",
      "category": "Security",
      "merchantName": "Siber Systems Inc.",
      "websiteUrl": "https://www.roboform.com",
      "cancellationUrl": "https://www.roboform.com/account/billing",
      "tags": ["password", "form fill", "sync", "security"],
      "plans": [
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 23.88,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Dashlane Family",
      "category": "Security",
      "merchantName": "Dashlane Inc.",
      "websiteUrl": "https://www.dashlane.com",
      "cancellationUrl": "https://www.dashlane.com/account/billing",
      "tags": ["password", "family", "security", "vpn"],
      "plans": [
        {
          "name": "Family Monthly",
          "billingCycle": "MONTHLY",
          "amount": 7.49,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "LastPass Families",
      "category": "Security",
      "merchantName": "LastPass",
      "websiteUrl": "https://www.lastpass.com",
      "cancellationUrl": "https://lastpass.com/delete_account.php",
      "tags": ["password", "family", "vault", "2fa"],
      "plans": [
        {
          "name": "Families Monthly",
          "billingCycle": "MONTHLY",
          "amount": 4.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "TunnelBear",
      "category": "Security",
      "merchantName": "TunnelBear Inc.",
      "websiteUrl": "https://www.tunnelbear.com",
      "cancellationUrl": "https://account.tunnelbear.com",
      "tags": ["vpn", "privacy", "simple", "bear"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 3.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Private Internet Access (PIA)",
      "category": "Security",
      "merchantName": "London Trust Media, Inc.",
      "websiteUrl": "https://www.privateinternetaccess.com",
      "cancellationUrl": "https://www.privateinternetaccess.com/account",
      "tags": ["vpn", "privacy", "no logs", "encryption"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 11.95,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "CyberGhost VPN",
      "category": "Security",
      "merchantName": "Kape Technologies",
      "websiteUrl": "https://www.cyberghostvpn.com",
      "cancellationUrl": "https://www.cyberghostvpn.com/en_US/account",
      "tags": ["vpn", "streaming", "security", "anonymous"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 12.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "IPVanish",
      "category": "Security",
      "merchantName": "J2 Global, Inc.",
      "websiteUrl": "https://www.ipvanish.com",
      "cancellationUrl": "https://www.ipvanish.com/account",
      "tags": ["vpn", "speed", "zero logs", "unlimited devices"],
      "plans": [
        {
          "name": "Monthly",
          "billingCycle": "MONTHLY",
          "amount": 10.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Windscribe",
      "category": "Security",
      "merchantName": "Windscribe Limited",
      "websiteUrl": "https://windscribe.com",
      "cancellationUrl": "https://windscribe.com/login",
      "tags": ["vpn", "ad blocker", "privacy", "free tier"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 5.75,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Proton VPN",
      "category": "Security",
      "merchantName": "Proton AG",
      "websiteUrl": "https://protonvpn.com",
      "cancellationUrl": "https://account.proton.me/u/0/settings/subscription",
      "tags": ["vpn", "swiss", "secure", "encrypted", "tor"],
      "plans": [
        {
          "name": "Plus Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Mullvad VPN",
      "category": "Security",
      "merchantName": "Mullvad VPN AB",
      "websiteUrl": "https://mullvad.net",
      "cancellationUrl": "https://mullvad.net/account",
      "tags": ["vpn", "anonymous", "no account", "privacy"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Prepaid; no subscription required"
        }
      ]
    },
    {
      "name": "IVPN",
      "category": "Security",
      "merchantName": "IVPN Ltd",
      "websiteUrl": "https://www.ivpn.net",
      "cancellationUrl": "https://www.ivpn.net/account/",
      "tags": ["vpn", "privacy", "no logs", "standard"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 6.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "O&O ShutUp10++",
      "category": "Security",
      "merchantName": "O&O Software GmbH",
      "websiteUrl": "https://www.oo-software.com",
      "cancellationUrl": "https://www.oo-software.com/en/account",
      "tags": ["privacy", "windows", "disable telemetry", "free"],
      "plans": [
        {
          "name": "Free Version",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "BleachBit",
      "category": "Utilities",
      "merchantName": "BleachBit Foundation",
      "websiteUrl": "https://www.bleachbit.org",
      "cancellationUrl": "https://www.bleachbit.org/support",
      "tags": ["cleanup", "privacy", "free", "open source"],
      "plans": [
        {
          "name": "Free",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "CCleaner Professional",
      "category": "Utilities",
      "merchantName": "Gen Digital Inc.",
      "websiteUrl": "https://www.ccleaner.com",
      "cancellationUrl": "https://id.avg.com/sign-in?target=https%3A%2F%2Fwww.avg.com%2Fmyaccount",
      "tags": ["cleanup", "registry", "privacy", "optimize"],
      "plans": [
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 29.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "iolo System Mechanic",
      "category": "Utilities",
      "merchantName": "iolo technologies, LLC",
      "websiteUrl": "https://www.iolo.com",
      "cancellationUrl": "https://www.iolo.com/account",
      "tags": ["pc optimization", "speed", "cleanup", "repair"],
      "plans": [
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 49.95,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Ashampoo WinOptimizer",
      "category": "Utilities",
      "merchantName": "Ashampoo GmbH & Co. KG",
      "websiteUrl": "https://www.ashampoo.com",
      "cancellationUrl": "https://www.ashampoo.com/en-us/account",
      "tags": ["windows", "tuneup", "cleanup", "privacy"],
      "plans": [
        {
          "name": "Annual",
          "billingCycle": "YEARLY",
          "amount": 29.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Ninite Pro",
      "category": "Utilities",
      "merchantName": "Ninite LLC",
      "websiteUrl": "https://ninite.com/pro",
      "cancellationUrl": "https://ninite.com/account",
      "tags": ["software installer", "updates", "silent", "bulk"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 20.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "PDQ Deploy",
      "category": "IT Management",
      "merchantName": "PDQ.com",
      "websiteUrl": "https://www.pdq.com",
      "cancellationUrl": "https://www.pdq.com/account",
      "tags": ["deployment", "windows", "software", "enterprise"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 129.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "ManageEngine Desktop Central",
      "category": "IT Management",
      "merchantName": "Zoho Corporation",
      "websiteUrl": "https://www.manageengine.com/products/desktop-central",
      "cancellationUrl": "https://www.manageengine.com/contact-support.html",
      "tags": ["endpoint management", "patching", "remote control"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 195.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "SolarWinds RMM",
      "category": "IT Management",
      "merchantName": "SolarWinds Worldwide, LLC",
      "websiteUrl": "https://www.solarwinds.com/rmm",
      "cancellationUrl": "https://www.solarwinds.com/account",
      "tags": ["remote monitoring", "msp", "patching", "backup"],
      "plans": [
        {
          "name": "Per Device Monthly",
          "billingCycle": "MONTHLY",
          "amount": 4.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Atera",
      "category": "IT Management",
      "merchantName": "Atera Networks Ltd",
      "websiteUrl": "https://www.atera.com",
      "cancellationUrl": "https://www.atera.com/account/billing",
      "tags": ["msp", "rmm", "psa", "remote access", "ai"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 69.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Syncro MSP",
      "category": "IT Management",
      "merchantName": "Syncro Cloud LLC",
      "websiteUrl": "https://syncromsp.com",
      "cancellationUrl": "https://syncromsp.com/account/billing",
      "tags": ["msp", "rmm", "psa", "ticketing", "billing"],
      "plans": [
        {
          "name": "Per Technician Monthly",
          "billingCycle": "MONTHLY",
          "amount": 65.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "NinjaRMM",
      "category": "IT Management",
      "merchantName": "NinjaOne Inc.",
      "websiteUrl": "https://www.ninjaone.com",
      "cancellationUrl": "https://www.ninjaone.com/account",
      "tags": ["rmm", "msp", "patching", "remote", "automation"],
      "plans": [
        {
          "name": "Per Device Monthly",
          "billingCycle": "MONTHLY",
          "amount": 3.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "LogMeIn Pro",
      "category": "Remote Access",
      "merchantName": "LogMeIn, Inc.",
      "websiteUrl": "https://www.logmein.com",
      "cancellationUrl": "https://secure.logmein.com/account/",
      "tags": ["remote desktop", "access", "support", "file transfer"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 30.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "TeamViewer",
      "category": "Remote Access",
      "merchantName": "TeamViewer Germany GmbH",
      "websiteUrl": "https://www.teamviewer.com",
      "cancellationUrl": "https://login.teamviewer.com/Account/Subscription",
      "tags": ["remote control", "support", "meeting", "iot"],
      "plans": [
        {
          "name": "Business Monthly",
          "billingCycle": "MONTHLY",
          "amount": 50.90,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "AnyDesk",
      "category": "Remote Access",
      "merchantName": "AnyDesk Software GmbH",
      "websiteUrl": "https://anydesk.com",
      "cancellationUrl": "https://anydesk.com/en/account/subscription",
      "tags": ["remote desktop", "lightweight", "fast", "secure"],
      "plans": [
        {
          "name": "Professional Monthly",
          "billingCycle": "MONTHLY",
          "amount": 10.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Splashtop Business",
      "category": "Remote Access",
      "merchantName": "Splashtop Inc.",
      "websiteUrl": "https://www.splashtop.com",
      "cancellationUrl": "https://my.splashtop.com/account/subscription",
      "tags": ["remote access", "fast", "affordable", "team"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 5.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Chrome Remote Desktop",
      "category": "Remote Access",
      "merchantName": "Google LLC",
      "websiteUrl": "https://remotedesktop.google.com",
      "cancellationUrl": "https://remotedesktop.google.com/access",
      "tags": ["remote", "free", "simple", "google"],
      "plans": [
        {
          "name": "Free",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Microsoft Remote Desktop",
      "category": "Remote Access",
      "merchantName": "Microsoft Corporation",
      "websiteUrl": "https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients",
      "cancellationUrl": "https://account.microsoft.com/services",
      "tags": ["rdp", "windows", "enterprise", "free"],
      "plans": [
        {
          "name": "Free",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Parsec",
      "category": "Remote Access",
      "merchantName": "Parsec Cloud, Inc.",
      "websiteUrl": "https://parsec.app",
      "cancellationUrl": "https://parsec.app/account/subscription",
      "tags": ["gaming", "workstation", "low latency", "gpu"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 10.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "NoMachine",
      "category": "Remote Access",
      "merchantName": "NoMachine S.r.l.",
      "websiteUrl": "https://www.nomachine.com",
      "cancellationUrl": "https://www.nomachine.com/account",
      "tags": ["remote desktop", "performance", "free", "enterprise"],
      "plans": [
        {
          "name": "Enterprise Monthly",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Free for personal use; enterprise plans available"
        }
      ]
    },
    {
      "name": "DWService",
      "category": "Remote Access",
      "merchantName": "DWService S.r.l.",
      "websiteUrl": "https://www.dwservice.net",
      "cancellationUrl": "https://www.dwservice.net/en/account",
      "tags": ["remote control", "free", "web-based", "no install"],
      "plans": [
        {
          "name": "Free",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Zoho Assist",
      "category": "Remote Access",
      "merchantName": "Zoho Corporation",
      "websiteUrl": "https://www.zoho.com/assist",
      "cancellationUrl": "https://www.zoho.com/assist/account/billing.html",
      "tags": ["remote support", "unattended", "on-demand", "msp"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 10.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "BeyondTrust Remote Support",
      "category": "Remote Access",
      "merchantName": "BeyondTrust Software, Inc.",
      "websiteUrl": "https://www.beyondtrust.com",
      "cancellationUrl": "https://www.beyondtrust.com/contact",
      "tags": ["enterprise", "security", "compliance", "support"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "ConnectWise Control",
      "category": "Remote Access",
      "merchantName": "ConnectWise, LLC",
      "websiteUrl": "https://www.connectwise.com/software/control",
      "cancellationUrl": "https://www.connectwise.com/account",
      "tags": ["msp", "remote support", "screen sharing", "session"],
      "plans": [
        {
          "name": "Per Resource Monthly",
          "billingCycle": "MONTHLY",
          "amount": 29.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "ScreenConnect",
      "category": "Remote Access",
      "merchantName": "ConnectWise, LLC",
      "websiteUrl": "https://www.connectwise.com/software/screenconnect",
      "cancellationUrl": "https://www.connectwise.com/account",
      "tags": ["remote support", "self-hosted", "on-premise", "msp"],
      "plans": [
        {
          "name": "Per Technician Monthly",
          "billingCycle": "MONTHLY",
          "amount": 35.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "ISL Online",
      "category": "Remote Access",
      "merchantName": "ISL Online d.o.o.",
      "websiteUrl": "https://www.islonline.com",
      "cancellationUrl": "https://www.islonline.com/account",
      "tags": ["remote desktop", "support", "meeting", "file transfer"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 20.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "RemotePC",
      "category": "Remote Access",
      "merchantName": "IDrive Inc.",
      "websiteUrl": "https://www.remotepc.com",
      "cancellationUrl": "https://www.remotepc.com/account/subscription",
      "tags": ["remote access", "file transfer", "printing", "chat"],
      "plans": [
        {
          "name": "Personal Monthly",
          "billingCycle": "MONTHLY",
          "amount": 6.95,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "IDrive RemotePC",
      "category": "Remote Access",
      "merchantName": "IDrive Inc.",
      "websiteUrl": "https://www.idrive.com/remotepc",
      "cancellationUrl": "https://www.idrive.com/account/remotepc",
      "tags": ["remote desktop", "backup", "access", "support"],
      "plans": [
        {
          "name": "Personal Monthly",
          "billingCycle": "MONTHLY",
          "amount": 6.95,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Zoho One",
      "category": "Business Suite",
      "merchantName": "Zoho Corporation",
      "websiteUrl": "https://www.zoho.com/one",
      "cancellationUrl": "https://www.zoho.com/one/account/billing.html",
      "tags": ["crm", "email", "finance", "hr", "all-in-one"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 37.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": " monday.com Work OS",
      "category": "Business Suite",
      "merchantName": "monday.com Ltd.",
      "websiteUrl": "https://monday.com",
      "cancellationUrl": "https://monday.com/account/billing",
      "tags": ["project management", "crm", "dev", "marketing", "hr"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 20.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Notion Enterprise",
      "category": "Business Suite",
      "merchantName": "Notion Labs, Inc.",
      "websiteUrl": "https://www.notion.so",
      "cancellationUrl": "https://www.notion.so/account/settings/billing",
      "tags": ["wiki", "docs", "projects", "database", "collaboration"],
      "plans": [
        {
          "name": "Enterprise Annual",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Custom pricing; contact sales"
        }
      ]
    },
    {
      "name": "ClickUp Enterprise",
      "category": "Business Suite",
      "merchantName": "ClickUp Inc.",
      "websiteUrl": "https://clickup.com",
      "cancellationUrl": "https://app.clickup.com/settings/billing",
      "tags": ["tasks", "docs", "goals", "chat", "whiteboards"],
      "plans": [
        {
          "name": "Enterprise Annual",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Custom pricing; contact sales"
        }
      ]
    },
    {
      "name": "Asana Enterprise",
      "category": "Business Suite",
      "merchantName": "Asana, Inc.",
      "websiteUrl": "https://asana.com",
      "cancellationUrl": "https://asana.com/account/billing",
      "tags": ["work management", "projects", "goals", "portfolios"],
      "plans": [
        {
          "name": "Enterprise Annual",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Custom pricing; contact sales"
        }
      ]
    },
    {
      "name": "Trello Enterprise",
      "category": "Business Suite",
      "merchantName": "Atlassian",
      "websiteUrl": "https://trello.com/enterprise",
      "cancellationUrl": "https://trello.com/account",
      "tags": ["kanban", "teams", "security", "admin", "atlassian"],
      "plans": [
        {
          "name": "Enterprise Annual",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Custom pricing; contact sales"
        }
      ]
    },
    {
      "name": "Slack Enterprise Grid",
      "category": "Business Suite",
      "merchantName": "Salesforce, Inc.",
      "websiteUrl": "https://slack.com/enterprise",
      "cancellationUrl": "https://my.slack.com/account/billing",
      "tags": ["messaging", "security", "compliance", "large org"],
      "plans": [
        {
          "name": "Enterprise Grid Annual",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Custom pricing; contact sales"
        }
      ]
    },
    {
      "name": "Microsoft 365 E3",
      "category": "Business Suite",
      "merchantName": "Microsoft Corporation",
      "websiteUrl": "https://www.microsoft.com/microsoft-365/enterprise",
      "cancellationUrl": "https://account.microsoft.com/services",
      "tags": ["office", "teams", "exchange", "sharepoint", "security"],
      "plans": [
        {
          "name": "E3 Monthly",
          "billingCycle": "MONTHLY",
          "amount": 36.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Google Workspace Enterprise",
      "category": "Business Suite",
      "merchantName": "Google LLC",
      "websiteUrl": "https://workspace.google.com/enterprise/",
      "cancellationUrl": "https://admin.google.com/ac/billing",
      "tags": ["gmail", "drive", "meet", "vault", "security"],
      "plans": [
        {
          "name": "Enterprise Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 18.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Dropbox Business Standard",
      "category": "Business Suite",
      "merchantName": "Dropbox, Inc.",
      "websiteUrl": "https://www.dropbox.com/business",
      "cancellationUrl": "https://www.dropbox.com/account/billing",
      "tags": ["cloud storage", "collaboration", "security", "teams"],
      "plans": [
        {
          "name": "Business Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 15.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Box Business",
      "category": "Business Suite",
      "merchantName": "Box, Inc.",
      "websiteUrl": "https://www.box.com",
      "cancellationUrl": "https://app.box.com/master/settings/billing",
      "tags": ["cloud content", "security", "compliance", "enterprise"],
      "plans": [
        {
          "name": "Business Monthly",
          "billingCycle": "MONTHLY",
          "amount": 15.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Egnyte Connect",
      "category": "Business Suite",
      "merchantName": "Egnyte, Inc.",
      "websiteUrl": "https://www.egnyte.com",
      "cancellationUrl": "https://www.egnyte.com/account/billing",
      "tags": ["file sharing", "hybrid cloud", "security", "compliance"],
      "plans": [
        {
          "name": "Connect Monthly",
          "billingCycle": "MONTHLY",
          "amount": 8.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Citrix ShareFile",
      "category": "Business Suite",
      "merchantName": "Cloud Software Group, Inc.",
      "websiteUrl": "https://www.sharefile.com",
      "cancellationUrl": "https://www.sharefile.com/account/billing",
      "tags": ["file sharing", "secure", "enterprise", "client portal"],
      "plans": [
        {
          "name": "Team Monthly",
          "billingCycle": "MONTHLY",
          "amount": 16.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "DocuSign eSignature",
      "category": "Business Suite",
      "merchantName": "DocuSign, Inc.",
      "websiteUrl": "https://www.docusign.com",
      "cancellationUrl": "https://www.docusign.com/account/billing",
      "tags": ["esignature", "contracts", "agreements", "workflow"],
      "plans": [
        {
          "name": "Business Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 40.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "PandaDoc",
      "category": "Business Suite",
      "merchantName": "PandaDoc, Inc.",
      "websiteUrl": "https://www.pandadoc.com",
      "cancellationUrl": "https://www.pandadoc.com/account/billing",
      "tags": ["documents", "proposals", "esignature", "workflow"],
      "plans": [
        {
          "name": "Essentials Monthly",
          "billingCycle": "MONTHLY",
          "amount": 19.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "HelloSign",
      "category": "Business Suite",
      "merchantName": "Dropbox, Inc.",
      "websiteUrl": "https://www.hellosign.com",
      "cancellationUrl": "https://www.hellosign.com/account/billing",
      "tags": ["esignature", "api", "templates", "workflow"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 15.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "SignNow",
      "category": "Business Suite",
      "merchantName": "airSlate, Inc.",
      "websiteUrl": "https://www.signnow.com",
      "cancellationUrl": "https://www.signnow.com/account/billing",
      "tags": ["esignature", "pdf", "forms", "workflow"],
      "plans": [
        {
          "name": "Business Monthly",
          "billingCycle": "MONTHLY",
          "amount": 8.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Adobe Sign",
      "category": "Business Suite",
      "merchantName": "Adobe Inc.",
      "websiteUrl": "https://www.adobe.com/sign.html",
      "cancellationUrl": "https://account.adobe.com/plans",
      "tags": ["esignature", "acrobat", "workflow", "enterprise"],
      "plans": [
        {
          "name": "Acrobat Sign Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.99,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Zoho Sign",
      "category": "Business Suite",
      "merchantName": "Zoho Corporation",
      "websiteUrl": "https://www.zoho.com/sign",
      "cancellationUrl": "https://www.zoho.com/sign/account/billing.html",
      "tags": ["esignature", "secure", "templates", "audit trail"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 3.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Formstack",
      "category": "Business Suite",
      "merchantName": "Formstack, LLC",
      "websiteUrl": "https://www.formstack.com",
      "cancellationUrl": "https://www.formstack.com/account/billing",
      "tags": ["forms", "workflows", "esignature", "documents"],
      "plans": [
        {
          "name": "Professional Monthly",
          "billingCycle": "MONTHLY",
          "amount": 49.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Jotform",
      "category": "Business Suite",
      "merchantName": "Jotform, Inc.",
      "websiteUrl": "https://www.jotform.com",
      "cancellationUrl": "https://www.jotform.com/myaccount/billing",
      "tags": ["forms", "surveys", "payments", "esignature"],
      "plans": [
        {
          "name": "Silver Monthly",
          "billingCycle": "MONTHLY",
          "amount": 39.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Typeform",
      "category": "Business Suite",
      "merchantName": "Typeform S.L.",
      "websiteUrl": "https://www.typeform.com",
      "cancellationUrl": "https://www.typeform.com/account/billing",
      "tags": ["forms", "surveys", "quizzes", "beautiful"],
      "plans": [
        {
          "name": "Essential Monthly",
          "billingCycle": "MONTHLY",
          "amount": 25.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "SurveyMonkey Advantage",
      "category": "Business Suite",
      "merchantName": "Momentive Global Inc.",
      "websiteUrl": "https://www.surveymonkey.com",
      "cancellationUrl": "https://www.surveymonkey.com/account/billing",
      "tags": ["surveys", "feedback", "market research", "analytics"],
      "plans": [
        {
          "name": "Advantage Monthly",
          "billingCycle": "MONTHLY",
          "amount": 35.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Qualtrics Core XM",
      "category": "Business Suite",
      "merchantName": "Qualtrics, LLC",
      "websiteUrl": "https://www.qualtrics.com",
      "cancellationUrl": "https://www.qualtrics.com/contact/",
      "tags": ["experience management", "surveys", "analytics", "enterprise"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "UserTesting",
      "category": "Business Suite",
      "merchantName": "UserTesting, Inc.",
      "websiteUrl": "https://www.usertesting.com",
      "cancellationUrl": "https://www.usertesting.com/account/billing",
      "tags": ["ux research", "feedback", "video", "insights"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 49.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Hotjar",
      "category": "Business Suite",
      "merchantName": "Hotjar Ltd",
      "websiteUrl": "https://www.hotjar.com",
      "cancellationUrl": "https://www.hotjar.com/account/billing",
      "tags": ["heatmaps", "recordings", "feedback", "analytics"],
      "plans": [
        {
          "name": "Plus Monthly",
          "billingCycle": "MONTHLY",
          "amount": 32.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Crazy Egg",
      "category": "Business Suite",
      "merchantName": "Crazy Egg, Inc.",
      "websiteUrl": "https://www.crazyegg.com",
      "cancellationUrl": "https://www.crazyegg.com/account/billing",
      "tags": ["heatmaps", "scroll maps", "a/b testing", "recordings"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 24.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "FullStory",
      "category": "Business Suite",
      "merchantName": "FullStory, Inc.",
      "websiteUrl": "https://www.fullstory.com",
      "cancellationUrl": "https://www.fullstory.com/account/billing",
      "tags": ["session replay", "analytics", "frustration signals", "ux"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Lucky Orange",
      "category": "Business Suite",
      "merchantName": "Lucky Orange LLC",
      "websiteUrl": "https://www.luckyorange.com",
      "cancellationUrl": "https://www.luckyorange.com/account/billing",
      "tags": ["heatmaps", "session recordings", "live view", "forms"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 10.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Mouseflow",
      "category": "Business Suite",
      "merchantName": "Mouseflow ApS",
      "websiteUrl": "https://mouseflow.com",
      "cancellationUrl": "https://mouseflow.com/account/billing",
      "tags": ["session replay", "heatmaps", "funnels", "feedback"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 29.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Inspectlet",
      "category": "Business Suite",
      "merchantName": "Inspectlet Inc.",
      "websiteUrl": "https://www.inspectlet.com",
      "cancellationUrl": "https://www.inspectlet.com/account/billing",
      "tags": ["session recording", "heatmaps", "funnels", "forms"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 39.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Smartlook",
      "category": "Business Suite",
      "merchantName": "Smartsupp.com s.r.o.",
      "websiteUrl": "https://www.smartlook.com",
      "cancellationUrl": "https://www.smartlook.com/account/billing",
      "tags": ["session replay", "heatmaps", "funnels", "retention"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 59.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Contentsquare",
      "category": "Business Suite",
      "merchantName": "Contentsquare SA",
      "websiteUrl": "https://www.contentsquare.com",
      "cancellationUrl": "https://www.contentsquare.com/contact/",
      "tags": ["digital experience", "analytics", "ai", "optimization"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Heap",
      "category": "Business Suite",
      "merchantName": "Heap, Inc.",
      "websiteUrl": "https://heap.io",
      "cancellationUrl": "https://heap.io/account/billing",
      "tags": ["analytics", "auto-capture", "funnels", "retention"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Free up to 10k sessions/month"
        }
      ]
    },
    {
      "name": "Amplitude",
      "category": "Business Suite",
      "merchantName": "Amplitude, Inc.",
      "websiteUrl": "https://amplitude.com",
      "cancellationUrl": "https://amplitude.com/account/billing",
      "tags": ["product analytics", "behavior", "funnels", "cohort"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Free up to 10M actions/month"
        }
      ]
    },
    {
      "name": "Mixpanel",
      "category": "Business Suite",
      "merchantName": "Mixpanel, Inc.",
      "websiteUrl": "https://mixpanel.com",
      "cancellationUrl": "https://mixpanel.com/account/billing",
      "tags": ["product analytics", "engagement", "retention", "funnels"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Free up to 500k MTUs/month"
        }
      ]
    },
    {
      "name": "Pendo",
      "category": "Business Suite",
      "merchantName": "Pendo.io, Inc.",
      "websiteUrl": "https://www.pendo.io",
      "cancellationUrl": "https://www.pendo.io/contact/",
      "tags": ["product experience", "analytics", "guides", "feedback"],
      "plans": [
        {
          "name": "Free",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Appcues",
      "category": "Business Suite",
      "merchantName": "Appcues, Inc.",
      "websiteUrl": "https://www.appcues.com",
      "cancellationUrl": "https://www.appcues.com/account/billing",
      "tags": ["onboarding", "product tours", "nps", "engagement"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 249.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Userpilot",
      "category": "Business Suite",
      "merchantName": "Userpilot Ltd",
      "websiteUrl": "https://userpilot.com",
      "cancellationUrl": "https://userpilot.com/account/billing",
      "tags": ["onboarding", "product adoption", "nps", "resource center"],
      "plans": [
        {
          "name": "Essentials Monthly",
          "billingCycle": "MONTHLY",
          "amount": 249.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Chameleon",
      "category": "Business Suite",
      "merchantName": "Chameleon.io Inc.",
      "websiteUrl": "https://www.trychameleon.com",
      "cancellationUrl": "https://www.trychameleon.com/account/billing",
      "tags": ["onboarding", "tooltips", "checklists", "announcements"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 249.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "WalkMe",
      "category": "Business Suite",
      "merchantName": "WalkMe Ltd",
      "websiteUrl": "https://www.walkme.com",
      "cancellationUrl": "https://www.walkme.com/contact/",
      "tags": ["digital adoption", "onboarding", "automation", "analytics"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Whatfix",
      "category": "Business Suite",
      "merchantName": "Whatfix, Inc.",
      "websiteUrl": "https://whatfix.com",
      "cancellationUrl": "https://whatfix.com/contact/",
      "tags": ["digital adoption", "onboarding", "guides", "analytics"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Pendo Feedback",
      "category": "Business Suite",
      "merchantName": "Pendo.io, Inc.",
      "websiteUrl": "https://www.pendo.io",
      "cancellationUrl": "https://www.pendo.io/contact/",
      "tags": ["in-app feedback", "nps", "surveys", "product"],
      "plans": [
        {
          "name": "Free",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Delighted",
      "category": "Business Suite",
      "merchantName": "Qualtrics, LLC",
      "websiteUrl": "https://delighted.com",
      "cancellationUrl": "https://delighted.com/account/billing",
      "tags": ["nps", "csat", "ces", "feedback", "surveys"],
      "plans": [
        {
          "name": "Basic Monthly",
          "billingCycle": "MONTHLY",
          "amount": 25.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Medallia",
      "category": "Business Suite",
      "merchantName": "Medallia, Inc.",
      "websiteUrl": "https://www.medallia.com",
      "cancellationUrl": "https://www.medallia.com/contact/",
      "tags": ["experience management", "feedback", "analytics", "enterprise"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "InMoment",
      "category": "Business Suite",
      "merchantName": "InMoment, Inc.",
      "websiteUrl": "https://www.inmoment.com",
      "cancellationUrl": "https://www.inmoment.com/contact/",
      "tags": ["cx", "feedback", "analytics", "text mining"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Sprinklr",
      "category": "Business Suite",
      "merchantName": "Sprinklr, Inc.",
      "websiteUrl": "https://www.sprinklr.com",
      "cancellationUrl": "https://www.sprinklr.com/contact/",
      "tags": ["cx", "social media", "care", "marketing", "enterprise"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Khoros",
      "category": "Business Suite",
      "merchantName": "Khoros, LLC",
      "websiteUrl": "https://khoros.com",
      "cancellationUrl": "https://khoros.com/contact",
      "tags": ["cx", "care", "community", "marketing", "social"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Zendesk Suite",
      "category": "Business Suite",
      "merchantName": "Zendesk, Inc.",
      "websiteUrl": "https://www.zendesk.com",
      "cancellationUrl": "https://www.zendesk.com/account/billing",
      "tags": ["support", "sales", "chat", "guide", "explore"],
      "plans": [
        {
          "name": "Suite Team Monthly",
          "billingCycle": "MONTHLY",
          "amount": 55.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Freshdesk",
      "category": "Business Suite",
      "merchantName": "Freshworks Inc.",
      "websiteUrl": "https://freshdesk.com",
      "cancellationUrl": "https://freshdesk.com/account/billing",
      "tags": ["support", "help desk", "omnichannel", "automation"],
      "plans": [
        {
          "name": "Growth Monthly",
          "billingCycle": "MONTHLY",
          "amount": 15.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Help Scout",
      "category": "Business Suite",
      "merchantName": "Help Scout, Inc.",
      "websiteUrl": "https://www.helpscout.com",
      "cancellationUrl": "https://www.helpscout.com/account/billing",
      "tags": ["support", "email", "docs", "beacon", "reporting"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 25.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Intercom",
      "category": "Business Suite",
      "merchantName": "Intercom, Inc.",
      "websiteUrl": "https://www.intercom.com",
      "cancellationUrl": "https://www.intercom.com/account/billing",
      "tags": ["messaging", "chat", "bot", "product tours", "support"],
      "plans": [
        {
          "name": "Essential Monthly",
          "billingCycle": "MONTHLY",
          "amount": 74.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Drift",
      "category": "Business Suite",
      "merchantName": "Drift, Inc.",
      "websiteUrl": "https://www.drift.com",
      "cancellationUrl": "https://www.drift.com/account/billing",
      "tags": ["conversational marketing", "chat", "bot", "leads"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 2500.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Crisp",
      "category": "Business Suite",
      "merchantName": "Crisp IM SAS",
      "websiteUrl": "https://crisp.chat",
      "cancellationUrl": "https://crisp.chat/en/account/billing",
      "tags": ["chat", "inbox", "knowledge base", "automation", "crm"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 25.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Tidio",
      "category": "Business Suite",
      "merchantName": "Tidio Ltd",
      "websiteUrl": "https://www.tidio.com",
      "cancellationUrl": "https://www.tidio.com/account/billing",
      "tags": ["live chat", "chatbot", "email", "automation"],
      "plans": [
        {
          "name": "Communicator Monthly",
          "billingCycle": "MONTHLY",
          "amount": 29.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "LiveChat",
      "category": "Business Suite",
      "merchantName": "LiveChat, Inc.",
      "websiteUrl": "https://www.livechat.com",
      "cancellationUrl": "https://www.livechat.com/account/billing",
      "tags": ["live chat", "help desk", "chatbot", "sales"],
      "plans": [
        {
          "name": "Team Monthly",
          "billingCycle": "MONTHLY",
          "amount": 20.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Olark",
      "category": "Business Suite",
      "merchantName": "Olark Live Chat, Inc.",
      "websiteUrl": "https://www.olark.com",
      "cancellationUrl": "https://www.olark.com/account/billing",
      "tags": ["live chat", "sales", "support", "lead capture"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 29.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Pure Chat",
      "category": "Business Suite",
      "merchantName": "Pure Chat, Inc.",
      "websiteUrl": "https://www.purechat.com",
      "cancellationUrl": "https://www.purechat.com/account/billing",
      "tags": ["live chat", "wordpress", "woocommerce", "simple"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 24.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Smartsupp",
      "category": "Business Suite",
      "merchantName": "Smartsupp.com s.r.o.",
      "websiteUrl": "https://www.smartsupp.com",
      "cancellationUrl": "https://www.smartsupp.com/account/billing",
      "tags": ["live chat", "visitor tracking", "video", "automation"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 15.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Comm100",
      "category": "Business Suite",
      "merchantName": "Comm100 Network Corporation",
      "websiteUrl": "https://www.comm100.com",
      "cancellationUrl": "https://www.comm100.com/account/billing",
      "tags": ["live chat", "email", "ticketing", "knowledge base"],
      "plans": [
        {
          "name": "Team Monthly",
          "billingCycle": "MONTHLY",
          "amount": 14.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Zopim",
      "category": "Business Suite",
      "merchantName": "Zendesk, Inc.",
      "websiteUrl": "https://www.zopim.com",
      "cancellationUrl": "https://www.zopim.com/account/billing",
      "tags": ["live chat", "zendesk", "support", "sales"],
      "plans": [
        {
          "name": "Team Monthly",
          "billingCycle": "MONTHLY",
          "amount": 14.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "JivoChat",
      "category": "Business Suite",
      "merchantName": "JivoSite Inc.",
      "websiteUrl": "https://www.jivochat.com",
      "cancellationUrl": "https://www.jivochat.com/account/billing",
      "tags": ["live chat", "phone", "email", "social", "bot"],
      "plans": [
        {
          "name": "Team Monthly",
          "billingCycle": "MONTHLY",
          "amount": 24.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Chatra",
      "category": "Business Suite",
      "merchantName": "Chatra Inc.",
      "websiteUrl": "https://chatra.io",
      "cancellationUrl": "https://chatra.io/account/billing",
      "tags": ["live chat", "offline messages", "mobile", "integrations"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 15.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Gist",
      "category": "Business Suite",
      "merchantName": "Gist, Inc.",
      "websiteUrl": "https://www.getgist.com",
      "cancellationUrl": "https://www.getgist.com/account/billing",
      "tags": ["messaging", "crm", "automation", "knowledge base"],
      "plans": [
        {
          "name": "Growth Monthly",
          "billingCycle": "MONTHLY",
          "amount": 25.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Kayako",
      "category": "Business Suite",
      "merchantName": "Kayako Inc.",
      "websiteUrl": "https://kayako.com",
      "cancellationUrl": "https://kayako.com/account/billing",
      "tags": ["help desk", "live chat", "messaging", "automation"],
      "plans": [
        {
          "name": "Essential Monthly",
          "billingCycle": "MONTHLY",
          "amount": 15.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Groove",
      "category": "Business Suite",
      "merchantName": "Groove, Inc.",
      "websiteUrl": "https://www.groovehq.com",
      "cancellationUrl": "https://www.groovehq.com/account/billing",
      "tags": ["help desk", "shared inbox", "knowledge base", "simple"],
      "plans": [
        {
          "name": "Premium Monthly",
          "billingCycle": "MONTHLY",
          "amount": 20.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "HappyFox",
      "category": "Business Suite",
      "merchantName": "HappyFox Inc.",
      "websiteUrl": "https://www.happyfox.com",
      "cancellationUrl": "https://www.happyfox.com/account/billing",
      "tags": ["help desk", "ticketing", "reporting", "automation"],
      "plans": [
        {
          "name": "Mighty Monthly",
          "billingCycle": "MONTHLY",
          "amount": 29.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "SupportBee",
      "category": "Business Suite",
      "merchantName": "SupportBee Inc.",
      "websiteUrl": "https://www.supportbee.com",
      "cancellationUrl": "https://www.supportbee.com/account/billing",
      "tags": ["help desk", "email", "shared inbox", "collaboration"],
      "plans": [
        {
          "name": "Team Monthly",
          "billingCycle": "MONTHLY",
          "amount": 12.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Front",
      "category": "Business Suite",
      "merchantName": "Front, Inc.",
      "websiteUrl": "https://front.com",
      "cancellationUrl": "https://front.com/account/billing",
      "tags": ["shared inbox", "email", "slack", "workflow", "analytics"],
      "plans": [
        {
          "name": "Team Monthly",
          "billingCycle": "MONTHLY",
          "amount": 12.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Missive",
      "category": "Business Suite",
      "merchantName": "Missive App Inc.",
      "websiteUrl": "https://missiveapp.com",
      "cancellationUrl": "https://missiveapp.com/account/billing",
      "tags": ["shared inbox", "email", "chat", "tasks", "collaboration"],
      "plans": [
        {
          "name": "Team Monthly",
          "billingCycle": "MONTHLY",
          "amount": 10.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Hiver",
      "category": "Business Suite",
      "merchantName": "Hiver Labs Inc.",
      "websiteUrl": "https://hiverhq.com",
      "cancellationUrl": "https://hiverhq.com/account/billing",
      "tags": ["gmail shared inbox", "collaboration", "automation", "reports"],
      "plans": [
        {
          "name": "Lite Monthly",
          "billingCycle": "MONTHLY",
          "amount": 7.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Drag",
      "category": "Business Suite",
      "merchantName": "Drag App Inc.",
      "websiteUrl": "https://www.dragapp.com",
      "cancellationUrl": "https://www.dragapp.com/account/billing",
      "tags": ["gmail shared inbox", "kanban", "tasks", "collaboration"],
      "plans": [
        {
          "name": "Team Monthly",
          "billingCycle": "MONTHLY",
          "amount": 5.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Streak",
      "category": "Business Suite",
      "merchantName": "Streak, Inc.",
      "websiteUrl": "https://www.streak.com",
      "cancellationUrl": "https://www.streak.com/account/billing",
      "tags": ["gmail crm", "pipeline", "tasks", "automation"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 19.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Cirrus Insight",
      "category": "Business Suite",
      "merchantName": "Cirruspath, Inc.",
      "websiteUrl": "https://www.cirrusinsight.com",
      "cancellationUrl": "https://www.cirrusinsight.com/account/billing",
      "tags": ["gmail salesforce", "crm", "email tracking", "templates"],
      "plans": [
        {
          "name": "Professional Monthly",
          "billingCycle": "MONTHLY",
          "amount": 25.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Yesware",
      "category": "Business Suite",
      "merchantName": "Yesware, Inc.",
      "websiteUrl": "https://www.yesware.com",
      "cancellationUrl": "https://www.yesware.com/account/billing",
      "tags": ["email tracking", "templates", "crm", "sales"],
      "plans": [
        {
          "name": "Professional Monthly",
          "billingCycle": "MONTHLY",
          "amount": 15.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Mailtrack",
      "category": "Business Suite",
      "merchantName": "Mailtrack.io",
      "websiteUrl": "https://mailtrack.io",
      "cancellationUrl": "https://mailtrack.io/account/billing",
      "tags": ["email tracking", "read receipts", "gmail", "outlook"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.95,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "BananaTag",
      "category": "Business Suite",
      "merchantName": "BananaTag Inc.",
      "websiteUrl": "https://www.bananatag.com",
      "cancellationUrl": "https://www.bananatag.com/account/billing",
      "tags": ["email tracking", "templates", "analytics", "sales"],
      "plans": [
        {
          "name": "Professional Monthly",
          "billingCycle": "MONTHLY",
          "amount": 15.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "ContactMonkey",
      "category": "Business Suite",
      "merchantName": "ContactMonkey Inc.",
      "websiteUrl": "https://www.contactmonkey.com",
      "cancellationUrl": "https://www.contactmonkey.com/account/billing",
      "tags": ["email tracking", "outlook", "gmail", "sales"],
      "plans": [
        {
          "name": "Professional Monthly",
          "billingCycle": "MONTHLY",
          "amount": 15.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Mixmax",
      "category": "Business Suite",
      "merchantName": "Mixmax, Inc.",
      "websiteUrl": "https://mixmax.com",
      "cancellationUrl": "https://mixmax.com/account/billing",
      "tags": ["email tracking", "scheduling", "templates", "sequences"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 15.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Outreach",
      "category": "Business Suite",
      "merchantName": "Outreach, Inc.",
      "websiteUrl": "https://www.outreach.io",
      "cancellationUrl": "https://www.outreach.io/contact/",
      "tags": ["sales engagement", "sequences", "analytics", "crm"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Salesloft",
      "category": "Business Suite",
      "merchantName": "Salesloft, Inc.",
      "websiteUrl": "https://salesloft.com",
      "cancellationUrl": "https://salesloft.com/contact/",
      "tags": ["sales engagement", "calling", "email", "analytics"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Gong",
      "category": "Business Suite",
      "merchantName": "Gong.io, Inc.",
      "websiteUrl": "https://www.gong.io",
      "cancellationUrl": "https://www.gong.io/contact/",
      "tags": ["revenue intelligence", "calls", "meetings", "crm"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Chorus.ai",
      "category": "Business Suite",
      "merchantName": "ZoomInfo Technologies LLC",
      "websiteUrl": "https://www.chorus.ai",
      "cancellationUrl": "https://www.chorus.ai/contact/",
      "tags": ["conversation intelligence", "calls", "meetings", "coaching"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "People.ai",
      "category": "Business Suite",
      "merchantName": "People.ai, Inc.",
      "websiteUrl": "https://www.people.ai",
      "cancellationUrl": "https://www.people.ai/contact/",
      "tags": ["revenue operations", "crm", "activity capture", "analytics"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "6sense",
      "category": "Business Suite",
      "merchantName": "6sense, Inc.",
      "websiteUrl": "https://6sense.com",
      "cancellationUrl": "https://6sense.com/contact/",
      "tags": ["abm", "predictive", "intent", "revenue orchestration"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Demandbase",
      "category": "Business Suite",
      "merchantName": "Demandbase, Inc.",
      "websiteUrl": "https://www.demandbase.com",
      "cancellationUrl": "https://www.demandbase.com/contact/",
      "tags": ["abm", "intent", "advertising", "orchestration"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Terminus",
      "category": "Business Suite",
      "merchantName": "Terminus, Inc.",
      "websiteUrl": "https://terminus.com",
      "cancellationUrl": "https://terminus.com/contact/",
      "tags": ["abm", "advertising", "engagement", "orchestration"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "RollWorks",
      "category": "Business Suite",
      "merchantName": "RollWorks, a division of NextRoll, Inc.",
      "websiteUrl": "https://rollworks.com",
      "cancellationUrl": "https://rollworks.com/contact/",
      "tags": ["abm", "advertising", "data", "orchestration"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "MadKudu",
      "category": "Business Suite",
      "merchantName": "MadKudu, Inc.",
      "websiteUrl": "https://www.madkudu.com",
      "cancellationUrl": "https://www.madkudu.com/contact/",
      "tags": ["lead scoring", "predictive", "segmentation", "growth"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "EverString",
      "category": "Business Suite",
      "merchantName": "EverString Technology Co., Ltd",
      "websiteUrl": "https://everstring.com",
      "cancellationUrl": "https://everstring.com/contact/",
      "tags": ["predictive", "data", "ai", "b2b"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "ZoomInfo",
      "category": "Business Suite",
      "merchantName": "ZoomInfo Technologies LLC",
      "websiteUrl": "https://www.zoominfo.com",
      "cancellationUrl": "https://www.zoominfo.com/contact/",
      "tags": ["b2b data", "contacts", "companies", "intent"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Lusha",
      "category": "Business Suite",
      "merchantName": "Lusha Systems Ltd",
      "websiteUrl": "https://www.lusha.com",
      "cancellationUrl": "https://www.lusha.com/account/billing",
      "tags": ["b2b data", "contacts", "leads", "chrome extension"],
      "plans": [
        {
          "name": "Basic Monthly",
          "billingCycle": "MONTHLY",
          "amount": 29.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Apollo.io",
      "category": "Business Suite",
      "merchantName": "Apollo.io, Inc.",
      "websiteUrl": "https://www.apollo.io",
      "cancellationUrl": "https://www.apollo.io/account/billing",
      "tags": ["b2b data", "prospecting", "engagement", "crm"],
      "plans": [
        {
          "name": "Basic Monthly",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Free up to 1000 credits/month"
        }
      ]
    },
    {
      "name": "Clearbit",
      "category": "Business Suite",
      "merchantName": "Clearbit, Inc.",
      "websiteUrl": "https://clearbit.com",
      "cancellationUrl": "https://clearbit.com/account/billing",
      "tags": ["b2b data", "enrichment", "prospecting", "api"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Free up to 1000 lookups/month"
        }
      ]
    },
    {
      "name": "Hunter.io",
      "category": "Business Suite",
      "merchantName": "Hunter Technology Corp.",
      "websiteUrl": "https://hunter.io",
      "cancellationUrl": "https://hunter.io/account/billing",
      "tags": ["email finder", "verifier", "prospecting", "domain search"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 49.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Snov.io",
      "category": "Business Suite",
      "merchantName": "Snov.io Ltd",
      "websiteUrl": "https://snov.io",
      "cancellationUrl": "https://snov.io/account/billing",
      "tags": ["email finder", "verifier", "drip campaigns", "linkedin"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 39.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Voila Norbert",
      "category": "Business Suite",
      "merchantName": "LeadsBridge S.r.l.",
      "websiteUrl": "https://www.voilanorbert.com",
      "cancellationUrl": "https://www.voilanorbert.com/account/billing",
      "tags": ["email finder", "verifier", "prospecting", "simple"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 49.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "EmailListVerify",
      "category": "Business Suite",
      "merchantName": "EmailListVerify LLC",
      "websiteUrl": "https://www.emaillistverify.com",
      "cancellationUrl": "https://www.emaillistverify.com/account/billing",
      "tags": ["email verifier", "clean list", "deliverability", "bulk"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Prepaid credits; no subscription"
        }
      ]
    },
    {
      "name": "ZeroBounce",
      "category": "Business Suite",
      "merchantName": "ZeroBounce, Inc.",
      "websiteUrl": "https://www.zerobounce.net",
      "cancellationUrl": "https://www.zerobounce.net/account/billing",
      "tags": ["email verifier", "validation", "spam trap", "catch-all"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Prepaid credits; no subscription"
        }
      ]
    },
    {
      "name": "NeverBounce",
      "category": "Business Suite",
      "merchantName": "NeverBounce, Inc.",
      "websiteUrl": "https://neverbounce.com",
      "cancellationUrl": "https://neverbounce.com/account/billing",
      "tags": ["email verifier", "real-time", "api", "bulk"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Prepaid credits; no subscription"
        }
      ]
    },
    {
      "name": "Bouncer",
      "category": "Business Suite",
      "merchantName": "Bouncer, Inc.",
      "websiteUrl": "https://bouncer.email",
      "cancellationUrl": "https://bouncer.email/account/billing",
      "tags": ["email verifier", "gmail", "real-time", "simple"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 12.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Mailgun",
      "category": "Email",
      "merchantName": "Mailgun Technologies, Inc.",
      "websiteUrl": "https://www.mailgun.com",
      "cancellationUrl": "https://www.mailgun.com/account/billing",
      "tags": ["email api", "transactional", "sending", "tracking"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Free up to 5k emails/month"
        }
      ]
    },
    {
      "name": "Postmark",
      "category": "Email",
      "merchantName": "ActiveCampaign, LLC",
      "websiteUrl": "https://postmarkapp.com",
      "cancellationUrl": "https://postmarkapp.com/account/billing",
      "tags": ["transactional email", "developer", "reliability", "api"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Free up to 100 emails/month"
        }
      ]
    },
    {
      "name": "Amazon SES",
      "category": "Email",
      "merchantName": "Amazon Web Services, Inc.",
      "websiteUrl": "https://aws.amazon.com/ses",
      "cancellationUrl": "https://console.aws.amazon.com/billing/home",
      "tags": ["email service", "transactional", "bulk", "aws"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Free tier available; pay per email"
        }
      ]
    },
    {
      "name": "Sendinblue",
      "category": "Email",
      "merchantName": "Sendinblue SAS",
      "websiteUrl": "https://www.sendinblue.com",
      "cancellationUrl": "https://www.sendinblue.com/account/billing",
      "tags": ["email marketing", "sms", "transactional", "automation"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Free up to 300 emails/day"
        }
      ]
    },
    {
      "name": "MailerLite",
      "category": "Email",
      "merchantName": "MailerLite UAB",
      "websiteUrl": "https://www.mailerlite.com",
      "cancellationUrl": "https://app.mailerlite.com/account/billing",
      "tags": ["email marketing", "automation", "landing pages", "pop-ups"],
      "plans": [
        {
          "name": "Free Plan",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Brevo",
      "category": "Email",
      "merchantName": "Sendinblue SAS",
      "websiteUrl": "https://www.brevo.com",
      "cancellationUrl": "https://www.brevo.com/account/billing",
      "tags": ["email marketing", "sms", "transactional", "crm", "automation"],
      "plans": [
        {
          "name": "Free Plan",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "GetResponse",
      "category": "Email",
      "merchantName": "GetResponse S.A.",
      "websiteUrl": "https://www.getresponse.com",
      "cancellationUrl": "https://www.getresponse.com/account/billing",
      "tags": ["email marketing", "automation", "webinars", "landing pages"],
      "plans": [
        {
          "name": "Email Marketing Monthly",
          "billingCycle": "MONTHLY",
          "amount": 19.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "AWeber",
      "category": "Email",
      "merchantName": "AWeber Communications, Inc.",
      "websiteUrl": "https://www.aweber.com",
      "cancellationUrl": "https://www.aweber.com/account/billing",
      "tags": ["email marketing", "automation", "landing pages", "templates"],
      "plans": [
        {
          "name": "Free Plan",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Constant Contact",
      "category": "Email",
      "merchantName": "Constant Contact, Inc.",
      "websiteUrl": "https://www.constantcontact.com",
      "cancellationUrl": "https://www.constantcontact.com/account/billing",
      "tags": ["email marketing", "events", "surveys", "social"],
      "plans": [
        {
          "name": "Core Monthly",
          "billingCycle": "MONTHLY",
          "amount": 12.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Mailjet",
      "category": "Email",
      "merchantName": "Mailjet SAS",
      "websiteUrl": "https://www.mailjet.com",
      "cancellationUrl": "https://www.mailjet.com/account/billing",
      "tags": ["email api", "marketing", "transactional", "real-time"],
      "plans": [
        {
          "name": "Free Plan",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Moosend",
      "category": "Email",
      "merchantName": "Moosend Ltd",
      "websiteUrl": "https://moosend.com",
      "cancellationUrl": "https://moosend.com/account/billing",
      "tags": ["email marketing", "automation", "landing pages", "ecommerce"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Omnisend",
      "category": "Email",
      "merchantName": "Omnisend, Inc.",
      "websiteUrl": "https://www.omnisend.com",
      "cancellationUrl": "https://www.omnisend.com/account/billing",
      "tags": ["email marketing", "sms", "automation", "ecommerce"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 16.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Klaviyo",
      "category": "Email",
      "merchantName": "Klaviyo, Inc.",
      "websiteUrl": "https://www.klaviyo.com",
      "cancellationUrl": "https://www.klaviyo.com/account/billing",
      "tags": ["email marketing", "sms", "ecommerce", "automation"],
      "plans": [
        {
          "name": "Email Monthly",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Free up to 250 contacts"
        }
      ]
    },
    {
      "name": "Privy",
      "category": "Email",
      "merchantName": "Privy, Inc.",
      "websiteUrl": "https://www.privy.com",
      "cancellationUrl": "https://www.privy.com/account/billing",
      "tags": ["pop-ups", "email capture", "sms", "ecommerce"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 19.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "OptinMonster",
      "category": "Email",
      "merchantName": "WPBeginner LLC",
      "websiteUrl": "https://optinmonster.com",
      "cancellationUrl": "https://optinmonster.com/account/billing",
      "tags": ["lead generation", "pop-ups", "conversion", "wordpress"],
      "plans": [
        {
          "name": "Basic Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Sumo",
      "category": "Email",
      "merchantName": "Sumo Group Ltd",
      "websiteUrl": "https://sumo.com",
      "cancellationUrl": "https://sumo.com/account/billing",
      "tags": ["pop-ups", "email capture", "heatmaps", "analytics"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 39.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Popup Maker",
      "category": "Email",
      "merchantName": "Popup Maker LLC",
      "websiteUrl": "https://wppopupmaker.com",
      "cancellationUrl": "https://wppopupmaker.com/account/billing",
      "tags": ["wordpress", "pop-ups", "email", "conversion"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Bloom",
      "category": "Email",
      "merchantName": "Bloom, Inc.",
      "websiteUrl": "https://www.bloom.io",
      "cancellationUrl": "https://www.bloom.io/account/billing",
      "tags": ["email marketing", "automation", "simple", "small business"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 19.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "MailerLite",
      "category": "Email",
      "merchantName": "MailerLite UAB",
      "websiteUrl": "https://www.mailerlite.com",
      "cancellationUrl": "https://app.mailerlite.com/account/billing",
      "tags": ["email marketing", "automation", "landing pages", "pop-ups"],
      "plans": [
        {
          "name": "Growing Business Monthly",
          "billingCycle": "MONTHLY",
          "amount": 50.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Benchmark Email",
      "category": "Email",
      "merchantName": "Benchmark Email, Inc.",
      "websiteUrl": "https://www.benchmarkemail.com",
      "cancellationUrl": "https://www.benchmarkemail.com/account/billing",
      "tags": ["email marketing", "automation", "templates", "surveys"],
      "plans": [
        {
          "name": "Free Plan",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "VerticalResponse",
      "category": "Email",
      "merchantName": "VerticalResponse, Inc.",
      "websiteUrl": "https://www.verticalresponse.com",
      "cancellationUrl": "https://www.verticalresponse.com/account/billing",
      "tags": ["email marketing", "social", "events", "surveys"],
      "plans": [
        {
          "name": "Free Plan",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Campaign Monitor",
      "category": "Email",
      "merchantName": "Campaign Monitor Pty Ltd",
      "websiteUrl": "https://www.campaignmonitor.com",
      "cancellationUrl": "https://www.campaignmonitor.com/account/billing",
      "tags": ["email marketing", "automation", "journeys", "analytics"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Emma",
      "category": "Email",
      "merchantName": "Emma, Inc.",
      "websiteUrl": "https://myemma.com",
      "cancellationUrl": "https://myemma.com/account/billing",
      "tags": ["email marketing", "design", "automation", "analytics"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 15.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Drip",
      "category": "Email",
      "merchantName": "Leadpages, LLC",
      "websiteUrl": "https://www.drip.com",
      "cancellationUrl": "https://www.drip.com/account/billing",
      "tags": ["ecommerce automation", "crm", "email", "sms"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 39.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "ActiveCampaign",
      "category": "Email",
      "merchantName": "ActiveCampaign, LLC",
      "websiteUrl": "https://www.activecampaign.com",
      "cancellationUrl": "https://www.activecampaign.com/account/billing",
      "tags": ["automation", "crm", "email", "sms", "machine learning"],
      "plans": [
        {
          "name": "Plus Monthly",
          "billingCycle": "MONTHLY",
          "amount": 70.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "ConvertKit",
      "category": "Email",
      "merchantName": "ConvertKit LLC",
      "websiteUrl": "https://convertkit.com",
      "cancellationUrl": "https://convertkit.com/account/billing",
      "tags": ["email marketing", "creators", "automation", "landing pages"],
      "plans": [
        {
          "name": "Creator Monthly",
          "billingCycle": "MONTHLY",
          "amount": 15.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "MailerLite",
      "category": "Email",
      "merchantName": "MailerLite UAB",
      "websiteUrl": "https://www.mailerlite.com",
      "cancellationUrl": "https://app.mailerlite.com/account/billing",
      "tags": ["email marketing", "automation", "landing pages", "pop-ups"],
      "plans": [
        {
          "name": "Advanced Monthly",
          "billingCycle": "MONTHLY",
          "amount": 80.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Mailchimp",
      "category": "Email",
      "merchantName": "Intuit Inc.",
      "websiteUrl": "https://mailchimp.com",
      "cancellationUrl": "https://mailchimp.com/account/billing/",
      "tags": ["email marketing", "automation", "crm", "landing pages"],
      "plans": [
        {
          "name": "Essentials Monthly",
          "billingCycle": "MONTHLY",
          "amount": 13.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "HubSpot Marketing Hub",
      "category": "Email",
      "merchantName": "HubSpot, Inc.",
      "websiteUrl": "https://www.hubspot.com/products/marketing",
      "cancellationUrl": "https://app.hubspot.com/billing",
      "tags": ["crm", "marketing", "automation", "analytics", "seo"],
      "plans": [
        {
          "name": "Professional Monthly",
          "billingCycle": "MONTHLY",
          "amount": 800.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Marketo Engage",
      "category": "Email",
      "merchantName": "Adobe Inc.",
      "websiteUrl": "https://business.adobe.com/products/marketo/marketo-engage.html",
      "cancellationUrl": "https://business.adobe.com/contact.html",
      "tags": ["marketing automation", "abm", "email", "analytics", "enterprise"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Pardot",
      "category": "Email",
      "merchantName": "Salesforce, Inc.",
      "websiteUrl": "https://www.salesforce.com/products/pardot/",
      "cancellationUrl": "https://www.salesforce.com/contact/",
      "tags": ["b2b marketing", "automation", "crm", "abm", "salesforce"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Eloqua",
      "category": "Email",
      "merchantName": "Oracle Corporation",
      "websiteUrl": "https://www.oracle.com/marketingcloud/products/eloqua/",
      "cancellationUrl": "https://www.oracle.com/contact/",
      "tags": ["marketing automation", "b2b", "enterprise", "abm", "oracle"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Act-On",
      "category": "Email",
      "merchantName": "Act-On Software, Inc.",
      "websiteUrl": "https://www.act-on.com",
      "cancellationUrl": "https://www.act-on.com/contact/",
      "tags": ["marketing automation", "b2b", "crm", "analytics", "mid-market"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "SharpSpring",
      "category": "Email",
      "merchantName": "SharpSpring, Inc.",
      "websiteUrl": "https://www.sharpspring.com",
      "cancellationUrl": "https://www.sharpspring.com/contact/",
      "tags": ["marketing automation", "crm", "agency", "b2b", "affordable"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Infusionsoft by Keap",
      "category": "Email",
      "merchantName": "Keap, Inc.",
      "websiteUrl": "https://keap.com",
      "cancellationUrl": "https://keap.com/account/billing",
      "tags": ["small business", "crm", "marketing", "sales", "automation"],
      "plans": [
        {
          "name": "Lite Monthly",
          "billingCycle": "MONTHLY",
          "amount": 79.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Ontraport",
      "category": "Email",
      "merchantName": "Ontraport, Inc.",
      "websiteUrl": "https://ontraport.com",
      "cancellationUrl": "https://ontraport.com/account/billing",
      "tags": ["marketing automation", "crm", "ecommerce", "courses", "coaching"],
      "plans": [
        {
          "name": "Basic Monthly",
          "billingCycle": "MONTHLY",
          "amount": 79.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Kajabi",
      "category": "Email",
      "merchantName": "Kajabi LLC",
      "websiteUrl": "https://kajabi.com",
      "cancellationUrl": "https://kajabi.com/account/billing",
      "tags": ["courses", "coaching", "membership", "marketing", "email"],
      "plans": [
        {
          "name": "Growth Monthly",
          "billingCycle": "MONTHLY",
          "amount": 149.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Teachable",
      "category": "Email",
      "merchantName": "Teachable, Inc.",
      "websiteUrl": "https://www.teachable.com",
      "cancellationUrl": "https://www.teachable.com/account/billing",
      "tags": ["courses", "online school", "coaching", "membership", "email"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 119.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Thinkific",
      "category": "Email",
      "merchantName": "Thinkific Labs Inc.",
      "websiteUrl": "https://www.thinkific.com",
      "cancellationUrl": "https://www.thinkific.com/account/billing",
      "tags": ["courses", "education", "membership", "coaching", "email"],
      "plans": [
        {
          "name": "Grow Monthly",
          "billingCycle": "MONTHLY",
          "amount": 99.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Podia",
      "category": "Email",
      "merchantName": "Podia Inc.",
      "websiteUrl": "https://www.podia.com",
      "cancellationUrl": "https://www.podia.com/account/billing",
      "tags": ["courses", "memberships", "digital products", "email", "website"],
      "plans": [
        {
          "name": "Shaker Monthly",
          "billingCycle": "MONTHLY",
          "amount": 79.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Gumroad",
      "category": "Email",
      "merchantName": "Gumroad, Inc.",
      "websiteUrl": "https://gumroad.com",
      "cancellationUrl": "https://gumroad.com/account/subscription",
      "tags": ["creators", "digital products", "payments", "email", "store"],
      "plans": [
        {
          "name": "Pro Monthly",
          "billingCycle": "MONTHLY",
          "amount": 10.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "SendOwl",
      "category": "Email",
      "merchantName": "SendOwl Ltd",
      "websiteUrl": "https://www.sendowl.com",
      "cancellationUrl": "https://www.sendowl.com/account/billing",
      "tags": ["digital products", "payments", "licensing", "email", "store"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 9.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Paddle",
      "category": "Payments",
      "merchantName": "Paddle.com Market Limited",
      "websiteUrl": "https://www.paddle.com",
      "cancellationUrl": "https://www.paddle.com/account",
      "tags": ["payments", "saas", "subscription", "tax", "fraud"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No monthly fee; transaction-based pricing"
        }
      ]
    },
    {
      "name": "Chargebee",
      "category": "Payments",
      "merchantName": "Chargebee Technologies Private Limited",
      "websiteUrl": "https://www.chargebee.com",
      "cancellationUrl": "https://www.chargebee.com/account/billing",
      "tags": ["subscription billing", "revenue", "saas", "invoicing"],
      "plans": [
        {
          "name": "Growth Monthly",
          "billingCycle": "MONTHLY",
          "amount": 149.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Recurly",
      "category": "Payments",
      "merchantName": "Recurly, Inc.",
      "websiteUrl": "https://recurly.com",
      "cancellationUrl": "https://recurly.com/account/billing",
      "tags": ["subscription billing", "revenue", "saas", "analytics"],
      "plans": [
        {
          "name": "Standard Monthly",
          "billingCycle": "MONTHLY",
          "amount": 129.0,
          "currency": "USD"
        }
      ]
    },
    {
      "name": "Braintree",
      "category": "Payments",
      "merchantName": "PayPal, Inc.",
      "websiteUrl": "https://www.braintreepayments.com",
      "cancellationUrl": "https://www.braintreepayments.com/account",
      "tags": ["payments", "paypal", "venmo", "apple pay", "google pay"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No monthly fee; transaction-based pricing"
        }
      ]
    },
    {
      "name": "Adyen",
      "category": "Payments",
      "merchantName": "Adyen N.V.",
      "websiteUrl": "https://www.adyen.com",
      "cancellationUrl": "https://www.adyen.com/contact",
      "tags": ["payments", "global", "ecommerce", "pos", "enterprise"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Worldpay",
      "category": "Payments",
      "merchantName": "Worldpay, Inc.",
      "websiteUrl": "https://www.worldpay.com",
      "cancellationUrl": "https://www.worldpay.com/contact",
      "tags": ["payments", "global", "ecommerce", "pos", "enterprise"],
      "plans": [
        {
          "name": "Custom Pricing",
          "billingCycle": "YEARLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Contact sales for pricing"
        }
      ]
    },
    {
      "name": "Square Payments",
      "category": "Payments",
      "merchantName": "Block, Inc.",
      "websiteUrl": "https://squareup.com/us/en/payments",
      "cancellationUrl": "https://squareup.com/dashboard/billing",
      "tags": ["payments", "pos", "ecommerce", "invoicing", "payroll"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No monthly fee; transaction-based pricing"
        }
      ]
    },
    {
      "name": "PayPal Payments",
      "category": "Payments",
      "merchantName": "PayPal, Inc.",
      "websiteUrl": "https://www.paypal.com",
      "cancellationUrl": "https://www.paypal.com/account/settings",
      "tags": ["payments", "checkout", "invoices", "marketplace", "global"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No monthly fee; transaction-based pricing"
        }
      ]
    },
    {
      "name": "Authorize.Net",
      "category": "Payments",
      "merchantName": "Visa Inc.",
      "websiteUrl": "https://www.authorize.net",
      "cancellationUrl": "https://www.authorize.net/support/",
      "tags": ["payments", "gateway", "ecommerce", "recurring", "developer"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No monthly fee; transaction-based pricing"
        }
      ]
    },
    {
      "name": "2Checkout",
      "category": "Payments",
      "merchantName": "2Checkout.com, Inc.",
      "websiteUrl": "https://www.2checkout.com",
      "cancellationUrl": "https://www.2checkout.com/account",
      "tags": ["payments", "global", "subscription", "digital goods", "physical"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No monthly fee; transaction-based pricing"
        }
      ]
    },
    {
      "name": "FastSpring",
      "category": "Payments",
      "merchantName": "FastSpring, Inc.",
      "websiteUrl": "https://fastspring.com",
      "cancellationUrl": "https://fastspring.com/account/billing",
      "tags": ["payments", "saas", "digital goods", "global", "subscription"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No monthly fee; transaction-based pricing"
        }
      ]
    },
    {
      "name": "Shopify Payments",
      "category": "Payments",
      "merchantName": "Shopify Inc.",
      "websiteUrl": "https://www.shopify.com/payments",
      "cancellationUrl": "https://admin.shopify.com/settings/payments",
      "tags": ["payments", "ecommerce", "shopify", "credit card", "apple pay"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No monthly fee; transaction-based pricing"
        }
      ]
    },
    {
      "name": "WooCommerce Payments",
      "category": "Payments",
      "merchantName": "Automattic Inc.",
      "websiteUrl": "https://woocommerce.com/payments",
      "cancellationUrl": "https://woocommerce.com/my-account/",
      "tags": ["payments", "wordpress", "ecommerce", "credit card", "stripe"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No monthly fee; transaction-based pricing"
        }
      ]
    },
    {
      "name": "BigCommerce Payments",
      "category": "Payments",
      "merchantName": "BigCommerce Holdings, Inc.",
      "websiteUrl": "https://www.bigcommerce.com/features/payments",
      "cancellationUrl": "https://www.bigcommerce.com/account/billing",
      "tags": ["payments", "ecommerce", "bigcommerce", "credit card", "paypal"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No monthly fee; transaction-based pricing"
        }
      ]
    },
    {
      "name": "Ecwid Payments",
      "category": "Payments",
      "merchantName": "Ecwid Inc.",
      "websiteUrl": "https://www.ecwid.com/features/payment-gateway",
      "cancellationUrl": "https://www.ecwid.com/account/billing",
      "tags": ["payments", "ecommerce", "ecwid", "credit card", "paypal"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No monthly fee; transaction-based pricing"
        }
      ]
    },
    {
      "name": "Wix Payments",
      "category": "Payments",
      "merchantName": "Wix.com Ltd.",
      "websiteUrl": "https://www.wix.com/payments",
      "cancellationUrl": "https://www.wix.com/account/billing",
      "tags": ["payments", "ecommerce", "wix", "credit card", "apple pay"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No monthly fee; transaction-based pricing"
        }
      ]
    },
    {
      "name": "Squarespace Payments",
      "category": "Payments",
      "merchantName": "Squarespace, Inc.",
      "websiteUrl": "https://www.squarespace.com/ecommerce-website",
      "cancellationUrl": "https://account.squarespace.com/billing",
      "tags": ["payments", "ecommerce", "squarespace", "credit card", "apple pay"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No monthly fee; transaction-based pricing"
        }
      ]
    },
    {
      "name": "Webflow Ecommerce",
      "category": "Payments",
      "merchantName": "Webflow, Inc.",
      "websiteUrl": "https://webflow.com/ecommerce-website-builder",
      "cancellationUrl": "https://webflow.com/dashboard/account/billing",
      "tags": ["payments", "ecommerce", "webflow", "credit card", "stripe"],
      "plans": [
        {
          "name": "Pay-as-you-go",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No monthly fee; transaction-based pricing"
        }
      ]
    },
    {
      "name": "Snipcart",
      "category": "Payments",
      "merchantName": "Snipcart Inc.",
      "websiteUrl": "https://snipcart.com",
      "cancellationUrl": "https://snipcart.com/account/billing",
      "tags": ["payments", "ecommerce", "developer", "headless", "api"],
      "plans": [
        {
          "name": "Starter Monthly",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "Free up to $500 in sales/month"
        }
      ]
    },
    {
      "name": "Paddle",
      "category": "Payments",
      "merchantName": "Paddle.com Market Limited",
      "websiteUrl": "https://www.paddle.com",
      "cancellationUrl": "https://www.paddle.com/account",
      "tags": ["payments", "saas", "subscription", "tax", "fraud"],
      "plans": [
        {
          "name": "Growth Monthly",
          "billingCycle": "MONTHLY",
          "amount": 0.0,
          "currency": "USD",
          "description": "No monthly fee; transaction-based pricing"
        }
      ]
    },
    
      {
        "name": "ChatGPT (OpenAI)",
        "category": "AI Assistant / LLM",
        "merchantName": "OpenAI",
        "websiteUrl": "https://chat.openai.com",
        "cancellationUrl": "https://chat.openai.com/account/billing",
        "tags": ["llm","assistant","api","chat"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD","description":"Free tier with basic access"},
          {"name":"ChatGPT Plus","billingCycle":"MONTHLY","amount":20,"currency":"USD","description":"Faster access, advanced model access"}
        ]
      },
      {
        "name": "Claude (Anthropic)",
        "category": "AI Assistant / LLM",
        "merchantName": "Anthropic",
        "websiteUrl": "https://www.anthropic.com",
        "cancellationUrl": "https://www.anthropic.com/billing",
        "tags": ["llm","assistant","privacy"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":30,"currency":"USD","description":"Higher usage limits"}
        ]
      },
      {
        "name": "Google Gemini / Google Cloud AI",
        "category": "AI Assistant / Cloud AI",
        "merchantName": "Google",
        "websiteUrl": "https://cloud.google.com/ai",
        "cancellationUrl": "https://console.cloud.google.com/billing",
        "tags": ["llm","cloud","api"],
        "plans": [
          {"name":"Pay-as-you-go","billingCycle":"MONTHLY","amount":0,"currency":"USD","description":"Billing based on usage"}
        ]
      },
      {
        "name": "GitHub Copilot",
        "category": "Dev Productivity / AI",
        "merchantName": "GitHub (Microsoft)",
        "websiteUrl": "https://github.com/features/copilot",
        "cancellationUrl": "https://github.com/settings/billing",
        "tags": ["developer","ai","autocomplete"],
        "plans": [
          {"name":"Individual","billingCycle":"MONTHLY","amount":10,"currency":"USD"},
          {"name":"Business","billingCycle":"MONTHLY","amount":19,"currency":"USD"}
        ]
      },
      {
        "name": "Notion",
        "category": "Productivity / Notes / Workspace",
        "merchantName": "Notion Labs",
        "websiteUrl": "https://www.notion.so",
        "cancellationUrl": "https://www.notion.so/settings/billing",
        "tags": ["notes","project","workspace","notion-ai"],
        "plans": [
          {"name":"Personal","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Personal Pro","billingCycle":"MONTHLY","amount":5,"currency":"USD"},
          {"name":"Team","billingCycle":"MONTHLY","amount":10,"currency":"USD"}
        ]
      },
      {
        "name": "Jasper",
        "category": "AI Writing / Content",
        "merchantName": "Jasper",
        "websiteUrl": "https://www.jasper.ai",
        "cancellationUrl": "https://www.jasper.ai/account/subscription",
        "tags": ["writing","copy","marketing","ai"],
        "plans": [
          {"name":"Starter","billingCycle":"MONTHLY","amount":39,"currency":"USD"},
          {"name":"Boss Mode","billingCycle":"MONTHLY","amount":99,"currency":"USD"}
        ]
      },
      {
        "name": "Grammarly",
        "category": "Writing / Grammar / AI",
        "merchantName": "Grammarly",
        "websiteUrl": "https://www.grammarly.com",
        "cancellationUrl": "https://www.grammarly.com/account/plan",
        "tags": ["writing","proofreading","ai"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Premium","billingCycle":"MONTHLY","amount":12,"currency":"USD"},
          {"name":"Business","billingCycle":"MONTHLY","amount":15,"currency":"USD"}
        ]
      },
      {
        "name": "Canva",
        "category": "Design / Creative / AI",
        "merchantName": "Canva",
        "websiteUrl": "https://www.canva.com",
        "cancellationUrl": "https://www.canva.com/account/billing/",
        "tags": ["design","graphics","ai","templates"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":12.99,"currency":"USD"},
          {"name":"Enterprise","billingCycle":"YEARLY","amount":30,"currency":"USD","description":"per seat, approx"}
        ]
      },
      {
        "name": "Figma",
        "category": "Design / UI",
        "merchantName": "Figma",
        "websiteUrl": "https://www.figma.com",
        "cancellationUrl": "https://www.figma.com/settings/billing",
        "tags": ["design","ui","collaboration"],
        "plans": [
          {"name":"Starter","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Professional","billingCycle":"MONTHLY","amount":12,"currency":"USD"},
          {"name":"Organization","billingCycle":"MONTHLY","amount":45,"currency":"USD"}
        ]
      },
      {
        "name": "Midjourney",
        "category": "AI Image Generation",
        "merchantName": "Midjourney",
        "websiteUrl": "https://www.midjourney.com",
        "cancellationUrl": "https://www.midjourney.com/account",
        "tags": ["image","ai","art"],
        "plans": [
          {"name":"Basic","billingCycle":"MONTHLY","amount":10,"currency":"USD"},
          {"name":"Standard","billingCycle":"MONTHLY","amount":30,"currency":"USD"}
        ]
      },
      {
        "name": "DALL·E (OpenAI)",
        "category": "AI Image Generation",
        "merchantName": "OpenAI",
        "websiteUrl": "https://lab.openai.com",
        "cancellationUrl": "https://platform.openai.com/account/billing",
        "tags": ["image","ai"],
        "plans": [
          {"name":"Pay-as-you-go","billingCycle":"MONTHLY","amount":0,"currency":"USD","description":"Credits based usage"}
        ]
      },
      {
        "name": "Stable Diffusion / Stability AI (DreamStudio)",
        "category": "AI Image Generation",
        "merchantName": "Stability AI",
        "websiteUrl": "https://dreamstudio.ai",
        "cancellationUrl": "https://dreamstudio.ai/account",
        "tags": ["image","ai","open model"],
        "plans": [
          {"name":"Pay-as-you-go","billingCycle":"MONTHLY","amount":0,"currency":"USD","description":"Credits per image"}
        ]
      },
      {
        "name": "Runway",
        "category": "AI Video & Media",
        "merchantName": "Runway",
        "websiteUrl": "https://runwayml.com",
        "cancellationUrl": "https://runwayml.com/account/billing",
        "tags": ["video","ai","editing"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Creator","billingCycle":"MONTHLY","amount":12,"currency":"USD"},
          {"name":"Business","billingCycle":"MONTHLY","amount":35,"currency":"USD"}
        ]
      },
      {
        "name": "Synthesia",
        "category": "AI Video Generation",
        "merchantName": "Synthesia",
        "websiteUrl": "https://www.synthesia.io",
        "cancellationUrl": "https://www.synthesia.io/account",
        "tags": ["video","ai","avatars"],
        "plans": [
          {"name":"Personal","billingCycle":"MONTHLY","amount":30,"currency":"USD"},
          {"name":"Corporate","billingCycle":"YEARLY","amount":1000,"currency":"USD","description":"enterprise pricing example"}
        ]
      },
      {
        "name": "Descript",
        "category": "Audio / Video Editing / AI",
        "merchantName": "Descript",
        "websiteUrl": "https://www.descript.com",
        "cancellationUrl": "https://www.descript.com/account/billing",
        "tags": ["audio","video","transcription","ai"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Creator","billingCycle":"MONTHLY","amount":12,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":24,"currency":"USD"}
        ]
      },
      {
        "name": "Otter.ai",
        "category": "Transcription / Meeting Notes",
        "merchantName": "Otter.ai",
        "websiteUrl": "https://otter.ai",
        "cancellationUrl": "https://otter.ai/account/billing",
        "tags": ["transcription","meetings","ai"],
        "plans": [
          {"name":"Basic","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":8.33,"currency":"USD"},
          {"name":"Business","billingCycle":"MONTHLY","amount":20,"currency":"USD"}
        ]
      },
      {
        "name": "Loom",
        "category": "Video Messaging / SaaS",
        "merchantName": "Loom",
        "websiteUrl": "https://www.loom.com",
        "cancellationUrl": "https://www.loom.com/account/billing",
        "tags": ["video","async","screenshare"],
        "plans": [
          {"name":"Starter","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Business","billingCycle":"MONTHLY","amount":8,"currency":"USD"}
        ]
      },
      {
        "name": "Typeform",
        "category": "Forms / Surveys",
        "merchantName": "Typeform",
        "websiteUrl": "https://www.typeform.com",
        "cancellationUrl": "https://admin.typeform.com/account/billing",
        "tags": ["forms","surveys","saas"],
        "plans": [
          {"name":"Basic","billingCycle":"MONTHLY","amount":25,"currency":"USD"},
          {"name":"Plus","billingCycle":"MONTHLY","amount":50,"currency":"USD"}
        ]
      },
      {
        "name": "Jotform",
        "category": "Forms / Surveys",
        "merchantName": "Jotform",
        "websiteUrl": "https://www.jotform.com",
        "cancellationUrl": "https://www.jotform.com/myaccount/billing/",
        "tags": ["forms","saas"],
        "plans": [
          {"name":"Starter","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Bronze","billingCycle":"MONTHLY","amount":34,"currency":"USD"}
        ]
      },
      {
        "name": "Airtable",
        "category": "Database / Low-code",
        "merchantName": "Airtable",
        "websiteUrl": "https://www.airtable.com",
        "cancellationUrl": "https://airtable.com/account/billing",
        "tags": ["database","no-code","tables"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Plus","billingCycle":"MONTHLY","amount":10,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":20,"currency":"USD"}
        ]
      },
      {
        "name": "Zapier",
        "category": "Automation / Integrations",
        "merchantName": "Zapier",
        "websiteUrl": "https://zapier.com",
        "cancellationUrl": "https://zapier.com/app/billing",
        "tags": ["automation","no-code","integrations"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Starter","billingCycle":"MONTHLY","amount":19.99,"currency":"USD"},
          {"name":"Professional","billingCycle":"MONTHLY","amount":49,"currency":"USD"}
        ]
      },
      {
        "name": "Make (Integromat)",
        "category": "Automation / Integrations",
        "merchantName": "Make",
        "websiteUrl": "https://www.make.com",
        "cancellationUrl": "https://www.make.com/en/billing",
        "tags": ["automation","no-code","integrations"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Core","billingCycle":"MONTHLY","amount":9,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":29,"currency":"USD"}
        ]
      },
      {
        "name": "n8n Cloud",
        "category": "Automation / Integrations",
        "merchantName": "n8n",
        "websiteUrl": "https://www.n8n.io",
        "cancellationUrl": "https://app.n8n.cloud/account/billing",
        "tags": ["automation","workflows","open-source"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Cloud Pro","billingCycle":"MONTHLY","amount":29,"currency":"USD"}
        ]
      },
      {
        "name": "HubSpot",
        "category": "CRM / Marketing / Sales",
        "merchantName": "HubSpot",
        "websiteUrl": "https://www.hubspot.com",
        "cancellationUrl": "https://app.hubspot.com/account-settings/billing",
        "tags": ["crm","marketing","sales"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Starter","billingCycle":"MONTHLY","amount":20,"currency":"USD"},
          {"name":"Professional","billingCycle":"MONTHLY","amount":800,"currency":"USD"}
        ]
      },
      {
        "name": "Salesforce",
        "category": "CRM / Enterprise",
        "merchantName": "Salesforce",
        "websiteUrl": "https://www.salesforce.com",
        "cancellationUrl": "https://login.salesforce.com",
        "tags": ["crm","enterprise","sales"],
        "plans": [
          {"name":"Essentials","billingCycle":"MONTHLY","amount":25,"currency":"USD"},
          {"name":"Professional","billingCycle":"MONTHLY","amount":75,"currency":"USD"}
        ]
      },
      {
        "name": "Intercom",
        "category": "Customer Messaging / Support",
        "merchantName": "Intercom",
        "websiteUrl": "https://www.intercom.com",
        "cancellationUrl": "https://www.intercom.com/settings/billing",
        "tags": ["support","chat","crm"],
        "plans": [
          {"name":"Starter","billingCycle":"MONTHLY","amount":39,"currency":"USD"},
          {"name":"Business","billingCycle":"MONTHLY","amount":99,"currency":"USD"}
        ]
      },
      {
        "name": "Drift",
        "category": "Conversational Marketing / Chat",
        "merchantName": "Drift",
        "websiteUrl": "https://www.drift.com",
        "cancellationUrl": "https://www.drift.com/support",
        "tags": ["chat","sales","ai"],
        "plans": [
          {"name":"Standard","billingCycle":"MONTHLY","amount":400,"currency":"USD","description":"example enterprise starting price"}
        ]
      },
      {
        "name": "Mailchimp",
        "category": "Email Marketing",
        "merchantName": "Mailchimp",
        "websiteUrl": "https://mailchimp.com",
        "cancellationUrl": "https://mailchimp.com/account/billing/",
        "tags": ["email","marketing","saas"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Essentials","billingCycle":"MONTHLY","amount":13,"currency":"USD"},
          {"name":"Standard","billingCycle":"MONTHLY","amount":20,"currency":"USD"}
        ]
      },
      {
        "name": "Klaviyo",
        "category": "Email & SMS Marketing",
        "merchantName": "Klaviyo",
        "websiteUrl": "https://www.klaviyo.com",
        "cancellationUrl": "https://www.klaviyo.com/account/billing",
        "tags": ["email","sms","marketing"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Paid","billingCycle":"MONTHLY","amount":30,"currency":"USD","description":"pricing scales with contacts"}
        ]
      },
      {
        "name": "Stripe Billing",
        "category": "Payments / Billing / SaaS",
        "merchantName": "Stripe",
        "websiteUrl": "https://stripe.com",
        "cancellationUrl": "https://dashboard.stripe.com/account/billing",
        "tags": ["payments","billing","saas"],
        "plans": [
          {"name":"Pay-as-you-go","billingCycle":"MONTHLY","amount":0,"currency":"USD","description":"fees per transaction"}
        ]
      },
      {
        "name": "SendGrid (Twilio SendGrid)",
        "category": "Transactional Email",
        "merchantName": "Twilio",
        "websiteUrl": "https://sendgrid.com",
        "cancellationUrl": "https://app.sendgrid.com/settings/billing",
        "tags": ["email","smtp","api"],
        "plans": [
          {"name":"Essentials","billingCycle":"MONTHLY","amount":14.95,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":89.95,"currency":"USD"}
        ]
      },
      {
        "name": "Twilio",
        "category": "Communications API",
        "merchantName": "Twilio",
        "websiteUrl": "https://www.twilio.com",
        "cancellationUrl": "https://www.twilio.com/console/billing",
        "tags": ["sms","voice","api"],
        "plans": [
          {"name":"Pay-as-you-go","billingCycle":"MONTHLY","amount":0,"currency":"USD","description":"usage-based"}
        ]
      },
      {
        "name": "Calendly",
        "category": "Scheduling / Productivity",
        "merchantName": "Calendly",
        "websiteUrl": "https://calendly.com",
        "cancellationUrl": "https://calendly.com/account/billing",
        "tags": ["calendar","scheduling","saas"],
        "plans": [
          {"name":"Basic","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Essentials","billingCycle":"MONTHLY","amount":8,"currency":"USD"},
          {"name":"Professional","billingCycle":"MONTHLY","amount":12,"currency":"USD"}
        ]
      },
      {
        "name": "Slack",
        "category": "Team Communication",
        "merchantName": "Slack (Salesforce)",
        "websiteUrl": "https://slack.com",
        "cancellationUrl": "https://my.slack.com/account/billing",
        "tags": ["chat","team","communication"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":8,"currency":"USD"},
          {"name":"Business+","billingCycle":"MONTHLY","amount":15,"currency":"USD"}
        ]
      },
      {
        "name": "Zoom",
        "category": "Video Conferencing",
        "merchantName": "Zoom",
        "websiteUrl": "https://zoom.us",
        "cancellationUrl": "https://zoom.us/account/billing",
        "tags": ["video","meetings","saas"],
        "plans": [
          {"name":"Basic","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":14.99,"currency":"USD"}
        ]
      },
      {
        "name": "Miro",
        "category": "Collaboration / Whiteboard",
        "merchantName": "Miro",
        "websiteUrl": "https://miro.com",
        "cancellationUrl": "https://miro.com/account/billing",
        "tags": ["whiteboard","collaboration","design"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Team","billingCycle":"MONTHLY","amount":8,"currency":"USD"},
          {"name":"Business","billingCycle":"MONTHLY","amount":16,"currency":"USD"}
        ]
      },
      {
        "name": "Asana",
        "category": "Project Management",
        "merchantName": "Asana",
        "websiteUrl": "https://asana.com",
        "cancellationUrl": "https://app.asana.com/-/billing",
        "tags": ["project","tasks","pm"],
        "plans": [
          {"name":"Basic","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Premium","billingCycle":"MONTHLY","amount":10.99,"currency":"USD"},
          {"name":"Business","billingCycle":"MONTHLY","amount":24.99,"currency":"USD"}
        ]
      },
      {
        "name": "ClickUp",
        "category": "Project Management",
        "merchantName": "ClickUp",
        "websiteUrl": "https://clickup.com",
        "cancellationUrl": "https://app.clickup.com/settings/billing",
        "tags": ["project","tasks","productivity"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Unlimited","billingCycle":"MONTHLY","amount":5,"currency":"USD"},
          {"name":"Business","billingCycle":"MONTHLY","amount":12,"currency":"USD"}
        ]
      },
      {
        "name": "Trello",
        "category": "Project Management / Boards",
        "merchantName": "Atlassian",
        "websiteUrl": "https://trello.com",
        "cancellationUrl": "https://trello.com/account/billing",
        "tags": ["boards","kanban","project"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Standard","billingCycle":"MONTHLY","amount":5,"currency":"USD"},
          {"name":"Premium","billingCycle":"MONTHLY","amount":10,"currency":"USD"}
        ]
      },
      {
        "name": "Monday.com",
        "category": "Work OS / Project Management",
        "merchantName": "monday.com",
        "websiteUrl": "https://monday.com",
        "cancellationUrl": "https://monday.com/signup/billing",
        "tags": ["work-os","project","saas"],
        "plans": [
          {"name":"Basic","billingCycle":"MONTHLY","amount":8,"currency":"USD"},
          {"name":"Standard","billingCycle":"MONTHLY","amount":10,"currency":"USD"}
        ]
      },
      {
        "name": "Stripe Radar / Subscription",
        "category": "Payments / Billing",
        "merchantName": "Stripe",
        "websiteUrl": "https://stripe.com/billing",
        "cancellationUrl": "https://dashboard.stripe.com/account/billing",
        "tags": ["payments","billing","subscriptions"],
        "plans": [
          {"name":"Standard","billingCycle":"MONTHLY","amount":0,"currency":"USD","description":"usage-based fees"}
        ]
      },
      {
        "name": "Amplitude",
        "category": "Product Analytics",
        "merchantName": "Amplitude",
        "websiteUrl": "https://amplitude.com",
        "cancellationUrl": "https://amplitude.com/account/billing",
        "tags": ["analytics","product","metrics"],
        "plans": [
          {"name":"Starter","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Growth","billingCycle":"MONTHLY","amount":995,"currency":"USD"}
        ]
      },
      {
        "name": "Mixpanel",
        "category": "Product Analytics",
        "merchantName": "Mixpanel",
        "websiteUrl": "https://mixpanel.com",
        "cancellationUrl": "https://mixpanel.com/account/billing",
        "tags": ["analytics","product","events"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Growth","billingCycle":"MONTHLY","amount":25,"currency":"USD"}
        ]
      },
      {
        "name": "Segment (Twilio Segment)",
        "category": "Customer Data Platform",
        "merchantName": "Twilio",
        "websiteUrl": "https://segment.com",
        "cancellationUrl": "https://segment.com/account/billing",
        "tags": ["cdp","analytics","data"],
        "plans": [
          {"name":"Developer","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Business","billingCycle":"MONTHLY","amount":1200,"currency":"USD"}
        ]
      },
      {
        "name": "Ahrefs",
        "category": "SEO / Marketing",
        "merchantName": "Ahrefs",
        "websiteUrl": "https://ahrefs.com",
        "cancellationUrl": "https://ahrefs.com/account/billing",
        "tags": ["seo","marketing","analytics"],
        "plans": [
          {"name":"Lite","billingCycle":"MONTHLY","amount":99,"currency":"USD"},
          {"name":"Standard","billingCycle":"MONTHLY","amount":199,"currency":"USD"}
        ]
      },
      {
        "name": "SEMrush",
        "category": "SEO / Marketing",
        "merchantName": "Semrush",
        "websiteUrl": "https://www.semrush.com",
        "cancellationUrl": "https://www.semrush.com/company/billing/",
        "tags": ["seo","marketing","analytics"],
        "plans": [
          {"name":"Pro","billingCycle":"MONTHLY","amount":119.95,"currency":"USD"},
          {"name":"Guru","billingCycle":"MONTHLY","amount":229.95,"currency":"USD"}
        ]
      },
      {
        "name": "SurferSEO",
        "category": "SEO / Content Optimization",
        "merchantName": "Surfer",
        "websiteUrl": "https://surferseo.com",
        "cancellationUrl": "https://surferseo.com/account/billing",
        "tags": ["seo","content","ai"],
        "plans": [
          {"name":"Basic","billingCycle":"MONTHLY","amount":49,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":99,"currency":"USD"}
        ]
      },
      {
        "name": "Writer.com",
        "category": "AI Writing / Teams",
        "merchantName": "Writer",
        "websiteUrl": "https://writer.com",
        "cancellationUrl": "https://writer.com/account/billing",
        "tags": ["writing","ai","enterprise"],
        "plans": [
          {"name":"Team","billingCycle":"MONTHLY","amount":19,"currency":"USD"},
          {"name":"Enterprise","billingCycle":"YEARLY","amount":0,"currency":"USD","description":"custom pricing"}
        ]
      },
      {
        "name": "Copy.ai",
        "category": "AI Writing",
        "merchantName": "Copy.ai",
        "websiteUrl": "https://www.copy.ai",
        "cancellationUrl": "https://www.copy.ai/account/billing",
        "tags": ["ai","copywriting","marketing"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":36,"currency":"USD"}
        ]
      },
      {
        "name": "Writesonic",
        "category": "AI Writing",
        "merchantName": "Writesonic",
        "websiteUrl": "https://writesonic.com",
        "cancellationUrl": "https://writesonic.com/account/billing",
        "tags": ["ai","writing","marketing"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Creator","billingCycle":"MONTHLY","amount":19,"currency":"USD"}
        ]
      },
      {
        "name": "Sudowrite",
        "category": "AI Writing / Fiction",
        "merchantName": "Sudowrite",
        "websiteUrl": "https://www.sudowrite.com",
        "cancellationUrl": "https://www.sudowrite.com/account/billing",
        "tags": ["writing","fiction","ai"],
        "plans": [
          {"name":"Monthly","billingCycle":"MONTHLY","amount":10,"currency":"USD"},
          {"name":"Yearly","billingCycle":"YEARLY","amount":96,"currency":"USD"}
        ]
      },
      {
        "name": "NovelAI",
        "category": "AI Writing / Storytelling",
        "merchantName": "NovelAI",
        "websiteUrl": "https://novelai.net",
        "cancellationUrl": "https://novelai.net/account/billing",
        "tags": ["writing","ai","stories"],
        "plans": [
          {"name":"Premium","billingCycle":"MONTHLY","amount":10,"currency":"USD"}
        ]
      },
      {
        "name": "Pictory",
        "category": "AI Video / Social Video",
        "merchantName": "Pictory",
        "websiteUrl": "https://pictory.ai",
        "cancellationUrl": "https://pictory.ai/account",
        "tags": ["video","ai","social"],
        "plans": [
          {"name":"Standard","billingCycle":"MONTHLY","amount":19,"currency":"USD"},
          {"name":"Premium","billingCycle":"MONTHLY","amount":39,"currency":"USD"}
        ]
      },
      {
        "name": "Replit",
        "category": "Cloud IDE / Dev Tools",
        "merchantName": "Replit",
        "websiteUrl": "https://replit.com",
        "cancellationUrl": "https://replit.com/account/billing",
        "tags": ["development","ide","cloud"],
        "plans": [
          {"name":"Hacker","billingCycle":"MONTHLY","amount":7,"currency":"USD"},
          {"name":"Teams","billingCycle":"MONTHLY","amount":15,"currency":"USD"}
        ]
      },
      {
        "name": "Glide (AI & No-code Apps)",
        "category": "No-code App Builder",
        "merchantName": "Glide",
        "websiteUrl": "https://www.glideapps.com",
        "cancellationUrl": "https://www.glideapps.com/account/billing",
        "tags": ["no-code","apps","saas"],
        "plans": [
          {"name":"Basic","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":32,"currency":"USD"}
        ]
      },
      {
        "name": "Bubble",
        "category": "No-code App Builder",
        "merchantName": "Bubble",
        "websiteUrl": "https://bubble.io",
        "cancellationUrl": "https://bubble.io/account",
        "tags": ["no-code","apps","saas"],
        "plans": [
          {"name":"Hobby","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Personal","billingCycle":"MONTHLY","amount":25,"currency":"USD"}
        ]
      },
      {
        "name": "Vercel",
        "category": "Hosting / Edge / Dev",
        "merchantName": "Vercel",
        "websiteUrl": "https://vercel.com",
        "cancellationUrl": "https://vercel.com/account/billing",
        "tags": ["hosting","edge","deploy"],
        "plans": [
          {"name":"Hobby","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":20,"currency":"USD"}
        ]
      },
      {
        "name": "Netlify",
        "category": "Hosting / Dev",
        "merchantName": "Netlify",
        "websiteUrl": "https://www.netlify.com",
        "cancellationUrl": "https://app.netlify.com/account/billing",
        "tags": ["hosting","deploy","dev"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":19,"currency":"USD"}
        ]
      },
      {
        "name": "Sentry",
        "category": "Error Monitoring / Observability",
        "merchantName": "Sentry",
        "websiteUrl": "https://sentry.io",
        "cancellationUrl": "https://sentry.io/account/billing",
        "tags": ["monitoring","errors","devops"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Team","billingCycle":"MONTHLY","amount":26,"currency":"USD"}
        ]
      },
      {
        "name": "Datadog",
        "category": "Monitoring / Observability",
        "merchantName": "Datadog",
        "websiteUrl": "https://www.datadoghq.com",
        "cancellationUrl": "https://app.datadoghq.com/account/settings/billing",
        "tags": ["monitoring","metrics","logs"],
        "plans": [
          {"name":"Infrastructure","billingCycle":"MONTHLY","amount":15,"currency":"USD","description":"per host approximate"}
        ]
      },
      {
        "name": "New Relic",
        "category": "Monitoring / Observability",
        "merchantName": "New Relic",
        "websiteUrl": "https://newrelic.com",
        "cancellationUrl": "https://one.newrelic.com/billing",
        "tags": ["monitoring","apm","logs"],
        "plans": [
          {"name":"Standard","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":49,"currency":"USD"}
        ]
      },
      {
        "name": "Tableau Cloud",
        "category": "Business Intelligence",
        "merchantName": "Tableau (Salesforce)",
        "websiteUrl": "https://www.tableau.com",
        "cancellationUrl": "https://www.tableau.com/support",
        "tags": ["bi","analytics","dashboard"],
        "plans": [
          {"name":"Viewer","billingCycle":"MONTHLY","amount":12,"currency":"USD"},
          {"name":"Explorer","billingCycle":"MONTHLY","amount":42,"currency":"USD"}
        ]
      },
      {
        "name": "Looker (Google Cloud)",
        "category": "Business Intelligence",
        "merchantName": "Google Cloud",
        "websiteUrl": "https://cloud.google.com/looker",
        "cancellationUrl": "https://console.cloud.google.com/billing",
        "tags": ["bi","analytics","cloud"],
        "plans": [
          {"name":"Enterprise","billingCycle":"YEARLY","amount":0,"currency":"USD","description":"custom pricing"}
        ]
      },
      {
        "name": "Calendso / Cal.com",
        "category": "Scheduling / Open Source",
        "merchantName": "Cal.com",
        "websiteUrl": "https://cal.com",
        "cancellationUrl": "https://cal.com/account/billing",
        "tags": ["scheduling","calendar","open-source"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":12,"currency":"USD"}
        ]
      },
      {
        "name": "FeedbackPanda (example SaaS)",
        "category": "Customer Feedback / Reviews",
        "merchantName": "FeedbackPanda",
        "websiteUrl": "https://www.feedbackpanda.com",
        "cancellationUrl": "https://www.feedbackpanda.com/account/billing",
        "tags": ["feedback","reviews","saas"],
        "plans": [
          {"name":"Pro","billingCycle":"MONTHLY","amount":7,"currency":"USD"}
        ]
      },
      {
        "name": "PagerDuty",
        "category": "Incident Response / Ops",
        "merchantName": "PagerDuty",
        "websiteUrl": "https://www.pagerduty.com",
        "cancellationUrl": "https://support.pagerduty.com",
        "tags": ["ops","incident","alerts"],
        "plans": [
          {"name":"Starter","billingCycle":"MONTHLY","amount":19,"currency":"USD"},
          {"name":"Business","billingCycle":"MONTHLY","amount":39,"currency":"USD"}
        ]
      },
      {
        "name": "Snyk",
        "category": "Security / Developer Tools",
        "merchantName": "Snyk",
        "websiteUrl": "https://snyk.io",
        "cancellationUrl": "https://snyk.io/account/billing",
        "tags": ["security","vulnerability","devsecops"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":46,"currency":"USD"}
        ]
      },
      {
        "name": "GitLab",
        "category": "DevOps / Repositories",
        "merchantName": "GitLab",
        "websiteUrl": "https://gitlab.com",
        "cancellationUrl": "https://gitlab.com/-/subscriptions",
        "tags": ["git","ci","devops"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Premium","billingCycle":"MONTHLY","amount":19,"currency":"USD"}
        ]
      },
      {
        "name": "Assemble AI (example AI tool)",
        "category": "AI Orchestration",
        "merchantName": "AssembleAI",
        "websiteUrl": "https://www.assembleai.com",
        "cancellationUrl": "https://www.assembleai.com/account/billing",
        "tags": ["ai","orchestration","models"],
        "plans": [
          {"name":"Starter","billingCycle":"MONTHLY","amount":29,"currency":"USD"},
          {"name":"Team","billingCycle":"MONTHLY","amount":99,"currency":"USD"}
        ]
      },
      {
        "name": "Claude Studio (Anthropic Labs)",
        "category": "AI Tools / Studio",
        "merchantName": "Anthropic",
        "websiteUrl": "https://console.anthropic.com",
        "cancellationUrl": "https://console.anthropic.com/account/billing",
        "tags": ["ai","studio","models"],
        "plans": [
          {"name":"Usage-based","billingCycle":"MONTHLY","amount":0,"currency":"USD","description":"pay for compute"}
        ]
      },
      {
        "name": "Hugging Face",
        "category": "ML Models / Hub / API",
        "merchantName": "Hugging Face",
        "websiteUrl": "https://huggingface.co",
        "cancellationUrl": "https://huggingface.co/settings/billing",
        "tags": ["ml","models","api"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Team","billingCycle":"MONTHLY","amount":9,"currency":"USD"}
        ]
      },
      {
        "name": "Replicate",
        "category": "ML Model Hosting / API",
        "merchantName": "Replicate",
        "websiteUrl": "https://replicate.com",
        "cancellationUrl": "https://replicate.com/account/billing",
        "tags": ["models","api","ai"],
        "plans": [
          {"name":"Pay-as-you-go","billingCycle":"MONTHLY","amount":0,"currency":"USD","description":"usage-based"}
        ]
      },
      {
        "name": "Claude for Teams (Anthropic)",
        "category": "AI Assistant / Teams",
        "merchantName": "Anthropic",
        "websiteUrl": "https://www.anthropic.com/teams",
        "cancellationUrl": "https://www.anthropic.com/support",
        "tags": ["teams","ai","assistant"],
        "plans": [
          {"name":"Teams","billingCycle":"MONTHLY","amount":30,"currency":"USD","description":"per seat approximate"}
        ]
      },
      {
        "name": "DeepL Pro",
        "category": "Translation / AI",
        "merchantName": "DeepL",
        "websiteUrl": "https://www.deepl.com",
        "cancellationUrl": "https://www.deepl.com/account",
        "tags": ["translation","ai","nlp"],
        "plans": [
          {"name":"Starter","billingCycle":"MONTHLY","amount":6.99,"currency":"USD"},
          {"name":"Advanced","billingCycle":"MONTHLY","amount":39,"currency":"USD"}
        ]
      },
      {
        "name": "Riffusion",
        "category": "AI Music / Audio",
        "merchantName": "Riffusion",
        "websiteUrl": "https://www.riffusion.com",
        "cancellationUrl": "https://www.riffusion.com/account",
        "tags": ["music","audio","ai"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":8,"currency":"USD"}
        ]
      },
      {
        "name": "LALAL.AI",
        "category": "Audio Separation / AI",
        "merchantName": "LALAL.AI",
        "websiteUrl": "https://www.lalal.ai",
        "cancellationUrl": "https://www.lalal.ai/account",
        "tags": ["audio","ai","separation"],
        "plans": [
          {"name":"Pay-as-you-go","billingCycle":"MONTHLY","amount":0,"currency":"USD","description":"credit-based"}
        ]
      },
      {
        "name": "Brandwatch (example marketing SaaS)",
        "category": "Social Listening / Analytics",
        "merchantName": "Brandwatch",
        "websiteUrl": "https://www.brandwatch.com",
        "cancellationUrl": "https://www.brandwatch.com/contact",
        "tags": ["social","analytics","marketing"],
        "plans": [
          {"name":"Enterprise","billingCycle":"YEARLY","amount":0,"currency":"USD","description":"custom pricing"}
        ]
      },
      {
        "name": "Coda",
        "category": "Docs / Docs-as-apps",
        "merchantName": "Coda",
        "websiteUrl": "https://coda.io",
        "cancellationUrl": "https://coda.io/account/billing",
        "tags": ["docs","productivity","no-code"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":10,"currency":"USD"}
        ]
      },
      {
        "name": "Heap",
        "category": "Product Analytics",
        "merchantName": "Heap",
        "websiteUrl": "https://heap.io",
        "cancellationUrl": "https://heap.io/support",
        "tags": ["analytics","product","events"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Growth","billingCycle":"MONTHLY","amount":0,"currency":"USD","description":"contact sales"}
        ]
      },
      {
        "name": "Helpscout",
        "category": "Customer Support / Helpdesk",
        "merchantName": "Help Scout",
        "websiteUrl": "https://www.helpscout.com",
        "cancellationUrl": "https://secure.helpscout.net/account/billing",
        "tags": ["support","helpdesk","saas"],
        "plans": [
          {"name":"Standard","billingCycle":"MONTHLY","amount":20,"currency":"USD"},
          {"name":"Plus","billingCycle":"MONTHLY","amount":40,"currency":"USD"}
        ]
      },
      {
        "name": "Zendesk",
        "category": "Customer Support",
        "merchantName": "Zendesk",
        "websiteUrl": "https://www.zendesk.com",
        "cancellationUrl": "https://support.zendesk.com/hc/en-us",
        "tags": ["support","helpdesk","crm"],
        "plans": [
          {"name":"Suite Team","billingCycle":"MONTHLY","amount":49,"currency":"USD"}
        ]
      },
      {
        "name": "Hotjar",
        "category": "Behavior Analytics",
        "merchantName": "Hotjar",
        "websiteUrl": "https://www.hotjar.com",
        "cancellationUrl": "https://www.hotjar.com/settings/billing",
        "tags": ["analytics","heatmaps","ux"],
        "plans": [
          {"name":"Basic","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Plus","billingCycle":"MONTHLY","amount":32,"currency":"USD"}
        ]
      },
      {
        "name": "FullStory",
        "category": "Digital Experience Analytics",
        "merchantName": "FullStory",
        "websiteUrl": "https://www.fullstory.com",
        "cancellationUrl": "https://www.fullstory.com/contact",
        "tags": ["analytics","ux","session-replay"],
        "plans": [
          {"name":"Business","billingCycle":"MONTHLY","amount":0,"currency":"USD","description":"contact sales"}
        ]
      },
      {
        "name": "Intercom Articles / Support",
        "category": "Knowledge Base / Support",
        "merchantName": "Intercom",
        "websiteUrl": "https://www.intercom.com/articles",
        "cancellationUrl": "https://www.intercom.com/settings/billing",
        "tags": ["kb","support","help"],
        "plans": [
          {"name":"Support","billingCycle":"MONTHLY","amount":39,"currency":"USD"}
        ]
      },
      {
        "name": "Apollo.io",
        "category": "Sales Intelligence / Outreach",
        "merchantName": "Apollo",
        "websiteUrl": "https://www.apollo.io",
        "cancellationUrl": "https://app.apollo.io/account/billing",
        "tags": ["sales","crm","prospecting"],
        "plans": [
          {"name":"Basic","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":99,"currency":"USD"}
        ]
      },
      {
        "name": "Pipedrive",
        "category": "CRM / Sales",
        "merchantName": "Pipedrive",
        "websiteUrl": "https://www.pipedrive.com",
        "cancellationUrl": "https://www.pipedrive.com/en/account/billing",
        "tags": ["crm","sales","pipeline"],
        "plans": [
          {"name":"Essential","billingCycle":"MONTHLY","amount":14.90,"currency":"USD"},
          {"name":"Advanced","billingCycle":"MONTHLY","amount":24.90,"currency":"USD"}
        ]
      },
      {
        "name": "Calendly Teams (example)",
        "category": "Scheduling / Teams",
        "merchantName": "Calendly",
        "websiteUrl": "https://calendly.com/teams",
        "cancellationUrl": "https://calendly.com/account/billing",
        "tags": ["teams","scheduling"],
        "plans": [
          {"name":"Teams","billingCycle":"MONTHLY","amount":12,"currency":"USD"}
        ]
      },
      {
        "name": "Clearbit",
        "category": "Data Enrichment / Marketing",
        "merchantName": "Clearbit",
        "websiteUrl": "https://clearbit.com",
        "cancellationUrl": "https://clearbit.com/contact",
        "tags": ["data","enrichment","marketing"],
        "plans": [
          {"name":"Business","billingCycle":"MONTHLY","amount":0,"currency":"USD","description":"contact sales"}
        ]
      },
      {
        "name": "Hotspot (example SaaS)",
        "category": "Marketing Automation",
        "merchantName": "Hotspot",
        "websiteUrl": "https://www.hotspot.com",
        "cancellationUrl": "https://www.hotspot.com/account/billing",
        "tags": ["marketing","automation"],
        "plans": [
          {"name":"Pro","billingCycle":"MONTHLY","amount":49,"currency":"USD"}
        ]
      },
      {
        "name": "Plausible Analytics",
        "category": "Privacy-first Analytics",
        "merchantName": "Plausible",
        "websiteUrl": "https://plausible.io",
        "cancellationUrl": "https://plausible.io/account",
        "tags": ["analytics","privacy"],
        "plans": [
          {"name":"Starter","billingCycle":"MONTHLY","amount":9,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":29,"currency":"USD"}
        ]
      },
      {
        "name": "Veed.io",
        "category": "Video Editing / AI",
        "merchantName": "Veed",
        "websiteUrl": "https://www.veed.io",
        "cancellationUrl": "https://www.veed.io/account",
        "tags": ["video","editing","ai"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Pro","billingCycle":"MONTHLY","amount":18,"currency":"USD"}
        ]
      },
      {
        "name": "Paper (doc collaboration)",
        "category": "Docs / Collaboration",
        "merchantName": "Paper",
        "websiteUrl": "https://www.dropbox.com/paper",
        "cancellationUrl": "https://www.dropbox.com/account/billing",
        "tags": ["docs","collaboration"],
        "plans": [
          {"name":"Free","billingCycle":"MONTHLY","amount":0,"currency":"USD"},
          {"name":"Standard","billingCycle":"MONTHLY","amount":12.50,"currency":"USD"}
        ]
      },
      {
        "name": "Otixo (example SaaS)",
        "category": "Cloud File Management",
        "merchantName": "Otixo",
        "websiteUrl": "https://www.otixo.com",
        "cancellationUrl": "https://www.otixo.com/account",
        "tags": ["files","cloud","saas"],
        "plans": [
          {"name":"Pro","billingCycle":"MONTHLY","amount":6.99,"currency":"USD"}
        ]
      },
      {
        "name": "Confluence (Atlassian)",
        "category": "Docs / Knowledge Base",
        "merchantName": "Atlassian",
        "websiteUrl": "https://www.atlassian.com/software/confluence",
        "cancellationUrl": "https://id.atlassian.com/manage-profile",
        "tags": ["docs","kb","collaboration"],
        "plans": [
          {"name":"Standard","billingCycle":"MONTHLY","amount":5.75,"currency":"USD"},
          {"name":"Premium","billingCycle":"MONTHLY","amount":10.50,"currency":"USD"}
        ]
      },
      {
        "name": "Screencast-O-Matic",
        "category": "Screen Recording",
        "merchantName": "Screencast-O-Matic",
        "websiteUrl": "https://screencast-o-matic.com",
        "cancellationUrl": "https://screencast-o-matic.com/account",
        "tags": ["video","screen-record"],
        "plans": [
          {"name":"Deluxe","billingCycle":"YEARLY","amount":1.65,"currency":"USD","description":"per month billed yearly"}
        ]
      },
      {
        "name": "Rebrandly",
        "category": "Link Management / Branding",
        "merchantName": "Rebrandly",
        "websiteUrl": "https://www.rebrandly.com",
        "cancellationUrl": "https://app.rebrandly.com/account/billing",
        "tags": ["links","branding","url"],
        "plans": [
          {"name":"Starter","billingCycle":"MONTHLY","amount":29,"currency":"USD"}
        ]
      },
      {
        "name": "Airbyte Cloud",
        "category": "Data Integration / ETL",
        "merchantName": "Airbyte",
        "websiteUrl": "https://airbyte.com",
        "cancellationUrl": "https://cloud.airbyte.com/account/billing",
        "tags": ["data","etl","integration"],
        "plans": [
          {"name":"Pay-as-you-go","billingCycle":"MONTHLY","amount":0,"currency":"USD","description":"usage-based"}
        ]
      },
      {
        "name": "Fathom",
        "category": "Meeting Notes / AI",
        "merchantName": "Fathom",
        "websiteUrl": "https://fathom.video",
        "cancellationUrl": "https://fathom.video/settings/billing",
        "tags": ["meetings","ai","notes"],
        "plans": [
          {"name":"Pro","billingCycle":"MONTHLY","amount":18,"currency":"USD"}
        ]
      },
      {
        "name": "Vero (example SaaS)",
        "category": "Customer Messaging / Email",
        "merchantName": "Vero",
        "websiteUrl": "https://www.getvero.com",
        "cancellationUrl": "https://app.getvero.com/account/billing",
        "tags": ["email","marketing"],
        "plans": [
          {"name":"Growth","billingCycle":"MONTHLY","amount":50,"currency":"USD"}
        ]
      },
      {
        "name": "PlayHT",
        "category": "Text-to-Speech / AI",
        "merchantName": "Play.ht",
        "websiteUrl": "https://play.ht",
        "cancellationUrl": "https://play.ht/account/billing",
        "tags": ["tts","audio","ai"],
        "plans": [
          {"name":"Hobby","billingCycle":"MONTHLY","amount":14,"currency":"USD"},
          {"name":"Enterprise","billingCycle":"YEARLY","amount":0,"currency":"USD","description":"custom"}
        ]
      }
    ]
    
  