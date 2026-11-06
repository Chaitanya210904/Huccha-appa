import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar.jsx';
import { Header } from './Header.jsx';
import { api } from '../api/index.js';

import { Dashboard } from '../pages/Dashboard/index.jsx';
import { Panchang } from '../pages/Panchang/index.jsx';
import { Shraddha } from '../pages/Shraddha/index.jsx';
import { Clients } from '../pages/Clients/index.jsx';
import { Bookings } from '../pages/Bookings/index.jsx';
import { Calendar } from '../pages/Calendar/index.jsx';
import { Finance } from '../pages/Finance/index.jsx';
import { Inventory } from '../pages/Inventory/index.jsx';
import { Assistants } from '../pages/Assistants/index.jsx';
import { Reports } from '../pages/Reports/index.jsx';
import { Settings } from '../pages/Settings/index.jsx';
import { Backup } from '../pages/Backup/index.jsx';
import { Verification } from '../pages/Verification/index.jsx';

export function Layout() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [settings, setSettings] = useState(null);
  const [panchangSummary, setPanchangSummary] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    async function loadHeaderPanchang() {
      try {
        const [sData, pData] = await Promise.all([
          api.getSettings(),
          api.getDailyPanchang()
        ]);
        setSettings(sData);
        if (pData?.angas) {
          setPanchangSummary({
            tithi: pData.angas.udayaTithi.name,
            paksha: pData.angas.udayaTithi.paksha,
            nakshatra: pData.angas.nakshatra.name
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadHeaderPanchang();
  }, []);

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard setTab={setCurrentTab} />;
      case 'panchang':
        return <Panchang />;
      case 'shraddha':
        return <Shraddha />;
      case 'clients':
        return <Clients />;
      case 'bookings':
        return <Bookings />;
      case 'calendar':
        return <Calendar />;
      case 'finance':
        return <Finance />;
      case 'inventory':
        return <Inventory />;
      case 'assistants':
        return <Assistants />;
      case 'reports':
        return <Reports />;
      case 'verification':
        return <Verification />;
      case 'backup':
        return <Backup />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setTab={setCurrentTab} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentTab={currentTab} setTab={setCurrentTab} collapsed={sidebarCollapsed} />
      <div className="main-wrapper">
        <Header
          panchangSummary={panchangSummary}
          settings={settings}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="page-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

