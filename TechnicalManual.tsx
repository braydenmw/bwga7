
import React from 'react';
import { Card } from './common/Card';
import { NexusLogo, BlueprintIcon, BriefcaseIcon } from './Icons';
import { AnnotatedSampleReport } from './AnnotatedSampleReport';

interface TechnicalManualProps {
    onGetStarted: () => void;
}

const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; }> = ({ title, subtitle, children }) => (
    <section className="mb-12">
        {subtitle && <p className="text-sm font-bold uppercase tracking-widest text-nexus-accent">{subtitle}</p>}
        <h2 className="mt-1 text-3xl font-extrabold text-nexus-text-primary tracking-tight">{title}</h2>
        <div className="mt-4 text-nexus-text-secondary space-y-4 prose max-w-none">
            {children}
        </div>
    </section>
);

const StepCard: React.FC<{ number: number; title: string; children: React.ReactNode; }> = ({ number, title, children }) => (
    <Card className="p-6 bg-nexus-surface border-transparent">
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-nexus-bg border border-nexus-border flex items-center justify-center font-bold text-nexus-secondary text-2xl">
                {number}
            </div>
            <div>
                <h3 className="text-xl font-bold text-nexus-text-primary">{title}</h3>
                <p className="mt-1 text-nexus-text-secondary">{children}</p>
            </div>
        </div>
    </Card>
);

const MethodologyCard: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <Card className="p-5 bg-nexus-surface/60 border border-nexus-border/50 h-full">
        <h4 className="text-lg font-bold text-amber-300">{title}</h4>
        <p className="mt-2 text-sm text-nexus-text-secondary">{children}</p>
    </Card>
);


export const TechnicalManual: React.FC<TechnicalManualProps> = ({ onGetStarted }) => {
    return (
        <div className="bg-nexus-surface">
             <div className="relative bg-nexus-bg">
                <div className="max-w-5xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
                    <NexusLogo className="w-16 h-16 text-nexus-accent mx-auto mb-4" />
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-nexus-text-primary tracking-tight">How The Nexus Engine Works</h1>
                    <p className="mt-6 text-xl text-nexus-secondary max-w-3xl mx-auto">
                        We are not another dashboard. We are a dedicated intelligence partner, built to translate raw data into strategic foresight for regional economic development.
                    </p>
                </div>
            </div>

            <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    
                    <Section subtitle="Part I: The Core Problem" title="Bridging the 'Global Understanding Gap'">
                        <p>
                            Regional economies are the bedrock of national prosperity, yet they are systematically misunderstood and overlooked by global markets. The reasons are simple: critical data is fragmented, on-the-ground intelligence is prohibitively expensive, and traditional analysis fails to capture the dynamic, interconnected nature of a local ecosystem. This creates a paralyzing "Understanding Gap" that stifles investment and prevents regions from realizing their full potential.
                        </p>
                        <p>
                            <strong>BWGA Nexus was engineered to close this gap.</strong> We provide an objective, data-driven first look—a trusted intelligence layer that gives government departments, agencies, and their private sector partners the confidence to engage, invest, and build.
                        </p>
                    </Section>
                    
                    <Section subtitle="Part II: The Services" title="A Dual-Engine Approach to Intelligence">
                        <p>The Nexus platform provides two distinct but complementary services, designed to cover the full spectrum of strategic intelligence needs from discovery to deep-dive analysis.</p>
                        <div className="grid md:grid-cols-2 gap-8 mt-6">
                            <Card className="p-6 border-nexus-accent/30 bg-nexus-accent/10">
                                <div className="flex items-center gap-4 mb-3">
                                    <BriefcaseIcon className="w-10 h-10 text-amber-300 flex-shrink-0" />
                                    <h3 className="text-2xl font-bold text-nexus-text-primary">Global Data Hub</h3>
                                </div>
                                <p className="text-nexus-text-secondary">This is your discovery engine. It acts as a **Global Development Opportunity Clearinghouse**, actively aggregating tenders and projects from global sources. Our AI provides an initial feasibility and risk assessment, allowing you to see what's happening *right now* and identify opportunities that align with your strategic goals.</p>
                            </Card>
                             <Card className="p-6 border-nexus-secondary/30 bg-nexus-secondary/10">
                                 <div className="flex items-center gap-4 mb-3">
                                    <BlueprintIcon className="w-10 h-10 text-cyan-300 flex-shrink-0" />
                                    <h3 className="text-2xl font-bold text-nexus-text-primary">Nexus Reports</h3>
                                </div>
                                <p className="text-nexus-text-secondary">This is your bespoke analysis engine. When you need to go beyond discovery and build a deep, strategic case, you commission a Nexus Report. You provide the strategic intent, and our AI conducts a detailed, multi-vector analysis tailored to your specific objectives, whether it's finding a partner or analyzing a market.</p>
                            </Card>
                        </div>
                    </Section>

                    <Section subtitle="Part III: The Methodologies" title="The Science Behind the Reports">
                        <p>Our reports are built on a foundation of proven academic and economic methodologies. This ensures our insights are not just opinions, but are grounded in a rigorous, repeatable analytical framework.</p>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <MethodologyCard title="Location Quotient (LQ) Analysis">
                                We use LQ to measure an industry's concentration in your region compared to a national average. An LQ greater than 1.0 indicates a local specialization and potential export capability, providing a quantitative basis for identifying your region's true economic strengths.
                            </MethodologyCard>
                             <MethodologyCard title="Industrial Cluster Analysis">
                                Beyond individual industries, we analyze entire ecosystems. By mapping the relationships between companies in a specific sector, we identify "anchor industries" and, most importantly, critical <strong>supply chain gaps</strong> that represent prime, targeted investment opportunities.
                            </MethodologyCard>
                             <MethodologyCard title="Shift-Share Analysis">
                                This powerful technique dissects your region's employment growth into three components: the national trend, the industry-specific trend, and the local competitive effect. It tells you if your region is outperforming or underperforming its peers, and why—providing crucial insight for strategic planning.
                            </MethodologyCard>
                        </div>
                    </Section>

                     <Section subtitle="Part IV: The Technology" title="About the Nexus Symbiotic Intelligence Language (NSIL)">
                        <p>
                            Developed by our founder, Brayden Walls, NSIL is a core innovation of the Nexus platform. Standard AI models produce unstructured text, which is difficult to use for strategic decisions. NSIL is a specialized, XML-like language that structures the AI's output into logical, interactive components.
                        </p>
                         <blockquote className="p-6 bg-nexus-surface/60 rounded-lg border-l-4 border-nexus-accent text-nexus-text-secondary italic">
                                "NSIL was created to solve a fundamental problem: how to turn a machine's vast knowledge into a human's strategic tool. It's the grammar that allows for a true symbiotic dialogue between the user and the AI."
                                <strong className="block not-italic mt-2 text-nexus-text-primary">— Brayden Walls, Founder</strong>
                         </blockquote>
                         <p>
                            When you see a report, you're seeing NSIL rendered visually. Each section tagged with NSIL (like `&lt;nsil:synergy_analysis&gt;` or `&lt;nsil:risk_map&gt;`) is a live element, allowing you to launch a "Symbiosis Chat" and query that specific piece of intelligence.
                        </p>
                    </Section>

                    <Section subtitle="Part V: Example Output" title="Deconstructing a Nexus Report">
                         <p>
                            A Nexus Report is not a static document; it's the beginning of a strategic dialogue. The process is a symbiotic partnership designed to merge large-scale data analysis with your specific, expert context. The intelligence is co-created: the AI provides the broad analytical framework based on what's happening globally; you provide the critical context that makes the insight actionable.
                        </p>
                        <p>
                            To make this concrete, the diagram below breaks down a sample <strong>Tier B: Competitive Landscape</strong> report. The annotations explain how each component is generated—from your direct inputs in the report generator to the complex analytical models our AI applies. This visual guide demonstrates the symbiotic process in action.
                        </p>
                        <div className="mt-8">
                            <AnnotatedSampleReport />
                        </div>
                    </Section>
                    
                    <Section subtitle="Part VI: Enterprise & Government" title="Platform Integration & Enterprise Licensing">
                        <p>
                            BWGA Nexus AI is engineered not just as a standalone tool, but as an embeddable intelligence layer designed to integrate directly into your existing workflows. We understand that government departments and large enterprises have unique data security, compliance, and operational requirements.
                        </p>
                        <p>
                            For organizations seeking to leverage the full power of the Nexus engine within their own environment, we offer <strong>full platform licensing options</strong>. This provides:
                        </p>
                        <ul className="list-disc list-outside ml-6 space-y-2">
                            <li>Deployment within your private cloud or on-premise infrastructure.</li>
                            <li>Customized integration with your internal data sources and systems.</li>
                            <li>Dedicated support, training, and model fine-tuning for your specific use cases.</li>
                            <li>Full compliance with your organization's data governance and security protocols.</li>
                        </ul>
                        <p>
                            Please contact BW Global Advisory directly to discuss enterprise licensing and partnership opportunities. Our goal is to become a trusted, long-term strategic intelligence partner.
                        </p>
                    </Section>

                     <section>
                         <div className="text-center p-10 bg-gradient-to-br from-nexus-accent/20 to-nexus-secondary/20 rounded-2xl border border-nexus-border">
                             <h2 className="text-3xl font-extrabold text-nexus-text-primary">Ready to Activate Your Regional Strategy?</h2>
                             <p className="mt-4 max-w-2xl mx-auto text-lg text-nexus-text-secondary">
                                Generate your first report to see the Nexus engine in action. Provide your strategic objective and let our AI provide the initial layer of intelligence you need to move forward with confidence.
                             </p>
                             <button 
                                onClick={onGetStarted}
                                className="mt-8 bg-gradient-to-r from-nexus-success to-teal-500 text-white font-bold py-3 px-10 rounded-lg hover:opacity-90 transition-all text-lg shadow-lg shadow-nexus-success/20 flex items-center gap-3 mx-auto"
                            >
                                <BlueprintIcon className="w-6 h-6" />
                                Generate a Nexus Report
                            </button>
                         </div>
                    </section>
                </div>
            </div>
        </div>
    );
};