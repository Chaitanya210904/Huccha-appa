import React, { useState, useEffect } from 'react';
import { api } from '../../api/index.js';
import { useI18n } from '../../hooks/useI18n.jsx';
import { Modal } from '../../components/Modal.jsx';
import {
  Database,
  Download,
  RefreshCw,
  RotateCcw,
  Shield,
  Mail,
  UploadCloud,
  Send,
  FileArchive,
  CheckCircle,
  AlertCircle,
  Settings as SettingsIcon,
  ExternalLink,
  FileText,
  Clock
} from 'lucide-react';

export function Backup() {
  const { t } = useI18n();
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [settings, setSettings] = useState(null);

  // Email modal state
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailNotes, setEmailNotes] = useState('');
  const [saveAsDefault, setSaveAsDefault] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(null);
  const [emailError, setEmailError] = useState(null);

  // SMTP configuration state
  const [showSmtpSettings, setShowSmtpSettings] = useState(false);
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(465);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [snapData, settingsData] = await Promise.all([
        api.getSnapshots().catch(() => []),
        api.getSettings().catch(() => null)
      ]);
      setSnapshots(snapData || []);
      if (settingsData) {
        setSettings(settingsData);
        setEmailTo(settingsData.email || 'chaitanyaprasadkulkarni4@gmail.com');
        setEmailSubject(`ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ - ಸಂಪೂರ್ಣ ಡೇಟಾ ಬ್ಯಾಕಪ್ (${new Date().toLocaleDateString('kn-IN')})`);
        if (settingsData.smtp) {
          setSmtpHost(settingsData.smtp.host || 'smtp.gmail.com');
          setSmtpPort(settingsData.smtp.port || 465);
          setSmtpUser(settingsData.smtp.user || '');
          setSmtpPass(settingsData.smtp.pass || '');
        }
      }
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
      await loadData();
      alert("ಹೊಸ ಬ್ಯಾಕಪ್ ಸ್ನ್ಯಾಪ್‌ಶಾಟ್ ಯಶಸ್ವಿಯಾಗಿ ರಚನೆಯಾಗಿದೆ (New backup snapshot created successfully)!");
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
      alert("ಡೇಟಾ ಯಶಸ್ವಿಯಾಗಿ ಮರುಸ್ಥಾಪಿಸಲಾಗಿದೆ (Data restored successfully)!");
      window.location.reload();
    } catch (e) {
      alert("Error restoring data: " + e.message);
    }
  };

  const handleExportZip = () => {
    window.open('/api/backup/export', '_blank');
  };

  // Open email modal with updated subject
  const openEmailModal = () => {
    setEmailSuccess(null);
    setEmailError(null);
    setEmailSubject(`ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ - ಸಂಪೂರ್ಣ ಡೇಟಾ ಬ್ಯಾಕಪ್ (${new Date().toLocaleDateString('kn-IN')})`);
    if (settings?.email) {
      setEmailTo(settings.email);
    } else if (!emailTo) {
      setEmailTo('chaitanyaprasadkulkarni4@gmail.com');
    }
    setEmailModalOpen(true);
  };

  // Trigger Zip & Send Email
  const handleSendEmail = async (forceDirect = false) => {
    const targetEmail = (emailTo || settings?.email || '').trim();
    if (!targetEmail) {
      alert("ದಯವಿಟ್ಟು ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ (Please enter an email address).");
      return;
    }

    setSendingEmail(true);
    setEmailSuccess(null);
    setEmailError(null);

    try {
      const payload = {
        email: targetEmail,
        to: targetEmail,
        subject: emailSubject,
        notes: emailNotes,
        saveAsDefault: saveAsDefault,
        extraFiles: uploadedFiles.map(f => ({ name: f.name, content: f.content }))
      };

      if (smtpUser && smtpPass && (forceDirect || showSmtpSettings)) {
        payload.smtpConfig = {
          host: smtpHost,
          port: Number(smtpPort),
          secure: Number(smtpPort) === 465,
          user: smtpUser,
          pass: smtpPass
        };
      }

      const res = await api.emailBackup(payload);

      if (res.method === 'smtp') {
        setEmailSuccess({
          type: 'smtp',
          message: res.message || `ಬ್ಯಾಕಪ್ ZIP ಫೈಲ್ ಅನ್ನು ${targetEmail} ಗೆ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ!`,
          filename: res.filename,
          size: res.fileSize
        });
        if (saveAsDefault) {
          setSettings(prev => ({ ...prev, email: targetEmail }));
        }
      } else {
        // Client assist mode: Trigger instant ZIP download and open Webmail compose
        handleExportZip();

        const mailSubject = encodeURIComponent(res.subject || emailSubject);
        const mailBody = encodeURIComponent(
          `ನಮಸ್ಕಾರ,\n\nಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮದ ಎಲ್ಲಾ ಬ್ಯಾಕಪ್ ಫೈಲ್‌ಗಳ ZIP ಕಡತವನ್ನು ಲಗತ್ತಿಸಲಾಗಿದೆ.\n\nಕಡತದ ಹೆಸರು: ${res.filename || 'PurohitManager-Backup.zip'}\nದಿನಾಂಕ: ${new Date().toLocaleString()}\n\nಧನ್ಯವಾದಗಳು.`
        );

        // Open Gmail Web compose
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${mailSubject}&body=${mailBody}`;
        window.open(gmailUrl, '_blank');

        setEmailSuccess({
          type: 'client',
          message: `ಬ್ಯಾಕಪ್ ZIP ಫೈಲ್ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ ಮತ್ತು Gmail ತೆರೆದಿದೆ. ದಯವಿಟ್ಟು ಡೌನ್‌ಲೋಡ್ ಆದ ZIP ಫೈಲ್ ಅನ್ನು Gmail ನಲ್ಲಿ Attach ಮಾಡಿ Send ಕ್ಲಿಕ್ ಮಾಡಿ!`,
          recipient: targetEmail,
          gmailUrl
        });

        if (saveAsDefault && targetEmail !== settings?.email) {
          api.updateSettings({ email: targetEmail }).catch(() => {});
          setSettings(prev => ({ ...prev, email: targetEmail }));
        }
      }
    } catch (e) {
      console.error(e);
      setEmailError(e.message || "Failed to send backup email");
    } finally {
      setSendingEmail(false);
    }
  };

  // Handle local file picking for upload
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setUploadStatus(null);

    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            name: file.name,
            size: file.size,
            content: event.target.result
          });
        };
        reader.readAsText(file);
      });
    });

    Promise.all(readers).then(results => {
      setUploadedFiles(prev => [...prev, ...results]);
      setUploading(false);
      setUploadStatus(`${results.length} ಫೈಲ್‌ಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ (Selected).`);
    }).catch(err => {
      console.error(err);
      setUploading(false);
      alert("Error reading files: " + err.message);
    });
  };

  // Restore from uploaded files
  const handleUploadRestore = async () => {
    if (uploadedFiles.length === 0) {
      alert("ದಯವಿಟ್ಟು ಮೊದಲು ಫೈಲ್‌ಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ (Please select files first).");
      return;
    }

    if (!window.confirm(`ಆಯ್ಕೆ ಮಾಡಿದ ${uploadedFiles.length} ಫೈಲ್‌ಗಳಿಂದ ಡೇಟಾ ಮರುಸ್ಥಾಪಿಸಬೇಕೇ? ಪ್ರಸ್ತುತ ಡೇಟಾದ ಸುರಕ್ಷತಾ ಸ್ನ್ಯಾಪ್‌ಶಾಟ್ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ತೆಗೆದುಕೊಳ್ಳಲಾಗುತ್ತದೆ.`)) {
      return;
    }

    setUploading(true);
    try {
      const res = await api.uploadRestoreBackup({
        files: uploadedFiles.map(f => ({ name: f.name, content: f.content }))
      });
      alert(res.message || "ಡೇಟಾ ಯಶಸ್ವಿಯಾಗಿ ಮರುಸ್ಥಾಪಿಸಲಾಗಿದೆ!");
      setUploadModalOpen(false);
      window.location.reload();
    } catch (e) {
      alert("ಮರುಸ್ಥಾಪನೆ ವಿಫಲವಾಗಿದೆ: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Top Header Card */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={24} color="#b45309" />
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#9a3412', margin: 0 }}>
                ಡೇಟಾ ಬ್ಯಾಕಪ್ & ರಕ್ಷಣೆ (Local Backup & Email)
              </h2>
              <div style={{ fontSize: '0.82rem', color: '#78350f', marginTop: '2px' }}>
                ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ - ಡೇಟಾ ಸಂಗ್ರಹ, ಜಿಪ್ ರಫ್ತು ಮತ್ತು ಇಮೇಲ್ ರವಾನೆ
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* The Main Requested Button: Zip & Email */}
            <button
              className="btn"
              style={{
                backgroundColor: '#0284c7',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.35)',
                padding: '8px 14px'
              }}
              onClick={openEmailModal}
            >
              <Mail size={16} /> Zip & Email Backup (ಇಮೇಲ್‌ಗೆ ಕಳುಹಿಸಿ)
            </button>

            {/* Upload Backup Option */}
            <button
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => {
                setUploadStatus(null);
                setUploadModalOpen(true);
              }}
            >
              <UploadCloud size={16} /> Upload Backup (ಅಪ್‌ಲೋಡ್)
            </button>

            {/* Export All Data as ZIP */}
            <button
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={handleExportZip}
            >
              <Download size={16} /> Export ZIP
            </button>

            {/* Create Snapshot Now */}
            <button
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={handleCreateSnapshot}
              disabled={creating}
            >
              <Shield size={16} /> {creating ? 'Backing up...' : 'Create Snapshot'}
            </button>
          </div>
        </div>
      </div>

      {/* Featured Section: Zip All Files & Email to Assigned Email */}
      <div
        className="card"
        style={{
          padding: '20px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '1.5px solid #f59e0b'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <FileArchive size={20} color="#b45309" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#9a3412', margin: 0 }}>
                📦 ಎಲ್ಲಾ ಫೈಲ್‌ಗಳನ್ನು ಜಿಪ್ ಮಾಡಿ ಇಮೇಲ್‌ಗೆ ಕಳುಹಿಸಿ (Zip All Files & Email)
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#78350f', margin: '4px 0 12px 0', lineHeight: 1.5 }}>
              ಮುಕ್ತಿ ಧಾಮದ ಎಲ್ಲಾ ಬುಕಿಂಗ್ಸ್, ಗ್ರಾಹಕರು, ಪೂಜೆಗಳು, ಲೆಕ್ಕಪತ್ರಗಳು, ವೆಚ್ಚಗಳು ಮತ್ತು ಸೆಟ್ಟಿಂಗ್ಸ್‌ಗಳನ್ನು ಒಂದೇ ZIP ಕಡತವಾಗಿ ಪ್ಯಾಕ್ ಮಾಡಿ, ನಿಮ್ಮ ನಿಯೋಜಿತ ಇಮೇಲ್‌ಗೆ ಕಳುಹಿಸಲು ಕೆಳಗಿನ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '0.9rem' }}>
              <span style={{ fontWeight: 700, color: '#451a03' }}>ನಿಯೋಜಿತ ಇಮೇಲ್ (Assigned Email):</span>
              <span
                style={{
                  backgroundColor: '#fff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #d97706',
                  fontWeight: 600,
                  color: '#9a3412',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Mail size={14} color="#d97706" />
                {settings?.email || emailTo || 'ಇಮೇಲ್ ನಮೂದಿಸಲಾಗಿಲ್ಲ (Not set)'}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '3px 8px', fontSize: '0.78rem' }}
                onClick={openEmailModal}
              >
                ಬದಲಾಯಿಸಿ (Change)
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            <button
              className="btn"
              style={{
                backgroundColor: '#0284c7',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '10px 18px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 3px 8px rgba(2, 132, 199, 0.3)'
              }}
              onClick={openEmailModal}
            >
              <Send size={18} /> ಎಲ್ಲಾ ಫೈಲ್‌ಗಳನ್ನು ಜಿಪ್ ಮಾಡಿ ಇಮೇಲ್ ಮಾಡಿ (Zip & Email Now)
            </button>
            <div style={{ fontSize: '0.76rem', color: '#92400e', textAlign: 'right' }}>
              ✓ 15+ ಡೇಟಾ ಫೈಲ್‌ಗಳು • ಆಫ್‌ಲೈನ್ ಸಂಕೋಚನ (High Compression)
            </div>
          </div>
        </div>
      </div>

      {/* Snapshots Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">ಲಭ್ಯವಿರುವ ಸ್ಥಳೀಯ ಸ್ನ್ಯಾಪ್‌ಶಾಟ್‌ಗಳು (Available Local Snapshots)</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ಒಟ್ಟು {snapshots.length} ಸುರಕ್ಷಿತ ಬ್ಯಾಕಪ್ ಪ್ರತಿಗಳು ಸಂಗ್ರಹದಲ್ಲಿವೆ
            </span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadData}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {snapshots.length === 0 ? (
          <p style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            ಯಾವುದೇ ಬ್ಯಾಕಪ್ ಸ್ನ್ಯಾಪ್‌ಶಾಟ್ ಲಭ್ಯವಿಲ್ಲ. "Create Snapshot" ಅಥವಾ "Zip & Email Backup" ಬಟನ್ ಒತ್ತಿ.
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ಸ್ನ್ಯಾಪ್‌ಶಾಟ್ ವಿವರ (Identifier)</th>
                  <th>ರಚನೆಯಾದ ಸಮಯ (Created At)</th>
                  <th>ಫೈಲ್‌ಗಳ ಸಂಖ್ಯೆ (Included Files)</th>
                  <th>ಕ್ರಮ (Action)</th>
                </tr>
              </thead>
              <tbody>
                {snapshots.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileArchive size={16} color="#b45309" />
                        <strong>{s.id}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="var(--text-muted)" />
                        {new Date(s.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-secondary" style={{ fontWeight: 600 }}>
                        {s.fileCount} JSON files
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        onClick={() => handleRestore(s.id)}
                      >
                        <RotateCcw size={14} /> ಮರುಸ್ಥಾಪಿಸಿ (Restore)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Zip & Email Backup Assistant */}
      <Modal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        title="📧 ಬ್ಯಾಕಪ್ ಜಿಪ್ ಮಾಡಿ ಇಮೇಲ್‌ಗೆ ಕಳುಹಿಸಿ (Zip & Email Backup)"
        maxWidth="640px"
      >
        <div style={{ padding: '8px 4px' }}>
          {emailSuccess ? (
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1.5px solid #22c55e',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: 700, fontSize: '1.05rem' }}>
                <CheckCircle size={20} /> ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ!
              </div>
              <p style={{ margin: '8px 0', color: '#166534', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {emailSuccess.message}
              </p>
              {emailSuccess.gmailUrl && (
                <div style={{ marginTop: '12px' }}>
                  <a
                    href={emailSuccess.gmailUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}
                  >
                    <ExternalLink size={16} /> Gmail ನಲ್ಲಿ ಪುನಃ ತೆರೆಯಿರಿ (Open Gmail)
                  </a>
                </div>
              )}
            </div>
          ) : null}

          {emailError && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1.5px solid #ef4444',
                borderRadius: '8px',
                padding: '14px',
                marginBottom: '16px',
                color: '#b91c1c',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={18} />
              <span>{emailError}</span>
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontWeight: 700, color: '#451a03', marginBottom: '4px' }}>
              ನಿಯೋಜಿತ ಇಮೇಲ್ ವಿಳಾಸ (Recipient Email Address) *
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. your-email@gmail.com"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', fontSize: '0.95rem' }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '0.82rem', color: '#78350f', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={saveAsDefault}
                onChange={(e) => setSaveAsDefault(e.target.checked)}
              />
              ಈ ಇಮೇಲ್ ಅನ್ನು ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಶಾಶ್ವತ ನಿಯೋಜಿತ ಇಮೇಲ್ ಆಗಿ ಉಳಿಸಿ (Save as default)
            </label>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#451a03', marginBottom: '4px' }}>
              ವಿಷಯ (Email Subject)
            </label>
            <input
              type="text"
              className="form-control"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              style={{ width: '100%', padding: '8px 12px' }}
            />
          </div>

          {/* Collapsible Direct SMTP Configuration */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', marginBottom: '16px', backgroundColor: '#fafafa' }}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setShowSmtpSettings(!showSmtpSettings)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 700, color: '#475569' }}>
                <SettingsIcon size={16} />
                <span>ಸ್ವಯಂಚಾಲಿತ ನೇರ ಇಮೇಲ್ ಕಳುಹಿಸುವಿಕೆ (Direct SMTP / Gmail App Password)</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600 }}>
                {showSmtpSettings ? 'ಮರೆಮಾಡಿ (Hide)' : 'ಕಾನ್ಫಿಗರ್ ಮಾಡಿ (Configure)'}
              </span>
            </div>

            {showSmtpSettings && (
              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 10px 0' }}>
                  Gmail ಅಥವಾ ಯಾವುದೇ SMTP ಸರ್ವರ್ ಮೂಲಕ ನೇರವಾಗಿ ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಆಟೋ-ಇಮೇಲ್ ಕಳುಹಿಸಲು Gmail App Password ಅನ್ನು ಇಲ್ಲಿ ನಮೂದಿಸಬಹುದು.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>SMTP Server Host</label>
                    <input
                      type="text"
                      className="form-control"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Port</label>
                    <input
                      type="number"
                      className="form-control"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      placeholder="465"
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Gmail / SMTP Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                      placeholder="your-email@gmail.com"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Gmail App Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={smtpPass}
                      onChange={(e) => setSmtpPass(e.target.value)}
                      placeholder="xxxx xxxx xxxx xxxx"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <button className="btn btn-secondary" onClick={() => setEmailModalOpen(false)}>
              ರದ್ದುಗೊಳಿಸಿ (Close)
            </button>

            <button
              className="btn"
              style={{
                backgroundColor: '#0284c7',
                color: '#fff',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px'
              }}
              onClick={() => handleSendEmail(false)}
              disabled={sendingEmail}
            >
              <Send size={16} />
              {sendingEmail ? 'ಜಿಪ್ ಮಾಡಿ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...' : 'ಜಿಪ್ ಮಾಡಿ ಇಮೇಲ್‌ಗೆ ಕಳುಹಿಸಿ (Zip & Send)'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Upload Backup Files */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="📥 ಬ್ಯಾಕಪ್ ಫೈಲ್‌ಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (Upload Backup Files)"
        maxWidth="600px"
      >
        <div style={{ padding: '8px 4px' }}>
          <p style={{ fontSize: '0.88rem', color: '#78350f', lineHeight: 1.5, margin: '0 0 14px 0' }}>
            ನಿಮ್ಮ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿರುವ ಬ್ಯಾಕಪ್ JSON ಕಡತಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. ಆಯ್ಕೆ ಮಾಡಿದ ಫೈಲ್‌ಗಳನ್ನು ಮುಕ್ತಿ ಧಾಮ ಡೇಟಾಬೇಸ್‌ಗೆ ಸುರಕ್ಷಿತವಾಗಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಬಹುದು ಅಥವಾ ಜಿಪ್ ಮಾಡಿ ಇಮೇಲ್‌ಗೆ ರವಾನಿಸಬಹುದು.
          </p>

          <div
            style={{
              border: '2px dashed #d97706',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: '#fffbeb',
              marginBottom: '16px'
            }}
          >
            <UploadCloud size={36} color="#d97706" style={{ margin: '0 auto 8px auto' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#9a3412', marginBottom: '4px' }}>
              ಬ್ಯಾಕಪ್ ಕಡತಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ (Select JSON Backup Files)
            </div>
            <div style={{ fontSize: '0.8rem', color: '#b45309', marginBottom: '12px' }}>
              bookings.json, clients.json, settings.json, ಇತ್ಯಾದಿ
            </div>
            <input
              type="file"
              multiple
              accept=".json,.txt"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="backup-file-upload-input"
            />
            <label
              htmlFor="backup-file-upload-input"
              className="btn btn-primary"
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <UploadCloud size={16} /> ಫೈಲ್ ಬ್ರೌಸ್ ಮಾಡಿ (Browse Files)
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#451a03', marginBottom: '6px' }}>
                ಆಯ್ಕೆಯಾದ ಕಡತಗಳು ({uploadedFiles.length}):
              </div>
              <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                {uploadedFiles.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      fontSize: '0.82rem',
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: i % 2 === 0 ? '#fff' : '#f8fafc'
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{f.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{(f.size / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={() => setUploadModalOpen(false)}>
              ಮುಚ್ಚಿ (Close)
            </button>
            <button
              className="btn btn-primary"
              onClick={handleUploadRestore}
              disabled={uploading || uploadedFiles.length === 0}
            >
              {uploading ? 'ಮರುಸ್ಥಾಪಿಸಲಾಗುತ್ತಿದೆ...' : 'ಮರುಸ್ಥಾಪಿಸಿ (Restore Files)'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
