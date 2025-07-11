import React, { useState } from 'react';
import type { FeedPost, LiveOpportunityItem, NewsContent, IndicatorContent, SymbiosisContext } from '../types';
import { BriefcaseIcon, MegaphoneIcon, ChartBarIcon, ExternalLinkIcon, SymbiosisIcon, AnalyzeIcon, ArrowUpIcon, ArrowDownIcon, BookmarkIcon } from './Icons';
import { Card } from './common/Card';

const timeAgo = (dateString: string) => {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (isNaN(seconds) || seconds < 0) return 'Just now';

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    } catch (error) {
        return 'Recently';
    }
};

interface DataFeedItemProps {
    post: FeedPost;
    onAnalyze: (item: LiveOpportunityItem) => void;
    onStartSymbiosis: (context: SymbiosisContext) => void;
}

const ActionButton: React.FC<{ onClick: (e: React.MouseEvent) => void; title: string; children: React.ReactNode; className?: string }> = ({ onClick, title, children, className = '' }) => (
    <button 
        onClick={onClick} 
        title={title}
        className={`p-1.5 text-nexus-text-secondary hover:text-nexus-secondary rounded-md hover:bg-nexus-surface transition-colors ${className}`}
    >
        {children}
    </button>
);

const OpportunityCard: React.FC<{ content: LiveOpportunityItem; onAnalyze: DataFeedItemProps['onAnalyze']; onStartSymbiosis: DataFeedItemProps['onStartSymbiosis'] }> = ({ content, onAnalyze, onStartSymbiosis }) => {
    const isUserAdded = content.isUserAdded;
    const [isSaved, setIsSaved] = useState(false);

    const handleSymbiosisClick = (event: React.MouseEvent, topic: string, originalContent: string) => {
        event.stopPropagation();
        onStartSymbiosis({ topic, originalContent });
    };

    const getScoreColor = (score: number) => {
        if (score >= 75) return 'text-nexus-success';
        if (score >= 50) return 'text-yellow-400';
        return 'text-nexus-error';
    };

    return (
        <div>
            <div className="flex justify-between items-start gap-4">
                <div className="flex-grow">
                    <h4 className="font-bold text-nexus-text-primary">{content.project_name}</h4>
                    <div className="text-xs text-nexus-text-secondary mt-1 flex items-center flex-wrap gap-x-2">
                        <span>{content.country}</span><span className="text-nexus-text-muted">&bull;</span>
                        <span>{content.sector}</span><span className="text-nexus-text-muted">&bull;</span>
                        <span className="font-semibold text-nexus-text-primary">{content.value}</span>
                    </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                    {isUserAdded ? (
                        <div className="px-2 py-1 text-xs font-semibold text-amber-300 bg-nexus-accent/10 border border-nexus-accent/50 rounded-full">User Added</div>
                    ) : (
                        <div className={`text-2xl font-bold ${getScoreColor(content.ai_feasibility_score!)}`}>{content.ai_feasibility_score}</div>
                    )}
                </div>
            </div>
            <p className="text-sm text-nexus-text-secondary mt-2">{content.summary}</p>
            <div className="mt-4 pt-3 border-t border-nexus-border flex justify-between items-center">
                 <a href={content.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-nexus-text-secondary hover:text-nexus-secondary transition-colors px-2 py-1">
                    <ExternalLinkIcon className="w-4 h-4" /> Source
                 </a>
                 <div className="flex items-center gap-1">
                    <ActionButton onClick={() => setIsSaved(!isSaved)} title={isSaved ? "Unsave" : "Save to Watchlist"} className={isSaved ? 'text-nexus-accent' : ''}>
                        <BookmarkIcon className="w-5 h-5"/>
                    </ActionButton>
                    {!isUserAdded && (
                        <ActionButton onClick={(e) => handleSymbiosisClick(e, `AI Risk Assessment for: ${content.project_name}`, content.ai_risk_assessment || '')} title="Start Symbiosis Chat">
                            <SymbiosisIcon className="w-5 h-5"/>
                        </ActionButton>
                    )}
                     <button onClick={() => onAnalyze(content)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-nexus-text-primary bg-nexus-surface/80 px-2.5 py-1.5 rounded-md hover:bg-nexus-accent/20 hover:text-nexus-accent transition-colors">
                        <AnalyzeIcon className="w-4 h-4"/>
                        Deep-Dive
                     </button>
                 </div>
            </div>
        </div>
    );
};

const NewsCard: React.FC<{ content: NewsContent }> = ({ content }) => {
    return (
        <div>
            <h4 className="font-bold text-nexus-text-primary">{content.headline}</h4>
            <div className="text-xs text-nexus-text-secondary mt-1 flex items-center flex-wrap gap-x-2">
                <span>{content.source}</span><span className="text-nexus-text-muted">&bull;</span>
                <span>{content.region}</span>
            </div>
            <p className="text-sm text-nexus-text-secondary mt-2">{content.summary}</p>
            <div className="mt-4 pt-3 border-t border-nexus-border flex justify-end items-center">
                 <a href={content.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-nexus-text-primary bg-nexus-surface/80 px-2.5 py-1.5 rounded-md hover:bg-nexus-accent/20 hover:text-nexus-accent transition-colors">
                    <ExternalLinkIcon className="w-4 h-4" /> Read More
                 </a>
            </div>
        </div>
    );
};

const IndicatorCard: React.FC<{ content: IndicatorContent }> = ({ content }) => {
    const isPositive = content.change >= 0;
    return (
        <div>
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h4 className="font-bold text-nexus-text-primary">{content.name}</h4>
                    <p className="text-xs text-nexus-text-muted">{content.region}</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-nexus-text-primary">{content.value}</p>
                    <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${isPositive ? 'text-nexus-success' : 'text-nexus-error'}`}>
                        {isPositive ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                        <span>{Math.abs(content.change)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const DataFeedItem: React.FC<DataFeedItemProps> = ({ post, onAnalyze, onStartSymbiosis }) => {
    const renderContent = () => {
        switch (post.type) {
            case 'opportunity': return <OpportunityCard content={post.content as LiveOpportunityItem} onAnalyze={onAnalyze} onStartSymbiosis={onStartSymbiosis} />;
            case 'news': return <NewsCard content={post.content as NewsContent} />;
            case 'indicator': return <IndicatorCard content={post.content as IndicatorContent} />;
            default: return null;
        }
    };

    const icons: Record<FeedPost['type'], React.ReactNode> = {
        opportunity: <BriefcaseIcon className="w-5 h-5" />,
        news: <MegaphoneIcon className="w-5 h-5" />,
        indicator: <ChartBarIcon className="w-5 h-5" />,
    };

    const typeText: Record<FeedPost['type'], string> = {
        opportunity: 'Opportunity',
        news: 'News',
        indicator: 'Economic Indicator'
    }

    return (
        <Card className="p-0 overflow-hidden transition-all duration-300 hover:border-nexus-secondary/50 hover:shadow-nexus-secondary/10 bg-nexus-surface">
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2.5 text-sm text-nexus-secondary">
                        {icons[post.type]}
                        <span className="font-semibold">{typeText[post.type]}</span>
                    </div>
                    <span className="text-xs text-nexus-text-muted">{timeAgo(post.timestamp)}</span>
                </div>
                {renderContent()}
            </div>
        </Card>
    );
};