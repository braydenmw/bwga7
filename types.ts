


export interface UserProfile {
  userName: string;
  userType: UserType;
  userDepartment: string;
  userCountry: string;
}


export enum MarketAnalysisTier {
  ECONOMIC_SNAPSHOT = "Tier A: Economic Snapshot",
  COMPETITIVE_LANDSCAPE = "Tier B: Competitive Landscape",
  INVESTMENT_DEEP_DIVE = "Tier C: Investment Deep-Dive",
}

export enum PartnerFindingTier {
  PARTNERSHIP_BLUEPRINT = "Tier 1: Partnership Blueprint",
  TRANSFORMATION_SIMULATOR = "Tier 2: Transformation Simulator",
  VALUATION_RISK = "Tier 4: Valuation & Risk Assessment",
}

export type ReportTier = MarketAnalysisTier | PartnerFindingTier;

export type UserType = 'government' | 'non-government';

export interface TierDetail {
  tier: ReportTier;
  brief: string;
  fullDescription: string;
  cost: string;
  pageCount: string;
  keyDeliverables: (string | { subItem: string })[];
  idealFor: string;
}

export type ReportOption = 
    | 'economic_impact'
    | 'geospatial'
    | 'investment_proposal'
    | 'project_metrics'
    | 'competitive_intel'
    | 'trade_flow';

export interface ReportOptionDetail {
    id: ReportOption;
    title: string;
    description: string;
    cost: string;
}

// Unified Report Parameters
export interface ReportParameters {
  userName: string;
  userType: UserType;
  userDepartment: string;
  userCountry: string;
  customObjective: string;
  industry: string;
  region: string;
  tier: ReportTier;
  // Matchmaking-related fields, now optional
  companySize?: string;
  keyTechnologies?: string[];
  targetMarket?: string[];
  // New options field
  selectedOptions: ReportOption[];
}


export interface LetterRequest {
  reportParameters: ReportParameters; // Now uses the unified type
  reportContent: string;
}

// --- Nexus Symbiosis™ Types ---
export interface SymbiosisContext {
  topic: string; 
  originalContent: string;
  reportParameters?: ReportParameters;
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}

// --- Live Opportunities & Analysis Types ---
export interface LiveOpportunityItem {
  project_name: string;
  country: string;
  sector: string;
  value: string;
  summary: string;
  source_url: string;
  ai_feasibility_score?: number;
  ai_risk_assessment?: string;
  isUserAdded?: boolean;
}

// --- New Global Data Hub Feed Types ---

export interface NewsContent {
    headline: string;
    source: string;
    summary: string;
    link: string;
    region: string;
}

export interface IndicatorContent {
    name: string;
    value: string;
    change: number; // e.g., 0.5 for +0.5%, -0.2 for -0.2%
    region: string;
}

export type FeedPost = {
    id: string;
    timestamp: string; // ISO 8601 format
    type: 'opportunity' | 'news' | 'indicator';
    content: LiveOpportunityItem | NewsContent | IndicatorContent;
};

export interface LiveOpportunitiesResponse {
  feed: FeedPost[];
  isMockData?: boolean;
}


export type View = 'mission' | 'manual' | 'opportunities' | 'report' | 'compliance';