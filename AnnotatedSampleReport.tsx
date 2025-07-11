import React from 'react';
import { NexusLogo } from './Icons';

const Annotation: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="annotation-block-interleaved">
        <h4>{title}</h4>
        <p>{children}</p>
    </div>
);

export const AnnotatedSampleReport: React.FC = () => {
    return (
        <div id="annotated-report" className="report-document p-8 sm:p-12 mx-auto my-6 max-w-5xl relative z-0">
            {/* Header */}
            <header className="report-page-header">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600">Prepared for: Jane Doe</p>
                        <p className="text-sm text-gray-600">Mindanao Development Authority, Philippines</p>
                    </div>
                    <NexusLogo className="w-16 h-16 text-gray-800" />
                </div>
                <h1 className="text-4xl font-bold font-sans text-gray-900 mt-6 text-center">Investment Intelligence Brief for: Mindanao, AgriTech</h1>
            </header>
            <Annotation title="1. User-Defined Origin & 2. Dynamic Report Title">
                The header section is populated directly from the <strong>'Your Profile'</strong> (Step 1) and <strong>'Set the Report Scope'</strong> (Step 2) stages in the report generator. This establishes the formal origin and ensures the focus is precise from the outset.
            </Annotation>

            {/* Score & Summary */}
            <main>
                <section>
                    <h2 className="report-section-title text-2xl">Overall Score & Investment Tier</h2>
                    <div className="score-box grid md:grid-cols-3 gap-6 items-center">
                        <div className="text-center">
                            <p className="text-7xl font-bold font-sans text-gray-800">78</p>
                            <p className="text-sm text-gray-600 font-semibold">Overall Score</p>
                        </div>
                        <div className="md:col-span-2">
                            <h3 className="text-xl font-bold font-sans text-gray-800">Tier 2 - High Growth Potential</h3>
                            <p className="mt-2 text-base leading-relaxed text-gray-700">Mindanao exhibits exceptional agricultural resources and strong government support, positioning it as a prime candidate for AgriTech investment. Key challenges in infrastructure and supply chain logistics temper the score, but represent clear targets for development.</p>
                        </div>
                    </div>
                </section>
                <Annotation title="3. AI-Calculated Score & 4. Qualitative Rationale">
                    The Nexus AI engine analyzes all gathered data against its internal models and your strategic objective, producing a single, weighted score for at-a-glance assessment. The AI then provides a qualitative summary of its findings, explaining the <strong>'why'</strong> behind the score and bridging quantitative data with strategic, human-readable insight.
                </Annotation>

                <section>
                    <h2 className="report-section-title text-2xl">Executive Summary</h2>
                    <p className="text-base leading-relaxed">This report provides a competitive landscape analysis of the AgriTech sector in Mindanao, Philippines. It utilizes Location Quotient (LQ) and Shift-Share analyses to identify the region's competitive advantages. Findings indicate a strong specialization in high-value crops (LQ > 1.5) but a lag in technology adoption. The analysis points to significant opportunities in supply chain technology, precision farming, and aquaculture tech, with a vetted list of potential international partners provided.</p>
                </section>
                <Annotation title="5. Objective-Driven Summary">
                    The Executive Summary is not generic. The AI synthesizes the key findings and recommendations that are most relevant to the <strong>'Strategic Intent'</strong> you defined in Step 5 of the generation process.
                </Annotation>

                {/* Tables */}
                <section>
                    <h2 className="report-section-title text-2xl">Competitive Landscape Analysis (Shift-Share)</h2>
                    <div className="overflow-x-auto">
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th className="header-teal">Factor</th>
                                    <th className="header-teal">Score (/10)</th>
                                    <th className="header-teal">Weight</th>
                                    <th className="header-teal">Analysis Summary</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>National Growth Effect</td>
                                    <td>8</td>
                                    <td>0.30</td>
                                    <td>The Philippine national focus on agricultural modernization provides a strong tailwind for regional growth.</td>
                                </tr>
                                <tr>
                                    <td>Industry Mix Effect</td>
                                    <td>9</td>
                                    <td>0.30</td>
                                    <td>Mindanao's focus on high-demand crops (banana, pineapple, coconut) is a significant advantage in the current global market.</td>
                                </tr>
                                <tr>
                                    <td>Regional Competitive Effect</td>
                                    <td>6</td>
                                    <td>0.40</td>
                                    <td>While resource-rich, the region faces competitive pressure from Vietnam and Thailand due to logistical inefficiencies. This is the key area for strategic intervention.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <Annotation title="6. Core Analytical Methodologies">
                    This table is a direct output of a core Regional Science model like <strong>Shift-Share Analysis</strong>. The AI uses Google Search to find public data (e.g., employment statistics) and applies the framework to it, providing a rigorous, data-driven foundation for the insights.
                </Annotation>

                <section>
                    <h2 className="report-section-title text-2xl">Recommended Partners</h2>
                    <div className="overflow-x-auto">
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th className="header-sky">Company</th>
                                    <th className="header-sky">Origin</th>
                                    <th className="header-sky">Match Strength</th>
                                    <th className="header-sky">Rationale</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Netafim</td>
                                    <td>Israel</td>
                                    <td>92%</td>
                                    <td>Global leader in precision irrigation. Their drip irrigation tech directly addresses water management issues in Mindanao's plantations.</td>
                                </tr>
                                <tr>
                                    <td>Trimble Inc.</td>
                                    <td>United States</td>
                                    <td>88%</td>
                                    <td>Specializes in GPS, mapping, and data analytics for agriculture. Could overhaul crop monitoring and yield management.</td>
                                </tr>
                                <tr>
                                    <td>DeLaval</td>
                                    <td>Sweden</td>
                                    <td>85%</td>
                                    <td>A key player in dairy and livestock management technology. Potential to revolutionize the regional dairy sector.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <Annotation title="7. Bespoke Partner Search">
                    For 'Find a Partner' reports, the AI uses your detailed partner profile to search for and analyze suitable companies, creating a vetted shortlist with a clear rationale for each match.
                </Annotation>

                {/* Recommendations */}
                <section>
                    <h2 className="report-section-title text-2xl">Strategic Recommendations</h2>
                    <p className="text-base leading-relaxed whitespace-pre-line">
                        1.  <strong>Launch the "Agri-Corridor" Initiative:</strong> Prioritize investment in farm-to-port road and cold storage infrastructure to reduce post-harvest losses and close the logistics gap with regional competitors.
                        <br />2.  <strong>Establish a Digital Farmer Program:</strong> Partner with a company like Trimble Inc. to launch a subsidized program for smallholders to adopt GPS and sensor technology, providing training and data support.
                        <br />3.  <strong>Create a Special Economic Zone for AgriTech:</strong> Offer tax incentives and streamlined regulations for international AgriTech firms establishing R&D and manufacturing facilities in Mindanao, targeting irrigation and post-harvest specialists.
                    </p>
                </section>
                <Annotation title="8. Actionable Recommendations">
                    This is the final output of the symbiotic process. The AI proposes specific, actionable steps to address the findings. You, the user, can then use the <strong>Symbiosis Chat</strong> to refine, challenge, and expand on these ideas, transforming the report from a static document into a dynamic strategic tool.
                </Annotation>
            </main>

            {/* Footer */}
            <footer className="mt-12 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
                <p><strong>Sources:</strong> Philippine Statistics Authority, World Bank Open Data, FAOSTAT</p>
                <p className="mt-2">Page 1 of 1 | BWGA Nexus AI | Confidential - Sample Document</p>
            </footer>
        </div>
    );
};
