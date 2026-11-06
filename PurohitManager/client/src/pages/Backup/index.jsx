import React, { useState, useEffect } from 'react';
import { api } from '../../api/index.js';
import { useI18n } from '../../hooks/useI18n.jsx';
import { Database, Download, RefreshCw, RotateCcw, Check, Shield } from 'lucide-react';

export function Backup() {
  const { t } = useI18n();
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadSnapshots();
  }, []);

  async function loadSnapshots() {
    setLoading(true);
    try {
      const data = await api.getSnapshots();
      setSnapshots(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateSnapshot = async () => {
    setCreating(true);
    try {
      await api.createSnapshot();
      await loadSnapshots();
      alert("New backup snapshot created successfully!");
    } catch (e) {
      alert("Error creating backup: " + e.message);
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm(`Are you sure you want to restore data from snapshot ${id}? A safety backup of your current data will be created first.`)) {
      return;
    }
    try {
      await api.restoreSnapshot(id);
      alert("Data restored successfully!");
      window.location.reload();
    } catch (e) {
      alert("Error restoring data: " + e.message);
    }
  };

  const handleExportZip = () => {
    window.open('/api/backup/export', '_blank');
  };

  return (
    <div>
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Local Backup & Data Protection (ಬ್ಯಾಕಪ್)</h2>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={handleExportZip}>
              <Download size={16} /> Export All Data as ZIP
            </button>
            <button className="btn btn-primary" onClick={handleCreateSnapshot} disabled={creating}>
              <Shield size={16} /> {creating ? 'Backing up...' : 'Create Snapshot Now'}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Available Local Snapshots ({snapshots.length})</h3>
          <button className="btn btn-secondary btn-sm" onClick={loadSnapshots}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {snapshots.length === 0 ? (
          <p style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No backup snapshots created yet. Click "Create Snapshot Now" or snapshots will be created automatically.
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Snapshot Identifier</th>
                  <th>Created At</th>
                  <th>Files Included</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {snapshots.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.id}</strong></td>
                    <td>{new Date(s.createdAt).toLocaleString()}</td>
                    <td>{s.fileCount} JSON files</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleRestore(s.id)}
                      >
                        <RotateCcw size={14} /> Restore Snapshot
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

