import React, { useState, useEffect } from 'react';
import { api } from '../../api/index.js';
import { useI18n } from '../../hooks/useI18n.jsx';
import { TithiBadge } from '../../components/TithiBadge.jsx';
import { Modal } from '../../components/Modal.jsx';
import {
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';

export function Panchang() {
  const { t } = useI18n();
  const [currentDate, setCurrentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState('blr');
  const [panchang, setPanchang] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sankalpa modal state
  const [sankalpaModalOpen, setSankalpaModalOpen] = useState(false);
  const [sankalpaResult, setSankalpaResult] = useState(null);
  const [sankalpaParams, setSankalpaParams] = useState({
    serviceType: 'satyanarayana',
    kartaName: '',
    gotra: 'Kashyapa',
    ancestorName: ''
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const cList = await api.getCities();
        setCities(cList || []);
      } catch (e) {}
    }
    init();
  }, []);

  useEffect(() => {
    async function fetchPanchang() {
      setLoading(true);
      try {
        const city = cities.find(c => c.id === selectedCityId) || { lat: 12.9716, lon: 77.5946 };
        const data = await api.getDailyPanchang({
          date: currentDate,
          lat: city.lat,
          lon: city.lon
        });
        setPanchang(data);
      } catch (err) {
        console.error('Error fetching panchang:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPanchang();
  }, [currentDate, selectedCityId, cities]);

  const changeDay = (delta) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + delta);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const handleGenerateSankalpa = async () => {
    try {
      const city = cities.find(c => c.id === selectedCityId);
      const res = await api.generateSankalpa({
        date: currentDate,
        client: { name: sankalpaParams.kartaName, gotra: sankalpaParams.gotra },
        serviceType: sankalpaParams.serviceType,
        ancestorName: sankalpaParams.ancestorName
      });
      setSankalpaResult(res);
      setSankalpaModalOpen(true);
    } catch (err) {
      alert("Failed to generate sankalpa: " + err.message);
    }
  };

  const copyText = (txt) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (iso) => {
    if (!iso) return '--';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading && !panchang) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Panchang...</div>;
  }

  const angas = panchang?.angas;
  const cal = panchang?.calendar;
  const sun = panchang?.sunData;
  const muhurtas = panchang?.muhurtas;

  return (
    <div>
      {/* Top Controls: Date and Place Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => changeDay(-1)}>
              <ChevronLeft size={16} /> Previous Day
            </button>
            <input
              type="date"
              className="form-control"
              style={{ width: '160px', padding: '6px 10px' }}
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
            />
            <button className="btn btn-secondary btn-sm" onClick={() => changeDay(1)}>
              Next Day <ChevronRight size={16} />
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentDate(new Date().toISOString().split('T')[0])}
            >
              Today
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} color="var(--primary)" />
              <select
                className="form-control"
                style={{ width: '180px', padding: '6px 10px' }}
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary btn-sm" onClick={handleGenerateSankalpa}>
              <Sparkles size={16} /> Generate Sankalpa
            </button>
          </div>
        </div>
      </div>

      {/* Main Header / Framed Calendar Box */}
      <div
        className="card"
        style={{
          borderLeft: '4px solid var(--primary)',
          background: '#fffdfa'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            {cal?.isThooguPanchanga && (
              <div style={{ marginBottom: '8px' }}>
                <span style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '3px 10px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700 }}>
                  🪔 {cal?.source}
                </span>
              </div>
            )}
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
              {cal?.samvatsara?.kannada ? `${cal?.samvatsara?.kannada} (${cal?.samvatsara?.name})` : cal?.samvatsara?.name} ಸಂವತ್ಸರ
              {cal?.samvatsara?.shaka ? ` • ಶಕ ${cal?.samvatsara?.shaka}` : ''}
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '4px', fontWeight: 600 }}>
              {cal?.ayana?.kannada || cal?.ayana?.sanskrit} • {cal?.ritu?.kannada || cal?.ritu?.sanskrit} ಋತು • {cal?.masa?.kannada || cal?.masa?.name} ಮಾಸ • {angas?.udayaTithi?.pakshaKannada || angas?.udayaTithi?.paksha} ಪಕ್ಷ • {angas?.vara?.kannada || angas?.vara?.sanskrit}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Solar Rashi: <strong>{cal?.solarRashi?.sanskrit}</strong> ({cal?.solarRashi?.english}) • Ayanamsa ({panchang?.ayanamsa?.system}): {panchang?.ayanamsa?.formatted}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', gap: '16px', background: '#f8fafc', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Sunrise</span>
                <span style={{ fontWeight: 600 }}>{formatTime(sun?.sunrise)}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Sunset</span>
                <span style={{ fontWeight: 600 }}>{formatTime(sun?.sunset)}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Dinamana</span>
                <span style={{ fontWeight: 600 }}>{sun?.dinamana}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Observances / Festivals Banner */}
      {(cal?.sankashtahara || cal?.ekadashi || cal?.hunnime || cal?.amavasya || cal?.isGovtHoliday || (panchang?.festivals && panchang.festivals.length > 0)) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {cal?.sankashtahara && (
            <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.25rem' }}>🌙</span>
              <div>
                <strong style={{ color: '#c2410c' }}>
                  ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ ({cal.sankashtahara.isAngaraki ? 'ಅಂಗಾರಕೀ ಸಂಕಷ್ಟಿ' : 'ಸಾಮಾನ್ಯ'})
                </strong>
                <span style={{ marginLeft: '12px', fontSize: '0.88rem', color: '#7c2d12' }}>
                  ಚಂದ್ರೋದಯ ಸಮಯ: <strong>{cal.sankashtahara.moonrise}</strong> (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)
                </span>
              </div>
            </div>
          )}

          {cal?.ekadashi && (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.25rem' }}>🌾</span>
              <div>
                <strong style={{ color: '#15803d' }}>
                  ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ ವ್ರತ: {cal.ekadashi.name} ({cal.ekadashi.englishName})
                </strong>
              </div>
            </div>
          )}

          {cal?.hunnime && (
            <div style={{ backgroundColor: '#fefce8', border: '1px solid #fef08a', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.25rem' }}>🌕</span>
              <div>
                <strong style={{ color: '#854d0e' }}>
                  ಹುಣ್ಣಿಮೆ: {cal.hunnime.name} ({cal.hunnime.englishName})
                </strong>
              </div>
            </div>
          )}

          {cal?.amavasya && (
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.25rem' }}>🌑</span>
              <div>
                <strong style={{ color: '#1e293b' }}>
                  ಅಮಾವಾಸ್ಯೆ: {cal.amavasya.name} ({cal.amavasya.englishName})
                </strong>
              </div>
            </div>
          )}

          {cal?.isGovtHoliday && cal?.holidayName && (
            <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.25rem' }}>🚩</span>
              <div>
                <strong style={{ color: '#b91c1c' }}>
                  ಸರ್ಕಾರಿ ಸಾರ್ವತ್ರಿಕ ರಜಾದಿನ: {cal.holidayName} {cal.holidayNameEn ? `(${cal.holidayNameEn})` : ''}
                </strong>
              </div>
            </div>
          )}

          {panchang?.festivals && panchang.festivals.length > 0 && (
            <div className="card" style={{ padding: '14px 18px', backgroundColor: '#fffdf5' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>
                🎉 ಇಂದಿನ ಉತ್ಸವಗಳು / ಧಾರ್ಮಿಕ ಆಚರಣೆಗಳು (Religious Events & Festivals):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {panchang.festivals.map((f, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: '#ffedd5',
                      color: '#9a3412',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: '1px solid #fed7aa'
                    }}
                  >
                    {f.kannada || f.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* The 5 Angas (Limbs) */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
        The Five Angas (ಪಂಚಾಂಗ ಅಂಗಗಳು)
      </h3>

      <div className="grid-3" style={{ marginBottom: '24px' }}>
        {/* 1. Tithi */}
        <div className="card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
            1. Tithi (ತಿಥಿ)
          </span>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 2px 0', color: '#1e293b' }}>
            {angas?.udayaTithi?.fullKannada || `${angas?.udayaTithi?.pakshaKannada || ''} ${angas?.udayaTithi?.kannada || ''}`}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {angas?.udayaTithi?.paksha} {angas?.udayaTithi?.name} (Udaya Tithi)
          </p>
          <div style={{ marginTop: '10px', fontSize: '0.8rem', background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
            <div>Starts: {formatTime(angas?.tithi?.startTime)}</div>
            <div>Ends: {formatTime(angas?.tithi?.endTime)}</div>
          </div>
        </div>

        {/* 2. Nakshatra */}
        <div className="card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
            2. Nakshatra (ನಕ್ಷತ್ರ)
          </span>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 2px 0', color: '#1e293b' }}>
            {angas?.nakshatra?.kannada || angas?.nakshatra?.name}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {angas?.nakshatra?.name} {angas?.nakshatra?.pada ? `• Pada ${angas?.nakshatra?.pada}` : ''}
          </p>
          <div style={{ marginTop: '10px', fontSize: '0.8rem', background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
            <div>Starts: {formatTime(angas?.nakshatra?.startTime)}</div>
            <div>Ends: {formatTime(angas?.nakshatra?.endTime)}</div>
          </div>
        </div>

        {/* 3. Yoga */}
        <div className="card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
            3. Yoga (ಯೋಗ)
          </span>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '6px 0 2px 0' }}>
            {angas?.yoga?.name}
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Index: {angas?.yoga?.index} of 27
          </p>
          <div style={{ marginTop: '10px', fontSize: '0.8rem', background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
            <div>Starts: {formatTime(angas?.yoga?.startTime)}</div>
            <div>Ends: {formatTime(angas?.yoga?.endTime)}</div>
          </div>
        </div>

        {/* 4. Karana */}
        <div className="card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
            4. Karana (ಕರಣ)
          </span>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '6px 0 2px 0' }}>
            {angas?.karana?.name}
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {angas?.karana?.isVishti ? '⚠️ Vishti (Bhadra Karana)' : 'Shubha Karana'}
          </p>
          <div style={{ marginTop: '10px', fontSize: '0.8rem', background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
            <div>Starts: {formatTime(angas?.karana?.startTime)}</div>
            <div>Ends: {formatTime(angas?.karana?.endTime)}</div>
          </div>
        </div>

        {/* 5. Vara */}
        <div className="card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
            5. Vara (ವಾರ)
          </span>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '6px 0 2px 0' }}>
            {angas?.vara?.sanskrit}
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Kannada: {angas?.vara?.kannada} • Deity: {angas?.vara?.deity}
          </p>
          <div style={{ marginTop: '10px', fontSize: '0.8rem', background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
            <div>Vedic Day: Runs Sunrise to Sunrise</div>
          </div>
        </div>

        {/* Daytime Divisions (Pancha-Bhaga) */}
        <div className="card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c2410c', textTransform: 'uppercase' }}>
            Pancha-Bhaga (ಪಂಚ ಭಾಗಗಳು)
          </span>
          <div style={{ fontSize: '0.8rem', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>Pratah: {formatTime(sun?.panchaBhaga?.pratah?.start)} - {formatTime(sun?.panchaBhaga?.pratah?.end)}</div>
            <div>Sangava: {formatTime(sun?.panchaBhaga?.sangava?.start)} - {formatTime(sun?.panchaBhaga?.sangava?.end)}</div>
            <div>Madhyahna: {formatTime(sun?.panchaBhaga?.madhyahna?.start)} - {formatTime(sun?.panchaBhaga?.madhyahna?.end)}</div>
            <div style={{ fontWeight: 700, color: '#c2410c' }}>
              Aparahna (Shraddha): {formatTime(sun?.panchaBhaga?.aparahna?.start)} - {formatTime(sun?.panchaBhaga?.aparahna?.end)}
            </div>
            <div>Sayahna: {formatTime(sun?.panchaBhaga?.sayahna?.start)} - {formatTime(sun?.panchaBhaga?.sayahna?.end)}</div>
          </div>
        </div>
      </div>

      {/* Muhurta Table & Day Choghadiya */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Auspicious & Inauspicious Muhurtas</h3>
          </div>
          <table style={{ fontSize: '0.875rem' }}>
            <tbody>
              <tr>
                <td><strong>Abhijit Muhurta (ಅಭಿಜಿತ್)</strong></td>
                <td style={{ color: '#15803d', fontWeight: 600 }}>
                  {formatTime(muhurtas?.abhijit?.start)} - {formatTime(muhurtas?.abhijit?.end)}
                </td>
                <td>Highly Auspicious</td>
              </tr>
              <tr>
                <td><strong>Brahma Muhurta (ಬ್ರಹ್ಮ ಮುಹೂರ್ತ)</strong></td>
                <td>{formatTime(muhurtas?.brahmaMuhurta?.start)} - {formatTime(muhurtas?.brahmaMuhurta?.end)}</td>
                <td>Spiritual / Yoga</td>
              </tr>
              <tr>
                <td><strong>Rahu Kala (ರಾಹುಕಾಲ)</strong></td>
                <td style={{ color: '#b91c1c', fontWeight: 600 }}>
                  {formatTime(muhurtas?.rahuKala?.start)} - {formatTime(muhurtas?.rahuKala?.end)}
                </td>
                <td>Inauspicious</td>
              </tr>
              <tr>
                <td><strong>Gulika Kala (ಗುಳಿಕಕಾಲ)</strong></td>
                <td>{formatTime(muhurtas?.gulikaKala?.start)} - {formatTime(muhurtas?.gulikaKala?.end)}</td>
                <td>Neutral / Saturn</td>
              </tr>
              <tr>
                <td><strong>Yamaganda (ಯಮಗಂಡ)</strong></td>
                <td>{formatTime(muhurtas?.yamagandaKala?.start)} - {formatTime(muhurtas?.yamagandaKala?.end)}</td>
                <td>Inauspicious</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Day Choghadiya (ಹಗಲಿನ ಚೌಘಡಿಯ)</h3>
          </div>
          <table style={{ fontSize: '0.85rem' }}>
            <thead>
              <tr>
                <th>Choghadiya</th>
                <th>Time Window</th>
                <th>Quality</th>
              </tr>
            </thead>
            <tbody>
              {muhurtas?.dayChoghadiyas?.map((ch, i) => (
                <tr key={i}>
                  <td><strong>{ch.name}</strong> ({ch.ruler})</td>
                  <td>{formatTime(ch.start)} - {formatTime(ch.end)}</td>
                  <td>
                    <span
                      className={`badge ${
                        ch.quality === 'Best' || ch.quality === 'Auspicious'
                          ? 'badge-success'
                          : ch.quality === 'Neutral'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                    >
                      {ch.quality}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sankalpa Generator Modal */}
      <Modal
        isOpen={sankalpaModalOpen}
        onClose={() => setSankalpaModalOpen(false)}
        title="Vedic Sankalpa Generator (ಸಂಕಲ್ಪ ವಾಚನ)"
        maxWidth="750px"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label className="form-label">Service Type</label>
            <select
              className="form-control"
              value={sankalpaParams.serviceType}
              onChange={(e) => setSankalpaParams({ ...sankalpaParams, serviceType: e.target.value })}
            >
              <option value="satyanarayana">Sri Satyanarayana Vrata</option>
              <option value="ganapati_homa">Maha Ganapati Homa</option>
              <option value="shraddha">Pratyabdika Shraddha</option>
              <option value="navagraha_homa">Navagraha Homa</option>
              <option value="vivaha">Vivaha Samskara</option>
              <option value="upanayana">Upanayana Samskara</option>
            </select>
          </div>

          <div>
            <label className="form-label">Client / Karta Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Srinivas Sharma"
              value={sankalpaParams.kartaName}
              onChange={(e) => setSankalpaParams({ ...sankalpaParams, kartaName: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Gotra</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Kashyapa, Bharadwaja"
              value={sankalpaParams.gotra}
              onChange={(e) => setSankalpaParams({ ...sankalpaParams, gotra: e.target.value })}
            />
          </div>

          {sankalpaParams.serviceType === 'shraddha' && (
            <div>
              <label className="form-label">Deceased / Pitru Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Ramachandra Sharma"
                value={sankalpaParams.ancestorName}
                onChange={(e) => setSankalpaParams({ ...sankalpaParams, ancestorName: e.target.value })}
              />
            </div>
          )}
        </div>

        <button className="btn btn-secondary btn-sm" style={{ marginBottom: '16px' }} onClick={handleGenerateSankalpa}>
          Regenerate Sankalpa
        </button>

        {sankalpaResult && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong>Sanskrit (Devanagari):</strong>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => copyText(sankalpaResult.devanagariText)}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />} Copy
                </button>
              </div>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {sankalpaResult.devanagariText}
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong>Kannada Script (ಕನ್ನಡ ಲಿಪಿ):</strong>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => copyText(sankalpaResult.kannadaText)}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />} Copy
                </button>
              </div>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {sankalpaResult.kannadaText}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

