import React, { useState, useEffect } from 'react';
import { api } from '../../api/index.js';
import { useI18n } from '../../hooks/useI18n.jsx';
import { Settings as SettingsIcon, Save, Database, Check } from 'lucide-react';

export function Settings() {
  const { t } = useI18n();
  const [settings, setSettings] = useState(null);
  const [cities, setCities] = useState([]);
  const [saved, setSaved] = useState(false);
  const [demoLoaded, setDemoLoaded] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [sData, cList] = await Promise.all([
          api.getSettings(),
          api.getCities()
        ]);
        setSettings(sData);
        setCities(cList || []);
      } catch (e) {
        console.error(e);
      }
    }
    init();
  }, []);

  const handleCityChange = (cityId) => {
    const found = cities.find(c => c.id === cityId);
    if (found) {
      setSettings({
        ...settings,
        cityId: found.id,
        cityName: found.name,
        latitude: found.lat,
        longitude: found.lon,
        timezone: found.tz
      });
    }
  };

  const handleSave = async () => {
    try {
      await api.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert("Error saving settings: " + e.message);
    }
  };

  const handleSeedDemo = async () => {
    if (!window.confirm("Load sample demo clients, ancestors, bookings, and payments? This will populate your system with test records.")) return;
    try {
      await api.seedDemoData();
      setDemoLoaded(true);
      setTimeout(() => setDemoLoaded(false), 3000);
      const updated = await api.getSettings();
      setSettings(updated);
      alert("Demo data loaded successfully! You can explore Clients, Shraddha, and Bookings now.");
    } catch (e) {
      alert("Error loading demo data: " + e.message);
    }
  };

  if (!settings) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading settings...</div>;
  }

  return (
    <div>
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SettingsIcon size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Settings & Configuration (ವ್ಯವಸ್ಥಾಪನೆ)</h2>
          </div>

          <button className="btn btn-primary" onClick={handleSave}>
            {saved ? <Check size={16} /> : <Save size={16} />} Save Settings
          </button>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Purohit Profile */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Purohit Profile & Letterhead</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              value={settings.purohitName}
              onChange={(e) => setSettings({ ...settings, purohitName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Title / Veda Shakha</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Rigveda Samhita / Smartha Purohit"
              value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number (Printed on receipts)</label>
            <input
              type="text"
              className="form-control"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">UPI ID for Dakshina</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. purohit@upi"
              value={settings.upiId}
              onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
            />
          </div>
        </div>

        {/* Right Column: Location & Tradition Preferences */}
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Location & Tradition</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Default City / Place</label>
              <select
                className="form-control"
                value={settings.cityId}
                onChange={(e) => handleCityChange(e.target.value)}
              >
                {cities.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.state})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Latitude (°N)</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  value={settings.latitude}
                  onChange={(e) => setSettings({ ...settings, latitude: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="form-label">Longitude (°E)</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  value={settings.longitude}
                  onChange={(e) => setSettings({ ...settings, longitude: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Sampradaya (Tradition)</label>
              <select
                className="form-control"
                value={settings.sampradaya}
                onChange={(e) => setSettings({ ...settings, sampradaya: e.target.value })}
              >
                <option value="Smartha">Smartha (Dharma Sindhu / Nirnaya Sindhu)</option>
                <option value="Madhva">Madhva (Sumadhva / Matha Panchanga)</option>
                <option value="Vaishnava">Sri Vaishnava (Ahobila / Munitraya)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ayanamsa System</label>
              <select
                className="form-control"
                value={settings.ayanamsa}
                onChange={(e) => setSettings({ ...settings, ayanamsa: e.target.value })}
              >
                <option value="Lahiri">Lahiri / Chitra Paksha (Standard Indian Calendar)</option>
                <option value="Raman">B. V. Raman</option>
                <option value="KP">Krishnamurti Paddhati (KP)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Lunar Month System (Masa)</label>
              <select
                className="form-control"
                value={settings.calendarSystem}
                onChange={(e) => setSettings({ ...settings, calendarSystem: e.target.value })}
              >
                <option value="Amanta">Amanta (South India: Karnataka, Maharashtra, AP, TN, Kerala)</option>
                <option value="Purnimanta">Purnimanta (North India: UP, MP, Bihar, Rajasthan)</option>
              </select>
            </div>
          </div>

          {/* Demo Seed Box */}
          <div className="card" style={{ background: '#f8fafc', border: '1px solid var(--border)' }}>
            <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Demo Data Setup</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Populate the database with realistic sample clients, deceased ancestors with lunar tithis, scheduled bookings, and payments.
            </p>
            <button className="btn btn-secondary btn-sm" onClick={handleSeedDemo}>
              <Database size={14} /> Load Sample Demo Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

