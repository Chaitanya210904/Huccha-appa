import React, { useState, useEffect } from 'react';
import { api } from '../../api/index.js';
import { useI18n } from '../../hooks/useI18n.jsx';
import { Modal } from '../../components/Modal.jsx';
import { UserCheck, Plus, Edit2, Trash2, Phone } from 'lucide-react';

export function Assistants() {
  const { t } = useI18n();
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: 'Vedic Ritwik',
    phone: '',
    dailyRemuneration: 1500,
    notes: ''
  });

  useEffect(() => {
    loadAssistants();
  }, []);

  async function loadAssistants() {
    setLoading(true);
    try {
      const data = await api.getAssistants();
      setAssistants(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    try {
      if (form.id) {
        await api.updateAssistant(form.id, form);
      } else {
        await api.createAssistant(form);
      }
      setModalOpen(false);
      loadAssistants();
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this assistant?")) return;
    try {
      await api.deleteAssistant(id);
      loadAssistants();
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  return (
    <div>
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Assistants & Ritwiks (ಸಹ ಪುರೋಹಿತರು / ಋತ್ವಿಜರು)</h2>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              setForm({ name: '', role: 'Vedic Ritwik', phone: '', dailyRemuneration: 1500, notes: '' });
              setModalOpen(true);
            }}
          >
            <Plus size={16} /> Add Assistant
          </button>
        </div>
      </div>

      <div className="card">
        {assistants.length === 0 ? (
          <p style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No assistants registered. Add shishyas or fellow priests to assign them to bookings.
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Assistant Name</th>
                  <th>Role / Specialty</th>
                  <th>Phone Number</th>
                  <th>Daily Remuneration</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assistants.map((a) => (
                  <tr key={a.id}>
                    <td><strong>{a.name}</strong></td>
                    <td><span className="badge badge-neutral">{a.role}</span></td>
                    <td>📞 {a.phone}</td>
                    <td><strong>₹{a.dailyRemuneration}</strong></td>
                    <td>{a.notes || '--'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setForm(a);
                            setModalOpen(true);
                          }}
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleDelete(a.id)}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assistant Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form.id ? "Edit Assistant" : "Add Assistant"}
      >
        <div className="form-group">
          <label className="form-label">Name *</label>
          <input
            type="text"
            className="form-control"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Role / Veda Shakha</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Rigveda Ritwik, Yajurveda, Shishya"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone *</label>
          <input
            type="text"
            className="form-control"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Daily Remuneration (₹)</label>
          <input
            type="number"
            className="form-control"
            value={form.dailyRemuneration}
            onChange={(e) => setForm({ ...form, dailyRemuneration: Number(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <input
            type="text"
            className="form-control"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </div>
      </Modal>
    </div>
  );
}

