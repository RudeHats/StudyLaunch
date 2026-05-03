'use client';

import { useState } from 'react';
import Navigation from '@/components/AppNavigation';
import NavigatorPage from '@/components/pages/Navigator';
import OraclePage from '@/components/pages/Oracle';
import LoanSensePage from '@/components/pages/LoanSense';
import DashboardPage from '@/components/pages/Dashboard';

export default function FeaturesDashboard() {
    const [activePage, setActivePage] = useState<'navigator' | 'oracle' | 'loansense' | 'dashboard'>('navigator');

    return (
        <div className="flex flex-col h-screen bg-[#fafaf9]">
            <Navigation activePage={activePage} setActivePage={setActivePage} />

            <div className="flex-1 overflow-hidden">
                {activePage === 'navigator' && <NavigatorPage />}
                {activePage === 'oracle' && <OraclePage />}
                {activePage === 'loansense' && <LoanSensePage />}
                {activePage === 'dashboard' && <DashboardPage />}
            </div>
        </div>
    );
}
