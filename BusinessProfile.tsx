import React from 'react';
import { Card } from './common/Card';

const SectionTitle: React.FC<{ subtitle: string; title: string; }> = ({ subtitle, title }) => (
    <div className="mb-10 text-center">
        <h3 className="text-sm font-bold uppercase tracking-widest text-nexus-accent">{subtitle}</h3>
        <h2 className="mt-2 text-3xl lg:text-4xl font-extrabold text-nexus-text-primary tracking-tight">{title}</h2>
    </div>
);

const Pillar: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <Card className="p-6 bg-nexus-surface border-transparent text-center h-full">
        <h4 className="text-lg font-bold text-nexus-text-primary mb-2">{title}</h4>
        <p className="text-sm text-nexus-text-secondary">{children}</p>
    </Card>
);

export const BusinessProfile: React.FC = () => {
    return (
        <div className="bg-nexus-surface text-nexus-text-secondary">
            {/* Hero Section */}
            <div className="relative bg-nexus-bg">
                <div className="absolute inset-0">
                    <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2684&auto=format&fit=crop" alt="Global network connections" />
                    <div className="absolute inset-0 bg-nexus-bg/80 mix-blend-multiply" aria-hidden="true"></div>
                </div>
                <div className="relative max-w-5xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-nexus-text-primary tracking-tight">The Definitive BWGA Mission Statement</h1>
                    <p className="mt-6 text-xl text-nexus-secondary max-w-3xl mx-auto">
                       We exist to make the overlooked, visible.
                    </p>
                </div>
            </div>

            <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    
                    {/* Part I: The Genesis & Vision */}
                    <section className="mb-16 md:mb-24">
                        <SectionTitle subtitle="Our Origin" title="A Unique Perspective on Value" />
                        <Card className="mt-10 p-8 bg-nexus-surface border-transparent space-y-6">
                            <p className="leading-relaxed">
                               My name is Brayden Walls, Founder and Creator of BWGA. This platform wasn't developed to compete; it was created to contribute. It was born from my time living in a regional city—a city whose challenges and strengths mirror those of regional communities worldwide, the true backbone of any national economy. My hope is to provide a new way for the world to see the real worth these communities hold, both in their people and in their land.
                            </p>
                            <p>
                                My journey to founding BWGA was unconventional. For 17 years, I operated in the high-stakes world of the global cargo industry, specializing in asset protection and risk prevention. My job was to value and protect critical assets from theft and terrorism. That career gave me a unique lens for identifying what is truly valuable and, more importantly, what is left unprotected.
                            </p>
                             <blockquote className="p-6 bg-nexus-bg/60 rounded-lg border-l-4 border-nexus-accent text-nexus-text-secondary italic">
                                When I spent time on the ground in Mindanao, Philippines, I saw the world's greatest unprotected asset: <strong className="text-nexus-text-primary">regional potential.</strong>
                            </blockquote>
                        </Card>
                    </section>

                     {/* Part II: The Problem */}
                    <section className="mb-16 md:mb-24">
                        <SectionTitle subtitle="The Challenge" title="The Global Understanding Gap" />
                         <p className="text-center text-nexus-text-secondary -mt-6 mb-10 max-w-3xl mx-auto">I witnessed a profound disconnect. Immense, quantifiable value in local resources, human capital, and government initiatives was effectively invisible to global markets. Investment decisions were being shaped by outdated perceptions and a lack of reliable, accessible information. This isn't a problem unique to one place; it is a systemic failure seen across the globe.</p>
                         <div className="mt-10 grid md:grid-cols-3 gap-8 text-center">
                            <Pillar title="Fragmented Information">
                                Critical data is scattered, unreliable, or behind prohibitive paywalls.
                            </Pillar>
                             <Pillar title="Prohibitive Due Diligence Costs">
                                The high cost of traditional consulting makes early-stage exploration a non-starter for many.
                            </Pillar>
                            <Pillar title="Local Complexities">
                                Regions often struggle to signal their true value through the noise of local and national complexities.
                            </Pillar>
                        </div>
                    </section>

                    {/* Part III: The Philosophy */}
                    <section className="mb-16 md:mb-24">
                        <SectionTitle subtitle="Our Solution" title="From Insight to Action" />
                        <Card className="mt-10 p-8 bg-nexus-surface border-transparent space-y-6">
                            <p>
                                This platform started as a simple idea. It wasn't until I began developing the dashboard and immersing myself in countless university studies, economic reports, and government papers that the true scale of the problem—and the potential for a solution—became clear.
                            </p>
                             <p>
                                But theory alone is not enough. The real breakthrough came from sitting with leaders like Mayor S. Co. in Mindanao, who provided the ground-level insight that validated years of research. This platform is the system I wish had existed then. It is for the development agency, the company deterred by uncertainty, and for the regional communities themselves.
                            </p>
                             <p className="font-semibold text-nexus-text-primary">For their generosity and perspective, I am deeply grateful to the Mayor, the Philippine government, and its people.</p>
                        </Card>
                    </section>
                    
                    {/* Our Mission */}
                    <section className="mb-16 md:mb-24">
                        <SectionTitle subtitle="Our Mission" title="A Confident First Look" />
                        <p className="text-center text-xl text-nexus-text-secondary max-w-3xl mx-auto">
                            Our goal is to be a trusted and cost-effective first step in global opportunity discovery, but to simply give those the confidence to be heard and be seen. We provide the initial layer of data-driven, AI-enhanced intelligence that gives organizations the confidence to take the next step—to engage, to invest, and to build sustainable partnerships.
                        </p>
                         <p className="text-center text-2xl text-nexus-text-primary font-bold max-w-3xl mx-auto mt-6">
                            We exist to make the overlooked, visible.
                        </p>
                    </section>


                     <section>
                         <div className="text-center p-10 bg-gradient-to-br from-emerald-900/50 to-cyan-900/50 rounded-2xl border-2 border-nexus-success/50 shadow-lg shadow-nexus-success/10">
                             <h2 className="text-3xl font-extrabold text-nexus-text-primary">Our Commitment: Symbiotic Growth</h2>
                             <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-200">
                                We believe that true value creation must be circular. That's why for every report sold or full platform license purchased, <strong className="text-emerald-300">up to 30% of the revenue will be directed back into community-focused economic development initiatives within the analyzed region.</strong>
                             </p>
                             <p className="mt-3 max-w-3xl mx-auto text-base text-nexus-text-secondary">
                                Our success is directly tied to the prosperity of the communities we serve.
                             </p>
                         </div>
                    </section>

                </div>
            </div>
        </div>
    );
};