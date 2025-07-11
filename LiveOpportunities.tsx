

import React, { useState, useEffect, useCallback } from 'react';
import { fetchLiveOpportunities, saveUserOpportunity } from '../services/nexusService';
import type { LiveOpportunityItem, SymbiosisContext, FeedPost } from '../types';
import { InfoCard } from './common/InfoCard';
import { PlusCircleIcon, GeospatialIcon, ShieldCheckIcon, BookmarkIcon, BriefcaseIcon } from './Icons';
import { Loader } from './common/Loader';
import { AddOpportunityModal } from './AddOpportunityModal';
import { RegionalSnapshot } from './RegionalSnapshot';
import { DataFeedItem } from './DataFeedItem';
import { Card } from './common/Card';

interface LiveOpportunitiesProps {
    onAnalyze: (item: LiveOpportunityItem) => void;
    onStartSymbiosis: (context: SymbiosisContext) => void;
}

const ConnectionGuide: React.FC = () => (
    <Card className="bg-red-900/30 border-2 border-nexus-error/80 p-6 text-amber-200 mb-6 shadow-lg shadow-red-900/30">
      <h3 className="text-xl font-bold text-white flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
        Action Required: Connection Failure
      </h3>
      <p className="mt-3 text-red-200">The application is running in <strong className="font-bold">offline/fallback mode</strong> because it failed to connect to the live AI service.</p>
      <p className="mt-1 text-red-200">This typically happens when the server-side component of the application is unresponsive or not configured correctly. The most common cause is a missing API Key.</p>
      
      <div className="mt-4 p-4 bg-nexus-bg/60 rounded-lg border border-nexus-error/50">
        <h4 className="font-semibold text-white">How to Fix This:</h4>
        <p className="text-sm text-amber-100 mt-2">The application administrator must configure the backend service with a valid API Key. This is done by setting a server-side environment variable.</p>
        <ol className="list-decimal list-inside mt-2 space-y-2 text-sm text-red-200">
          <li>Access the hosting environment where the application's server-side code (the `api` directory) is running.</li>
          <li>In the environment variable settings for your service, add a new variable.</li>
          <li className="p-3 my-2 bg-nexus-surface rounded-md font-mono text-amber-200 border border-amber-500/50">
            <div><strong>Variable Name:</strong> <code className="bg-nexus-bg text-white px-2 py-1 rounded">API_KEY</code></div>
            <div className="mt-2"><strong>Variable Value:</strong> <code className="bg-nexus-bg text-white px-2 py-1 rounded">[Your Google Gemini API Key]</code></div>
          </li>
          <li>Save the changes and restart or redeploy the server to apply the new environment variable.</li>
          <li>Once the key is correctly set, the application will connect to the live data feed automatically.</li>
        </ol>
         <div className="mt-4 pt-3 border-t border-nexus-error/40">
          <h5 className="font-semibold text-amber-100">Need help?</h5>
          <p className="text-sm text-red-200 mt-1">
            Here are guides for setting environment variables on popular hosting platforms:
          </p>
          <div className="mt-2 flex flex-wrap gap-4 text-sm">
            <a href="https://vercel.com/docs/projects/environment-variables" target="_blank" rel="noopener noreferrer" className="font-semibold text-amber-200 hover:text-white underline">Vercel</a>
            <a href="https://docs.netlify.com/environment-variables/overview/" target="_blank" rel="noopener noreferrer" className="font-semibold text-amber-200 hover:text-white underline">Netlify</a>
            <a href="https://cloud.google.com/run/docs/configuring/environment-variables" target="_blank" rel="noopener noreferrer" className="font-semibold text-amber-200 hover:text-white underline">Google Cloud Run</a>
            <a href="https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html#environment-variables" target="_blank" rel="noopener noreferrer" className="font-semibold text-amber-200 hover:text-white underline">AWS Amplify</a>
          </div>
        </div>
      </div>
    </Card>
);

const IntelligenceToolItem: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1 text-nexus-secondary">{icon}</div>
        <div>
            <h4 className="font-bold text-nexus-text-primary">{title}</h4>
            <p className="text-sm text-nexus-text-secondary">{children}</p>
        </div>
    </div>
);


export const LiveOpportunities: React.FC<LiveOpportunitiesProps> = ({ onAnalyze, onStartSymbiosis }) => {
    const [feed, setFeed] = useState<FeedPost[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [isMockData, setIsMockData] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const loadFeed = useCallback(async (forceRefresh = false) => {
        setStatus('loading');
        setError(null);
        try {
            const apiResult = await fetchLiveOpportunities();
            if (apiResult && Array.isArray(apiResult.feed)) {
                const sortedFeed = apiResult.feed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                setFeed(sortedFeed);
                setIsMockData(apiResult.isMockData || false);
                setStatus('success');
            } else {
                throw new Error("Invalid data format received from the server.");
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
            setError(errorMessage);
            setStatus('error');
            // When an error occurs, we are implicitly using mock data.
            setIsMockData(true);
            console.error("Failed to load live feed:", e);
        }
    }, []);

    useEffect(() => {
        loadFeed();
    }, [loadFeed]);

    const handleAddOpportunity = (item: Omit<LiveOpportunityItem, 'isUserAdded' | 'ai_feasibility_score' | 'ai_risk_assessment'>) => {
        saveUserOpportunity(item);
        setIsAddModalOpen(false);
        loadFeed(true); // Reload to show the new item
    };

    return (
        <div className="p-4 md:p-8 flex flex-col gap-6 text-nexus-text-secondary">
            <header className="max-w-screen-xl w-full mx-auto">
                <div className="flex flex-wrap gap-4 justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-extrabold text-nexus-text-primary tracking-tighter">Global Data Hub</h2>
                        <p className="text-nexus-text-secondary mt-2 max-w-3xl">A real-time intelligence feed for regional development, opportunities, and market signals.</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-gradient-to-r from-nexus-success to-teal-500 text-white font-bold py-2 px-5 rounded-lg hover:opacity-90 transition-all shadow-lg shadow-nexus-success/20 flex items-center gap-2"
                    >
                        <PlusCircleIcon className="w-6 h-6" />
                        List Your Project
                    </button>
                </div>
            </header>

            <main className="flex-grow max-w-screen-xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- Main Content: Feed --- */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {(isMockData || status === 'error') && <ConnectionGuide />}
                    {status === 'loading' && <Loader message="Loading Global Intelligence Feed..." />}
                    
                    {status === 'success' && feed.length > 0 && (
                        <div className="space-y-6">
                            {feed.map((post) => (
                                <DataFeedItem 
                                    key={post.id} 
                                    post={post}
                                    onAnalyze={onAnalyze} 
                                    onStartSymbiosis={onStartSymbiosis}
                                />
                            ))}
                        </div>
                    )}

                    {status === 'success' && feed.length === 0 && !isMockData &&
                        <div className="text-center text-gray-500 p-8 border-2 border-dashed border-slate-700 rounded-xl">
                            No active items in the feed. You can be the first to list a project.
                        </div>
                    }
                </div>

                {/* --- Sidebar: Analytics & Tools --- */}
                <aside className="lg:col-span-1 flex flex-col gap-6">
                    <InfoCard title="Regional Opportunity Snapshot">
                        <RegionalSnapshot feed={feed} />
                    </InfoCard>
                     <InfoCard title="Intelligence Tools">
                         <div className="p-4 space-y-5">
                            <IntelligenceToolItem icon={<GeospatialIcon className="w-6 h-6"/>} title="Geospatial Intel">
                                Access satellite imagery, infrastructure mapping, and climate data to visualize on-the-ground conditions.
                            </IntelligenceToolItem>
                            <IntelligenceToolItem icon={<BookmarkIcon className="w-6 h-6"/>} title="My Watchlist">
                                Save items from the feed for quick access and to build a portfolio of interests.
                            </IntelligenceToolItem>
                             <IntelligenceToolItem icon={<BriefcaseIcon className="w-6 h-6" />} title="Competitor Analysis">
                                Build and monitor a watchlist of competitor companies or peer regions to track their activities and strategies.
                            </IntelligenceToolItem>
                         </div>
                    </InfoCard>
                </aside>
            </main>

            {isAddModalOpen && (
                <AddOpportunityModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSave={handleAddOpportunity}
                />
            )}
        </div>
    );
};