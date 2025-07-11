
import React from 'react';
import type { LiveOpportunityItem, SymbiosisContext } from '../types';
import { ExternalLinkIcon, SymbiosisIcon, AnalyzeIcon } from './Icons';

interface OpportunityListItemProps { 
    item: LiveOpportunityItem; 
    onAnalyze: (item: LiveOpportunityItem) => void;
    onStartSymbiosis: (context: SymbiosisContext) => void;
}

export const OpportunityListItem: React.FC<OpportunityListItemProps> = ({ item, onAnalyze, onStartSymbiosis }) => {
    
    const isUserAdded = item.isUserAdded;

    const handleSymbiosisClick = (event: React.MouseEvent, topic: string, content: string) => {
        event.stopPropagation();
        onStartSymbiosis({ topic: topic, originalContent: content });
    };

    const getScoreColor = (score: number) => {
        if (score >= 75) return 'text-green-400';
        if (score >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="group bg-slate-800/60 border border-slate-700 hover:border-purple-500/50 rounded-lg transition-all duration-300 flex flex-col">
            <div className="p-4">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                        <h4 className="font-bold text-gray-100 group-hover:text-cyan-400 transition-colors">{item.project_name}</h4>
                        <div className="text-xs text-gray-400 mt-1 flex items-center flex-wrap gap-x-2">
                            <span>{item.country}</span>
                            <span className="text-gray-600">&bull;</span>
                            <span>{item.sector}</span>
                             <span className="text-gray-600">&bull;</span>
                            <span className="font-semibold">{item.value}</span>
                        </div>
                    </div>
                     <div className="text-right flex-shrink-0 ml-4">
                        {isUserAdded ? (
                            <div className="px-2 py-1 text-xs font-semibold text-purple-300 bg-purple-900/50 border border-purple-700 rounded-full">
                                User Added
                            </div>
                        ) : (
                            <div className={`text-2xl font-bold ${getScoreColor(item.ai_feasibility_score!)}`}>{item.ai_feasibility_score}</div>
                        )}
                     </div>
                </div>
                <p className="text-sm text-gray-400 mt-2">{item.summary}</p>
            </div>
            <div className="bg-slate-900/70 p-2 border-t border-slate-700 flex justify-between items-center mt-auto rounded-b-lg">
                 <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-300 transition-colors px-2 py-1">
                    <ExternalLinkIcon className="w-4 h-4" /> Source
                 </a>
                 <div className="flex items-center gap-1">
                    {!isUserAdded && (
                        <button 
                            onClick={(e) => handleSymbiosisClick(e, `AI Risk Assessment for: ${item.project_name}`, item.ai_risk_assessment || '')} 
                            className="p-1.5 text-gray-400 hover:text-cyan-300 rounded-md hover:bg-white/10 transition-colors" 
                            title="Start Symbiosis Chat"
                        >
                            <SymbiosisIcon className="w-4 h-4"/>
                        </button>
                    )}
                     <button onClick={() => onAnalyze(item)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-200 bg-white/10 px-2 py-1.5 rounded-md hover:bg-purple-500/50 transition-colors">
                        <AnalyzeIcon className="w-4 h-4"/>
                        Deep-Dive
                     </button>
                 </div>
            </div>
        </div>
    );
};
