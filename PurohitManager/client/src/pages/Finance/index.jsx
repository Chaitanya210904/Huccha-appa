import React, { useState, useEffect } from 'react';
import { api } from '../../api/index.js';
import { useI18n } from '../../hooks/useI18n.jsx';
import { Modal } from '../../components/Modal.jsx';
import { printElement } from '../../utils/print.js';
import {
  generateReceiptPdfBlob,
  downloadReceiptPdf,
  copyReceiptImageToClipboard
} from '../../utils/receiptPdf.js';
import { GURU_LEFT_BASE64, GURU_RIGHT_BASE64 } from '../../assets/guruImagesBase64.js';
import {
  DollarSign,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  Receipt as ReceiptIcon,
  Filter,
  Send,
  Copy,
  Check,
  Download,
  FileText
} from 'lucide-react';

export function Finance() {
  const { t } = useI18n();
  const [ledger, setLedger] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Receipt Modal
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [whatsappHelpOpen, setWhatsappHelpOpen] = useState(false);
  const [downloadedFilename, setDownloadedFilename] = useState('');

  // New Expense Modal
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Samagri',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'Cash',
    notes: ''
  });

  useEffect(() => {
    loadFinance();
  }, []);

  async function loadFinance() {
    setLoading(true);
    try {
      const [lData, sData] = await Promise.all([
        api.getLedger(),
        api.getFinancialSummary(new Date().getFullYear())
      ]);
      setLedger(lData || []);
      setSummary(sData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenReceipt = async (paymentId) => {
    try {
      const r = await api.getReceipt(paymentId);
      setReceiptData(r);
      setReceiptModalOpen(true);
    } catch (e) {
      alert("Error loading receipt: " + e.message);
    }
  };

  const handleSaveExpense = async () => {
    try {
      await api.createExpense({
        ...expenseForm,
        amount: Number(expenseForm.amount)
      });
      setExpenseModalOpen(false);
      loadFinance();
    } catch (e) {
      alert("Error saving expense: " + e.message);
    }
  };

  const printDocument = () => {
    const el = document.getElementById('printable-receipt');
    if (el) {
      printElement(el, `Receipt_${receiptData?.receiptNumber || 'Dakshina'}`);
    } else {
      window.print();
    }
  };

  const generateWhatsAppReceiptText = () => {
    if (!receiptData) return '';
    const instKn = receiptData.institution?.kannada || 'ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ';
    const instEn = receiptData.institution?.english || 'Chaitanya Krupa Mukthi Dham';

    return `॥ ಶ್ರೀ ಗುರುಭ್ಯೋ ನಮಃ ॥
🚩 *${instKn}*
*${instEn}*
ವೈದಿಕ ಸೇವೆಗಳು, ಪೂಜೆಗಳು ಮತ್ತು ಸಂಸ್ಕಾರ ಕೇಂದ್ರ
━━━━━━━━━━━━━━━━━━━
📜 *ಅಧಿಕೃತ ದಕ್ಷಿಣೆ ರಸೀದಿ (Dakshina Receipt)*
━━━━━━━━━━━━━━━━━━━
• *ರಸೀದಿ ಸಂ:* ${receiptData.receiptNumber || '--'}
• *ದಿನಾಂಕ:* ${receiptData.paymentDate || '--'}
• *ಪಂಚಾಂಗ:* ${receiptData.vedicDate?.samvatsara || ''} ಸಂವತ್ಸರ, ${receiptData.vedicDate?.masa || ''} ಮಾಸ, ${receiptData.vedicDate?.tithi || ''} ತಿಥಿ, ${receiptData.vedicDate?.vara || ''}

👤 *ಯಜಮಾನರು:* ${receiptData.client?.name || ''}
${receiptData.client?.gotra ? `• *ಗೋತ್ರ:* ${receiptData.client.gotra}\n` : ''}🪔 *ಪೂಜೆ / ಸೇವೆ:* ${receiptData.ceremony?.name || 'ವೈದಿಕ ಪೂಜೆ / ಸಂಸ್ಕಾರ'}
💰 *ಸ್ವೀಕರಿಸಿದ ದಕ್ಷಿಣೆ:* *₹${receiptData.amount?.toLocaleString('en-IN')}*
(_${receiptData.amountInWords}_)
💳 *ಪಾವತಿ ವಿಧಾನ:* ${receiptData.paymentMode || 'Cash'}
━━━━━━━━━━━━━━━━━━━
॥ ಧರ್ಮೋ ರಕ್ಷತಿ ರಕ್ಷಿತಃ ॥

ಇಂತಿ ತಮ್ಮ ಪುರೋಹಿತರು:
*${receiptData.purohit?.name || ''}* ${receiptData.purohit?.title ? `(${receiptData.purohit.title})` : ''}
${receiptData.purohit?.city ? `ಸ್ಥಳ: ${receiptData.purohit.city}\n` : ''}ದೂರವಾಣಿ: ${receiptData.purohit?.phone || ''}${receiptData.purohit?.upiId ? `\nUPI ID: ${receiptData.purohit.upiId}` : ''}
━━━━━━━━━━━━━━━━━━━
ಧನ್ಯವಾದಗಳು! ಶುಭಮಸ್ತು!`;
  };

  const handleCopyWhatsAppReceipt = () => {
    const text = generateWhatsAppReceiptText();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  const handleSendWhatsAppReceipt = () => {
    if (!receiptData) return;
    let phone = receiptData.client?.phone || '';
    if (!phone) {
      phone = prompt(
        "ಯಜಮಾನರ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (Enter Client WhatsApp Mobile Number):",
        ""
      );
      if (!phone) return;
    }

    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    const text = generateWhatsAppReceiptText();
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleDownloadPdfOnly = async () => {
    if (!receiptData) return;
    setGeneratingPdf(true);
    try {
      const { pdfBlob } = await generateReceiptPdfBlob(receiptData);
      const filename = downloadReceiptPdf(pdfBlob, receiptData.receiptNumber);
      alert(`ರಸೀದಿ PDF (${filename}) ಯಶಸ್ವಿಯಾಗಿ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ!`);
    } catch (err) {
      alert("PDF generation failed: " + err.message);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleSendWhatsAppPdfReceipt = async () => {
    if (!receiptData) return;

    let phone = receiptData.client?.phone || '';
    if (!phone) {
      phone = prompt(
        "ಯಜಮಾನರ WhatsApp ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (Enter Client's WhatsApp Mobile Number):",
        ""
      );
      if (!phone) return;
    }

    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    setGeneratingPdf(true);
    try {
      const { pdfBlob, jpegBlob } = await generateReceiptPdfBlob(receiptData);
      const filename = `Receipt_${receiptData.receiptNumber || 'Dakshina'}.pdf`;

      // 1. If Web Share with file is supported, share actual PDF file directly
      if (navigator.canShare) {
        try {
          const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });
          if (navigator.canShare({ files: [pdfFile] })) {
            await navigator.share({
              files: [pdfFile],
              title: `ದಕ್ಷಿಣೆ ರಸೀದಿ (${receiptData.receiptNumber})`,
              text: `ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ - ಅಧಿಕೃತ ದಕ್ಷಿಣೆ ರಸೀದಿ PDF`
            });
            setGeneratingPdf(false);
            return;
          }
        } catch (shareErr) {
          if (shareErr.name === 'AbortError') {
            setGeneratingPdf(false);
            return;
          }
          console.warn("Native share fallback to download:", shareErr);
        }
      }

      // 2. Desktop fallback:
      // a) Download the authentic PDF file directly to device
      const downloadedName = downloadReceiptPdf(pdfBlob, receiptData.receiptNumber);
      setDownloadedFilename(downloadedName);

      // b) Also copy the graphical receipt image to clipboard for instant Ctrl+V pasting in WhatsApp Web
      await copyReceiptImageToClipboard(jpegBlob);

      // c) Open client's WhatsApp chat with preloaded message
      const text = `ನಮಸ್ಕಾರ ${receiptData.client?.name || ''}, ತಮ್ಮ "${receiptData.ceremony?.name || 'ವೈದಿಕ ಸೇವೆ'}" ಕಾರ್ಯಕ್ರಮದ ಅಧಿಕೃತ ದಕ್ಷಿಣೆ ರಸೀದಿ PDF (${receiptData.receiptNumber}) ಸಿದ್ಧವಾಗಿದೆ. - ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ`;
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');

      // d) Show the guide modal
      setWhatsappHelpOpen(true);
    } catch (err) {
      alert("Error preparing WhatsApp PDF: " + err.message);
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div>
      {/* Metrics Row */}
      <div className="grid-3" style={{ marginBottom: '20px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Dakshina Income ({summary?.year})</p>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#16a34a' }}>
                ₹{(summary?.totalIncome || 0).toLocaleString('en-IN')}
              </h2>
            </div>
            <div style={{ background: '#dcfce7', padding: '12px', borderRadius: '10px', color: '#15803d' }}>
              <ArrowDownLeft size={24} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Expenses ({summary?.year})</p>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#dc2626' }}>
                ₹{(summary?.totalExpenses || 0).toLocaleString('en-IN')}
              </h2>
            </div>
            <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '10px', color: '#b91c1c' }}>
              <ArrowUpRight size={24} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Net Savings / Earnings</p>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                ₹{(summary?.netEarnings || 0).toLocaleString('en-IN')}
              </h2>
            </div>
            <div style={{ background: '#ffedd5', padding: '12px', borderRadius: '10px', color: '#c2410c' }}>
              <DollarSign size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Action Header */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title">Transaction Ledger & Dakshina Receipts</h3>
          <button className="btn btn-secondary" onClick={() => setExpenseModalOpen(true)}>
            <Plus size={16} /> Record Expense
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="card">
        {ledger.length === 0 ? (
          <p style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No transactions recorded yet.
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Mode</th>
                  <th>Amount</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((item) => {
                  const isIncome = item.type === 'INCOME';
                  return (
                    <tr key={item.id}>
                      <td><strong>{item.date}</strong></td>
                      <td>
                        <span className={`badge ${isIncome ? 'badge-success' : 'badge-danger'}`}>
                          {item.type}
                        </span>
                      </td>
                      <td>
                        <strong>{item.title}</strong>
                        {item.notes && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {item.notes}
                          </div>
                        )}
                      </td>
                      <td>{item.mode}</td>
                      <td>
                        <strong style={{ color: isIncome ? '#16a34a' : '#dc2626' }}>
                          {isIncome ? `+₹${item.amount}` : `-₹${item.amount}`}
                        </strong>
                      </td>
                      <td>
                        {isIncome && item.receiptNumber && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenReceipt(item.id)}
                          >
                            <Printer size={14} /> Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Expense Modal */}
      <Modal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        title="Record Expense (ಖರ್ಚು ದಾಖಲು)"
      >
        <div className="form-group">
          <label className="form-label">Expense Title *</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Samidha & Ghee purchase, Travel"
            value={expenseForm.title}
            onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-control"
            value={expenseForm.category}
            onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
          >
            <option value="Samagri">Samagri & Puja Items</option>
            <option value="Assistant Remuneration">Assistant / Ritwik Remuneration</option>
            <option value="Travel">Travel / Conveyance</option>
            <option value="Temple/Trust">Temple / Veda Pathashala Donation</option>
            <option value="Books/Panchanga">Books & Panchangas</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Amount (₹) *</label>
          <input
            type="number"
            className="form-control"
            value={expenseForm.amount}
            onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={expenseForm.date}
            onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Payment Mode</label>
          <select
            className="form-control"
            value={expenseForm.paymentMode}
            onChange={(e) => setExpenseForm({ ...expenseForm, paymentMode: e.target.value })}
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <button className="btn btn-secondary" onClick={() => setExpenseModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSaveExpense}>Save Expense</button>
        </div>
      </Modal>

      {/* A4 Printable Dakshina Receipt Modal */}
      <Modal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        title="Dakshina Receipt (ದಕ್ಷಿಣೆ ರಸೀದಿ)"
        maxWidth="700px"
      >
        {receiptData && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                ಯಜಮಾನರು: <strong style={{ color: 'var(--text-main)' }}>{receiptData.client?.name}</strong> {receiptData.client?.phone ? `(${receiptData.client.phone})` : ''}
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  className="btn btn-sm"
                  onClick={handleSendWhatsAppPdfReceipt}
                  disabled={generatingPdf}
                  style={{
                    backgroundColor: '#16a34a',
                    color: '#fff',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 700,
                    padding: '7px 16px',
                    borderRadius: '6px',
                    cursor: generatingPdf ? 'wait' : 'pointer',
                    boxShadow: '0 2px 4px rgba(22, 163, 74, 0.3)'
                  }}
                  title="ಯಜಮಾನರ WhatsApp ಗೆ ಅಧಿಕೃತ ರಸೀದಿ PDF ಕಳುಹಿಸಿ"
                >
                  <Send size={15} />
                  <span>{generatingPdf ? 'PDF ಸಿದ್ಧವಾಗುತ್ತಿದೆ...' : 'WhatsApp ಗೆ PDF ಕಳುಹಿಸಿ (Send PDF)'}</span>
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleDownloadPdfOnly}
                  disabled={generatingPdf}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  title="ಕಂಪ್ಯೂಟರ್‌ಗೆ ನೇರವಾಗಿ PDF ಫೈಲ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ"
                >
                  <Download size={14} />
                  <span>PDF ಡೌನ್‌ಲೋಡ್</span>
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={printDocument}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  title="A4 PDF ಮುದ್ರಿಸಿ"
                >
                  <Printer size={14} />
                  <span>ಪ್ರಿಂಟ್ (Print)</span>
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleCopyWhatsAppReceipt}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  title="ರಸೀದಿ ವಿವರಗಳ ಪಠ್ಯವನ್ನು ಕಾಪಿ ಮಾಡಿ"
                >
                  {copiedReceipt ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  <span>{copiedReceipt ? 'ಕಾಪಿ ಆಗಿದೆ!' : 'ಪಠ್ಯ ಕಾಪಿ'}</span>
                </button>
              </div>
            </div>

            {/* Helper Tip */}
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '10px 14px', fontSize: '0.82rem', color: '#166534', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>📄</span>
              <span>
                <strong>WhatsApp PDF ಕಳುಹಿಸುವ ವಿಧಾನ:</strong> ಮೇಲಿನ <strong>'WhatsApp ಗೆ PDF ಕಳುಹಿಸಿ'</strong> ಬಟನ್ ಒತ್ತಿದಾಗ ಅಧಿಕೃತ A4 PDF ಡೌನ್‌ಲೋಡ್ ಆಗಿ ಯಜಮಾನರ WhatsApp ಚಾಟ್ ತೆರೆಯುತ್ತದೆ. ಅಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಆದ PDF ಫೈಲ್ ಅನ್ನು ಸುಲಭವಾಗಿ ಅಟ್ಯಾಚ್ ಮಾಡಿ ಕಳುಹಿಸಬಹುದು. (ಅಥವಾ ನೇರವಾಗಿ <em>Ctrl+V / Cmd+V</em> ಒತ್ತಿ ಚಿತ್ರವಾಗಿಯೂ ಕಳುಹಿಸಬಹುದು).
              </span>
            </div>

            {/* Printable Receipt Frame */}
            <div
              id="printable-receipt"
              className="printable-document"
              style={{
                border: '2px solid #b45309',
                padding: '24px',
                borderRadius: '8px',
                background: '#fff'
              }}
            >
              {/* Purohit Letterhead with Left and Right Gurus */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #b45309', paddingBottom: '14px', marginBottom: '16px', gap: '14px' }}>
                {/* Left Guru Image */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <img
                    src={GURU_LEFT_BASE64}
                    alt="Guru Left"
                    style={{
                      width: '84px',
                      height: '98px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      border: '2.5px solid #b45309',
                      boxShadow: '0 3px 8px rgba(180, 83, 9, 0.25)',
                      backgroundColor: '#fff',
                      display: 'block'
                    }}
                  />
                </div>

                {/* Center Title and Details */}
                <div style={{ textAlign: 'center', flexGrow: 1 }}>
                  <div style={{ fontSize: '1.25rem', color: '#b45309', fontWeight: 700 }}>॥ ಶ್ರೀ ಗುರುಭ್ಯೋ ನಮಃ ॥</div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#9a3412', margin: '4px 0', letterSpacing: '0.02em' }}>
                    {receiptData.institution?.kannada || 'ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ'}
                  </h1>
                  <p style={{ fontSize: '1.02rem', color: '#78350f', fontWeight: 700, margin: '2px 0' }}>
                    {receiptData.institution?.english || 'Chaitanya Krupa Mukthi Dham'}
                  </p>
                  <div style={{ fontSize: '0.85rem', color: '#854d0e', fontWeight: 600, marginTop: '2px' }}>
                    ವೈದಿಕ ಸೇವೆಗಳು, ಪೂಜೆಗಳು ಮತ್ತು ಸಂಸ್ಕಾರ ಕೇಂದ್ರ
                  </div>
                  <div style={{ fontSize: '0.92rem', color: '#451a03', fontWeight: 700, marginTop: '4px' }}>
                    ಪುರೋಹಿತರು: {receiptData.purohit?.name} {receiptData.purohit?.title ? `(${receiptData.purohit?.title})` : ''}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
                    {receiptData.purohit?.city} • ಸಂಪರ್ಕ: {receiptData.purohit?.phone} {receiptData.purohit?.upiId ? `• UPI: ${receiptData.purohit?.upiId}` : ''}
                  </p>
                </div>

                {/* Right Guru Image */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <img
                    src={GURU_RIGHT_BASE64}
                    alt="Guru Right"
                    style={{
                      width: '84px',
                      height: '98px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      border: '2.5px solid #b45309',
                      boxShadow: '0 3px 8px rgba(180, 83, 9, 0.25)',
                      backgroundColor: '#fff',
                      display: 'block'
                    }}
                  />
                </div>
              </div>

              {/* Receipt Meta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '16px' }}>
                <div>
                  <strong>Receipt No:</strong> {receiptData.receiptNumber}
                </div>
                <div>
                  <strong>Date:</strong> {receiptData.paymentDate}
                </div>
              </div>

              {/* Vedic Date Details */}
              <div style={{ background: '#fef3c7', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#92400e', marginBottom: '16px' }}>
                <strong>Vedic Almanac Date:</strong> {receiptData.vedicDate?.samvatsara} Samvatsara, {receiptData.vedicDate?.masa} Masa, {receiptData.vedicDate?.paksha} Paksha, {receiptData.vedicDate?.tithi} Tithi, {receiptData.vedicDate?.vara}
              </div>

              {/* Receipt Body */}
              <div style={{ fontSize: '0.95rem', lineHeight: '1.8', marginBottom: '24px' }}>
                <p>
                  Received with thanks from <strong>Shri / Smt {receiptData.client?.name}</strong>
                  {receiptData.client?.gotra && <span> (Gotra: <strong>{receiptData.client.gotra}</strong>)</span>},
                </p>
                <p>
                  the sum of <strong>Rupees {receiptData.amount?.toLocaleString('en-IN')}</strong> (<em>{receiptData.amountInWords}</em>)
                </p>
                <p>
                  towards Dakshina for <strong>{receiptData.ceremony?.name || 'Vedic Ceremony'}</strong> conducted on {receiptData.ceremony?.date || receiptData.paymentDate}.
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Payment Mode: <strong>{receiptData.paymentMode}</strong>
                </p>
              </div>

              {/* Signature */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '40px' }}>
                <div style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: 600 }}>
                  ॥ ಧರ್ಮೋ ರಕ್ಷತಿ ರಕ್ಷಿತಃ ॥
                </div>
                <div style={{ textAlign: 'center', width: '200px', borderTop: '1px solid #000', paddingTop: '6px', fontSize: '0.85rem' }}>
                  <strong>{receiptData.purohit?.name}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Signature of Purohit</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* WhatsApp PDF Delivery Assistant Modal */}
      <Modal
        isOpen={whatsappHelpOpen}
        onClose={() => setWhatsappHelpOpen(false)}
        title="WhatsApp ನಲ್ಲಿ PDF ಕಳುಹಿಸುವ ವಿಧಾನ (WhatsApp PDF Delivery)"
        maxWidth="520px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#f0fdf4', padding: '14px 16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            <span style={{ fontSize: '2rem' }}>📄</span>
            <div>
              <div style={{ fontWeight: 800, color: '#166534', fontSize: '0.96rem' }}>
                ರಸೀದಿ PDF ಯಶಸ್ವಿಯಾಗಿ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ!
              </div>
              <div style={{ fontSize: '0.8rem', color: '#15803d', marginTop: '2px' }}>
                ಫೈಲ್ ಹೆಸರು: <strong>{downloadedFilename}</strong>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.88rem', color: '#1e293b', lineHeight: 1.6 }}>
            ಯಜಮಾನರೊಂದಿಗೆ WhatsApp ಚಾಟ್ ಈಗಾಗಲೇ ತೆರೆದುಕೊಂಡಿದೆ. ಕೆಳಗಿನ <strong>೨ ಸರಳ ವಿಧಾನಗಳಲ್ಲಿ</strong> ಯಾವುದನ್ನಾದರೂ ಬಳಸಿ ರಸೀದಿ ಕಳುಹಿಸಿ:
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ backgroundColor: '#fed7aa', color: '#9a3412', fontWeight: 800, borderRadius: '50%', width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem' }}>೧</span>
              <div>
                <strong style={{ color: '#0f172a' }}>ವಿಧಾನ ೧ (ಅತ್ಯಂತ ವೇಗ - ನೇರ ಪೇಸ್ಟ್):</strong><br />
                ರಸೀದಿಯ ಸುಂದರ ಚಿತ್ರವನ್ನು ನಿಮ್ಮ ಕ್ಲಿಪ್‌ಬೋರ್ಡ್‌ಗೆ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ. WhatsApp ಚಾಟ್‌ನಲ್ಲಿ ಸಂದೇಶ ಬಾಕ್ಸ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ <strong>Ctrl+V</strong> (ಅಥವಾ Mac ನಲ್ಲಿ <strong>Cmd+V</strong>) ಒತ್ತಿದರೆ ರಸೀದಿ ಚಿತ್ರವಾಗಿ ತಕ್ಷಣವೇ ಪೋಸ್ಟ್ ಆಗುತ್ತದೆ!
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ backgroundColor: '#bbf7d0', color: '#166534', fontWeight: 800, borderRadius: '50%', width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem' }}>೨</span>
              <div>
                <strong style={{ color: '#0f172a' }}>ವಿಧಾನ ೨ (ಮೂಲ PDF ಡಾಕ್ಯುಮೆಂಟ್ ಕಳುಹಿಸಲು):</strong><br />
                WhatsApp ನಲ್ಲಿ <strong>📎 (Attach)</strong> ಚಿಹ್ನೆ ಒತ್ತಿ <strong>Document (ದಾಖಲೆ)</strong> ಆಯ್ಕೆಮಾಡಿ, ನಿಮ್ಮ Downloads ಫೋಲ್ಡರ್‌ನಲ್ಲಿರುವ <strong>{downloadedFilename}</strong> ಅನ್ನು ಆಯ್ಕೆಮಾಡಿ ಕಳುಹಿಸಿ.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button className="btn btn-primary" onClick={() => setWhatsappHelpOpen(false)}>
              ಅರ್ಥವಾಯಿತು (Got It)
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

