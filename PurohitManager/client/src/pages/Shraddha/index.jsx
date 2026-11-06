import React, { useState, useEffect } from 'react';
import { api } from '../../api/index.js';
import { useI18n } from '../../hooks/useI18n.jsx';
import { Modal } from '../../components/Modal.jsx';
import {
  Flame,
  Calendar,
  Send,
  Sparkles,
  Info,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  FileText,
  Printer,
  Clock,
  ListChecks,
  Users
} from 'lucide-react';

export function Shraddha() {
  const { t, lang } = useI18n();
  const [activeSubTab, setActiveSubTab] = useState('upcoming_pujas'); // 'upcoming_pujas', 'upcoming', 'calculator', 'mahalaya'
  const [upcoming, setUpcoming] = useState([]);
  const [upcomingPujas, setUpcomingPujas] = useState([]);
  const [clients, setClients] = useState([]);
  const [deceasedList, setDeceasedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pujaFilter, setPujaFilter] = useState('all'); // 'all', 'today', 'week', 'month'

  // Calculator state
  const [selectedDeceasedId, setSelectedDeceasedId] = useState('');
  const [targetYear, setTargetYear] = useState(new Date().getFullYear());
  const [calculationResult, setCalculationResult] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);

  // Mahalaya state
  const [mahalayaData, setMahalayaData] = useState(null);
  const [mahalayaYear, setMahalayaYear] = useState(new Date().getFullYear());

  // Reminder message modal state
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [messageClientPhone, setMessageClientPhone] = useState('');
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState(null);

  // Samagri checklist modal for tracker
  const [checklistModalOpen, setChecklistModalOpen] = useState(false);
  const [activePuja, setActivePuja] = useState(null);
  const [pujaSamagriItems, setPujaSamagriItems] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const today = new Date(todayStr);

      const [upData, dList, setts, bList, cList] = await Promise.all([
        api.getUpcomingShraddhas(30),
        api.getDeceased(),
        api.getSettings(),
        api.getBookings(),
        api.getClients()
      ]);

      setUpcoming(upData || []);
      setDeceasedList(dList || []);
      setSettings(setts || null);
      setClients(cList || []);

      const pujas = (bList || [])
        .filter(b => b.status !== 'cancelled' && b.date >= todayStr)
        .map(b => {
          const bDate = new Date(b.date);
          const diffTime = bDate.getTime() - today.getTime();
          const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const client = (cList || []).find(c => c.id === b.clientId);
          return {
            ...b,
            daysLeft,
            clientPhone: client?.phone || '',
            clientGotra: client?.gotra || ''
          };
        })
        .sort((a, b) => a.daysLeft - b.daysLeft || a.time.localeCompare(b.time));

      setUpcomingPujas(pujas);

      if (dList && dList.length > 0) {
        setSelectedDeceasedId(dList[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleCalculateAnnual = async () => {
    setCalcLoading(true);
    try {
      const res = await api.calculateAnnualShraddha({
        deceasedId: selectedDeceasedId,
        targetYear: Number(targetYear)
      });
      setCalculationResult(res);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setCalcLoading(false);
    }
  };

  const handleLoadMahalaya = async (yr) => {
    try {
      const data = await api.getMahalaya(yr);
      setMahalayaData(data);
    } catch (err) {
      alert("Error loading Mahalaya: " + err.message);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'mahalaya' && !mahalayaData) {
      handleLoadMahalaya(mahalayaYear);
    }
  }, [activeSubTab]);

  const openReminderModal = async (s) => {
    try {
      const res = await api.generateMessage({
        type: 'shraddhaReminder',
        params: {
          clientName: s.clientName,
          purohitName: settings?.purohitName || 'ಪುರೋಹಿತರು',
          phone: settings?.phone || '',
          deceasedName: s.deceasedName,
          relation: s.relation,
          date: s.scheduledDate,
          tithi: s.tithiName,
          masa: s.masa,
          aparahnaStart: s.details?.aparahnaStart ? new Date(s.details.aparahnaStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '1:30 PM'
        },
        lang: lang === 'hi' ? 'hi' : lang === 'kn' ? 'kn' : 'en'
      });
      setGeneratedMessage(res.message);
      setMessageClientPhone(s.clientPhone || '');
      setMessageModalOpen(true);
    } catch (e) {
      alert("Error generating message: " + e.message);
    }
  };

  const openBookingReminderModal = async (b) => {
    try {
      const res = await api.generateMessage({
        type: 'bookingReminder',
        params: {
          clientName: b.clientName,
          serviceName: b.serviceName,
          date: b.date,
          time: b.time,
          venue: b.venue,
          purohitName: settings?.purohitName || 'ಪುರೋಹಿತರು',
          phone: settings?.phone || ''
        },
        lang: lang === 'hi' ? 'hi' : lang === 'kn' ? 'kn' : 'en'
      });
      setGeneratedMessage(res.message);
      setMessageClientPhone(b.clientPhone || '');
      setMessageModalOpen(true);
    } catch (e) {
      alert("Error generating message: " + e.message);
    }
  };

  const openPujaChecklist = async (b) => {
    setActivePuja(b);
    if (b.samagriChecklist && b.samagriChecklist.length > 0) {
      setPujaSamagriItems(b.samagriChecklist);
    } else {
      try {
        const res = await api.getSamagriTemplate(b.serviceId);
        const items = res?.items || res?.data?.items || [];
        setPujaSamagriItems(items);
      } catch (e) {
        setPujaSamagriItems([]);
      }
    }
    setChecklistModalOpen(true);
  };

  const copyToClipboard = (txt) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsApp = () => {
    const cleanPhone = messageClientPhone.replace(/[^0-9]/g, '');
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(generatedMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(generatedMessage)}`;
    window.open(url, '_blank');
  };

  const filteredUpcomingPujas = upcomingPujas.filter(b => {
    if (pujaFilter === 'today') return b.daysLeft === 0;
    if (pujaFilter === 'week') return b.daysLeft <= 7;
    if (pujaFilter === 'month') return b.daysLeft <= 30;
    return true;
  });

  return (
    <div>
      {/* Sub Tabs Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeSubTab === 'upcoming_pujas' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('upcoming_pujas')}
          style={{ fontWeight: 700 }}
        >
          <span>🪔</span> ಮುಂಬರುವ ಪೂಜೆಗಳು (Upcoming Pujas) ({upcomingPujas.length})
        </button>
        <button
          className={`btn ${activeSubTab === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('upcoming')}
          style={{ fontWeight: 700 }}
        >
          <Flame size={16} /> ವಾರ್ಷಿಕ ಶ್ರಾದ್ಧಗಳು (Annual Shraddhas) ({upcoming.length})
        </button>
        <button
          className={`btn ${activeSubTab === 'calculator' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('calculator')}
          style={{ fontWeight: 700 }}
        >
          <Sparkles size={16} /> ಶ್ರಾದ್ಧ ದಿನಾಂಕ ಗಣಕ (Date Calculator)
        </button>
        <button
          className={`btn ${activeSubTab === 'mahalaya' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('mahalaya')}
          style={{ fontWeight: 700 }}
        >
          <Calendar size={16} /> ಮಹಾಲಯ ಪಕ್ಷ (Pitru Paksha)
        </button>
      </div>

      {/* TAB 0: ALL UPCOMING PUJAS & HOMAS TRACKER */}
      {activeSubTab === 'upcoming_pujas' && (
        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 className="card-title">ಮುಂಬರುವ ಪೂಜಾ ಮತ್ತು ಹೋಮ ಕಾರ್ಯಕ್ರಮಗಳ ಟ್ರ್ಯಾಕರ್</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ಯಜಮಾನರಿಗೆ ನಿಗದಿಯಾಗಿರುವ ಎಲ್ಲಾ ಪೂಜೆಗಳು, ಮುಹೂರ್ತ, ಸಾಮಗ್ರಿ ಸಿದ್ಧತೆ ಮತ್ತು ವಾಟ್ಸಾಪ್ ನೆನಪೋಲೆ
              </p>
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className={`btn btn-sm ${pujaFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPujaFilter('all')}
              >
                ಎಲ್ಲಾ ({upcomingPujas.length})
              </button>
              <button
                className={`btn btn-sm ${pujaFilter === 'today' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPujaFilter('today')}
              >
                ಇಂದು ({upcomingPujas.filter(b => b.daysLeft === 0).length})
              </button>
              <button
                className={`btn btn-sm ${pujaFilter === 'week' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPujaFilter('week')}
              >
                ಮುಂದಿನ ೭ ದಿನಗಳು ({upcomingPujas.filter(b => b.daysLeft <= 7).length})
              </button>
              <button
                className={`btn btn-sm ${pujaFilter === 'month' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPujaFilter('month')}
              >
                ಈ ತಿಂಗಳು ({upcomingPujas.filter(b => b.daysLeft <= 30).length})
              </button>
            </div>
          </div>

          {filteredUpcomingPujas.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              ಯಾವುದೇ ಮುಂಬರುವ ಪೂಜೆಗಳು ನಿಗದಿಯಾಗಿಲ್ಲ. (No upcoming pujas found).
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr style={{ backgroundColor: '#fdfaf5' }}>
                    <th>ಪೂಜೆ / ಸೇವೆ (Ceremony)</th>
                    <th>ಯಜಮಾನರು (Client)</th>
                    <th>ದಿನಾಂಕ & ಮುಹೂರ್ತ (Date & Time)</th>
                    <th>ಸ್ಥಳ (Venue)</th>
                    <th>ದಕ್ಷಿಣೆ (Dakshina)</th>
                    <th>ಸಾಮಗ್ರಿ ಪಟ್ಟಿ (Samagri)</th>
                    <th style={{ textAlign: 'center' }}>ಕ್ರಮ (WhatsApp Reminder)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUpcomingPujas.map((b) => {
                    const isToday = b.daysLeft === 0;
                    const isTomorrow = b.daysLeft === 1;
                    const isSoon = b.daysLeft <= 3;

                    return (
                      <tr key={b.id} style={{ backgroundColor: isToday ? '#fff7ed' : '#ffffff' }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '1.1rem' }}>🪔</span>
                            <strong style={{ color: '#b93815', fontSize: '0.95rem' }}>{b.serviceName}</strong>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            ಸ್ಥಿತಿ: <span className="badge badge-warning">{b.status}</span>
                          </div>
                        </td>

                        <td>
                          <strong>{b.clientName}</strong>
                          {b.clientPhone && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              📱 {b.clientPhone}
                            </div>
                          )}
                          {b.clientGotra && (
                            <div style={{ fontSize: '0.72rem', color: '#9a3412' }}>
                              ಗೋತ್ರ: {b.clientGotra}
                            </div>
                          )}
                        </td>

                        <td>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{b.date}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> {b.time}
                          </div>
                          <span
                            className={`badge ${isToday ? 'badge-danger' : isTomorrow ? 'badge-warning' : isSoon ? 'badge-primary' : 'badge-neutral'}`}
                            style={{ marginTop: '4px', fontSize: '0.7rem' }}
                          >
                            {isToday ? 'ಇಂದೇ ಪೂಜೆ (Today!)' : isTomorrow ? 'ನಾಳೆ (Tomorrow)' : `ಇನ್ನೂ ${b.daysLeft} ದಿನಗಳಲ್ಲಿ`}
                          </span>
                        </td>

                        <td style={{ maxWidth: '180px', fontSize: '0.85rem' }}>
                          {b.venue || 'ಯಜಮಾನರ ನಿವಾಸ'}
                        </td>

                        <td>
                          <div style={{ fontWeight: 700 }}>₹{b.dakshina}</div>
                          <span style={{ fontSize: '0.7rem', color: (b.paidAmount || 0) >= b.dakshina ? '#15803d' : '#b45309', fontWeight: 600 }}>
                            {(b.paidAmount || 0) >= b.dakshina ? 'ಸ್ವೀಕೃತವಾಗಿದೆ (Paid)' : `ಬಾಕಿ: ₹${b.dakshina - (b.paidAmount || 0)}`}
                          </span>
                        </td>

                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => openPujaChecklist(b)}
                            title="View / Print Samagri List"
                          >
                            <FileText size={13} /> ಸಾಮಗ್ರಿ ಪರಿಶೀಲಿಸಿ
                          </button>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ backgroundColor: '#16a34a', borderColor: '#15803d' }}
                            onClick={() => openBookingReminderModal(b)}
                            title="Send WhatsApp Reminder"
                          >
                            <Send size={13} /> WhatsApp ನೆನಪೋಲೆ
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 1: UPCOMING SHRADDHAS */}
      {activeSubTab === 'upcoming' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('shraddha.upcomingTitle')}</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing next 30 days
            </span>
          </div>

          {upcoming.length === 0 ? (
            <p style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              {t('shraddha.noUpcoming')}
            </p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Ancestor Name & Relation</th>
                    <th>Client (Yajamana)</th>
                    <th>Masa & Tithi</th>
                    <th>Scheduled Date</th>
                    <th>Aparahna Timing</th>
                    <th>Tradition Decision</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map((s, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{s.deceasedName}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {s.relation} • Gotra: {s.gotra}
                        </div>
                      </td>
                      <td>
                        <strong>{s.clientName}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {s.clientPhone}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-warning">
                          {s.masa} {s.tithiName}
                        </span>
                      </td>
                      <td>
                        <strong>{s.scheduledDate}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#c2410c' }}>
                          {s.daysLeft === 0 ? 'Today!' : s.daysLeft === 1 ? 'Tomorrow' : `In ${s.daysLeft} days`}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>
                          {s.details?.aparahnaStart ? `${new Date(s.details.aparahnaStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(s.details.aparahnaEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '--'}
                        </span>
                      </td>
                      <td style={{ maxWidth: '240px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {s.explanation}
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => openReminderModal(s)}
                        >
                          <Send size={14} /> Send Reminder
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ANNUAL DATE CALCULATOR & CANDIDATES */}
      {activeSubTab === 'calculator' && (
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 className="card-title" style={{ marginBottom: '16px' }}>
              Select Ancestor to Calculate Annual Shraddha Date
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
              <div>
                <label className="form-label">Select Deceased Ancestor</label>
                <select
                  className="form-control"
                  value={selectedDeceasedId}
                  onChange={(e) => setSelectedDeceasedId(e.target.value)}
                >
                  {deceasedList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.relation}) - Client: {d.clientName} ({d.masa} {d.tithiName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Target Year</label>
                <input
                  type="number"
                  className="form-control"
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleCalculateAnnual}
                disabled={calcLoading}
              >
                {calcLoading ? 'Calculating...' : 'Evaluate Candidates'}
              </button>
            </div>
          </div>

          {calculationResult && (
            <div className="card">
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '20px'
                }}
              >
                <h4 style={{ color: '#166534', fontSize: '1.1rem', fontWeight: 700 }}>
                  Recommended Shraddha Date: {calculationResult.recommendedDate}
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#15803d', marginTop: '4px' }}>
                  <strong>Tradition Rule Applied ({calculationResult.sampradaya}):</strong> {calculationResult.explanation}
                </p>
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>
                Evaluated Candidate Days (ಪರಿಶೀಲಿಸಿದ ದಿನಗಳು)
              </h4>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Candidate Date</th>
                      <th>Sunrise / Sunset</th>
                      <th>Aparahna Window</th>
                      <th>Tithi Window</th>
                      <th>Aparahna Overlap</th>
                      <th>Kutapa Overlap</th>
                      <th>Udaya Tithi?</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculationResult.candidates.map((c, i) => {
                      const isRecommended = c.date === calculationResult.recommendedDate;
                      return (
                        <tr
                          key={i}
                          style={{
                            backgroundColor: isRecommended ? '#fefce8' : 'inherit'
                          }}
                        >
                          <td>
                            <strong>{c.date}</strong>
                            {isRecommended && (
                              <span className="badge badge-success" style={{ marginLeft: '8px' }}>
                                Recommended
                              </span>
                            )}
                          </td>
                          <td style={{ fontSize: '0.8rem' }}>
                            {new Date(c.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} / {new Date(c.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ fontSize: '0.8rem' }}>
                            {new Date(c.aparahnaStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(c.aparahnaEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ fontSize: '0.8rem' }}>
                            {new Date(c.tithiStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(c.tithiEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td>
                            <strong style={{ color: c.overlapMinutes > 0 ? '#16a34a' : '#dc2626' }}>
                              {c.overlapMinutes} mins
                            </strong>
                          </td>
                          <td>
                            {c.kutapaOverlapMinutes} mins
                          </td>
                          <td>
                            {c.isUdayaTithi ? 'Yes (ಉದಯ)' : 'No'}
                          </td>
                          <td>
                            {c.overlapMinutes > 0 ? (
                              <span className="badge badge-success">Touches Aparahna</span>
                            ) : (
                              <span className="badge badge-neutral">No overlap</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MAHALAYA (PITRU PAKSHA) CALENDAR */}
      {activeSubTab === 'mahalaya' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Pitru Paksha (Mahalaya) Calendar</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                className="form-control"
                style={{ width: '100px', padding: '4px 8px' }}
                value={mahalayaYear}
                onChange={(e) => setMahalayaYear(Number(e.target.value))}
              />
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleLoadMahalaya(mahalayaYear)}
              >
                Load
              </button>
            </div>
          </div>

          {mahalayaData ? (
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  marginBottom: '20px',
                  background: '#f8fafc',
                  padding: '16px',
                  borderRadius: '8px'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Maha Bharani (ಮಹಾ ಭರಣಿ)</span>
                  <div style={{ fontWeight: 700, color: '#c2410c' }}>
                    {mahalayaData.specialDays?.mahaBharani || 'N/A'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avidhava Navami (ಅವಿಧವಾ ನವಮಿ)</span>
                  <div style={{ fontWeight: 700, color: '#c2410c' }}>
                    {mahalayaData.specialDays?.avidhavaNavami || 'N/A'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Yati Mahalaya (ಯತಿ ಮಹಾಲಯ)</span>
                  <div style={{ fontWeight: 700, color: '#c2410c' }}>
                    {mahalayaData.specialDays?.yatiMahalaya || 'N/A'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ghata Chaturdashi (ಘಾತ ಚತುರ್ದಶಿ)</span>
                  <div style={{ fontWeight: 700, color: '#c2410c' }}>
                    {mahalayaData.specialDays?.ghataChaturdashi || 'N/A'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sarva Pitru Amavasya (ಸರ್ವಪಿತೃ ಅಮಾವಾಸ್ಯೆ)</span>
                  <div style={{ fontWeight: 700, color: '#c2410c' }}>
                    {mahalayaData.specialDays?.sarvaPitruAmavasya || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Paksha Tithi</th>
                      <th>Nakshatra</th>
                      <th>Aparahna Window</th>
                      <th>Special Significance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mahalayaData.days?.map((d, i) => (
                      <tr
                        key={i}
                        style={{
                          backgroundColor:
                            d.isSarvaPitruAmavasya || d.isMahaBharani || d.isAvidhavaNavami
                              ? '#fff7ed'
                              : 'inherit'
                        }}
                      >
                        <td><strong>{d.date}</strong></td>
                        <td>{d.tithiName} (Krishna {d.pakshaTithi})</td>
                        <td>{d.nakshatra}</td>
                        <td style={{ fontSize: '0.8rem' }}>
                          {new Date(d.aparahnaStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(d.aparahnaEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td>
                          {d.isMahaBharani && <span className="badge badge-warning">Maha Bharani</span>}
                          {d.isAvidhavaNavami && <span className="badge badge-warning">Avidhava Navami</span>}
                          {d.isYatiMahalaya && <span className="badge badge-warning">Yati Dvadashi</span>}
                          {d.isGhataChaturdashi && <span className="badge badge-danger">Ghata Chaturdashi</span>}
                          {d.isSarvaPitruAmavasya && <span className="badge badge-primary">Sarva Pitru Amavasya</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p style={{ padding: '20px', textAlign: 'center' }}>Loading Mahalaya Calendar...</p>
          )}
        </div>
      )}

      {/* Reminder Message Modal */}
      <Modal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        title="Send WhatsApp / SMS Reminder"
      >
        <div style={{ marginBottom: '16px' }}>
          <label className="form-label">Client Phone Number</label>
          <input
            type="text"
            className="form-control"
            value={messageClientPhone}
            onChange={(e) => setMessageClientPhone(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label className="form-label">Message Preview</label>
          <textarea
            className="form-control"
            rows={6}
            value={generatedMessage}
            onChange={(e) => setGeneratedMessage(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            className="btn btn-secondary"
            onClick={() => copyToClipboard(generatedMessage)}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />} Copy Text
          </button>

          <button className="btn btn-primary" onClick={openWhatsApp}>
            <ExternalLink size={16} /> Open in WhatsApp
          </button>
        </div>
      </Modal>

      {/* Samagri Checklist Modal for Tracker */}
      <Modal
        isOpen={checklistModalOpen}
        onClose={() => setChecklistModalOpen(false)}
        title={`ಸಾಮಗ್ರಿ ಪಟ್ಟಿ: ${activePuja?.serviceName}`}
        maxWidth="680px"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
              ಯಜಮಾನರು: {activePuja?.clientName}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ದಿನಾಂಕ: {activePuja?.date} ({activePuja?.time}) • ಸ್ಥಳ: {activePuja?.venue || 'ಯಜಮಾನರ ನಿವಾಸ'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                let text = `॥ ಶ್ರೀಃ ॥\n`;
                text += `*ಯಜಮಾನರು:* ${activePuja?.clientName}\n`;
                text += `*ಪೂಜೆ:* ${activePuja?.serviceName}\n`;
                text += `*ದಿನಾಂಕ:* ${activePuja?.date} (${activePuja?.time})\n`;
                text += `------------------------------------\n`;
                text += `*ಪೂಜೆಗೆ ತರಬೇಕಾದ ಸಾಮಗ್ರಿಗಳ ಪಟ್ಟಿ:*\n`;
                pujaSamagriItems.forEach((it, idx) => {
                  const name = it.kannada ? `${it.kannada} (${it.item})` : it.item;
                  text += `${idx + 1}. ${name} - *${it.qty || 'ಯಥಾಶಕ್ತಿ'}*\n`;
                });
                text += `------------------------------------\n`;
                if (settings?.purohitName) {
                  text += `ಇಂತಿ ತಮ್ಮ ಪುರೋಹಿತರು: *${settings.purohitName}*\n`;
                  if (settings?.phone) text += `ಸಂಪರ್ಕ: ${settings.phone}\n`;
                }
                text += `_ಧನ್ಯವಾದಗಳು!_\n`;
                navigator.clipboard.writeText(text);
                alert("ಸಾಮಗ್ರಿ ಪಟ್ಟಿಯನ್ನು ಕಾಪಿ ಮಾಡಲಾಗಿದೆ! (Copied!)");
              }}
            >
              <Copy size={14} /> WhatsApp ಪಟ್ಟಿ ಕಾಪಿ
            </button>

            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
              <Printer size={14} /> ಮುದ್ರಿಸಿ
            </button>
          </div>
        </div>

        <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
          <table>
            <thead>
              <tr style={{ backgroundColor: '#faf2e6' }}>
                <th style={{ width: '40px', textAlign: 'center' }}>#</th>
                <th>ಸಾಮಗ್ರಿ (Item)</th>
                <th>ಅಳತೆ (Qty)</th>
              </tr>
            </thead>
            <tbody>
              {pujaSamagriItems.map((it, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{it.kannada || it.item}</div>
                    {it.kannada && it.item && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{it.item}</div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{it.qty || 'ಯಥಾಶಕ್ತಿ'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}

