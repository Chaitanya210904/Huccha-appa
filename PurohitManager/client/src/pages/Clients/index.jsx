import React, { useState, useEffect } from 'react';
import { api } from '../../api/index.js';
import { useI18n } from '../../hooks/useI18n.jsx';
import { Modal } from '../../components/Modal.jsx';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Trash2,
  ChevronRight,
  Flame,
  CalendarCheck,
  Sparkles
} from 'lucide-react';

export function Clients() {
  const { t } = useI18n();
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientDetails, setClientDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Client form modal
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [clientForm, setClientForm] = useState({
    name: '',
    phone: '',
    alternatePhone: '',
    email: '',
    address: '',
    gotra: '',
    nakshatra: '',
    rashi: '',
    community: 'Smartha',
    notes: ''
  });

  // Deceased ancestor modal
  const [ancestorModalOpen, setAncestorModalOpen] = useState(false);
  const [ancestorForm, setAncestorForm] = useState({
    name: '',
    relation: 'Father (Pitru)',
    gotra: '',
    deathDate: '',
    deathTime: '12:00',
    deathPlace: '',
    masa: 'Chaitra',
    paksha: 'Shukla',
    tithi: 1,
    tithiName: 'Prathama',
    sampradaya: 'Smartha',
    notes: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    setLoading(true);
    try {
      const data = await api.getClients();
      setClients(data || []);
      if (data && data.length > 0 && !selectedClient) {
        selectClient(data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function selectClient(id) {
    try {
      const full = await api.getClientById(id);
      setSelectedClient(full);
      setClientDetails(full);
    } catch (e) {
      console.error(e);
    }
  }

  const handleSaveClient = async () => {
    try {
      const payload = {
        name: clientForm.name,
        phone: clientForm.phone,
        alternatePhone: clientForm.alternatePhone || '',
        email: clientForm.email || '',
        address: clientForm.address || '',
        gotra: clientForm.gotra,
        nakshatra: clientForm.nakshatra || '',
        rashi: clientForm.rashi || '',
        community: clientForm.community || 'Smartha',
        notes: clientForm.notes || ''
      };
      if (clientForm.id) {
        await api.updateClient(clientForm.id, payload);
      } else {
        await api.createClient(payload);
      }
      setClientModalOpen(false);
      await loadClients();
      if (clientForm.id) {
        await selectClient(clientForm.id);
      }
    } catch (err) {
      alert("Error saving client: " + err.message);
    }
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      await api.deleteClient(id);
      setSelectedClient(null);
      loadClients();
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleAutoFillDeathDetails = async () => {
    if (!ancestorForm.deathDate) {
      alert("Please enter death date first");
      return;
    }
    try {
      const calc = await api.calculateDeathDetails({
        deathDate: ancestorForm.deathDate,
        deathTime: ancestorForm.deathTime
      });
      setAncestorForm({
        ...ancestorForm,
        masa: calc.masa,
        paksha: calc.paksha,
        tithi: calc.tithiIndex,
        tithiName: calc.tithiName,
        sampradaya: calc.sampradaya || ancestorForm.sampradaya
      });
    } catch (e) {
      alert("Calculation error: " + e.message);
    }
  };

  const handleSaveAncestor = async () => {
    try {
      await api.createDeceased({
        ...ancestorForm,
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        gotra: ancestorForm.gotra || selectedClient.gotra || ''
      });
      setAncestorModalOpen(false);
      await selectClient(selectedClient.id);
    } catch (e) {
      alert("Error saving ancestor: " + e.message);
    }
  };

  const filteredClients = (clients || []).filter(c => {
    if (!c) return false;
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return true;
    const nameMatch = (c.name || '').toLowerCase().includes(q);
    const phoneMatch = (c.phone || '').includes(q);
    const gotraMatch = (c.gotra || '').toLowerCase().includes(q);
    return nameMatch || phoneMatch || gotraMatch;
  });

  return (
    <div>
      {/* Search and Action Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '36px' }}
              placeholder="Search by name, phone, or gotra..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              setClientForm({
                name: '',
                phone: '',
                alternatePhone: '',
                email: '',
                address: '',
                gotra: '',
                nakshatra: '',
                rashi: '',
                community: 'Smartha',
                notes: ''
              });
              setClientModalOpen(true);
            }}
          >
            <Plus size={16} /> Add New Client
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px' }}>
        {/* Left Column: Clients List */}
        <div className="card" style={{ padding: '12px', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', padding: '0 8px' }}>
            All Clients ({filteredClients.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {filteredClients.map((c) => {
              const isSelected = selectedClient?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => selectClient(c.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#fff7ed' : '#fff',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{c.name || 'Unnamed Client'}</h4>
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                      {c.community || 'Smartha'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Gotra: <strong>{c.gotra || 'N/A'}</strong> • 📞 {c.phone || 'N/A'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Client Detailed View */}
        <div>
          {selectedClient ? (
            <div>
              {/* Profile Card */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{selectedClient.name || 'Unnamed Client'}</h2>
                    <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                      Gotra: {selectedClient.gotra || 'N/A'} • Nakshatra: {selectedClient.nakshatra || 'N/A'} • Rashi: {selectedClient.rashi || 'N/A'} • Sampradaya: {selectedClient.community || 'Smartha'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setClientForm(selectedClient);
                        setClientModalOpen(true);
                      }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClient(selectedClient.id)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Primary Phone</span>
                    <strong>{selectedClient.phone}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Alternate Phone</span>
                    <strong>{selectedClient.alternatePhone || '--'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Email</span>
                    <strong>{selectedClient.email || '--'}</strong>
                  </div>
                  <div style={{ gridColumn: 'span 3' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Address</span>
                    <strong>{selectedClient.address || '--'}</strong>
                  </div>
                </div>

                {selectedClient.notes && (
                  <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Notes: {selectedClient.notes}
                  </p>
                )}
              </div>

              {/* Linked Deceased Ancestors for Shraddha */}
              <div className="card">
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Flame size={18} color="var(--primary)" />
                    <h3 className="card-title">Deceased Ancestors for Annual Shraddha</h3>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setAncestorForm({
                        name: '',
                        relation: 'Father (Pitru)',
                        gotra: selectedClient.gotra,
                        deathDate: '',
                        deathTime: '12:00',
                        deathPlace: '',
                        masa: 'Chaitra',
                        paksha: 'Shukla',
                        tithi: 1,
                        tithiName: 'Prathama',
                        sampradaya: selectedClient.community || 'Smartha',
                        notes: ''
                      });
                      setAncestorModalOpen(true);
                    }}
                  >
                    <Plus size={14} /> Add Ancestor
                  </button>
                </div>

                {!selectedClient.deceasedAncestors || selectedClient.deceasedAncestors.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px 0' }}>
                    No ancestors linked yet. Add parents or grandparents to track annual shraddha dates.
                  </p>
                ) : (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Ancestor Name</th>
                          <th>Relation</th>
                          <th>Death Date (Gregorian)</th>
                          <th>Vedic Lunar Tithi</th>
                          <th>Tradition</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedClient.deceasedAncestors.map((d) => (
                          <tr key={d.id}>
                            <td><strong>{d.name}</strong></td>
                            <td>{d.relation}</td>
                            <td>{d.deathDate} ({d.deathTime || '12:00'})</td>
                            <td>
                              <span className="badge badge-warning">
                                {d.masa} {d.tithiName} ({d.paksha})
                              </span>
                            </td>
                            <td>{d.sampradaya}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Booking History */}
              <div className="card">
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarCheck size={18} color="var(--primary)" />
                    <h3 className="card-title">Ceremony Booking History</h3>
                  </div>
                </div>

                {!selectedClient.bookings || selectedClient.bookings.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px 0' }}>
                    No bookings recorded for this client.
                  </p>
                ) : (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Ceremony</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Venue</th>
                          <th>Dakshina</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedClient.bookings.map((b) => (
                          <tr key={b.id}>
                            <td><strong>{b.serviceName}</strong></td>
                            <td>{b.date}</td>
                            <td>{b.time}</td>
                            <td>{b.venue}</td>
                            <td>₹{b.dakshina}</td>
                            <td>
                              <span className={`badge ${b.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Select a client from the list to view their full profile and ancestors.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Client Modal */}
      <Modal
        isOpen={clientModalOpen}
        onClose={() => setClientModalOpen(false)}
        title={clientForm.id ? "Edit Client" : "Add New Client"}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              value={clientForm.name}
              onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="text"
              className="form-control"
              value={clientForm.phone}
              onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Alternate Phone</label>
            <input
              type="text"
              className="form-control"
              value={clientForm.alternatePhone}
              onChange={(e) => setClientForm({ ...clientForm, alternatePhone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gotra *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Kashyapa, Bharadwaja"
              value={clientForm.gotra}
              onChange={(e) => setClientForm({ ...clientForm, gotra: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Community / Sampradaya</label>
            <select
              className="form-control"
              value={clientForm.community}
              onChange={(e) => setClientForm({ ...clientForm, community: e.target.value })}
            >
              <option value="Smartha">Smartha</option>
              <option value="Madhva">Madhva</option>
              <option value="Vaishnava">Vaishnava</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Birth Nakshatra</label>
            <input
              type="text"
              className="form-control"
              value={clientForm.nakshatra}
              onChange={(e) => setClientForm({ ...clientForm, nakshatra: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Birth Rashi</label>
            <input
              type="text"
              className="form-control"
              value={clientForm.rashi}
              onChange={(e) => setClientForm({ ...clientForm, rashi: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              value={clientForm.address}
              onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Notes</label>
            <textarea
              className="form-control"
              rows={2}
              value={clientForm.notes}
              onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <button className="btn btn-secondary" onClick={() => setClientModalOpen(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSaveClient}>
            Save Client
          </button>
        </div>
      </Modal>

      {/* Add Deceased Ancestor Modal */}
      <Modal
        isOpen={ancestorModalOpen}
        onClose={() => setAncestorModalOpen(false)}
        title="Add Deceased Ancestor (ಪಿತೃ ಸೇರ್ಪಡೆ)"
        maxWidth="650px"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Ancestor Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Late K. Ramachandra"
              value={ancestorForm.name}
              onChange={(e) => setAncestorForm({ ...ancestorForm, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Relation *</label>
            <select
              className="form-control"
              value={ancestorForm.relation}
              onChange={(e) => setAncestorForm({ ...ancestorForm, relation: e.target.value })}
            >
              <option value="Father (Pitru)">Father (Pitru)</option>
              <option value="Mother (Matru)">Mother (Matru)</option>
              <option value="Paternal Grandfather (Pitamaha)">Paternal Grandfather (Pitamaha)</option>
              <option value="Paternal Grandmother (Pitamahi)">Paternal Grandmother (Pitamahi)</option>
              <option value="Maternal Grandfather (Mata-Maha)">Maternal Grandfather (Mata-Maha)</option>
              <option value="Maternal Grandmother (Mata-Mahi)">Maternal Grandmother (Mata-Mahi)</option>
              <option value="Brother / Sister / Other">Brother / Sister / Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Date of Death (Gregorian) *</label>
            <input
              type="date"
              className="form-control"
              value={ancestorForm.deathDate}
              onChange={(e) => setAncestorForm({ ...ancestorForm, deathDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Time of Death</label>
            <input
              type="time"
              className="form-control"
              value={ancestorForm.deathTime}
              onChange={(e) => setAncestorForm({ ...ancestorForm, deathTime: e.target.value })}
            />
          </div>

          <div style={{ gridColumn: 'span 2', marginBottom: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAutoFillDeathDetails}
            >
              <Sparkles size={14} /> Auto-Calculate Lunar Masa & Tithi from Death Date/Time
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Vedic Lunar Masa *</label>
            <input
              type="text"
              className="form-control"
              value={ancestorForm.masa}
              onChange={(e) => setAncestorForm({ ...ancestorForm, masa: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Paksha *</label>
            <select
              className="form-control"
              value={ancestorForm.paksha}
              onChange={(e) => setAncestorForm({ ...ancestorForm, paksha: e.target.value })}
            >
              <option value="Shukla">Shukla</option>
              <option value="Krishna">Krishna</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tithi Index (1-30)</label>
            <input
              type="number"
              className="form-control"
              min="1"
              max="30"
              value={ancestorForm.tithi}
              onChange={(e) => setAncestorForm({ ...ancestorForm, tithi: Number(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tithi Name</label>
            <input
              type="text"
              className="form-control"
              value={ancestorForm.tithiName}
              onChange={(e) => setAncestorForm({ ...ancestorForm, tithiName: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <button className="btn btn-secondary" onClick={() => setAncestorModalOpen(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSaveAncestor}>
            Save Ancestor
          </button>
        </div>
      </Modal>
    </div>
  );
}

