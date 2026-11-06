import React, { useState, useEffect } from 'react';
import { api } from '../../api/index.js';
import { useI18n } from '../../hooks/useI18n.jsx';
import { TithiBadge } from '../../components/TithiBadge.jsx';
import { GURU_LEFT_BASE64, GURU_RIGHT_BASE64 } from '../../assets/guruImagesBase64.js';
import {
  Calendar,
  Flame,
  Users,
  DollarSign,
  PlusCircle,
  Clock,
  ArrowRight,
  Send,
  CheckCircle2
} from 'lucide-react';

export function Dashboard({ setTab, onQuickSankalpa }) {
  const { t } = useI18n();
  const [panchang, setPanchang] = useState(null);
  const [upcomingShraddhas, setUpcomingShraddhas] = useState([]);
  const [todayBookings, setTodayBookings] = useState([]);
  const [financeSummary, setFinanceSummary] = useState(null);
  const [clientCount, setClientCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const todayStr = new Date().toISOString().split('T')[0];

        const [pData, shraddhaData, bookingsData, finData, clientsData] = await Promise.all([
          api.getDailyPanchang(),
          api.getUpcomingShraddhas(30),
          api.getBookings({ date: todayStr }),
          api.getFinancialSummary(new Date().getFullYear()),
          api.getClients()
        ]);

        setPanchang(pData);
        setUpcomingShraddhas(shraddhaData || []);
        setTodayBookings(bookingsData || []);
        setFinanceSummary(finData);
        setClientCount(clientsData?.length || 0);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>;
  }

  const udaya = panchang?.angas?.udayaTithi;
  const nakshatra = panchang?.angas?.nakshatra;
  const cal = panchang?.calendar;
  const muhurtas = panchang?.muhurtas;

  return (
    <div>
      {/* Welcome Banner & Quick Panchang */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #fff9f0 0%, #fef3c7 45%, #ffedd5 100%)',
          border: '1px solid #fde68a',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(180, 83, 9, 0.08)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Left Guru Image */}
            <img
              src={GURU_LEFT_BASE64}
              alt="Guru Left"
              style={{
                width: '64px',
                height: '75px',
                objectFit: 'cover',
                borderRadius: '50%',
                border: '3px solid #b45309',
                boxShadow: '0 4px 10px rgba(180, 83, 9, 0.25)',
                backgroundColor: '#fff',
                flexShrink: 0
              }}
              title="ಶ್ರೀ ಚೈತನ್ಯಾಶ್ರಮ ಹೆಬ್ಬಳ್ಳಿ ಗುರುಗಳು"
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.4rem' }}>🪔</span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#9a3412', margin: 0 }}>
                  ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ - ಶುಭೋದಯ
                </h2>
              </div>
              <p style={{ color: '#b45309', fontSize: '0.94rem', fontWeight: 600, margin: '2px 0' }}>
                {cal?.samvatsara?.kannada ? `${cal.samvatsara.kannada} (${cal.samvatsara.name})` : cal?.samvatsara?.name} ಸಂವತ್ಸರ • {cal?.ayana?.kannada || cal?.ayana?.sanskrit} • {cal?.ritu?.kannada || cal?.ritu?.sanskrit} ಋತು • {cal?.masa?.kannada || cal?.masa?.name} ಮಾಸ • {udaya?.pakshaKannada || udaya?.paksha} ಪಕ್ಷ
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                {udaya && <TithiBadge tithi={udaya.name} paksha={udaya.paksha} nakshatra={nakshatra?.name} />}
                <span className="badge badge-neutral" style={{ backgroundColor: '#fff', border: '1px solid #eddcc6', color: '#78350f' }}>
                  ವಾರ: {panchang?.angas?.vara?.kannada || panchang?.angas?.vara?.sanskrit}
                </span>
                {panchang?.festivals?.length > 0 && (
                  <span className="badge badge-warning" style={{ backgroundColor: '#ffedd5', color: '#9a3412', border: '1px solid #fed7aa' }}>
                    🎉 {panchang.festivals.map(f => f.kannada || f.name).join(', ')}
                  </span>
                )}
              </div>
            </div>

            {/* Right Guru Image */}
            <img
              src={GURU_RIGHT_BASE64}
              alt="Guru Right"
              style={{
                width: '64px',
                height: '75px',
                objectFit: 'cover',
                borderRadius: '50%',
                border: '3px solid #b45309',
                boxShadow: '0 4px 10px rgba(180, 83, 9, 0.25)',
                backgroundColor: '#fff',
                flexShrink: 0
              }}
              title="ಪೂಜ್ಯ ಗುರುಗಳು"
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setTab('panchang')}
            >
              ದಿನ ಪಂಚಾಂಗ (View Panchang)
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setTab('bookings')}
            >
              + ಹೊಸ ಬುಕ್ಕಿಂಗ್ (+ Booking)
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Today's Bookings</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{todayBookings.length}</h3>
            </div>
            <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '8px', color: '#b45309' }}>
              <Calendar size={20} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Upcoming Shraddhas (30d)</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ea580c' }}>{upcomingShraddhas.length}</h3>
            </div>
            <div style={{ background: '#ffedd5', padding: '10px', borderRadius: '8px', color: '#c2410c' }}>
              <Flame size={20} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Clients</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{clientCount}</h3>
            </div>
            <div style={{ background: '#e0e7ff', padding: '10px', borderRadius: '8px', color: '#4338ca' }}>
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>This Year Dakshina</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#16a34a' }}>
                ₹{(financeSummary?.totalIncome || 0).toLocaleString('en-IN')}
              </h3>
            </div>
            <div style={{ background: '#dcfce7', padding: '10px', borderRadius: '8px', color: '#15803d' }}>
              <DollarSign size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Upcoming Shraddhas Alert */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} color="#ea580c" />
              <h3 className="card-title">{t('shraddha.upcomingTitle')}</h3>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setTab('shraddha')}
            >
              View All
            </button>
          </div>

          {upcomingShraddhas.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '16px 0' }}>
              {t('shraddha.noUpcoming')}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingShraddhas.slice(0, 4).map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: s.daysLeft <= 7 ? '#fff7ed' : '#f8fafc',
                    border: `1px solid ${s.daysLeft <= 7 ? '#fed7aa' : 'var(--border)'}`
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{s.deceasedName}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Client: <strong>{s.clientName}</strong> • {s.masa} {s.tithiName}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#c2410c', marginTop: '2px' }}>
                      {s.explanation}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      className={`badge ${s.daysLeft <= 3 ? 'badge-danger' : s.daysLeft <= 7 ? 'badge-warning' : 'badge-neutral'}`}
                    >
                      {s.daysLeft === 0 ? 'Today!' : s.daysLeft === 1 ? 'Tomorrow' : `In ${s.daysLeft} days`}
                    </span>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '4px' }}>
                      {s.scheduledDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Key Muhurtas & Today's Schedule */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Today's Essential Timings</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Dinamana: {panchang?.sunData?.dinamana}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Sunrise / Sunset</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                {panchang?.sunData?.sunrise ? new Date(panchang.sunData.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'} / {panchang?.sunData?.sunset ? new Date(panchang.sunData.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
              </span>
            </div>

            <div style={{ padding: '10px', background: '#dcfce7', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
              <span style={{ fontSize: '0.75rem', color: '#15803d', display: 'block' }}>Abhijit Muhurta</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#166534' }}>
                {muhurtas?.abhijit ? `${new Date(muhurtas.abhijit.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(muhurtas.abhijit.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '--'}
              </span>
            </div>

            <div style={{ padding: '10px', background: '#fee2e2', borderRadius: '6px', border: '1px solid #fecaca' }}>
              <span style={{ fontSize: '0.75rem', color: '#b91c1c', display: 'block' }}>Rahu Kala</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#991b1b' }}>
                {muhurtas?.rahuKala ? `${new Date(muhurtas.rahuKala.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(muhurtas.rahuKala.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '--'}
              </span>
            </div>

            <div style={{ padding: '10px', background: '#fef3c7', borderRadius: '6px', border: '1px solid #fde68a' }}>
              <span style={{ fontSize: '0.75rem', color: '#b45309', display: 'block' }}>Yamaganda</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#92400e' }}>
                {muhurtas?.yamagandaKala ? `${new Date(muhurtas.yamagandaKala.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(muhurtas.yamagandaKala.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '--'}
              </span>
            </div>
          </div>

          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>
            Today's Scheduled Pujas ({todayBookings.length})
          </h4>
          {todayBookings.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No bookings scheduled for today.
            </p>
          ) : (
            todayBookings.map((b) => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  borderBottom: '1px solid var(--border)'
                }}
              >
                <div>
                  <strong>{b.serviceName}</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Client: {b.clientName} • Time: {b.time}
                  </p>
                </div>
                <span className="badge badge-warning">{b.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

