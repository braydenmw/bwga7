


import type { TierDetail, ReportOptionDetail } from './types';
import { MarketAnalysisTier, PartnerFindingTier } from './types';

export const INDUSTRIES = [
  "Advanced Manufacturing & Robotics",
  "Agriculture & Aquaculture Technology (AgriTech)",
  "Artificial Intelligence (AI) & Machine Learning",
  "Biotechnology & Life Sciences",
  "Clean Technology & Renewable Energy",
  "Critical Minerals & Rare Earth Elements",
  "Cybersecurity",
  "Digital Infrastructure (Data Centers, 5G)",
  "Financial Technology (FinTech)",
  "Logistics & Supply Chain Tech",
  "Medical Technology & Healthcare Innovation",
  "Space Technology & Exploration",
  "Sustainable Materials",
  "Water Technology & Management",
];

export const COUNTRIES = [
  "Australia", "Brazil", "Canada", "Chile", "Egypt", "Estonia",
  "Finland", "Germany", "Ghana", "India", "Indonesia", "Israel",
  "Japan", "Kenya", "Malaysia", "Mexico", "Morocco", "Netherlands",
  "New Zealand", "Nigeria", "Norway", "Oman", "Philippines", "Poland",
  "Portugal", "Qatar", "Rwanda", "Saudi Arabia", "Singapore",
  "South Africa", "South Korea", "Spain", "Sweden", "Switzerland",
  "Taiwan", "Tanzania", "Thailand", "Turkey", "United Arab Emirates",
  "United Kingdom", "United States", "Uruguay", "Vietnam"
];

export const GOVERNMENT_DEPARTMENTS = [
    "Department of Trade & Industry",
    "Foreign Affairs / State Department",
    "Economic Development Agency",
    "Investment Promotion Agency",
    "Department of Agriculture",
    "Department of Science & Technology",
    "National Security Council",
    "Other"
];

export const NON_GOV_ORG_TYPES = [
    "Private Corporation",
    "Investment Firm / Venture Capital",
    "Industry Association / Chamber of Commerce",
    "Research Institute / Academia",
    "Consulting Firm",
    "Non-Profit / NGO",
    "Other"
];


export const COMPANY_SIZES = [
    "Startup (1-50 employees)",
    "Small-Medium Enterprise (51-500 employees)",
    "Large Corporation (501-5000 employees)",
    "Multinational (5000+ employees)"
];

export const KEY_TECHNOLOGIES = [
    "AI/ML Platforms",
    "IoT & Edge Computing",
    "Blockchain & DLT",
    "Advanced Materials",
    "Robotics & Automation",
    "Gene Editing/CRISPR",
    "Quantum Computing",
    "5G/6G Communications",
    "Battery & Energy Storage",
    "Carbon Capture, Utilization, and Storage (CCUS)",
    "Precision Agriculture",
    "Digital Twin Technology"
];

export const TARGET_MARKETS = [
    "Developed Economies (e.g., North America, Western Europe)",
    "Emerging Asia (e.g., Southeast Asia, India)",
    "Latin America",
    "Middle East & North Africa (MENA)",
    "Sub-Saharan Africa",
    "Global/Any",
];

export const GLOBAL_REGIONS = [
    "Global",
    "North America",
    "Europe",
    "Asia-Pacific",
    "Latin America",
    "Middle East & Africa",
];

export const DASHBOARD_CATEGORIES = [
  "Geopolitical Shifts",
  "Technology Breakthroughs",
  "Supply Chain Disruptions",
  "Market Entry Signals"
];


export const MARKET_ANALYSIS_TIER_DETAILS: TierDetail[] = [
    {
        tier: MarketAnalysisTier.ECONOMIC_SNAPSHOT,
        brief: "A high-level quantitative look at a region's core industrial strengths.",
        fullDescription: "This foundational report utilizes Location Quotient (LQ) analysis, a standard economic development metric, to provide a quantitative measure of an industry's concentration in your region compared to a national average. Our AI engine synthesizes public data to give you a quick, data-driven baseline of your region's key industrial specializations. It’s the first step to understanding your economic DNA.",
        cost: "R&D Phase: $150",
        pageCount: "Approx. 5 pages",
        keyDeliverables: [
            "Location Quotient (LQ) Analysis for chosen industry",
            "Interpretation of regional specialization",
            "Identification of core economic strengths",
            "Data visualization of LQ score",
        ],
        idealFor: "Initial discovery and quickly validating assumptions about a region's industrial base."
    },
    {
        tier: MarketAnalysisTier.COMPETITIVE_LANDSCAPE,
        brief: "Reveals if your region is winning or losing against its peers and why.",
        fullDescription: "Building on the Snapshot, this report incorporates a powerful Shift-Share Analysis to dissect your region's employment growth. Our AI determines if job creation is driven by broad national trends, the specific mix of industries you have, or true local competitive advantages. This methodology reveals the 'why' behind your economic performance and informs competitive strategy.",
        cost: "R&D Phase: $400",
        pageCount: "Approx. 15 pages",
        keyDeliverables: [
            { subItem: "Everything in Snapshot, PLUS:" },
            "Shift-Share Analysis",
            "Decomposition of growth (National, Industry, Competitive)",
            "Analysis of regional outperformance/underperformance",
            "Strategic insights for policy focus",
        ],
        idealFor: "Formulating competitive strategy and understanding the 'why' behind regional economic performance."
    },
     {
        tier: MarketAnalysisTier.INVESTMENT_DEEP_DIVE,
        brief: "Pinpoints specific, actionable investment opportunities within a sector.",
        fullDescription: "Our most comprehensive market analysis integrates LQ and Shift-Share with an Industrial Cluster Analysis. The AI maps your entire industry ecosystem, identifying 'anchor' firms and, critically, uncovering supply chain gaps that represent prime, actionable investment targets. This report transforms broad analysis into a specific list of data-validated opportunities to present to investors.",
        cost: "R&D Phase: $700",
        pageCount: "Approx. 30 pages",
        keyDeliverables: [
            { subItem: "Everything in Landscape, PLUS:" },
            "Industrial Cluster & Ecosystem Mapping",
            "Identification of 'Anchor Industries'",
            "Pinpointed Supply Chain Gaps",
            "Actionable list of investment opportunities",
        ],
        idealFor: "Investment promotion agencies and strategic planners seeking specific, data-validated opportunities to present to investors."
    },
];

export const PARTNER_FINDING_TIER_DETAILS: TierDetail[] = [
    {
        tier: PartnerFindingTier.PARTNERSHIP_BLUEPRINT,
        brief: "A vetted shortlist of up to 3 potential private sector partners with deeper synergy analysis.",
        fullDescription: "The Partnership Blueprint leverages our AI's core intelligence engine to build a robust case for private sector engagement. It provides a vetted shortlist of potential partners, synthesizing market data and your objectives to generate detailed synergy analyses and preliminary risk maps. This process is adapted from corporate strategy frameworks for public-private partnership evaluation.",
        cost: "R&D Phase: $550",
        pageCount: "Approx. 20 pages",
        keyDeliverables: [
            "Vetted shortlist of up to 3 companies",
            "In-Depth Synergy Analysis for each",
            "Preliminary Risk Map (Opportunities, Cautions, Risks)",
            "Sector-Specific Ecosystem Analysis for your region",
            "NSIL Interactive Report",
        ],
        idealFor: "Economic development agencies needing a list of viable, pre-vetted private sector partners for a specific regional initiative."
    },
     {
        tier: PartnerFindingTier.TRANSFORMATION_SIMULATOR,
        brief: "A deep dive on the #1 matched partner, including economic impact modeling AND the new 'Nexus Future-Cast Scenarios'.",
        fullDescription: "This premium tier focuses on the top-matched partner, applying economic impact modeling to simulate effects on your region's economy. The AI also generates 'Nexus Future-Cast Scenarios™'—a dynamic strategic playbook modeling plausible futures based on geopolitical and market shifts, combining predictive analytics with strategic planning frameworks.",
        cost: "R&D Phase: $850",
        pageCount: "Approx. 40 pages",
        keyDeliverables: [
            { subItem: "Everything in Blueprint, PLUS:" },
            "Deep dive analysis on the #1 ranked partner",
            "Economic Impact Modeling for your region",
            "Nexus Future-Cast Scenarios™",
            "Advanced Infrastructure & Logistics Audit",
            "ESG & Climate Resilience Due Diligence",
        ],
        idealFor: "Government bodies planning significant, long-term strategic initiatives requiring a full-spectrum analysis of risks and opportunities under various future conditions."
    },
    {
        tier: PartnerFindingTier.VALUATION_RISK,
        brief: "Deep-dive due diligence on a top-matched company, focusing on valuation, risk, and reputational factors.",
        fullDescription: "The ultimate due diligence tool. This report provides a deep-dive financial and non-financial risk assessment on a single, top-tier matched company. Our AI engine conducts an adverse media scan, maps geopolitical exposures, and analyzes financial health to provide a comprehensive partnership viability score, adapted from investment banking and corporate risk management best practices.",
        cost: "R&D Phase: $1,200",
        pageCount: "Approx. 30 pages",
        keyDeliverables: [
            "In-depth Single-Company Financial Health Assessment",
            "Reputational & Media Risk Analysis (Adverse Media Scan)",
            "Geopolitical & Regulatory Exposure Mapping",
            "Final Partnership Viability Score & Recommendation"
        ],
        idealFor: "Final-stage due diligence, de-risking major investment decisions, and for board-level or investment committee presentations."
    }
];

export const REPORT_OPTIONS: ReportOptionDetail[] = [
    {
        id: 'economic_impact',
        title: 'Economic Impact Modeling',
        description: 'An input-output analysis to model the ripple effects of a potential investment, estimating impacts on jobs, GDP, and related industries.',
        cost: 'R&D Phase: $10'
    },
    {
        id: 'geospatial',
        title: 'Geospatial Intelligence Layer',
        description: 'Interactive mapping of critical infrastructure, supply chains, and workforce distribution to visualize assets and bottlenecks.',
        cost: 'R&D Phase: $10'
    },
    {
        id: 'investment_proposal',
        title: 'AI-Powered Investment Proposal',
        description: 'Generates a data-driven proposal template tailored to an investment opportunity, highlighting ROI and strategic alignment.',
        cost: 'R&D Phase: $10'
    },
    {
        id: 'project_metrics',
        title: 'Project Success Metrics',
        description: 'Defines and tracks key performance indicators for development projects, creating a dashboard for monitoring progress and outcomes.',
        cost: 'R&D Phase: $10'
    },
    {
        id: 'competitive_intel',
        title: 'Competitive Intelligence Scan',
        description: 'Analyzes peer regions or competitor companies, benchmarking strengths and weaknesses to identify strategic gaps and opportunities.',
        cost: 'R&D Phase: $10'
    },
    {
        id: 'trade_flow',
        title: 'Global Trade Flow Analysis',
        description: 'Monitors import/export patterns for key commodities related to the target industry, identifying supply chain shifts and market trends.',
        cost: 'R&D Phase: $10'
    },
];