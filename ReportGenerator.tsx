import React, { useState, useEffect } from 'react';
import type { ReportParameters, UserType, ReportTier, ReportOption, UserProfile } from '../types';
import { INDUSTRIES, COUNTRIES, COMPANY_SIZES, KEY_TECHNOLOGIES, TARGET_MARKETS, GOVERNMENT_DEPARTMENTS, NON_GOV_ORG_TYPES, MARKET_ANALYSIS_TIER_DETAILS, PARTNER_FINDING_TIER_DETAILS, REPORT_OPTIONS } from '../constants';
import { Card } from './common/Card';
import { fetchRegionalCities } from '../services/nexusService';
import { RocketLaunchIcon } from './Icons';

interface ReportGeneratorProps {
  onGenerate: (params: ReportParameters) => void;
  isGenerating: boolean;
  userProfile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => void;
}

const ProgressIndicator: React.FC<{ current: number; labels: string[] }> = ({ current, labels }) => (
    <div className="w-full mb-10 px-4">
        <ol className="flex items-center w-full">
            {labels.map((label, index) => {
                const step = index + 1;
                const isCompleted = current > step;
                const isCurrent = current === step;
                return (
                    <li key={label} className={`flex items-center text-sm md:text-base ${index < labels.length - 1 ? 'w-full' : ''}`}>
                        <div className="flex flex-col md:flex-row items-center">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-all duration-300
                                ${isCompleted ? 'bg-nexus-success' : isCurrent ? 'bg-nexus-accent scale-110 shadow-lg shadow-nexus-accent/30' : 'bg-nexus-surface'}`}>
                                {isCompleted ? (
                                    <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                    </svg>
                                ) : (
                                    <span className={`font-bold ${isCurrent ? 'text-white' : 'text-nexus-text-muted'}`}>{step}</span>
                                )}
                            </div>
                            <div className="mt-2 md:mt-0 md:ml-4 text-center md:text-left">
                                <h3 className={`font-medium ${isCurrent ? 'text-nexus-text-primary' : 'text-nexus-text-muted'}`}>{label}</h3>
                            </div>
                        </div>
                        {index < labels.length - 1 && (
                            <div className={`flex-auto border-t-2 transition-all duration-500 mx-4 ${isCompleted ? 'border-nexus-success' : 'border-nexus-surface'}`}></div>
                        )}
                    </li>
                );
            })}
        </ol>
    </div>
);

const placeholderObjective = "Example:\n'My department is leading a new initiative to develop a local AgriTech hub. My objective is to understand our region's competitive landscape in AgriTech and identify potential foreign technology partners to establish a new R&D facility. This partner should leverage our strong agricultural base to produce precision agriculture solutions. The goal is to create high-skilled jobs, transfer technology, and boost our agricultural sector's productivity.'";

const StepHeader: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-nexus-secondary">{title}</h3>
        <p className="text-nexus-text-secondary mt-1 max-w-2xl mx-auto">{children}</p>
    </div>
);

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onGenerate, isGenerating, userProfile, onProfileUpdate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Profile
  const [userType, setUserType] = useState<UserType>('government');
  const [userName, setUserName] = useState('');
  const [userDepartment, setUserDepartment] = useState(GOVERNMENT_DEPARTMENTS[0]);
  const [userCountry, setUserCountry] = useState('Australia');
  const [isManualDept, setIsManualDept] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  
  // Step 2: Scope
  const [targetCountry, setTargetCountry] = useState('Philippines');
  const [regionalCity, setRegionalCity] = useState('');
  const [industry, setIndustry] = useState(INDUSTRIES[4]);
  const [manualCityEntry, setManualCityEntry] = useState(false);
  const [manualIndustry, setManualIndustry] = useState('');
  const [isManualIndustry, setIsManualIndustry] = useState(false);

  // Step 3: Tier
  const [tier, setTier] = useState<ReportTier | null>(null);

  // Step 4: Options
  const [selectedOptions, setSelectedOptions] = useState<ReportOption[]>([]);

  // Step 5: Finalize
  const [customObjective, setCustomObjective] = useState('');
  const [companySize, setCompanySize] = useState(COMPANY_SIZES[0]);
  const [keyTechnologies, setKeyTechnologies] = useState<string[]>([]);
  const [targetMarket, setTargetMarket] = useState<string[]>([]);
  const [manualKeyTech, setManualKeyTech] = useState('');
  const [isManualKeyTech, setIsManualKeyTech] = useState(false);

  // City loader state
  const [isCityLoading, setIsCityLoading] = useState(false);
  const [cityLookupError, setCityLookupError] = useState<string | null>(null);
  const [regionalCities, setRegionalCities] = useState<string[]>([]);

  useEffect(() => {
    if (userProfile) {
        setUserName(userProfile.userName);
        setUserType(userProfile.userType);
        setUserCountry(userProfile.userCountry);

        const isStandardDept = (userProfile.userType === 'government' ? GOVERNMENT_DEPARTMENTS : NON_GOV_ORG_TYPES).includes(userProfile.userDepartment);
        if (isStandardDept) {
            setUserDepartment(userProfile.userDepartment);
            setIsManualDept(false);
        } else {
            setUserDepartment(userProfile.userDepartment);
            setIsManualDept(true);
        }
    }
  }, [userProfile]);
  
  const handleProfileSave = () => {
      const newProfile = { userName, userType, userDepartment, userCountry };
      onProfileUpdate(newProfile);
      setProfileMessage('Profile Saved!');
      setTimeout(() => setProfileMessage(''), 2000);
  };

  useEffect(() => {
    let isCancelled = false;
    if (manualCityEntry || !targetCountry) {
        setRegionalCities([]);
        setRegionalCity('');
        return;
    }
    
    const timerId = setTimeout(() => {
        const loadCities = async () => {
          setIsCityLoading(true); setCityLookupError(null); setRegionalCity(''); setRegionalCities([]);
          try {
            const cities = await fetchRegionalCities(targetCountry);
            if (isCancelled) return;
            if (cities && cities.length > 0) { setRegionalCities(cities); setRegionalCity(cities[0]); } 
            else { setCityLookupError(`No regional centers found. Please enter manually.`); setManualCityEntry(true); }
          } catch (error) {
            if (isCancelled) return;
            setCityLookupError((error as Error).message || "An unknown error occurred."); setManualCityEntry(true);
          } finally {
            if (!isCancelled) setIsCityLoading(false);
          }
        };
        loadCities();
    }, 100);
    return () => { isCancelled = true; clearTimeout(timerId); };
  }, [targetCountry, manualCityEntry]);

  const handleTierSelect = (selectedTier: ReportTier) => {
    setTier(selectedTier);
    setCurrentStep(4); // Move to new Options step
  };

  const handleOptionToggle = (optionId: ReportOption) => {
      setSelectedOptions(prev => 
          prev.includes(optionId)
              ? prev.filter(id => id !== optionId)
              : [...prev, optionId]
      );
  };

  const handleNext = () => {
      if (currentStep === 1) {
          handleProfileSave();
      }
      setCurrentStep(prev => prev + 1)
  };
  const handleBack = () => setCurrentStep(prev => prev - 1);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tier) { alert("An error occurred. Please restart the process."); setCurrentStep(1); return; }

    const finalIndustry = isManualIndustry ? manualIndustry : industry;
    const region = `${manualCityEntry ? regionalCity : regionalCity}, ${targetCountry}`;
    const finalKeyTechs = isManualKeyTech ? manualKeyTech.split(',').map(t => t.trim()).filter(Boolean) : keyTechnologies;
    const finalUserDept = isManualDept ? userDepartment : userDepartment;

    const params: ReportParameters = {
        userName, userType, userDepartment: finalUserDept, userCountry,
        region, industry: finalIndustry, customObjective,
        tier,
        selectedOptions,
        companySize,
        keyTechnologies: finalKeyTechs,
        targetMarket
    };
    onGenerate(params);
  };

  const inputStyles = "w-full p-3 bg-nexus-bg border border-nexus-border rounded-lg focus:ring-2 focus:ring-nexus-accent focus:outline-none transition placeholder:text-nexus-text-muted disabled:bg-black/20 disabled:cursor-not-allowed text-nexus-text-primary";
  const labelStyles = "block text-sm font-medium text-nexus-text-secondary mb-2";
  const ManualEntryCheckbox: React.FC<{ isChecked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ isChecked, onChange }) => (
    <label className="flex items-center text-xs text-nexus-text-secondary cursor-pointer">
      <input type="checkbox" checked={isChecked} onChange={onChange} className="mr-2 h-4 w-4 rounded bg-nexus-surface border-nexus-border text-nexus-accent focus:ring-nexus-accent"/> Manual/Other
    </label>
  );

  const wizardLabels = ["Profile", "Scope", "Tier", "Options", "Finalize"];
  const totalSteps = 5;

  const renderStepContent = () => {
      switch (currentStep) {
          case 1: return ( // Your Profile
            <Card className="bg-nexus-surface p-6 md:p-8">
                <StepHeader title="Step 1: Your Profile">Your profile helps us tailor the report's context. The name, department, and country you provide will appear on the report cover, establishing its formal origin. This information is saved to your browser for convenience.</StepHeader>
                <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <label className={labelStyles}>Are you representing a...</label>
                        <div className="flex gap-4">
                            {(['government', 'non-government'] as UserType[]).map(type => (
                                <button key={type} type="button" onClick={() => { setUserType(type); setUserDepartment(type === 'government' ? GOVERNMENT_DEPARTMENTS[0] : NON_GOV_ORG_TYPES[0]); setIsManualDept(false); }} className={`flex-1 p-3 text-center rounded-lg border-2 transition ${userType === type ? 'bg-nexus-accent/20 border-nexus-accent' : 'bg-nexus-surface border-nexus-border hover:border-nexus-text-muted'}`}>
                                    {type === 'government' ? 'Government Body' : 'Non-Government Org'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                          <label htmlFor="userDepartment" className={labelStyles}>{userType === 'government' ? 'Department' : 'Organization Type'}</label>
                          <ManualEntryCheckbox isChecked={isManualDept} onChange={e => setIsManualDept(e.target.checked)} />
                        </div>
                        {isManualDept ? (
                           <input type="text" id="userDepartment" value={userDepartment} onChange={e => setUserDepartment(e.target.value)} className={inputStyles} placeholder="Enter your organization..." />
                        ) : (
                          <select id="userDepartment" value={userDepartment} onChange={e => setUserDepartment(e.target.value)} className={inputStyles}>
                              {(userType === 'government' ? GOVERNMENT_DEPARTMENTS : NON_GOV_ORG_TYPES).map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        )}
                    </div>
                    <div><label htmlFor="userName" className={labelStyles}>Your Name</label><input type="text" id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} className={inputStyles} placeholder="e.g., Jane Doe" required /></div>
                    <div><label htmlFor="userCountry" className={labelStyles}>Your Country</label><select id="userCountry" value={userCountry} onChange={(e) => setUserCountry(e.target.value)} className={inputStyles} required>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                </div>
            </Card>
          );
          case 2: return ( // Set Scope
            <Card className="bg-nexus-surface p-6 md:p-8">
                <StepHeader title="Step 2: Set the Report Scope">The scope defines the 'what' and 'where' of the analysis. Selecting a specific country and a regional center allows our AI to focus its data gathering. The industry focus ensures the resulting intelligence is relevant and specific.</StepHeader>
                <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div><label htmlFor="targetCountry" className={labelStyles}>Target Country</label><select id="targetCountry" value={targetCountry} onChange={(e) => { setTargetCountry(e.target.value); setManualCityEntry(false); }} className={inputStyles} required>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    <div><div className="flex justify-between items-center mb-2"><label htmlFor="regionalCity" className={labelStyles}>Regional City / Area</label><ManualEntryCheckbox isChecked={manualCityEntry} onChange={(e) => setManualCityEntry(e.target.checked)} /></div>
                        {manualCityEntry ? <input type="text" id="regionalCity" value={regionalCity} onChange={(e) => setRegionalCity(e.target.value)} className={inputStyles} placeholder="e.g., Clark Freeport Zone" required/> : isCityLoading ? <div className={`${inputStyles} flex items-center justify-center text-nexus-text-secondary`}><svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Fetching...</div> : regionalCities.length > 0 ? <select id="regionalCity" value={regionalCity} onChange={(e) => setRegionalCity(e.target.value)} className={inputStyles} required>{regionalCities.map(c => <option key={c} value={c}>{c}</option>)}</select> : <input type="text" className={inputStyles} placeholder="Select target country" disabled/>}
                        {cityLookupError && <p className="text-nexus-error text-xs mt-2">{cityLookupError}</p>}
                    </div>
                    <div className="md:col-span-2"><div className="flex justify-between items-center mb-2"><label htmlFor="industry" className={labelStyles}>Industry Focus</label><ManualEntryCheckbox isChecked={isManualIndustry} onChange={(e) => setIsManualIndustry(e.target.checked)} /></div>
                        {isManualIndustry ? <input type="text" id="industry" value={manualIndustry} onChange={e => setManualIndustry(e.target.value)} className={inputStyles} placeholder="Enter custom industry" required/> : <select id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} className={inputStyles} required>{INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}</select>}
                    </div>
                </div>
            </Card>
          );
          case 3: // Select Tier
            const allTiers = [...MARKET_ANALYSIS_TIER_DETAILS, ...PARTNER_FINDING_TIER_DETAILS];
            return (
              <div>
                   <StepHeader title="Step 3: Select Your Base Report Tier">The report tier determines the depth of the analysis. Each tier builds upon the last, employing progressively more advanced regional science methodologies to move from a high-level snapshot to a deep, actionable strategic plan. Read each description to understand the analysis you will receive.</StepHeader>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {allTiers.map(detail => (
                       <Card key={detail.tier} className="flex flex-col p-5 bg-nexus-surface/80 border border-nexus-border hover:border-nexus-accent transition-all shadow-lg hover:shadow-nexus-accent/10">
                           <div className="flex-grow">
                               <h4 className="font-bold text-nexus-accent text-lg">{detail.tier}</h4>
                               <p className="text-sm text-nexus-text-secondary mt-2 pb-4">{detail.fullDescription}</p>
                               <div className="border-t border-nexus-border my-4"></div>
                               <p className="text-xs font-semibold text-nexus-text-primary uppercase tracking-wider mb-2">Key Deliverables</p>
                               <ul className="space-y-1.5 text-sm text-nexus-text-secondary mb-4">
                                  {detail.keyDeliverables.map((item, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                          {typeof item === 'string' ? ( <> <svg className="w-4 h-4 text-nexus-success mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg> <span>{item}</span> </> ) : ( <span className="text-xs italic text-nexus-text-muted pl-6">{item.subItem}</span> )}
                                      </li>
                                  ))}
                               </ul>
                           </div>
                            <div className="border-t border-nexus-border pt-4 mt-auto">
                                <div className="flex justify-between items-baseline text-sm mb-4">
                                   <span className="font-semibold text-nexus-success text-base">{detail.cost}</span>
                                   <span className="text-nexus-text-secondary font-medium">{detail.pageCount}</span>
                                </div>
                               <button onClick={() => handleTierSelect(detail.tier)} className="w-full bg-nexus-accent text-white font-bold py-2.5 px-4 rounded-lg hover:bg-amber-400 transition-colors">
                                   Select & Configure
                               </button>
                           </div>
                       </Card>
                     ))}
                   </div>
              </div>
            );
          case 4: // Select Options
            return (
                <Card className="bg-nexus-surface p-6 md:p-8">
                    <StepHeader title="Step 4: Add Nexus Options">Our optional modules append specialized analyses to your report. Each module instructs the AI to perform a deep-dive on a topic like competitive intelligence or economic impact modeling, providing an extra layer of value for a nominal R&D fee.</StepHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
                        {REPORT_OPTIONS.map(option => {
                            const isSelected = selectedOptions.includes(option.id);
                            return (
                                <div 
                                    key={option.id} 
                                    onClick={() => handleOptionToggle(option.id)}
                                    className={`p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${isSelected ? 'border-nexus-accent bg-nexus-accent/20' : 'border-nexus-border bg-nexus-surface/80 hover:border-nexus-text-muted'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <h4 className={`font-bold ${isSelected ? 'text-amber-300' : 'text-nexus-text-primary'}`}>{option.title}</h4>
                                        <div className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center border-2 ${isSelected ? 'bg-nexus-accent border-amber-400' : 'bg-nexus-bg border-nexus-border'}`}>
                                            {isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                    </div>
                                    <p className="text-sm text-nexus-text-secondary mt-2">{option.description}</p>
                                    <p className="text-right font-mono text-xs mt-3 text-nexus-success">{option.cost}</p>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            );
          case 5: return ( // Finalize
              <Card className="bg-nexus-surface p-6 md:p-8">
                  <StepHeader title="Step 5: Define Your Strategic Intent">This is the most critical input. A clear, detailed objective allows the AI to move beyond generic data and provide tailored analysis and recommendations that directly address your goals. Be as specific as possible.</StepHeader>
                  <div className="max-w-3xl mx-auto space-y-8">
                      <div>
                        <h4 className="font-semibold text-nexus-accent text-lg mb-4 text-center">Your Core Objective</h4>
                        <textarea value={customObjective} onChange={(e) => setCustomObjective(e.target.value)} rows={8} className={inputStyles} placeholder={placeholderObjective} required/>
                      </div>
                      <div className="border-t border-nexus-border pt-6">
                          <h4 className="font-semibold text-nexus-accent text-lg mb-4 text-center">Optional: Ideal Partner Profile</h4>
                          <p className="text-nexus-text-secondary mb-4 text-sm text-center">If finding a partner is part of your objective, provide details here. Otherwise, leave blank.</p>
                          <div className="grid lg:grid-cols-2 gap-8">
                              <div><label htmlFor="companySize" className={labelStyles}>Partner Company Size</label><select id="companySize" value={companySize} onChange={(e) => setCompanySize(e.target.value)} className={inputStyles}>{COMPANY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                              <div><label htmlFor="targetMarket" className={labelStyles}>Partner's Target Markets</label><select id="targetMarket" multiple value={targetMarket} onChange={(e) => setTargetMarket(Array.from(e.target.selectedOptions, option => option.value))} className={`${inputStyles} h-32`}>{TARGET_MARKETS.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                              <div className="lg:col-span-2"><div className="flex justify-between items-center mb-2"><label htmlFor="keyTechnologies" className={labelStyles}>Key Technologies / Capabilities</label><ManualEntryCheckbox isChecked={isManualKeyTech} onChange={e => setIsManualKeyTech(e.target.checked)} /></div>
                                  {isManualKeyTech ? <textarea id="keyTechnologies" value={manualKeyTech} onChange={e => setManualKeyTech(e.target.value)} className={`${inputStyles} h-32`} placeholder="Enter technologies, separated by commas"/> : <select id="keyTechnologies" multiple value={keyTechnologies} onChange={(e) => setKeyTechnologies(Array.from(e.target.selectedOptions, option => option.value))} className={`${inputStyles} h-32`}>{KEY_TECHNOLOGIES.map(t => <option key={t} value={t}>{t}</option>)}</select>}
                              </div>
                          </div>
                      </div>
                  </div>
              </Card>
          );
          default: return <div>Invalid Step</div>;
      }
  };
  
  return (
    <div className="p-4 md:p-8 flex flex-col items-center">
      <header className="mb-8 text-center max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-nexus-text-primary tracking-tighter">Nexus Report Generator</h2>
        <p className="text-nexus-text-secondary mt-2">A guided process for generating bespoke strategic intelligence.</p>
      </header>
      
      <div className="w-full max-w-7xl">
        {currentStep > 0 && <ProgressIndicator current={currentStep} labels={wizardLabels} />}
        <form onSubmit={handleSubmit}>
            {renderStepContent()}
            <div className="mt-8 flex justify-between items-center">
                <button type="button" onClick={handleBack} disabled={currentStep === 1} className="bg-nexus-text-muted text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Back
                </button>
                 {profileMessage && <span className="text-nexus-success text-sm font-semibold">{profileMessage}</span>}
                {currentStep < totalSteps ? (
                    <button type="button" onClick={handleNext} disabled={(currentStep === 3 && !tier)} className="bg-gradient-to-r from-nexus-accent to-amber-600 text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {currentStep === 1 ? 'Save Profile & Next' : 'Next'}
                    </button>
                ) : (
                    <button type="submit" disabled={isGenerating || !customObjective} className="bg-gradient-to-r from-nexus-success to-emerald-600 text-white font-bold py-3 px-10 rounded-lg hover:opacity-90 transition-all disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px] text-lg shadow-lg shadow-nexus-success/20 disabled:shadow-none">
                        {isGenerating ? (
                            <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating...</>
                        ) : (
                            <div className="flex items-center gap-2">
                                <RocketLaunchIcon className="w-6 h-6" />
                                <span>Activate Nexus AI</span>
                            </div>
                        )}
                    </button>
                )}
            </div>
        </form>
      </div>
    </div>
  );
};