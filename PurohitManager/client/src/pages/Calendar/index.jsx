import React, { useState, useEffect } from 'react';
import { api } from '../../api/index.js';
import { useI18n } from '../../hooks/useI18n.jsx';
import { Modal } from '../../components/Modal.jsx';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Sparkles, X, Sun, Moon, Upload, FileText, CheckCircle2 } from 'lucide-react';

export function Calendar() {
  const { t, lang } = useI18n();
  const [currentYear, setCurrentYear] = useState(() => 2026);
  const [currentMonth, setCurrentMonth] = useState(() => 1);
  const [monthData, setMonthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  // Upload Calendar PDF state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadedCalendars, setUploadedCalendars] = useState([]);
  const [uploadForm, setUploadForm] = useState({
    year: 2027,
    title: 'ಶ್ರೀ ಚೈತನ್ಯಾಶ್ರಮ ತೂಗುಪಂಚಾಂಗ ೨೦೨೭',
    filename: '',
    fileBase64: '',
    notes: ''
  });
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadUploadedCalendars = async () => {
    try {
      const res = await api.getUploadedCalendars();
      if (res && res.data) {
        setUploadedCalendars(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಕೇವಲ PDF ಫೈಲ್ ಮಾತ್ರ ಆಯ್ಕೆಮಾಡಿ.' : 'Please select a valid PDF file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploadForm(prev => ({
        ...prev,
        filename: file.name,
        fileBase64: reader.result
      }));
      setFilePreview({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.fileBase64) {
      alert(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಪಂಚಾಂಗದ PDF ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ' : 'Please select a PDF file');
      return;
    }
    setUploading(true);
    try {
      const res = await api.uploadCalendarPdf(uploadForm);
      if (res.success) {
        alert(lang === 'kn' ? `ವರ್ಷ ${uploadForm.year} ರ ಪಂಚಾಂಗ PDF ಯಶಸ್ವಿಯಾಗಿ ಅಪ್ಲೋಡ್ ಆಗಿದೆ!` : `Calendar PDF for year ${uploadForm.year} uploaded successfully!`);
        setUploadForm({
          year: 2027,
          title: 'ಶ್ರೀ ಚೈತನ್ಯಾಶ್ರಮ ತೂಗುಪಂಚಾಂಗ ೨೦೨೭',
          filename: '',
          fileBase64: '',
          notes: ''
        });
        setFilePreview(null);
        await loadUploadedCalendars();
      } else {
        alert('Upload failed: ' + (res.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    async function fetchMonth() {
      setLoading(true);
      try {
        const monthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
        const [data, monthBookings] = await Promise.all([
          api.getMonthPanchang(currentYear, currentMonth),
          api.getBookings({ month: monthStr })
        ]);

        // Map bookings to their date
        const bookingsByDate = {};
        (monthBookings || []).forEach(b => {
          if (!bookingsByDate[b.date]) bookingsByDate[b.date] = [];
          bookingsByDate[b.date].push(b);
        });

        // Merge into days
        if (data && data.days) {
          data.days = data.days.map(d => ({
            ...d,
            bookings: bookingsByDate[d.date] || []
          }));
        }

        setMonthData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMonth();
  }, [currentYear, currentMonth]);

  const changeMonth = (delta) => {
    let newM = currentMonth + delta;
    let newY = currentYear;
    if (newM > 12) {
      newM = 1;
      newY += 1;
    } else if (newM < 1) {
      newM = 12;
      newY -= 1;
    }
    setCurrentMonth(newM);
    setCurrentYear(newY);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthNamesKn = [
    "ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್",
    "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟೆಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್"
  ];

  // Calculate day-of-week offset for the 1st of this month (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();

  return (
    <div>
      {/* Month Navigation & Thoogu Panchanga 2026 Banner */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CalIcon size={24} color="var(--primary)" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                {monthNamesKn[currentMonth - 1]} ({monthNames[currentMonth - 1]}) {currentYear}
              </h2>
            </div>
            {currentYear === 2026 && (
              <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#b45309' }}>
                <span style={{ backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, border: '1px solid #fde68a' }}>
                  🪔 ಶ್ರೀ ಚೈತನ್ಯಾಶ್ರಮ ತೂಗುಪಂಚಾಂಗ ೨೦೨೬ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)
                </span>
                {monthData?.samvatsaraKannada && (
                  <span style={{ color: 'var(--text-muted)' }}>
                    {monthData.samvatsaraKannada} ಸಂವತ್ಸರ • {monthData.masaKannada || ''}
                  </span>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                loadUploadedCalendars();
                setUploadModalOpen(true);
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Upload size={15} />
              <span>{lang === 'kn' ? 'ಪಂಚಾಂಗ PDF ಅಪ್ಲೋಡ್' : 'Upload Calendar PDF'}</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => changeMonth(-1)}>
              <ChevronLeft size={16} /> {lang === 'kn' ? 'ಹಿಂದಿನ ತಿಂಗಳು' : 'Prev Month'}
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setCurrentYear(2026);
                setCurrentMonth(1);
              }}
            >
              Jan 2026
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                const now = new Date();
                setCurrentYear(now.getFullYear());
                setCurrentMonth(now.getMonth() + 1);
              }}
            >
              {lang === 'kn' ? 'ಪ್ರಸ್ತುತ ತಿಂಗಳು' : 'This Month'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => changeMonth(1)}>
              {lang === 'kn' ? 'ಮುಂದಿನ ತಿಂಗಳು' : 'Next Month'} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card" style={{ padding: '12px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            ಲೋಡ್ ಆಗುತ್ತಿದೆ / Loading Calendar...
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              gap: '6px',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            {/* Weekday Header */}
            {[
              { en: 'Sun', kn: 'ರವಿ (Sun)' },
              { en: 'Mon', kn: 'ಸೋಮ (Mon)' },
              { en: 'Tue', kn: 'ಮಂಗಳ (Tue)' },
              { en: 'Wed', kn: 'ಬುಧ (Wed)' },
              { en: 'Thu', kn: 'ಗುರು (Thu)' },
              { en: 'Fri', kn: 'ಶುಕ್ರ (Fri)' },
              { en: 'Sat', kn: 'ಶನಿ (Sat)' }
            ].map((d, i) => (
              <div
                key={d.en}
                style={{
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  color: i === 0 ? '#dc2626' : 'var(--text-main)',
                  padding: '8px 2px',
                  backgroundColor: i === 0 ? '#fee2e2' : '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  minWidth: 0,
                  overflow: 'hidden'
                }}
              >
                <div style={{ fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.kn}</div>
              </div>
            ))}

            {/* Empty slots for days before 1st of month */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                style={{
                  minHeight: '100px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px dashed #e2e8f0',
                  opacity: 0.4,
                  minWidth: 0
                }}
              />
            ))}

            {/* Days of Month */}
            {monthData?.days?.map((day) => {
              const hasFestival = day.festivals && day.festivals.length > 0;
              const isShukla = day.paksha === 'Shukla';
              const isHoliday = day.isGovtHoliday;
              const isEkadashi = !!day.ekadashi;
              const isSankashti = !!day.sankashtahara;
              const isHunnime = !!day.hunnime;
              const isAmavasya = !!day.amavasya;

              let cellBg = '#ffffff';
              if (isHoliday) cellBg = '#fef2f2';
              else if (isHunnime || isAmavasya) cellBg = '#fefce8';
              else if (isEkadashi) cellBg = '#f0fdf4';
              else if (hasFestival) cellBg = '#fff7ed';

              return (
                <div
                  key={day.dayOfMonth}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    minHeight: '100px',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: isHoliday ? '1px solid #fca5a5' : hasFestival ? '1px solid #fed7aa' : '1px solid var(--border)',
                    backgroundColor: cellBg,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'transform 0.1s, box-shadow 0.1s',
                    position: 'relative',
                    minWidth: 0,
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Date & Paksha Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 0 }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: isHoliday ? '#b91c1c' : 'var(--text-main)', lineHeight: 1 }}>
                      {day.dayOfMonth}
                    </span>
                    <span
                      style={{
                        fontSize: '0.62rem',
                        padding: '1px 4px',
                        borderRadius: '3px',
                        backgroundColor: isShukla ? '#fef3c7' : '#e0e7ff',
                        color: isShukla ? '#b45309' : '#3730a3',
                        fontWeight: 700,
                        whiteSpace: 'nowrap'
                      }}
                      title={isShukla ? 'ಶುಕ್ಲ ಪಕ್ಷ (Shukla Paksha)' : 'ಕೃಷ್ಣ ಪಕ್ಷ (Krishna Paksha)'}
                    >
                      {isShukla ? 'ಶುಕ್ಲ' : 'ಕೃಷ್ಣ'}
                    </span>
                  </div>

                  {/* Tithi & Nakshatra */}
                  <div style={{ margin: '3px 0', minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: '#1e293b',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.25
                      }}
                      title={day.tithiFullKannada || day.tithiKannada || day.tithi}
                    >
                      {day.tithiFullKannada || day.tithiKannada || day.tithi}
                    </div>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.2
                      }}
                      title={day.nakshatraKannada || day.nakshatra}
                    >
                      {day.nakshatraKannada || day.nakshatra}
                    </div>
                  </div>

                  {/* Booked Pujas on this Day */}
                  {day.bookings && day.bookings.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', margin: '2px 0', minWidth: 0 }}>
                      {day.bookings.map((b, bIdx) => (
                        <div
                          key={b.id || bIdx}
                          style={{
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            color: '#ffffff',
                            background: 'linear-gradient(135deg, #b93815 0%, #8c2409 100%)',
                            padding: '2px 4px',
                            borderRadius: '3px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            boxShadow: '0 1px 2px rgba(185, 56, 21, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                          title={`ಪೂಜೆ: ${b.serviceName} | ಯಜಮಾನರು: ${b.clientName} | ಸಮಯ: ${b.time} | ಸ್ಥಳ: ${b.venue || ''}`}
                        >
                          <span>🪔</span>
                          <span>{b.time} {b.serviceName}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Highlights (Sankashti / Ekadashi / Holiday / Festival) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                    {isSankashti && (
                      <div
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: '#7c2d12',
                          background: '#ffedd5',
                          padding: '1px 3px',
                          borderRadius: '3px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={`ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ: ${day.sankashtahara.moonrise}`}
                      >
                        🌙 ಸಂಕಷ್ಟಿ {day.sankashtahara.moonrise}
                      </div>
                    )}

                    {isEkadashi && (
                      <div
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: '#15803d',
                          background: '#dcfce7',
                          padding: '1px 3px',
                          borderRadius: '3px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={`ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (${day.ekadashi.name})`}
                      >
                        🌾 ಏಕಾದಶಿ ({day.ekadashi.name})
                      </div>
                    )}

                    {isHunnime && (
                      <div
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: '#b45309',
                          background: '#fef3c7',
                          padding: '1px 3px',
                          borderRadius: '3px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={day.hunnime.name}
                      >
                        🌕 {day.hunnime.name}
                      </div>
                    )}

                    {isAmavasya && (
                      <div
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: '#334155',
                          background: '#e2e8f0',
                          padding: '1px 3px',
                          borderRadius: '3px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={day.amavasya.name}
                      >
                        🌑 {day.amavasya.name}
                      </div>
                    )}

                    {isHoliday && day.holidayName && (
                      <div
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: '#b91c1c',
                          background: '#fee2e2',
                          padding: '1px 3px',
                          borderRadius: '3px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={`ಸರ್ಕಾರಿ ರಜೆ: ${day.holidayName}`}
                      >
                        🚩 {day.holidayName}
                      </div>
                    )}

                    {hasFestival && !isHoliday && !isEkadashi && !isHunnime && !isAmavasya && !isSankashti && (
                      <div
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 600,
                          color: '#c2410c',
                          background: '#fed7aa',
                          padding: '1px 3px',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={day.festivals.join(', ')}
                      >
                        🎉 {day.festivals[0]}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Day Details Modal */}
      {selectedDay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={() => setSelectedDay(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              backgroundColor: '#ffffff',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  {selectedDay.date} ({selectedDay.varaKannada})
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 600 }}>
                  {selectedDay.samvatsaraKannada} ಸಂವತ್ಸರ • {selectedDay.masaKannada} ಮಾಸ
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedDay(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ತಿಥಿ / Tithi</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedDay.tithiFullKannada || selectedDay.tithiKannada}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ನಕ್ಷತ್ರ / Nakshatra</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedDay.nakshatraKannada || selectedDay.nakshatra}</div>
                </div>
              </div>

              {/* Scheduled Bookings for this Day */}
              {selectedDay.bookings && selectedDay.bookings.length > 0 && (
                <div style={{ backgroundColor: '#fff4ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontWeight: 800, color: '#9a3412', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🪔</span> ನಿಗದಿತ ಪೂಜೆಗಳು ({selectedDay.bookings.length} Bookings Today):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedDay.bookings.map((b, idx) => (
                      <div key={b.id || idx} style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #fed7aa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ color: '#b93815', fontSize: '0.95rem' }}>{b.serviceName}</strong>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#ffedd5', color: '#c2410c', padding: '2px 6px', borderRadius: '4px' }}>
                            ⏰ {b.time}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', marginTop: '4px', color: '#1e293b' }}>
                          ಯಜಮಾನರು: <strong>{b.clientName}</strong> {b.venue ? `• ಸ್ಥಳ: ${b.venue}` : ''}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          ದಕ್ಷಿಣೆ: ₹{b.dakshina} • ಸ್ಥಿತಿ: <span className="badge badge-warning">{b.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDay.sankashtahara && (
                <div style={{ backgroundColor: '#fff7ed', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ffedd5' }}>
                  <div style={{ fontWeight: 700, color: '#c2410c' }}>
                    🌙 ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ ({selectedDay.sankashtahara.isAngaraki ? 'ಅಂಗಾರಕೀ ಸಂಕಷ್ಟಿ' : 'ಸಾಮಾನ್ಯ'})
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    ಚಂದ್ರೋದಯ ಸಮಯ: <strong>{selectedDay.sankashtahara.moonrise}</strong> (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)
                  </div>
                </div>
              )}

              {selectedDay.ekadashi && (
                <div style={{ backgroundColor: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', border: '1px solid #dcfce7' }}>
                  <div style={{ fontWeight: 700, color: '#15803d' }}>
                    🌾 ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ: {selectedDay.ekadashi.name} ({selectedDay.ekadashi.englishName})
                  </div>
                </div>
              )}

              {selectedDay.isGovtHoliday && (
                <div style={{ backgroundColor: '#fee2e2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fca5a5' }}>
                  <div style={{ fontWeight: 700, color: '#b91c1c' }}>
                    🚩 ಸರ್ಕಾರಿ ರಜಾದಿನ: {selectedDay.holidayName}
                  </div>
                </div>
              )}

              {selectedDay.festivals && selectedDay.festivals.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    ಧಾರ್ಮಿಕ ಕಾರ್ಯಕ್ರಮಗಳು / ಉತ್ಸವಗಳು:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {selectedDay.festivals.map((f, i) => (
                      <li key={i} style={{ color: '#1e293b' }}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '8px' }}>
                ಮೂಲ ಆಧಾರ: ಶ್ರೀ ಚೈತನ್ಯಾಶ್ರಮ ತೂಗುಪಂಚಾಂಗ ೨೦೨೬, ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ (ಧಾರವಾಡ ಪಂಚಾಂಗ ಸಮಿತಿ)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Next Year Calendar PDF Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title={lang === 'kn' ? "ಮುಂದಿನ ವರ್ಷದ ಪಂಚಾಂಗ PDF ಅಪ್ಲೋಡ್" : "Upload Next Year Calendar PDF"}
        maxWidth="680px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#fef3c7', padding: '12px 16px', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '0.85rem', color: '#92400e' }}>
            <div style={{ fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} />
              <span>ಪಂಚಾಂಗ ದಾಖಲೀಕರಣ ಮತ್ತು ನವೀಕರಣ (Calendar Digital Registration)</span>
            </div>
            ಇಲ್ಲಿ ನೀವು ಮುಂದಿನ ವರ್ಷದ (ಉದಾಹರಣೆಗೆ ೨೦೨೭ ರ) ಮುದ್ರಿತ ತೂಗುಪಂಚಾಂಗದ PDF ಅನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಬಹುದು. ಇದು ಆಫ್‌ಲೈನ್ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಶೇಖರಣೆಯಾಗಿ ಪಂಚಾಂಗ ಹಾಗೂ ಧಾರ್ಮಿಕ ದಿನಗಳ ನವೀಕರಣಕ್ಕೆ ಲಭ್ಯವಾಗುತ್ತದೆ.
          </div>

          <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>ವರ್ಷ / Year *</label>
                <select
                  className="form-control"
                  value={uploadForm.year}
                  onChange={(e) => setUploadForm({ ...uploadForm, year: Number(e.target.value), title: `ಶ್ರೀ ಚೈತನ್ಯಾಶ್ರಮ ತೂಗುಪಂಚಾಂಗ ${e.target.value}` })}
                  required
                >
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                  <option value={2029}>2029</option>
                  <option value={2030}>2030</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>ಪಂಚಾಂಗದ ಹೆಸರು / Calendar Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="ಉದಾ: ಶ್ರೀ ಚೈತನ್ಯಾಶ್ರಮ ತೂಗುಪಂಚಾಂಗ ೨೦೨೭"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 700 }}>ಪಂಚಾಂಗ PDF ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ (Select PDF File) *</label>
              <div
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '8px',
                  padding: '18px',
                  textAlign: 'center',
                  backgroundColor: filePreview ? '#f0fdf4' : '#f8fafc',
                  borderColor: filePreview ? '#86efac' : '#cbd5e1'
                }}
              >
                <input
                  type="file"
                  id="calendarPdfInput"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="calendarPdfInput"
                  className="btn btn-secondary"
                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Upload size={16} />
                  <span>{filePreview ? 'ಬೇರೆ PDF ಆಯ್ಕೆಮಾಡಿ (Change File)' : 'PDF ಫೈಲ್ ಬ್ರೌಸ್ ಮಾಡಿ (Browse PDF)'}</span>
                </label>

                {filePreview ? (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#15803d', fontWeight: 600, fontSize: '0.85rem' }}>
                    <CheckCircle2 size={16} />
                    <span>{filePreview.name} ({filePreview.size})</span>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    ಕೇವಲ .pdf ಫೈಲ್‌ಗಳು ಮಾನ್ಯವಾಗಿರುತ್ತವೆ (ಗರಿಷ್ಠ 50MB)
                  </div>
                )}
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">ವಿವರಣೆ / ಟಿಪ್ಪಣಿ (Notes - Optional)</label>
              <input
                type="text"
                className="form-control"
                value={uploadForm.notes}
                onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
                placeholder="ಉದಾ: ಧಾರವಾಡ ಪಂಚಾಂಗ ಸಮಿತಿ, ಹೆಬ್ಬಳ್ಳಿ ಆಶ್ರಮ ಮುದ್ರಿತ ಆವೃತ್ತಿ"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setUploadModalOpen(false)}
                disabled={uploading}
              >
                ರದ್ದು (Cancel)
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={uploading || !uploadForm.fileBase64}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Upload size={16} />
                <span>{uploading ? 'ಅಪ್ಲೋಡ್ ಆಗುತ್ತಿದೆ...' : 'ಪಂಚಾಂಗ PDF ಉಳಿಸಿ (Save Calendar PDF)'}</span>
              </button>
            </div>
          </form>

          {/* List of Registered Panchangas */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '8px' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-main)' }}>
              ಲಭ್ಯವಿರುವ ಪಂಚಾಂಗಗಳ ಪಟ್ಟಿ (Registered Calendars)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* 2026 Ground Truth Default */}
              <div style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#166534' }}>
                    🪔 ಶ್ರೀ ಚೈತನ್ಯಾಶ್ರಮ ತೂಗುಪಂಚಾಂಗ ೨೦೨೬ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#15803d', marginTop: '2px' }}>
                    ಮೂಲ ಮುದ್ರಿತ ಪ್ರತಿ (೨೪ ಪುಟಗಳು) • 365 ದಿನಗಳ ನಿಖರ ಪರಿಶೀಲಿತ ಆಧಾರ
                  </div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                  ಸಕ್ರಿಯ (Active Ground Truth)
                </span>
              </div>

              {/* Uploaded ones */}
              {uploadedCalendars && uploadedCalendars.length > 0 ? (
                uploadedCalendars.map((cal) => (
                  <div key={cal.id || cal.year} style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #fed7aa', backgroundColor: '#fff7ed', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#9a3412' }}>
                        📅 {cal.title || `ಪಂಚಾಂಗ ${cal.year}`}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#7c2d12', marginTop: '2px' }}>
                        ಫೈಲ್: {cal.filename} {cal.sizeFormatted ? `(${cal.sizeFormatted})` : ''} • {cal.notes || ''}
                      </div>
                    </div>
                    <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                      {cal.status || 'Uploaded'}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 0' }}>
                  ಇನ್ನೂ ಯಾವುದೇ ಮುಂದಿನ ವರ್ಷದ ಪಂಚಾಂಗ ಅಪ್ಲೋಡ್ ಆಗಿಲ್ಲ (No additional calendars uploaded yet).
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

