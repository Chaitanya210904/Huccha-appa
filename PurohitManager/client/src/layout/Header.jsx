import React from 'react';
import { useI18n } from '../hooks/useI18n.jsx';
import { TithiBadge } from '../components/TithiBadge.jsx';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { GURU_LEFT_BASE64, GURU_RIGHT_BASE64 } from '../assets/guruImagesBase64.js';

export function Header({ panchangSummary, settings, toggleSidebar, sidebarCollapsed }) {
  const { lang, setLang } = useI18n();

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          onClick={toggleSidebar}
          className="btn btn-secondary btn-sm"
          style={{ padding: '6px', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center' }}
          title={sidebarCollapsed ? "ಮೆನು ವಿಸ್ತರಿಸಿ (Expand Sidebar)" : "ಮೆನು ಮರೆಮಾಡಿ (Collapse Sidebar)"}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
        {panchangSummary ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TithiBadge
              tithi={panchangSummary.tithi}
              paksha={panchangSummary.paksha}
              nakshatra={panchangSummary.nakshatra}
            />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              📍 {settings?.cityName || 'Bengaluru'}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Loading Panchang...
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img
          src={GURU_LEFT_BASE64}
          alt="Guru Left"
          style={{ width: '30px', height: '35px', objectFit: 'cover', borderRadius: '50%', border: '1.5px solid #b45309', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
          title="ಶ್ರೀ ಚೈತನ್ಯಾಶ್ರಮ ಹೆಬ್ಬಳ್ಳಿ ಗುರುಗಳು"
        />
        <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#9a3412', letterSpacing: '0.01em' }}>
          ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ
        </span>
        <img
          src={GURU_RIGHT_BASE64}
          alt="Guru Right"
          style={{ width: '30px', height: '35px', objectFit: 'cover', borderRadius: '50%', border: '1.5px solid #b45309', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
          title="ಪೂಜ್ಯ ಗುರುಗಳು"
        />
      </div>

      <div className="header-right">
        <div className="lang-selector">
          <button
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
            onClick={() => setLang('en')}
          >
            English
          </button>
          <button
            className={`lang-btn ${lang === 'hi' ? 'active' : ''}`}
            onClick={() => setLang('hi')}
          >
            हिन्दी
          </button>
          <button
            className={`lang-btn ${lang === 'kn' ? 'active' : ''}`}
            onClick={() => setLang('kn')}
          >
            ಕನ್ನಡ
          </button>
        </div>
      </div>
    </header>
  );
}

