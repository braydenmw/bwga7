
import type { ReportParameters, SymbiosisContext, ChatMessage, LetterRequest, LiveOpportunityItem, LiveOpportunitiesResponse, UserProfile, FeedPost } from "../types";
import { MOCK_OPPORTUNITIES } from "../data/mockOpportunities";

// --- Timeout Wrapper ---
async function fetchWithTimeout(resource: RequestInfo | URL, options: RequestInit & { timeout?: number } = {}) {
    const { timeout = 20000 } = options; // 20 second default timeout
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal  
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new Error('The request timed out. The server is unresponsive, which is likely due to a missing API Key in the server environment.');
        }
        throw error;
    }
}


// --- API Wrapper ---
async function apiCall(action: string, payload?: any) {
    const response = await fetchWithTimeout('/api/nexus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`API Error (${response.status}): ${errorBody.message || 'Unknown server error'}`);
    }

    return response;
}

// --- API FUNCTIONS ---

export async function* generateStrategicReport(params: ReportParameters): AsyncGenerator<string> {
    const response = await apiCall('generateStrategicReport', params);
    const body = response.body;
    if (!body) throw new Error("Response body is null");

    const reader = body.getReader();
    const decoder = new TextDecoder();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield decoder.decode(value);
    }
}

export async function* generateAnalysisStream(item: LiveOpportunityItem, region: string): AsyncGenerator<string, void, undefined> {
    const response = await apiCall('generateAnalysis', { item, region });
    const body = response.body;
    if (!body) throw new Error("Response body is null");

    const reader = body.getReader();
    const decoder = new TextDecoder();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield decoder.decode(value, { stream: true });
    }
}

export async function fetchSymbiosisResponse(context: SymbiosisContext, history: ChatMessage[]): Promise<string> {
    try {
        const response = await apiCall('fetchSymbiosisResponse', { context, history });
        const data = await response.json();
        return data.text;
    } catch (error: any) {
        console.error("Symbiosis response error:", error);
        throw new Error(error.message || "Failed to get response from Symbiosis AI.");
    }
}

export async function generateOutreachLetter(request: LetterRequest): Promise<string> {
    const response = await apiCall('generateOutreachLetter', request);
    const data = await response.json();
    return data.text;
}


// --- USER PROFILE FUNCTIONS ---
const USER_PROFILE_KEY = 'nexus_user_profile';

export function getUserProfile(): UserProfile | null {
    try {
        const stored = localStorage.getItem(USER_PROFILE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to parse user profile from localStorage", e);
        localStorage.removeItem(USER_PROFILE_KEY);
    }
    return null;
}

export function saveUserProfile(profile: UserProfile) {
    try {
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
        console.error("Failed to save user profile to localStorage", e);
    }
}


// --- USER OPPORTUNITY FUNCTIONS ---
const USER_OPPORTUNITIES_KEY = 'nexus_user_opportunities';

export function getUserOpportunities(): LiveOpportunityItem[] {
    try {
        const stored = localStorage.getItem(USER_OPPORTUNITIES_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to parse user opportunities from localStorage", e);
        localStorage.removeItem(USER_OPPORTUNITIES_KEY);
    }
    return [];
}

export function saveUserOpportunity(newItem: Omit<LiveOpportunityItem, 'isUserAdded' | 'ai_feasibility_score' | 'ai_risk_assessment'>) {
    const allItems = getUserOpportunities();
    const itemToAdd: LiveOpportunityItem = {
        ...newItem,
        isUserAdded: true,
    };
    allItems.unshift(itemToAdd); // Add to the beginning
    try {
        localStorage.setItem(USER_OPPORTUNITIES_KEY, JSON.stringify(allItems));
    } catch (e) {
        console.error("Failed to save user opportunity to localStorage", e);
    }
}


// --- CACHED FUNCTIONS ---

const CITIES_CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function fetchRegionalCities(country: string): Promise<string[]> {
    const cacheKey = `cities_cache_${country}`;

    try {
        const cachedDataString = localStorage.getItem(cacheKey);
        if (cachedDataString) {
            const cachedData = JSON.parse(cachedDataString);
            const cacheAge = new Date().getTime() - new Date(cachedData.timestamp).getTime();
            if (cachedData && Array.isArray(cachedData.cities) && cacheAge < CITIES_CACHE_DURATION_MS) {
                return cachedData.cities;
            }
        }
    } catch (e) {
        console.warn("Could not read city cache. Proceeding with API call.", e);
    }
    
    try {
        const response = await apiCall('getRegionalCities', country);
        const cities = await response.json();

        if (!Array.isArray(cities)) throw new Error("API returned non-array data for cities.");

        const dataToCache = { cities, timestamp: new Date().toISOString() };
        localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        return cities;

    } catch (apiError) {
        console.warn(`API call failed for cities in ${country}. Attempting to load from fallback cache.`, apiError);
        
        try {
            const cachedDataString = localStorage.getItem(cacheKey);
            if (cachedDataString) {
                const cachedData = JSON.parse(cachedDataString);
                if (cachedData && Array.isArray(cachedData.cities)) {
                    return cachedData.cities;
                }
            }
        } catch (cacheError) {
            console.error("Failed to read from fallback city cache:", cacheError);
        }
        
        throw new Error(`Could not fetch cities for ${country}. The AI service may be unavailable or rate-limited.`);
    }
}


const convertUserOpportunityToFeedPost = (item: LiveOpportunityItem, index: number): FeedPost => ({
    id: `user-${item.project_name.replace(/\s+/g, '')}-${index}`,
    timestamp: new Date().toISOString(),
    type: 'opportunity',
    content: item,
});

export async function fetchLiveOpportunities(): Promise<LiveOpportunitiesResponse> {
    try {
        const response = await apiCall('fetchLiveOpportunities');
        const result = await response.json();
        
        const userItems = getUserOpportunities().map(convertUserOpportunityToFeedPost);
        const combinedFeed = [...userItems, ...(result.feed || [])];

        return { feed: combinedFeed, isMockData: result.isMockData || false };

    } catch (apiError: any) {
        console.warn(`LIVE API FAILED: ${apiError.message}. Serving mock data as a fallback. Please ensure your API_KEY is correctly configured in your environment variables.`);
        const userItems = getUserOpportunities().map(convertUserOpportunityToFeedPost);
        const combinedFeed = [...userItems, ...(MOCK_OPPORTUNITIES.feed || [])];
        return { feed: combinedFeed, isMockData: true };
    }
}