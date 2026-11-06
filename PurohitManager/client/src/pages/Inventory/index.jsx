import React, { useState, useEffect } from 'react';
import { api } from '../../api/index.js';
import { useI18n } from '../../hooks/useI18n.jsx';
import { Modal } from '../../components/Modal.jsx';
import { printElement } from '../../utils/print.js';
import { GURU_LEFT_BASE64, GURU_RIGHT_BASE64 } from '../../assets/guruImagesBase64.js';
import {
  ListChecks,
  Plus,
  Printer,
  Edit2,
  Trash2,
  Copy,
  Check,
  Search,
  Filter,
  Flame,
  Sparkles,
  Share2
} from 'lucide-react';

export function Inventory() {
  const { t, lang } = useI18n();
  const [pujas, setPujas] = useState([]);
  const [selectedPujaId, setSelectedPujaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchPuja, setSearchPuja] = useState('');
  const [searchItem, setSearchItem] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState(null);

  // Modals
  const [pujaModalOpen, setPujaModalOpen] = useState(false);
  const [pujaForm, setPujaForm] = useState({
    id: '',
    name: '',
    kannadaName: '',
    category: 'ವ್ರತ / ಪೂಜೆ (Vrata / Puja)',
    description: '',
    prefillEssentials: true
  });

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [itemForm, setItemForm] = useState({
    id: '',
    item: '',
    kannada: '',
    qty: '',
    category: 'ಪೂಜಾ ದ್ರವ್ಯಗಳು',
    essential: true
  });

  useEffect(() => {
    loadPujas();
  }, []);

  async function loadPujas(preferredSelectedId = null) {
    setLoading(true);
    try {
      const [data, setts] = await Promise.all([
        api.getPujaSamagriList(),
        api.getSettings()
      ]);
      const list = data || [];
      setPujas(list);
      setSettings(setts || null);
      if (list.length > 0) {
        if (preferredSelectedId && list.some(p => p.id === preferredSelectedId)) {
          setSelectedPujaId(preferredSelectedId);
        } else if (!selectedPujaId || !list.some(p => p.id === selectedPujaId)) {
          setSelectedPujaId(list[0].id);
        }
      } else {
        setSelectedPujaId(null);
      }
    } catch (e) {
      console.error('Error loading puja samagri list:', e);
    } finally {
      setLoading(false);
    }
  }

  const selectedPuja = pujas.find(p => p.id === selectedPujaId) || null;

  // Filtered pujas in left sidebar
  const filteredPujas = pujas.filter(p => {
    const q = searchPuja.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.kannadaName && p.kannadaName.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  // Filtered items in selected puja
  const filteredItems = (selectedPuja?.items || []).filter(it => {
    const matchCat = categoryFilter === 'ALL' || it.category === categoryFilter;
    const q = searchItem.toLowerCase();
    const matchSearch = !q || (
      (it.item && it.item.toLowerCase().includes(q)) ||
      (it.kannada && it.kannada.toLowerCase().includes(q)) ||
      (it.qty && it.qty.toLowerCase().includes(q))
    );
    return matchCat && matchSearch;
  });

  // Categories list in current selected puja
  const availableCategories = Array.from(
    new Set((selectedPuja?.items || []).map(it => it.category).filter(Boolean))
  );

  // Common essential starter items for new pujas
  const COMMON_ESSENTIAL_ITEMS = [
    { item: "Turmeric powder", kannada: "ಅರಿಶಿನ ಪುಡಿ", qty: "100 g", category: "ಪೂಜಾ ದ್ರವ್ಯಗಳು", essential: true },
    { item: "Kumkuma (Vermilion)", kannada: "ಕುಂಕುಮ", qty: "100 g", category: "ಪೂಜಾ ದ್ರವ್ಯಗಳು", essential: true },
    { item: "Sandalwood paste / Chandana", kannada: "ಗಂಧದ ಪುಡಿ / ಚಂದನ", qty: "1 box", category: "ಪೂಜಾ ದ್ರವ್ಯಗಳು", essential: true },
    { item: "Betel leaves (Vilyada ele)", kannada: "ವೀಳ್ಯದೆಲೆ", qty: "30 leaves", category: "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", essential: true },
    { item: "Betel nuts (Adike / Supari)", kannada: "ಅಡಿಕೆ", qty: "15 pieces", category: "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", essential: true },
    { item: "Coconuts (Tenginakayi)", kannada: "ತೆಂಗಿನಕಾಯಿ", qty: "3 nos", category: "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", essential: true },
    { item: "Raw Rice (Akki)", kannada: "ಅಕ್ಕಿ", qty: "2 kg", category: "ಧಾನ್ಯಗಳು", essential: true },
    { item: "Flowers & Garlands", kannada: "ಹೂವು ಮತ್ತು ಹಾರ", qty: "1 bunch + 1 garland", category: "ಪೂಜಾ ದ್ರವ್ಯಗಳು", essential: true },
    { item: "Camphor (Karpura) & Incense (Agarbatti)", kannada: "ಕರ್ಪೂರ ಮತ್ತು ಊದಿನಕಡ್ಡಿ", qty: "1 packet each", category: "ಪೂಜಾ ದ್ರವ್ಯಗಳು", essential: true },
    { item: "Fruits (Bananas)", kannada: "ಹಣ್ಣುಗಳು (ಬಾಳೆಹಣ್ಣು)", qty: "1 bunch", category: "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", essential: true },
    { item: "Oil lamps, cotton wicks, oil/ghee", kannada: "ದೀಪಗಳು, ಬತ್ತಿ, ಎಣ್ಣೆ / ತುಪ್ಪ", qty: "1 pair", category: "ಪೂಜಾ ದ್ರವ್ಯಗಳು", essential: true }
  ];

  // Save Puja (create or edit)
  const handleSavePuja = async () => {
    if (!pujaForm.kannadaName && !pujaForm.name) {
      alert("ದಯವಿಟ್ಟು ಪೂಜೆಯ ಹೆಸರನ್ನು ನಮೂದಿಸಿ (Please enter Puja Name)");
      return;
    }

    try {
      if (pujaForm.id) {
        // Edit existing
        await api.updatePuja(pujaForm.id, {
          name: pujaForm.name,
          kannadaName: pujaForm.kannadaName,
          category: pujaForm.category,
          defaultDakshina: Number(pujaForm.defaultDakshina) || 3500,
          description: pujaForm.description
        });
        setPujaModalOpen(false);
        await loadPujas(pujaForm.id);
      } else {
        // Create new
        const initialItems = pujaForm.prefillEssentials
          ? COMMON_ESSENTIAL_ITEMS.map((it, idx) => ({ ...it, id: `it_${Date.now()}_${idx}` }))
          : [];

        const newPuja = await api.createPuja({
          name: pujaForm.name || pujaForm.kannadaName,
          kannadaName: pujaForm.kannadaName || pujaForm.name,
          category: pujaForm.category,
          defaultDakshina: Number(pujaForm.defaultDakshina) || 3500,
          description: pujaForm.description,
          items: initialItems
        });
        setPujaModalOpen(false);
        await loadPujas(newPuja.id);
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  // Delete Puja
  const handleDeletePuja = async (pujaId, pujaName) => {
    if (!window.confirm(`"${pujaName}" ಪೂಜೆಯ ಪಟ್ಟಿಯನ್ನು ಅಳಿಸಬೇಕೇ? (Are you sure you want to delete this puja checklist?)`)) {
      return;
    }
    try {
      await api.deletePuja(pujaId);
      await loadPujas();
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  // Save Item (add or edit)
  const handleSaveItem = async () => {
    if (!itemForm.kannada && !itemForm.item) {
      alert("ದಯವಿಟ್ಟು ಸಾಮಗ್ರಿಯ ಹೆಸರನ್ನು ನಮೂದಿಸಿ (Please enter Item Name)");
      return;
    }

    try {
      if (itemForm.id) {
        // Edit item
        await api.updateSamagriItem(selectedPujaId, itemForm.id, itemForm);
      } else {
        // Add item
        await api.addSamagriItem(selectedPujaId, itemForm);
      }
      setItemModalOpen(false);
      await loadPujas(selectedPujaId);
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  // Delete Item
  const handleDeleteItem = async (itemId, itemName) => {
    if (!window.confirm(`"${itemName}" ಸಾಮಗ್ರಿಯನ್ನು ಪಟ್ಟಿಯಿಂದ ತೆಗೆದುಹಾಕಬೇಕೇ?`)) return;
    try {
      await api.deleteSamagriItem(selectedPujaId, itemId);
      await loadPujas(selectedPujaId);
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  // Copy WhatsApp-ready formatted message
  const handleCopyWhatsApp = () => {
    if (!selectedPuja) return;

    let text = `॥ ಶ್ರೀಃ ॥\n`;
    text += `*${selectedPuja.kannadaName || selectedPuja.name}*\n`;
    text += `*ಪೂಜೆಗೆ ಯಜಮಾನರು ತರಬೇಕಾದ ಸಾಮಗ್ರಿಗಳ ಪಟ್ಟಿ:*\n`;
    text += `------------------------------------\n`;

    const items = selectedPuja.items || [];
    items.forEach((it, idx) => {
      const name = it.kannada ? `${it.kannada} (${it.item})` : it.item;
      text += `${idx + 1}. ${name} - *${it.qty || 'ಯಥಾಶಕ್ತಿ'}*\n`;
    });

    text += `------------------------------------\n`;
    if (settings?.purohitName) {
      text += `ಪುರೋಹಿತರು: *${settings.purohitName}*\n`;
      if (settings?.phone) text += `ಸಂಪರ್ಕ: ${settings.phone}\n`;
    }
    text += `_ಧನ್ಯವಾದಗಳು!_\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const printChecklist = () => {
    if (!selectedPuja) {
      window.print();
      return;
    }
    const printableArea = document.createElement('div');
    printableArea.className = 'printable-document';
    printableArea.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #b45309; padding-bottom: 12px; margin-bottom: 16px; gap: 12px;">
        <img src="${GURU_LEFT_BASE64}" alt="Guru Left" style="width: 70px; height: 82px; object-fit: cover; border-radius: 50%; border: 2px solid #b45309; flex-shrink: 0;" />
        <div style="text-align: center; flex-grow: 1;">
          <div style="font-size: 1.15rem; color: #b45309; font-weight: 700;">॥ ಶ್ರೀ ಗುರುಭ್ಯೋ ನಮಃ ॥</div>
          <h1 style="font-size: 1.6rem; color: #9a3412; margin: 3px 0; font-weight: 800;">
            ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ
          </h1>
          <div style="font-size: 0.92rem; color: #78350f; font-weight: 600;">
            Chaitanya Krupa Mukthi Dham • ಪೂಜಾ ಸಾಮಗ್ರಿ ಪಟ್ಟಿ
          </div>
          <h2 style="font-size: 1.25rem; color: #1e293b; margin: 6px 0 2px 0;">
            ${selectedPuja.kannadaName || selectedPuja.name}
          </h2>
          <div style="font-size: 0.85rem; color: #64748b;">
            ವರ್ಗ: ${selectedPuja.category || 'ವ್ರತ / ಪೂಜೆ'} • ಒಟ್ಟು ಸಾಮಗ್ರಿಗಳು: ${selectedPuja.items?.length || 0}
          </div>
        </div>
        <img src="${GURU_RIGHT_BASE64}" alt="Guru Right" style="width: 70px; height: 82px; object-fit: cover; border-radius: 50%; border: 2px solid #b45309; flex-shrink: 0;" />
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-top: 14px;">
        <thead>
          <tr style="background-color: #f8fafc;">
            <th style="width: 45px; border: 1px solid #cbd5e1; padding: 6px 10px; text-align: center;">#</th>
            <th style="border: 1px solid #cbd5e1; padding: 6px 10px;">ಸಾಮಗ್ರಿಯ ಹೆಸರು (Item Name)</th>
            <th style="border: 1px solid #cbd5e1; padding: 6px 10px; width: 140px;">ಪ್ರಮಾಣ / ಅಳತೆ (Qty)</th>
            <th style="border: 1px solid #cbd5e1; padding: 6px 10px; width: 130px;">ವಿಭಾಗ (Category)</th>
            <th style="border: 1px solid #cbd5e1; padding: 6px 10px; width: 60px; text-align: center;">ಸಿದ್ಧತೆ</th>
          </tr>
        </thead>
        <tbody>
          ${(selectedPuja.items || []).map((it, idx) => `
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 6px 10px; text-align: center;">${idx + 1}</td>
              <td style="border: 1px solid #cbd5e1; padding: 6px 10px;">
                <strong>${it.kannada || it.item}</strong>
                ${it.kannada && it.item ? `<div style="font-size: 0.8rem; color: #64748b;">${it.item}</div>` : ''}
              </td>
              <td style="border: 1px solid #cbd5e1; padding: 6px 10px;">${it.qty || '--'}</td>
              <td style="border: 1px solid #cbd5e1; padding: 6px 10px; font-size: 0.85rem;">${it.category || 'ಇತರೆ'}</td>
              <td style="border: 1px solid #cbd5e1; padding: 6px 10px; text-align: center; font-size: 1.1rem;">☐</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${settings?.purohitName ? `
        <div style="margin-top: 30px; text-align: right; font-size: 0.9rem;">
          <div>ಪುರೋಹಿತರು: <strong>${settings.purohitName}</strong></div>
          <div style="font-size: 0.8rem; color: #64748b;">ದೂರವಾಣಿ: ${settings.phone || ''}</div>
        </div>
      ` : ''}
    `;
    printElement(printableArea, `Samagri_${selectedPuja.kannadaName || selectedPuja.name}`);
  };

  return (
    <div>
      {/* Top Header Card */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ListChecks size={24} color="var(--primary)" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                {lang === 'kn' ? 'ಪೂಜಾ ಸಾಮಗ್ರಿ ಪಟ್ಟಿ ನಿರ್ವಹಣೆ' : 'Puja Samagri Checklists'}
              </h2>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              ಯಾವ ಪೂಜೆಗೆ ಯಾವ ಸಾಮಗ್ರಿ ಬೇಕು ಎಂಬುದನ್ನು ಇಲ್ಲಿ ನಿಗದಿಪಡಿಸಿ. ಹೊಸ ಪೂಜೆಗಳನ್ನು ಸೇರಿಸಿ ಅಥವಾ ಇರುವ ಪಟ್ಟಿಯನ್ನು ಬದಲಾಯಿಸಿ ಯಜಮಾನರಿಗೆ ಕಳುಹಿಸಿ.
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              setPujaForm({
                id: '',
                name: '',
                kannadaName: '',
                category: 'ವ್ರತ / ಪೂಜೆ (Vrata / Puja)',
                description: '',
                prefillEssentials: true
              });
              setPujaModalOpen(true);
            }}
          >
            <Plus size={16} /> ಹೊಸ ಪೂಜೆ ಸೇರಿಸಿ (Add New Puja)
          </button>
        </div>
      </div>

      {loading && pujas.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          ಸಾಮಗ್ರಿ ಪಟ್ಟಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ... / Loading Puja Samagri Checklists...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px minmax(0, 1fr)', gap: '16px', alignItems: 'start' }}>
          
          {/* Left Column: Puja Selector List */}
          <div className="card" style={{ padding: '14px', maxHeight: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '32px', fontSize: '0.85rem' }}
                  placeholder="ಪೂಜೆ ಹುಡುಕಿ / Search Puja..."
                  value={searchPuja}
                  onChange={(e) => setSearchPuja(e.target.value)}
                />
              </div>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filteredPujas.map((p) => {
                const isSelected = p.id === selectedPujaId;
                const count = p.items ? p.items.length : 0;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPujaId(p.id);
                      setCategoryFilter('ALL');
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: isSelected ? '#fff7ed' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1, paddingRight: '8px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: isSelected ? '#c2410c' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.kannadaName || p.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        backgroundColor: isSelected ? '#fed7aa' : '#f1f5f9',
                        color: isSelected ? '#9a3412' : '#475569',
                        padding: '2px 7px',
                        borderRadius: '12px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {count} ಸಾಮಗ್ರಿ
                    </span>
                  </div>
                );
              })}

              {filteredPujas.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  ಯಾವುದೇ ಪೂಜೆ ಕಂಡುಬಂದಿಲ್ಲ.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Active Puja Samagri Checklist */}
          {selectedPuja ? (
            <div className="card" style={{ padding: '20px' }}>
              {/* Puja Title & Actions Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.25rem' }}>🪔</span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>
                      {selectedPuja.kannadaName || selectedPuja.name}
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {selectedPuja.name} • <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{selectedPuja.category}</span>
                  </div>
                  {selectedPuja.description && (
                    <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                      {selectedPuja.description}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setItemForm({
                        id: '',
                        item: '',
                        kannada: '',
                        qty: '',
                        category: 'ಪೂಜಾ ದ್ರವ್ಯಗಳು',
                        essential: true
                      });
                      setItemModalOpen(true);
                    }}
                  >
                    <Plus size={15} /> ಸಾಮಗ್ರಿ ಸೇರಿಸಿ (Add Item)
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ backgroundColor: copied ? '#dcfce7' : '', color: copied ? '#15803d' : '' }}
                    onClick={handleCopyWhatsApp}
                    title="Copy full list for sending on WhatsApp"
                  >
                    {copied ? <Check size={15} color="#15803d" /> : <Copy size={15} />}
                    {copied ? 'ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!' : 'WhatsApp ಪಟ್ಟಿ ಕಾಪಿ ಮಾಡಿ'}
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={printChecklist}
                    title="Print A4 checklist"
                  >
                    <Printer size={15} /> ಮುದ್ರಿಸಿ (Print)
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setPujaForm({
                        id: selectedPuja.id,
                        name: selectedPuja.name,
                        kannadaName: selectedPuja.kannadaName,
                        category: selectedPuja.category || 'ವ್ರತ / ಪೂಜೆ (Vrata / Puja)',
                        defaultDakshina: selectedPuja.defaultDakshina || 3500,
                        description: selectedPuja.description || '',
                        prefillEssentials: false
                      });
                      setPujaModalOpen(true);
                    }}
                    title="Edit puja details"
                  >
                    <Edit2 size={15} />
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#dc2626' }}
                    onClick={() => handleDeletePuja(selectedPuja.id, selectedPuja.kannadaName || selectedPuja.name)}
                    title="Delete this puja checklist"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Filters and search inside selected Puja */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {/* Category Pills */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    className={`btn btn-sm ${categoryFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem', padding: '3px 10px', borderRadius: '16px' }}
                    onClick={() => setCategoryFilter('ALL')}
                  >
                    ಎಲ್ಲಾ ({selectedPuja.items?.length || 0})
                  </button>
                  {availableCategories.map(cat => {
                    const count = selectedPuja.items.filter(it => it.category === cat).length;
                    return (
                      <button
                        key={cat}
                        className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.78rem', padding: '3px 10px', borderRadius: '16px' }}
                        onClick={() => setCategoryFilter(cat)}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Item Search */}
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '30px', paddingRight: '8px', paddingBlock: '4px', fontSize: '0.8rem' }}
                    placeholder="ಸಾಮಗ್ರಿ ಹುಡುಕಿ..."
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                  />
                </div>
              </div>

              {/* Samagri Table */}
              {filteredItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8fafc', borderRadius: '8px', color: 'var(--text-muted)' }}>
                  ಯಾವುದೇ ಸಾಮಗ್ರಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಸಾಮಗ್ರಿ ಸೇರಿಸಲು ಮೇಲಿನ <strong>"ಸಾಮಗ್ರಿ ಸೇರಿಸಿ"</strong> ಬಟನ್ ಒತ್ತಿರಿ.
                </div>
              ) : (
                <div className="table-container" style={{ border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <table>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc' }}>
                        <th style={{ width: '40px', textAlign: 'center' }}>#</th>
                        <th>ಸಾಮಗ್ರಿಯ ಹೆಸರು (Item Name)</th>
                        <th>ಪ್ರಮಾಣ / ಅಳತೆ (Quantity)</th>
                        <th>ವಿಭಾಗ (Category)</th>
                        <th style={{ width: '90px', textAlign: 'center' }}>ಕ್ರಮ (Actions)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((it, idx) => (
                        <tr key={it.id || idx}>
                          <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {idx + 1}
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                              {it.kannada || it.item}
                            </div>
                            {it.kannada && it.item && (
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                {it.item}
                              </div>
                            )}
                          </td>
                          <td>
                            <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.92rem' }}>
                              {it.qty || 'ಯಥಾಶಕ್ತಿ'}
                            </span>
                          </td>
                          <td>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: '#f1f5f9',
                                color: '#475569',
                                fontWeight: 600
                              }}
                            >
                              {it.category || 'ಪೂಜಾ ದ್ರವ್ಯ'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '4px 6px' }}
                                onClick={() => {
                                  setItemForm({
                                    id: it.id,
                                    item: it.item || '',
                                    kannada: it.kannada || '',
                                    qty: it.qty || '',
                                    category: it.category || 'ಪೂಜಾ ದ್ರವ್ಯಗಳು',
                                    essential: it.essential !== false
                                  });
                                  setItemModalOpen(true);
                                }}
                                title="Edit item"
                              >
                                <Edit2 size={13} />
                              </button>

                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '4px 6px', color: '#dc2626' }}
                                onClick={() => handleDeleteItem(it.id, it.kannada || it.item)}
                                title="Delete item"
                              >
                                <Trash2 size={13} />
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
          ) : (
            <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              ದಯವಿಟ್ಟು ಎಡಭಾಗದಲ್ಲಿ ಪೂಜೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Puja Modal */}
      <Modal
        isOpen={pujaModalOpen}
        onClose={() => setPujaModalOpen(false)}
        title={pujaForm.id ? "ಪೂಜೆ ವಿವರ ಬದಲಾಯಿಸಿ (Edit Puja)" : "ಹೊಸ ಪೂಜೆ ಸೇರಿಸಿ (Add New Puja)"}
      >
        <div className="form-group">
          <label className="form-label">ಪೂಜೆಯ ಹೆಸರು (ಕನ್ನಡದಲ್ಲಿ / Kannada Name) *</label>
          <input
            type="text"
            className="form-control"
            placeholder="ಉದಾ: ಶ್ರೀ ಸತ್ಯನಾರಾಯಣ ವ್ರತ ಪೂಜೆ, ಗಣಪತಿ ಹೋಮ, ರುದ್ರಾಭಿಷೇಕ"
            value={pujaForm.kannadaName}
            onChange={(e) => setPujaForm({ ...pujaForm, kannadaName: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Puja Name (in English)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Sri Satyanarayana Vrata Puja"
            value={pujaForm.name}
            onChange={(e) => setPujaForm({ ...pujaForm, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">ವಿಭಾಗ (Category)</label>
          <select
            className="form-control"
            value={pujaForm.category}
            onChange={(e) => setPujaForm({ ...pujaForm, category: e.target.value })}
          >
            <option value="ವ್ರತ / ಪೂಜೆ (Vrata / Puja)">ವ್ರತ / ಪೂಜೆ (Vrata / Puja)</option>
            <option value="ಹೋಮ / ಹವನ (Homa / Havana)">ಹೋಮ / ಹವನ (Homa / Havana)</option>
            <option value="ಸಂಸ್ಕಾರ (Samskara)">ಸಂಸ್ಕಾರ (Samskara - ಮದುವೆ, ಮುಂಜಿವೆ, ನಾಮಕರಣ)</option>
            <option value="ಪಿತೃ ಕಾರ್ಯ (Pitru Karya)">ಪಿತೃ ಕಾರ್ಯ (Pitru Karya - ಶ್ರಾದ್ಧ, ತರ್ಪಣ)</option>
            <option value="ಶಾಂತಿ / ಪರಿಹಾರ (Shanti / Parihara)">ಶಾಂತಿ / ಪರಿಹಾರ (Shanti / Parihara)</option>
            <option value="ಇತರೆ (General)">ಇತರೆ (General)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">ಪೂಜೆಯ ಅಂದಾಜು ದಕ್ಷಿಣೆ (Default Dakshina in ₹)</label>
          <input
            type="number"
            className="form-control"
            placeholder="ಉದಾ: 5000"
            value={pujaForm.defaultDakshina || ''}
            onChange={(e) => setPujaForm({ ...pujaForm, defaultDakshina: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">ವಿವರಣೆ / ಟಿಪ್ಪಣಿ (Description / Notes)</label>
          <textarea
            className="form-control"
            rows={2}
            placeholder="ಯಜಮಾನರಿಗೆ ವಿಶೇಷ ಸೂಚನೆ ಅಥವಾ ವಿವರ..."
            value={pujaForm.description}
            onChange={(e) => setPujaForm({ ...pujaForm, description: e.target.value })}
          />
        </div>

        {!pujaForm.id && (
          <div style={{ marginTop: '10px', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={pujaForm.prefillEssentials}
                onChange={(e) => setPujaForm({ ...pujaForm, prefillEssentials: e.target.checked })}
              />
              ಸಾಮಾನ್ಯ ಪೂಜಾ ಸಾಮಗ್ರಿಗಳನ್ನು ಆರಂಭದಲ್ಲೇ ಸೇರಿಸಿ (ಅರಿಶಿನ, ಕುಂಕುಮ, ವೀಳ್ಯದೆಲೆ, ಅಡಿಕೆ, ತೆಂಗಿನಕಾಯಿ, ಅಕ್ಕಿ, ಕರ್ಪೂರ ಇತ್ಯಾದಿ)
            </label>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button className="btn btn-secondary" onClick={() => setPujaModalOpen(false)}>
            ರದ್ದು (Cancel)
          </button>
          <button className="btn btn-primary" onClick={handleSavePuja}>
            ಉಳಿಸಿ (Save Puja)
          </button>
        </div>
      </Modal>

      {/* Add / Edit Item Modal */}
      <Modal
        isOpen={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        title={itemForm.id ? "ಸಾಮಗ್ರಿ ಬದಲಾಯಿಸಿ (Edit Samagri Item)" : "ಹೊಸ ಸಾಮಗ್ರಿ ಸೇರಿಸಿ (Add Samagri Item)"}
      >
        <div className="form-group">
          <label className="form-label">ಸಾಮಗ್ರಿಯ ಹೆಸರು (ಕನ್ನಡದಲ್ಲಿ / Kannada Name) *</label>
          <input
            type="text"
            className="form-control"
            placeholder="ಉದಾ: ಅರಿಶಿನ ಪುಡಿ, ತುಪ್ಪ, ವೀಳ್ಯದೆಲೆ, ಸಮಿತ್ತು"
            value={itemForm.kannada}
            onChange={(e) => setItemForm({ ...itemForm, kannada: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Item Name (in English)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Turmeric powder, Cow Ghee, Betel leaves"
            value={itemForm.item}
            onChange={(e) => setItemForm({ ...itemForm, item: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">ಪ್ರಮಾಣ / ಅಳತೆ (Quantity / Measure) *</label>
            <input
              type="text"
              className="form-control"
              placeholder="ಉದಾ: 100 g, 50 ಎಲೆಗಳು, 1 kg, 5 ಕಾಯಿ"
              value={itemForm.qty}
              onChange={(e) => setItemForm({ ...itemForm, qty: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">ವಿಭಾಗ (Category)</label>
            <select
              className="form-control"
              value={itemForm.category}
              onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
            >
              <option value="ಪೂಜಾ ದ್ರವ್ಯಗಳು">ಪೂಜಾ ದ್ರವ್ಯಗಳು (Pooja Dravya)</option>
              <option value="ಹೋಮ ದ್ರವ್ಯಗಳು">ಹೋಮ ದ್ರವ್ಯಗಳು (Homa Dravya)</option>
              <option value="ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ">ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ (Fruits & Leaves)</option>
              <option value="ಧಾನ್ಯಗಳು">ಧಾನ್ಯಗಳು (Grains & Grocery)</option>
              <option value="ವಸ್ತ್ರ ಮತ್ತು ಇತರ">ವಸ್ತ್ರ ಮತ್ತು ಇತರ (Cloth & Vessels)</option>
              <option value="ನೈವೇದ್ಯ">ನೈವೇದ್ಯ (Naivedya / Prasada)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button className="btn btn-secondary" onClick={() => setItemModalOpen(false)}>
            ರದ್ದು (Cancel)
          </button>
          <button className="btn btn-primary" onClick={handleSaveItem}>
            ಉಳಿಸಿ (Save Item)
          </button>
        </div>
      </Modal>
    </div>
  );
}
