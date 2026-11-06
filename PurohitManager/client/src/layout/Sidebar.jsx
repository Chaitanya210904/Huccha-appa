import React from 'react';
import { GURU_LEFT_BASE64, GURU_RIGHT_BASE64 } from '../assets/guruImagesBase64.js';
import {
  LayoutDashboard,
  Sun,
  Flame,
  Users,
  CalendarCheck,
  Calendar as CalendarIcon,
  Receipt,
  Package,
  UserCheck,
  BarChart3,
  CheckCircle,
  Database,
  Settings
} from 'lucide-react';
import { useI18n } from '../hooks/useI18n.jsx';

export function Sidebar({ currentTab, setTab, collapsed }) {
  const { t } = useI18n();

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'panchang', label: t('nav.panchang'), icon: Sun },
    { id: 'shraddha', label: t('nav.shraddha'), icon: Flame },
    { id: 'clients', label: t('nav.clients'), icon: Users },
    { id: 'bookings', label: t('nav.bookings'), icon: CalendarCheck },
    { id: 'calendar', label: t('nav.calendar'), icon: CalendarIcon },
    { id: 'finance', label: t('nav.finance'), icon: Receipt },
    { id: 'inventory', label: t('nav.inventory'), icon: Package },
    { id: 'assistants', label: t('nav.assistants'), icon: UserCheck },
    { id: 'reports', label: t('nav.reports'), icon: BarChart3 },
    { id: 'verification', label: t('nav.verification'), icon: CheckCircle },
    { id: 'backup', label: t('nav.backup'), icon: Database },
    { id: 'settings', label: t('nav.settings'), icon: Settings }
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header" style={{ padding: collapsed ? '12px 6px' : '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <img
            src={GURU_LEFT_BASE64}
            alt="Guru Left"
            style={{
              width: collapsed ? '30px' : '38px',
              height: collapsed ? '35px' : '44px',
              objectFit: 'cover',
              borderRadius: '50%',
              border: '2px solid #fcd34d',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              backgroundColor: '#fff'
            }}
            title="ಶ್ರೀ ಚೈತನ್ಯಾಶ್ರಮ ಹೆಬ್ಬಳ್ಳಿ ಗುರುಗಳು"
          />
          {!collapsed && <span style={{ fontSize: '1.4rem' }}>🪔</span>}
          <img
            src={GURU_RIGHT_BASE64}
            alt="Guru Right"
            style={{
              width: collapsed ? '30px' : '38px',
              height: collapsed ? '35px' : '44px',
              objectFit: 'cover',
              borderRadius: '50%',
              border: '2px solid #fcd34d',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              backgroundColor: '#fff'
            }}
            title="ಪೂಜ್ಯ ಗುರುಗಳು"
          />
        </div>
        {!collapsed && (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '0.98rem', lineHeight: '1.3', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '0.01em' }}>
              ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ
            </h1>
            <p style={{ fontSize: '0.72rem', color: '#fcd34d', fontWeight: 600, letterSpacing: '0.02em', margin: '2px 0 0 0' }}>
              Chaitanya Krupa Mukthi Dham
            </p>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <span>Offline-First v1.0</span>
        <span style={{ color: '#22c55e' }}>● Local</span>
      </div>
    </aside>
  );
}

