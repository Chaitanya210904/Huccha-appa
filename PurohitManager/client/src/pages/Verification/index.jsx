import React, { useState, useEffect } from 'react';
import { api } from '../../api/index.js';
import { useI18n } from '../../hooks/useI18n.jsx';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export function Verification() {
  const { t } = useI18n();
  const [testDate, setTestDate] = useState('2026-04-14'); // Mesha Sankranti / Solar New Year
  const [testCity, setTestCity] = useState({ lat: 12.9716, lon: 77.5946, name: 'Bengaluru' });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Benchmarked reference dates for verification
  const benchmarkCases = [
    {
      title: "Chaitra Shukla Pratipada (Ugadi 2026)",
      date: "2026-03-20",
      description: "Beginning of Parabhava Samvatsara, Chaitra Masa",
      referenceTithi: "Prathama",
      referencePaksha: "Shukla"
    },
    {
      title: "Mesha Sankranti 2026 (Solar New Year)",
      date: "2026-04-14",
      description: "Sun enters Sidereal Mesha (Aries)",
      referenceRashi: "Mesha",
      referenceAyana: "Uttarayana"
    },
    {
      title: "Guru Purnima 2026",
      date: "2026-07-29",
      description: "Ashadha Purnima (Vyasa Puja)",
      referenceTithi: "Purnima",
      referencePaksha: "Shukla"
    },
    {
      title: "Sarva Pitru Amavasya 2026 (Mahalaya)",
      date: "2026-10-10",
      description: "End of Pitru Paksha",
      referenceTithi: "Amavasya",
      referencePaksha: "Krishna"
    }
  ];

  const runVerification = async (dateStr) => {
    setLoading(true);
    try {
      const data = await api.getDailyPanchang({
        date: dateStr,
        lat: testCity.lat,
        lon: testCity.lon
      });
      setResults(data);
    } catch (e) {
      alert("Verification error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runVerification(testDate);
  }, [testDate]);

  return (
    <div>
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Panchang Cross-Check & Verification (ಪಂಚಾಂಗ ಮೌಲ್ಯಮಾಪನ)
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Test Date:</span>
            <input
              type="date"
              className="form-control"
              style={{ width: '160px', padding: '4px 8px' }}
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Benchmark Presets */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 className="card-title" style={{ marginBottom: '12px' }}>
          Standard Benchmark Test Cases
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {benchmarkCases.map((b, i) => (
            <div
              key={i}
              onClick={() => setTestDate(b.date)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid ${testDate === b.date ? 'var(--primary)' : 'var(--border)'}`,
                backgroundColor: testDate === b.date ? '#fff7ed' : '#f8fafc',
                cursor: 'pointer'
              }}
            >
              <strong style={{ fontSize: '0.9rem' }}>{b.title}</strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {b.date} • {b.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Output */}
      {results && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Calculated Astronomical Parameters</h3>
            </div>
            <table style={{ fontSize: '0.875rem' }}>
              <tbody>
                <tr>
                  <td><strong>Ayanamsa System</strong></td>
                  <td>{results.ayanamsa?.system} (Chitra Paksha)</td>
                </tr>
                <tr>
                  <td><strong>Ayanamsa Value</strong></td>
                  <td><strong>{results.ayanamsa?.formatted}</strong> ({results.ayanamsa?.degrees.toFixed(5)}°)</td>
                </tr>
                <tr>
                  <td><strong>Sunrise (Upper Limb)</strong></td>
                  <td>{results.sunData?.sunrise ? new Date(results.sunData.sunrise).toLocaleTimeString() : '--'}</td>
                </tr>
                <tr>
                  <td><strong>Sunset</strong></td>
                  <td>{results.sunData?.sunset ? new Date(results.sunData.sunset).toLocaleTimeString() : '--'}</td>
                </tr>
                <tr>
                  <td><strong>Day Duration (Dinamana)</strong></td>
                  <td>{results.sunData?.dinamana}</td>
                </tr>
                <tr>
                  <td><strong>Solar Rashi</strong></td>
                  <td>{results.calendar?.solarRashi?.sanskrit} ({results.calendar?.solarRashi?.english})</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Vedic Five Angas (Verification)</h3>
            </div>
            <table style={{ fontSize: '0.875rem' }}>
              <tbody>
                <tr>
                  <td><strong>Udaya Tithi</strong></td>
                  <td>
                    <strong>{results.angas?.udayaTithi?.name}</strong> ({results.angas?.udayaTithi?.paksha} Paksha)
                  </td>
                </tr>
                <tr>
                  <td><strong>Tithi Start / End</strong></td>
                  <td style={{ fontSize: '0.8rem' }}>
                    {results.angas?.tithi?.startTime ? new Date(results.angas.tithi.startTime).toLocaleTimeString() : '--'} to {results.angas?.tithi?.endTime ? new Date(results.angas.tithi.endTime).toLocaleTimeString() : '--'}
                  </td>
                </tr>
                <tr>
                  <td><strong>Nakshatra & Pada</strong></td>
                  <td>
                    <strong>{results.angas?.nakshatra?.name}</strong> (Pada {results.angas?.nakshatra?.pada})
                  </td>
                </tr>
                <tr>
                  <td><strong>Yoga</strong></td>
                  <td>{results.angas?.yoga?.name}</td>
                </tr>
                <tr>
                  <td><strong>Karana</strong></td>
                  <td>{results.angas?.karana?.name}</td>
                </tr>
                <tr>
                  <td><strong>Vedic Weekday (Vara)</strong></td>
                  <td>{results.angas?.vara?.sanskrit} ({results.angas?.vara?.devanagari})</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

