import React, { useState, useEffect } from 'react';
import { api } from '../../api/index.js';
import { useI18n } from '../../hooks/useI18n.jsx';
import { Modal } from '../../components/Modal.jsx';
import { printElement } from '../../utils/print.js';
import { GURU_LEFT_BASE64, GURU_RIGHT_BASE64 } from '../../assets/guruImagesBase64.js';
import {
  CalendarCheck,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  DollarSign,
  FileText,
  Printer,
  Send,
  Trash2,
  Copy
} from 'lucide-react';

export function Bookings() {
  const { t, lang } = useI18n();
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  // New Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    clientId: '',
    clientName: '',
    serviceId: 'satyanarayana',
    serviceName: 'Sri Satyanarayana Vrata Puja',
    date: new Date().toISOString().split('T')[0],
    time: '09:30',
    venue: '',
    dakshina: 5000,
    assistantIds: [],
    notes: ''
  });

  // Samagri checklist modal
  const [checklistModalOpen, setChecklistModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [samagriItems, setSamagriItems] = useState([]);

  // Payment modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    mode: 'Cash',
    notes: ''
  });

  const [settings, setSettings] = useState(null);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');
  const [reminderPhone, setReminderPhone] = useState('');

  // Quick Client Creation mode inside Booking Modal
  const [clientMode, setClientMode] = useState('existing'); // 'existing' | 'new'
  const [newClientForm, setNewClientForm] = useState({
    name: '',
    phone: '',
    gotra: 'Kashyapa',
    address: '',
    community: 'Smartha'
  });

  const toMinutes = (t) => {
    if (!t || !t.includes(':')) return 0;
    const [h, m] = t.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const activeConflict = (() => {
    if (!bookingForm.date || !bookingForm.time) return null;
    const newMins = toMinutes(bookingForm.time);
    return bookings.find(b => {
      if (b.status === 'cancelled') return false;
      if (b.date !== bookingForm.date) return false;
      const bMins = toMinutes(b.time);
      return Math.abs(bMins - newMins) < 90;
    });
  })();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [bData, cData, sData, aData, setts] = await Promise.all([
        api.getBookings(),
        api.getClients(),
        api.getServices(),
        api.getAssistants(),
        api.getSettings()
      ]);
      setBookings(bData || []);
      setClients(cData || []);
      setServices(sData || []);
      setAssistants(aData || []);
      setSettings(setts || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenNewBooking = () => {
    const hasClients = clients.length > 0;
    const defaultClient = hasClients ? clients[0] : null;
    const defaultService = services[0] || { id: 'satyanarayana', name: 'Sri Satyanarayana Vrata Puja', defaultDakshina: 5000 };

    setClientMode(hasClients ? 'existing' : 'new');
    setNewClientForm({
      name: '',
      phone: '',
      gotra: 'Kashyapa',
      address: '',
      community: 'Smartha'
    });

    setBookingForm({
      clientId: defaultClient ? defaultClient.id : '',
      clientName: defaultClient ? defaultClient.name : '',
      serviceId: defaultService.id,
      serviceName: defaultService.kannadaName ? `${defaultService.kannadaName} (${defaultService.name})` : defaultService.name,
      date: new Date().toISOString().split('T')[0],
      time: '09:30',
      venue: defaultClient?.address || '',
      dakshina: defaultService.defaultDakshina || 5000,
      assistantIds: [],
      notes: ''
    });
    setBookingModalOpen(true);
  };

  const handleSaveBooking = async () => {
    try {
      let finalClientId = bookingForm.clientId;
      let finalClientName = bookingForm.clientName;
      let finalVenue = bookingForm.venue;

      if (clientMode === 'new') {
        if (!newClientForm.name || newClientForm.name.trim().length < 2) {
          alert("ದಯವಿಟ್ಟು ಯಜಮಾನರ ಹೆಸರನ್ನು ನಮೂದಿಸಿ (Please enter Client Name)");
          return;
        }
        if (!newClientForm.phone || newClientForm.phone.trim().length < 7) {
          alert("ದಯವಿಟ್ಟು ಸರಿಯಾದ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (Please enter a valid Phone number)");
          return;
        }

        // Auto-create client immediately on the fly
        const createdClient = await api.createClient({
          name: newClientForm.name.trim(),
          phone: newClientForm.phone.trim(),
          gotra: newClientForm.gotra?.trim() || 'Kashyapa',
          address: newClientForm.address?.trim() || finalVenue || '',
          community: newClientForm.community || 'Smartha'
        });

        finalClientId = createdClient.id;
        finalClientName = createdClient.name;
        if (!finalVenue && newClientForm.address) {
          finalVenue = newClientForm.address;
        }
      } else {
        const client = clients.find(c => c.id === bookingForm.clientId);
        if (client) {
          finalClientName = client.name;
        }
      }

      if (!finalClientId) {
        alert("ದಯವಿಟ್ಟು ಯಜಮಾನರನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಹೊಸದಾಗಿ ಸೇರಿಸಿ (Please select or add a client)");
        return;
      }

      // Check time conflict with other existing bookings
      const toMinutes = (t) => {
        if (!t || !t.includes(':')) return 0;
        const [h, m] = t.split(':').map(Number);
        return (h || 0) * 60 + (m || 0);
      };
      const newMins = toMinutes(bookingForm.time);
      const conflict = bookings.find(b => {
        if (b.status === 'cancelled') return false;
        if (b.date !== bookingForm.date) return false;
        const bMins = toMinutes(b.time);
        return Math.abs(bMins - newMins) < 90;
      });

      if (conflict) {
        alert(`⚠️ ಸಮಯ ಸಂಘರ್ಷ (Time Conflict)!\n\nದಿನಾಂಕ ${bookingForm.date} ರಂದು ${conflict.time} ಕ್ಕೆ ಈಗಾಗಲೇ "${conflict.serviceName}" ಪೂಜೆಯನ್ನು ಯಜಮಾನರಾದ "${conflict.clientName}" ಅವರಿಗೆ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ.\n\nಒಂದೇ ಸಮಯದಲ್ಲಿ ಎರಡು ಪೂಜೆಗಳನ್ನು ಬುಕ್ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಬೇರೆ ಸಮಯ ಅಥವಾ ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ.`);
        return;
      }

      const service = services.find(s => s.id === bookingForm.serviceId);

      await api.createBooking({
        ...bookingForm,
        clientId: finalClientId,
        clientName: finalClientName,
        venue: finalVenue || 'Yajamana Residence',
        serviceName: service ? (service.kannadaName ? `${service.kannadaName} (${service.name})` : service.name) : bookingForm.serviceName,
        dakshina: Number(bookingForm.dakshina)
      });

      await loadData();

      // Check if user wants to schedule another ceremony for this same client
      const bookAnother = window.confirm(`"${finalClientName}" ಅವರಿಗೆ ಪೂಜೆ ಯಶಸ್ವಿಯಾಗಿ ನಿಗದಿಯಾಗಿದೆ!\n\nಇದೇ ಯಜಮಾನರಿಗೆ ಇನ್ನೊಂದು ಪೂಜೆಯನ್ನು ಬುಕ್ ಮಾಡಬೇಕೇ?\n(Would you like to schedule another puja for this client?)`);

      if (bookAnother) {
        setClientMode('existing');
        const nextService = services[1] || services[0];
        setBookingForm({
          clientId: finalClientId,
          clientName: finalClientName,
          serviceId: nextService.id,
          serviceName: nextService.kannadaName ? `${nextService.kannadaName} (${nextService.name})` : nextService.name,
          date: bookingForm.date,
          time: '11:30',
          venue: finalVenue,
          dakshina: nextService.defaultDakshina || 3500,
          assistantIds: [],
          notes: ''
        });
      } else {
        setBookingModalOpen(false);
      }
    } catch (err) {
      alert("Error creating booking: " + err.message);
    }
  };

  const openChecklistModal = async (booking) => {
    setActiveBooking(booking);
    if (booking.samagriChecklist && booking.samagriChecklist.length > 0) {
      setSamagriItems(booking.samagriChecklist);
    } else {
      // Load template
      try {
        const res = await api.getSamagriTemplate(booking.serviceId);
        const items = res?.items || res?.data?.items || [];
        const initial = items.map(i => ({
          item: i.item,
          qty: i.qty,
          kannada: i.kannada,
          provided: false
        }));
        setSamagriItems(initial);
      } catch (e) {
        setSamagriItems([]);
      }
    }
    setChecklistModalOpen(true);
  };

  const handleCopyBookingWhatsApp = () => {
    if (!activeBooking) return;
    let text = `॥ ಶ್ರೀಃ ॥\n`;
    text += `*ಯಜಮಾನರು:* ${activeBooking.clientName}\n`;
    text += `*ಪೂಜೆ:* ${activeBooking.serviceName}\n`;
    text += `*ದಿನಾಂಕ:* ${activeBooking.date} (${activeBooking.time})\n`;
    if (activeBooking.venue) text += `*ಸ್ಥಳ:* ${activeBooking.venue}\n`;
    text += `------------------------------------\n`;
    text += `*ಪೂಜೆಗೆ ತರಬೇಕಾದ ಸಾಮಗ್ರಿಗಳ ಪಟ್ಟಿ:*\n`;
    samagriItems.forEach((it, idx) => {
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
    alert("ಸಾಮಗ್ರಿ ಪಟ್ಟಿಯನ್ನು ಕಾಪಿ ಮಾಡಲಾಗಿದೆ! (Copied to clipboard!)");
  };

  const openBookingReminderModal = async (b) => {
    try {
      const cl = clients.find(c => c.id === b.clientId);
      const res = await api.generateMessage({
        type: 'bookingConfirmation',
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
      setReminderMessage(res.message);
      setReminderPhone(cl?.phone || '');
      setReminderModalOpen(true);
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const openBookingWhatsApp = () => {
    const cleanPhone = reminderPhone.replace(/[^0-9]/g, '');
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(reminderMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(reminderMessage)}`;
    window.open(url, '_blank');
  };

  const handleSaveChecklist = async () => {
    try {
      await api.updateBooking(activeBooking.id, {
        samagriChecklist: samagriItems
      });
      setChecklistModalOpen(false);
      loadData();
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const openPaymentModal = (b) => {
    setActiveBooking(b);
    const balance = Math.max(0, b.dakshina - (b.paidAmount || 0));
    setPaymentForm({
      bookingId: b.id,
      clientId: b.clientId,
      clientName: b.clientName,
      amount: balance || b.dakshina,
      date: new Date().toISOString().split('T')[0],
      mode: 'UPI',
      notes: `Dakshina for ${b.serviceName}`
    });
    setPaymentModalOpen(true);
  };

  const handleSavePayment = async () => {
    try {
      await api.createPayment(paymentForm);
      setPaymentModalOpen(false);
      loadData();
    } catch (e) {
      alert("Payment recording failed: " + e.message);
    }
  };

  const printChecklist = () => {
    const el = document.getElementById('booking-samagri-checklist');
    if (el) {
      printElement(el, `Checklist_${activeBooking?.serviceName || 'Puja'}`);
    } else {
      window.print();
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  return (
    <div>
      {/* Action Header */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'scheduled', 'confirmed', 'completed', 'cancelled'].map(status => (
              <button
                key={status}
                className={`btn btn-sm ${filterStatus === status ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <button className="btn btn-primary" onClick={handleOpenNewBooking}>
            <Plus size={16} /> New Ceremony Booking
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card">
        {filteredBookings.length === 0 ? (
          <p style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No bookings found for the selected filter.
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Ceremony (ಸೇವೆ)</th>
                  <th>Client</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Dakshina Status</th>
                  <th>Checklist</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => {
                  const isPaid = (b.paidAmount || 0) >= b.dakshina;
                  return (
                    <tr key={b.id}>
                      <td>
                        <strong>{b.serviceName}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Status: <span className="badge badge-warning">{b.status}</span>
                        </div>
                      </td>
                      <td>
                        <strong>{b.clientName}</strong>
                      </td>
                      <td>
                        <div><strong>{b.date}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ⏰ {b.time}
                        </div>
                      </td>
                      <td style={{ maxWidth: '200px', fontSize: '0.85rem' }}>
                        {b.venue}
                      </td>
                      <td>
                        <div>₹{b.dakshina}</div>
                        <span className={`badge ${isPaid ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.7rem' }}>
                          {isPaid ? 'Fully Paid' : `Paid: ₹${b.paidAmount || 0}`}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openChecklistModal(b)}
                        >
                          <FileText size={14} /> Samagri List
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#16a34a', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}
                            onClick={() => openBookingReminderModal(b)}
                            title="Send WhatsApp Reminder"
                          >
                            <Send size={14} /> WhatsApp
                          </button>
                          {!isPaid && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => openPaymentModal(b)}
                            >
                              <DollarSign size={14} /> Dakshina
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Booking Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Schedule Ceremony Booking (ಪೂಜೆ / ಸೇವಾ ಬುಕ್ಕಿಂಗ್)"
        maxWidth="680px"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          
          {/* Quick Client Selection / Creation Section (Full Width) */}
          <div style={{ gridColumn: 'span 2', backgroundColor: '#fff9f0', border: '1px solid #fed7aa', borderRadius: '8px', padding: '12px 14px', marginBottom: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#9a3412', display: 'flex', alignItems: 'center', gap: '6px' }}>
                👤 ಯಜಮಾನರ ವಿವರ (Client / Yajamana Details) *
              </span>

              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#fed7aa', padding: '2px', borderRadius: '6px' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${clientMode === 'existing' ? 'btn-primary' : ''}`}
                  style={{
                    fontSize: '0.74rem',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    backgroundColor: clientMode === 'existing' ? 'var(--primary)' : 'transparent',
                    color: clientMode === 'existing' ? '#fff' : '#7c2d12',
                    border: 'none',
                    fontWeight: 600
                  }}
                  onClick={() => setClientMode('existing')}
                  disabled={clients.length === 0}
                >
                  ಇರುವ ಯಜಮಾನರು (Existing) {clients.length > 0 ? `(${clients.length})` : ''}
                </button>

                <button
                  type="button"
                  className={`btn btn-sm ${clientMode === 'new' ? 'btn-primary' : ''}`}
                  style={{
                    fontSize: '0.74rem',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    backgroundColor: clientMode === 'new' ? 'var(--primary)' : 'transparent',
                    color: clientMode === 'new' ? '#fff' : '#7c2d12',
                    border: 'none',
                    fontWeight: 600
                  }}
                  onClick={() => setClientMode('new')}
                >
                  ➕ ಹೊಸ ಯಜಮಾನರು (+ New Client)
                </button>
              </div>
            </div>

            {clientMode === 'existing' && clients.length > 0 ? (
              <div>
                <select
                  className="form-control"
                  value={bookingForm.clientId}
                  onChange={(e) => {
                    const c = clients.find(cl => cl.id === e.target.value);
                    setBookingForm({
                      ...bookingForm,
                      clientId: e.target.value,
                      clientName: c ? c.name : '',
                      venue: c?.address || bookingForm.venue
                    });
                  }}
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) {c.gotra ? `• ಗೋತ್ರ: ${c.gotra}` : ''} {c.address ? `• ${c.address}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '3px', color: '#7c2d12' }}>
                    ಯಜಮಾನರ ಹೆಸರು (Client Name) *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                    placeholder="ಉದಾ: ರಮೇಶ್ ಕುಲಕರ್ಣಿ"
                    value={newClientForm.name}
                    onChange={(e) => setNewClientForm({ ...newClientForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '3px', color: '#7c2d12' }}>
                    ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (Phone / WhatsApp) *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                    placeholder="ಉದಾ: 9845012345"
                    value={newClientForm.phone}
                    onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '3px', color: '#7c2d12' }}>
                    ಗೋತ್ರ (Gotra)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                    placeholder="ಉದಾ: Kashyapa, Bharadwaja"
                    value={newClientForm.gotra}
                    onChange={(e) => setNewClientForm({ ...newClientForm, gotra: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '3px', color: '#7c2d12' }}>
                    ವಿಳಾಸ / ಸ್ಥಳ (Address / Venue)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                    placeholder="ಉದಾ: ಧಾರವಾಡ, ವಿದ್ಯಾಗಿರಿ"
                    value={newClientForm.address}
                    onChange={(e) => {
                      setNewClientForm({ ...newClientForm, address: e.target.value });
                      if (!bookingForm.venue || bookingForm.venue === newClientForm.address) {
                        setBookingForm({ ...bookingForm, venue: e.target.value });
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Ceremony / Service (ಪೂಜೆ / ಸೇವೆ) *</label>
            <select
              className="form-control"
              value={bookingForm.serviceId}
              onChange={(e) => {
                const s = services.find(sv => sv.id === e.target.value);
                const displayName = s ? (s.kannadaName ? `${s.kannadaName} (${s.name})` : s.name) : '';
                setBookingForm({
                  ...bookingForm,
                  serviceId: e.target.value,
                  serviceName: displayName,
                  dakshina: s?.defaultDakshina || bookingForm.dakshina
                });
              }}
            >
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.kannadaName ? `${s.kannadaName} (${s.name})` : s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Date (YYYY-MM-DD) *</label>
            <input
              type="date"
              className="form-control"
              value={bookingForm.date}
              onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Muhurta / Time *</label>
            <input
              type="time"
              className="form-control"
              value={bookingForm.time}
              onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
            />
          </div>

          {activeConflict && (
            <div style={{ gridColumn: 'span 2', backgroundColor: '#fee2e2', border: '1px solid #f87171', borderRadius: '6px', padding: '10px 14px', fontSize: '0.84rem', color: '#991b1b', fontWeight: 600 }}>
              ⚠️ ಸಮಯ ಸಂಘರ್ಷ (Time Conflict)!
              <div style={{ fontWeight: 400, marginTop: '2px', color: '#7f1d1d' }}>
                ದಿನಾಂಕ <strong>{bookingForm.date}</strong> ರಂದು ಸಮಯ <strong>{activeConflict.time}</strong> ಕ್ಕೆ ಈಗಾಗಲೇ &quot;<strong>{activeConflict.serviceName}</strong>&quot; ({activeConflict.clientName}) ಪೂಜೆ ನಿಗದಿಯಾಗಿದೆ. ಪುರೋಹಿತರಿಗೆ ಒಂದೇ ಸಮಯದಲ್ಲಿ ಎರಡು ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳನ್ನು ಬುಕ್ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಬೇರೆ ಸಮಯ ಅಥವಾ ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ.
              </div>
            </div>
          )}

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Venue / Place of Ceremony *</label>
            <input
              type="text"
              className="form-control"
              value={bookingForm.venue}
              onChange={(e) => setBookingForm({ ...bookingForm, venue: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Dakshina Amount (₹)</label>
            <input
              type="number"
              className="form-control"
              value={bookingForm.dakshina}
              onChange={(e) => setBookingForm({ ...bookingForm, dakshina: Number(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assign Assistants</label>
            <select
              className="form-control"
              multiple
              style={{ height: '60px' }}
              value={bookingForm.assistantIds}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                setBookingForm({ ...bookingForm, assistantIds: selected });
              }}
            >
              {assistants.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Notes</label>
            <input
              type="text"
              className="form-control"
              value={bookingForm.notes}
              onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <button className="btn btn-secondary" onClick={() => setBookingModalOpen(false)}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSaveBooking}
            disabled={!!activeConflict}
            style={{ opacity: activeConflict ? 0.6 : 1, cursor: activeConflict ? 'not-allowed' : 'pointer' }}
          >
            {activeConflict ? 'ಸಮಯ ಸಂಘರ್ಷವಿದೆ (Conflict)' : 'Confirm Booking'}
          </button>
        </div>
      </Modal>

      {/* Samagri Checklist Modal & Printable Sheet */}
      <Modal
        isOpen={checklistModalOpen}
        onClose={() => setChecklistModalOpen(false)}
        title={`Samagri Checklist: ${activeBooking?.serviceName}`}
        maxWidth="700px"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Client: <strong>{activeBooking?.clientName}</strong> • Date: <strong>{activeBooking?.date}</strong>
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleCopyBookingWhatsApp}>
              <Send size={14} /> WhatsApp ಪಟ್ಟಿ ಕಾಪಿ
            </button>
            <button className="btn btn-secondary btn-sm" onClick={printChecklist}>
              <Printer size={14} /> Print A4 Checklist
            </button>
          </div>
        </div>

        <div id="booking-samagri-checklist" className="printable-document" style={{ maxHeight: '50vh', overflowY: 'auto', marginBottom: '16px' }}>
          {/* Institutional letterhead for printing with Guru images */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #b45309', paddingBottom: '10px', marginBottom: '12px', gap: '10px' }}>
            <img
              src={GURU_LEFT_BASE64}
              alt="Guru Left"
              style={{ width: '56px', height: '65px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #b45309', flexShrink: 0 }}
            />
            <div style={{ textAlign: 'center', flexGrow: 1 }}>
              <div style={{ fontSize: '1.1rem', color: '#b45309', fontWeight: 700 }}>॥ ಶ್ರೀ ಗುರುಭ್ಯೋ ನಮಃ ॥</div>
              <h2 style={{ fontSize: '1.35rem', color: '#9a3412', margin: '3px 0', fontWeight: 800 }}>
                ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ
              </h2>
              <div style={{ fontSize: '0.82rem', color: '#78350f', fontWeight: 600 }}>
                Chaitanya Krupa Mukthi Dham • ಪೂಜಾ ಸಾಮಗ್ರಿ ಪಟ್ಟಿ
              </div>
              <div style={{ fontSize: '0.88rem', color: '#1e293b', fontWeight: 700, marginTop: '3px' }}>
                ಕಾರ್ಯಕ್ರಮ: {activeBooking?.serviceName} • ಯಜಮಾನರು: {activeBooking?.clientName} • ದಿನಾಂಕ: {activeBooking?.date}
              </div>
            </div>
            <img
              src={GURU_RIGHT_BASE64}
              alt="Guru Right"
              style={{ width: '56px', height: '65px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #b45309', flexShrink: 0 }}
            />
          </div>

          <table style={{ fontSize: '0.85rem' }}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>✓</th>
                <th>Samagri Item</th>
                <th>Quantity</th>
                <th>Kannada Name</th>
              </tr>
            </thead>
            <tbody>
              {samagriItems.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      type="checkbox"
                      checked={item.provided}
                      onChange={(e) => {
                        const copy = [...samagriItems];
                        copy[idx].provided = e.target.checked;
                        setSamagriItems(copy);
                      }}
                    />
                  </td>
                  <td><strong>{item.item}</strong></td>
                  <td>{item.qty || '--'}</td>
                  <td>{item.kannada || '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={() => setChecklistModalOpen(false)}>Close</button>
          <button className="btn btn-primary" onClick={handleSaveChecklist}>Save Checklist</button>
        </div>
      </Modal>

      {/* Record Dakshina Payment Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Record Dakshina Payment"
      >
        <div className="form-group">
          <label className="form-label">Dakshina Amount (₹) *</label>
          <input
            type="number"
            className="form-control"
            value={paymentForm.amount}
            onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={paymentForm.date}
            onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Payment Mode</label>
          <select
            className="form-control"
            value={paymentForm.mode}
            onChange={(e) => setPaymentForm({ ...paymentForm, mode: e.target.value })}
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
            <option value="Bank Transfer">Bank Transfer / NEFT</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <input
            type="text"
            className="form-control"
            value={paymentForm.notes}
            onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <button className="btn btn-secondary" onClick={() => setPaymentModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSavePayment}>Save & Generate Receipt</button>
        </div>
      </Modal>

      {/* WhatsApp Booking Reminder Modal */}
      <Modal
        isOpen={reminderModalOpen}
        onClose={() => setReminderModalOpen(false)}
        title="Send WhatsApp Booking Confirmation / Reminder"
        maxWidth="600px"
      >
        <div style={{ marginBottom: '16px' }}>
          <label className="form-label">Client Phone Number</label>
          <input
            type="text"
            className="form-control"
            value={reminderPhone}
            onChange={(e) => setReminderPhone(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label className="form-label">WhatsApp Message Preview</label>
          <textarea
            className="form-control"
            rows={6}
            value={reminderMessage}
            onChange={(e) => setReminderMessage(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              navigator.clipboard.writeText(reminderMessage);
              alert("ಸಂದೇಶ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ! (Copied!)");
            }}
          >
            <Copy size={16} /> Copy Text
          </button>

          <button className="btn btn-primary" onClick={openBookingWhatsApp} style={{ backgroundColor: '#16a34a', borderColor: '#15803d' }}>
            <Send size={16} /> Open in WhatsApp
          </button>
        </div>
      </Modal>
    </div>
  );
}

