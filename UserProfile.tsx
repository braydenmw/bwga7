
import React, { useState, useEffect } from 'react';
import type { UserProfile as UserProfileType, UserType } from '../types';
import { COUNTRIES, GOVERNMENT_DEPARTMENTS, NON_GOV_ORG_TYPES } from '../constants';
import { Card } from './common/Card';

interface UserProfileProps {
  profile: UserProfileType | null;
  onSave: (profile: UserProfileType) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ profile, onSave }) => {
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState<UserType>('government');
  const [userDepartment, setUserDepartment] = useState('');
  const [userCountry, setUserCountry] = useState(COUNTRIES[0]);
  const [isManualDept, setIsManualDept] = useState(false);

  useEffect(() => {
    if (profile) {
      setUserName(profile.userName);
      setUserType(profile.userType);
      setUserCountry(profile.userCountry);

      const isStandardDept = (profile.userType === 'government' ? GOVERNMENT_DEPARTMENTS : NON_GOV_ORG_TYPES).includes(profile.userDepartment);
      if (isStandardDept) {
        setUserDepartment(profile.userDepartment);
        setIsManualDept(false);
      } else {
        setUserDepartment(profile.userDepartment);
        setIsManualDept(true);
      }
    }
  }, [profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() && userDepartment.trim()) {
      onSave({ userName, userType, userDepartment, userCountry });
    }
  };

  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
    setUserDepartment(type === 'government' ? GOVERNMENT_DEPARTMENTS[0] : NON_GOV_ORG_TYPES[0]);
    setIsManualDept(false);
  };
  
  const inputStyles = "w-full p-3 bg-slate-800/80 border border-nexus-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition placeholder:text-gray-500";
  const labelStyles = "block text-sm font-medium text-gray-400 mb-2";

  return (
    <div className="p-4 md:p-8 overflow-y-auto h-full flex flex-col items-center">
      <header className="mb-8 text-center max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tighter">Your Profile</h2>
        <p className="text-gray-400 mt-2">This information will be used to personalize your reports and pre-fill forms.</p>
      </header>
      <Card className="bg-nexus-surface p-6 md:p-8 w-full max-w-3xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="userName" className={labelStyles}>Your Name</label>
              <input type="text" id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} className={inputStyles} placeholder="e.g., Jane Doe" required />
            </div>
            <div>
              <label htmlFor="userCountry" className={labelStyles}>Your Country</label>
              <select id="userCountry" value={userCountry} onChange={(e) => setUserCountry(e.target.value)} className={inputStyles} required>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelStyles}>You are representing a...</label>
              <div className="flex gap-4">
                {(['government', 'non-government'] as UserType[]).map(type => (
                  <button key={type} type="button" onClick={() => handleUserTypeChange(type)} className={`flex-1 p-3 text-center rounded-lg border-2 transition ${userType === type ? 'bg-purple-900/50 border-purple-500' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}>
                    {type === 'government' ? 'Government Body' : 'Non-Government Org'}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="userDepartment" className={labelStyles}>{userType === 'government' ? 'Department' : 'Organization Type'}</label>
                <label className="flex items-center text-xs text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={isManualDept} onChange={e => setIsManualDept(e.target.checked)} className="mr-2 h-4 w-4 rounded bg-slate-700 border-slate-500 text-purple-500 focus:ring-purple-600"/>
                    Manual/Other
                </label>
              </div>
              {isManualDept ? (
                 <input type="text" id="userDepartment" value={userDepartment} onChange={e => setUserDepartment(e.target.value)} className={inputStyles} placeholder="Enter your organization..." />
              ) : (
                <select id="userDepartment" value={userDepartment} onChange={e => setUserDepartment(e.target.value)} className={inputStyles}>
                    {(userType === 'government' ? GOVERNMENT_DEPARTMENTS : NON_GOV_ORG_TYPES).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              )}
            </div>
          </div>
          <div className="pt-6 border-t border-nexus-border text-right">
            <button type="submit" className="bg-gradient-to-r from-green-500 to-teal-400 text-white font-bold py-2 px-8 rounded-lg hover:opacity-90 transition-all">
              Save Profile
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
