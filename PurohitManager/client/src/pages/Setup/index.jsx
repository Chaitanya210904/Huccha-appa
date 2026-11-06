import React, { useState } from 'react';
import { api } from '../../api/index.js';

export function Setup({ onComplete }) {
  const [form, setForm] = useState({
    purohitName: 'Pandit Venkatesha Sharma',
    title: 'Rigveda Samhita / Smartha Purohit',
    phone: '',
    cityName: 'Bengaluru',
    cityId: 'blr',
    latitude: 12.9716,
    longitude: 77.5946,
    sampradaya: 'Smartha',
    ayanamsa: 'Lahiri'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateSettings(form);
      if (onComplete) onComplete();
    } catch (err) {
      alert("Setup error: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '60px auto', padding: '32px', background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span style={{ fontSize: '3rem' }}>🪔</span>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#9a3412', marginTop: '8px' }}>
          ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Chaitanya Krupa Mukthi Dham - Vedic Services & Management System
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Your Full Name *</label>
          <input
            type="text"
            className="form-control"
            value={form.purohitName}
            onChange={(e) => setForm({ ...form, purohitName: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Title / Veda Shakha</label>
          <input
            type="text"
            className="form-control"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tradition / Sampradaya</label>
          <select
            className="form-control"
            value={form.sampradaya}
            onChange={(e) => setForm({ ...form, sampradaya: e.target.value })}
          >
            <option value="Smartha">Smartha (Dharma Sindhu / Nirnaya Sindhu)</option>
            <option value="Madhva">Madhva (Sumadhva Tradition)</option>
            <option value="Vaishnava">Sri Vaishnava (Ahobila / Munitraya)</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '12px' }}>
          Complete Initial Setup & Enter Dashboard
        </button>
      </form>
    </div>
  );
}

