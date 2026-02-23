export const SCHEDULE_URL = "https://www.eagleworksai.com/schedule-a-call";

export const SCAN_STEPS = [
  "Searching for businesses in your market area…",
  "Scanning competitor websites and service pages…",
  "Pulling Google and Yelp ratings…",
  "Analyzing service offerings and pricing…",
  "Building your competitor list…",
];

export const ANALYSIS_STEPS = [
  "Deep-scanning competitor websites…",
  "Extracting pricing and service details…",
  "Analyzing online reputation and reviews…",
  "Comparing positioning and messaging…",
  "Identifying service gaps and opportunities…",
  "Evaluating digital presence strength…",
  "Scoring competitive threats…",
  "Generating strategic insights…",
];

export const SERVICE_IDEAS = [
  { icon: "📊", title: "Competitor Price Tracking", desc: "Automatically monitor competitor pricing changes across websites. Get alerts when someone undercuts you or raises rates." },
  { icon: "⭐", title: "Review Monitoring & Alerts", desc: "Track new reviews across Google, Yelp, and industry sites for you and every competitor. Know when sentiment shifts." },
  { icon: "🔍", title: "Lead Source Intelligence", desc: "Scrape and analyze where your competitors' leads come from — ad platforms, directories, referral sources — and find gaps." },
  { icon: "📋", title: "Vendor & Supplier Monitoring", desc: "Track vendor pricing, availability, and compliance across multiple suppliers. Automated alerts when terms change." },
  { icon: "🏢", title: "Franchise Consistency Audits", desc: "Automated checks across franchise locations — website accuracy, pricing consistency, brand compliance, review scores." },
  { icon: "💼", title: "Job Posting Tracker", desc: "Monitor competitor hiring activity to detect expansion, new service lines, or leadership changes before they're announced." },
  { icon: "📰", title: "Industry News & Regulatory Tracker", desc: "Aggregate news, regulatory updates, and market shifts from dozens of sources into one daily or weekly briefing." },
  { icon: "📈", title: "Market Benchmarking Reports", desc: "Periodic deep-dives comparing your business against industry benchmarks — pricing, services, digital presence, growth signals." },
];

export const PRICING_TIERS = [
  {
    name: "One-Time Report",
    price: "$50",
    desc: "Complete competitive analysis delivered as an interactive dashboard + spreadsheet",
    features: ["5-10 competitors analyzed", "Pricing & service comparison", "Online reputation audit", "Strategic recommendations", "Interactive HTML dashboard", "Excel data workbook"],
    cta: "Get Your Report",
    highlight: false,
  },
  {
    name: "Monthly Monitoring",
    price: "$40/mo",
    desc: "Ongoing competitive intelligence with automated change detection",
    features: ["Everything in One-Time Report", "Monthly re-scan of all competitors", "Change log with severity ratings", "Automated alerts on key changes", "Trend tracking over time", "Monthly strategy brief"],
    cta: "Start Monitoring",
    highlight: true,
  },
  {
    name: "Custom Build",
    price: "Custom Quote",
    desc: "We build the exact intelligence system your business needs",
    features: ["Custom data sources & scraping", "Tailored analysis framework", "Client-facing dashboards", "API integrations with your tools", "Automated workflows & alerts", "Ongoing support & iteration"],
    cta: "Let's Talk",
    highlight: false,
  },
];
