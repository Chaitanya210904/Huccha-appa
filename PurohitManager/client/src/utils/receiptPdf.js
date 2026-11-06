/**
 * Client-side high-resolution PDF generation and WhatsApp document sharing
 * for Chaitanya Krupa Mukthi Dham Dakshina Receipts.
 */

import { GURU_LEFT_BASE64, GURU_RIGHT_BASE64 } from '../assets/guruImagesBase64.js';

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Encapsulates a JPEG image buffer into a standard PDF-1.4 binary file.
 */
export function buildPdfFromJpegBlob(jpegBlob, width, height) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const jpegArray = new Uint8Array(reader.result);
        const pdfWidth = 595.28;
        const pdfHeight = 841.89;

        const header = '%PDF-1.4\n';
        const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
        const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
        const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfWidth} ${pdfHeight}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`;
        const obj4Head = `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegArray.length} >>\nstream\n`;
        const obj4Foot = '\nendstream\nendobj\n';
        const streamContent = `q\n${pdfWidth} 0 0 ${pdfHeight} 0 0 cm\n/Im1 Do\nQ\n`;
        const obj5 = `5 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}endstream\nendobj\n`;

        const enc = new TextEncoder();
        const headerBytes = enc.encode(header);
        const obj1Bytes = enc.encode(obj1);
        const obj2Bytes = enc.encode(obj2);
        const obj3Bytes = enc.encode(obj3);
        const obj4HeadBytes = enc.encode(obj4Head);
        const obj4FootBytes = enc.encode(obj4Foot);
        const obj5Bytes = enc.encode(obj5);

        const offsets = [];
        let pos = headerBytes.length;
        offsets.push(pos); pos += obj1Bytes.length;
        offsets.push(pos); pos += obj2Bytes.length;
        offsets.push(pos); pos += obj3Bytes.length;
        offsets.push(pos); pos += obj4HeadBytes.length + jpegArray.length + obj4FootBytes.length;
        offsets.push(pos); pos += obj5Bytes.length;

        const xref = 'xref\n0 6\n0000000000 65535 f \n' +
          offsets.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('');
        const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${pos}\n%%EOF\n`;

        const xrefBytes = enc.encode(xref);
        const trailerBytes = enc.encode(trailer);

        const totalLength = pos + xrefBytes.length + trailerBytes.length;
        const pdfBytes = new Uint8Array(totalLength);

        let offset = 0;
        pdfBytes.set(headerBytes, offset); offset += headerBytes.length;
        pdfBytes.set(obj1Bytes, offset); offset += obj1Bytes.length;
        pdfBytes.set(obj2Bytes, offset); offset += obj2Bytes.length;
        pdfBytes.set(obj3Bytes, offset); offset += obj3Bytes.length;
        pdfBytes.set(obj4HeadBytes, offset); offset += obj4HeadBytes.length;
        pdfBytes.set(jpegArray, offset); offset += jpegArray.length;
        pdfBytes.set(obj4FootBytes, offset); offset += obj4FootBytes.length;
        pdfBytes.set(obj5Bytes, offset); offset += obj5Bytes.length;
        pdfBytes.set(xrefBytes, offset); offset += xrefBytes.length;
        pdfBytes.set(trailerBytes, offset);

        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        resolve(pdfBlob);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(jpegBlob);
  });
}

/**
 * Draws the high-res printable A4 receipt onto an HTML5 Canvas.
 */
export function drawReceiptCanvas(receiptData, images = {}) {
  const { imgLeft, imgRight } = images;
  const width = 1240;
  const height = 1754; // A4 aspect ratio (1 : 1.414) at 150 DPI
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Pure White Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Decorative Double Border in Vedic Maroon / Gold
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, width - 100, height - 100);

  // Left Guru Image (Circular/Oval frame with ornate gold border)
  if (imgLeft) {
    const lx = 75;
    const ly = 95;
    const lw = 135;
    const lh = 160;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(lx + lw / 2, ly + lh / 2, lw / 2, lh / 2, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(imgLeft, lx, ly, lw, lh);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(lx + lw / 2, ly + lh / 2, lw / 2, lh / 2, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(lx + lw / 2, ly + lh / 2, lw / 2 - 3, lh / 2 - 3, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Right Guru Image (Circular/Oval frame with ornate gold border)
  if (imgRight) {
    const rx = width - 75 - 135;
    const ry = 95;
    const rw = 135;
    const rh = 160;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(rx + rw / 2, ry + rh / 2, rw / 2, rh / 2, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(imgRight, rx, ry, rw, rh);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(rx + rw / 2, ry + rh / 2, rw / 2, rh / 2, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(rx + rw / 2, ry + rh / 2, rw / 2 - 3, rh / 2 - 3, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 1. Invocation Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Kannada", sans-serif';
  ctx.fillText('॥ ಶ್ರೀ ಗುರುಭ್ಯೋ ನಮಃ ॥', width / 2, 115);

  // 2. Institution Name in Kannada
  const instKn = receiptData.institution?.kannada || 'ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ';
  ctx.fillStyle = '#9a3412';
  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Kannada", sans-serif';
  ctx.fillText(instKn, width / 2, 175);

  // 3. Institution Name in English
  const instEn = receiptData.institution?.english || 'Chaitanya Krupa Mukthi Dham';
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(instEn, width / 2, 218);

  // 4. Subtitle
  ctx.fillStyle = '#92400e';
  ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Kannada", sans-serif';
  ctx.fillText('ವೈದಿಕ ಸೇವೆಗಳು, ಪೂಜೆಗಳು ಮತ್ತು ಸಂಸ್ಕಾರ ಕೇಂದ್ರ', width / 2, 254);

  // Divider Line
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(70, 275);
  ctx.lineTo(width - 70, 275);
  ctx.stroke();

  // 5. Purohit Letterhead Details
  const purohitName = receiptData.purohit?.name || '';
  const purohitTitle = receiptData.purohit?.title ? `(${receiptData.purohit.title})` : '';
  const purohitCity = receiptData.purohit?.city || 'Hubballi-Dharwad';
  const purohitPhone = receiptData.purohit?.phone || '';
  const purohitUpi = receiptData.purohit?.upiId ? ` • UPI ID: ${receiptData.purohit.upiId}` : '';

  ctx.fillStyle = '#451a03';
  ctx.font = 'bold 21px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Kannada", sans-serif';
  ctx.fillText(`ಪುರೋಹಿತರು: ${purohitName} ${purohitTitle}`, width / 2, 312);

  ctx.fillStyle = '#64748b';
  ctx.font = '17px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(`${purohitCity} • ಸಂಪರ್ಕ: ${purohitPhone}${purohitUpi}`, width / 2, 342);

  // Divider Line
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(70, 365);
  ctx.lineTo(width - 70, 365);
  ctx.stroke();

  // 6. Meta: Receipt No & Date
  ctx.textAlign = 'left';
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(`ರಸೀದಿ ಸಂ (Receipt No): ${receiptData.receiptNumber || 'REC-2026-0001'}`, 80, 410);

  ctx.textAlign = 'right';
  ctx.fillText(`ದಿನಾಂಕ (Date): ${receiptData.paymentDate || new Date().toISOString().split('T')[0]}`, width - 80, 410);

  // 7. Vedic Date Almanac Box
  const vBoxX = 75;
  const vBoxY = 435;
  const vBoxW = width - 150;
  const vBoxH = 55;

  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(vBoxX, vBoxY, vBoxW, vBoxH);
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 1;
  ctx.strokeRect(vBoxX, vBoxY, vBoxW, vBoxH);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#92400e';
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Kannada", sans-serif';
  const vText = `ಪಂಚಾಂಗ: ${receiptData.vedicDate?.samvatsara || ''} ಸಂವತ್ಸರ • ${receiptData.vedicDate?.masa || ''} ಮಾಸ • ${receiptData.vedicDate?.paksha || ''} ಪಕ್ಷ • ${receiptData.vedicDate?.tithi || ''} ತಿಥಿ • ${receiptData.vedicDate?.vara || ''}`;
  ctx.fillText(vText, vBoxX + 16, vBoxY + 34);

  // 8. Receipt Body Text
  const bodyStartY = 540;
  const lineHeight = 46;
  ctx.fillStyle = '#1e293b';
  ctx.textAlign = 'left';

  // Client line
  ctx.font = '22px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Kannada", sans-serif';
  ctx.fillText('Received with thanks from (ಸ್ವೀಕರಿಸಿದ್ದು):', 80, bodyStartY);

  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Kannada", sans-serif';
  ctx.fillStyle = '#0f172a';
  const clientGotra = receiptData.client?.gotra ? ` (Gotra: ${receiptData.client.gotra})` : '';
  ctx.fillText(`Shri / Smt: ${receiptData.client?.name || 'Yajamana'}${clientGotra}`, 110, bodyStartY + 45);

  // Amount line
  ctx.fillStyle = '#1e293b';
  ctx.font = '22px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Kannada", sans-serif';
  ctx.fillText('the sum of Rupees (ಸ್ವೀಕರಿಸಿದ ದಕ್ಷಿಣೆ ಮೊತ್ತ):', 80, bodyStartY + 110);

  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#b45309';
  ctx.fillText(`₹ ${Number(receiptData.amount || 0).toLocaleString('en-IN')}  /-`, 110, bodyStartY + 155);

  ctx.font = 'italic 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText(`(${receiptData.amountInWords || ''})`, 110, bodyStartY + 190);

  // Ceremony line
  ctx.fillStyle = '#1e293b';
  ctx.font = '22px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Kannada", sans-serif';
  ctx.fillText('towards Dakshina for ceremony (ಕಾರ್ಯಕ್ರಮ / ಪೂಜಾ ವಿವರ):', 80, bodyStartY + 250);

  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Kannada", sans-serif';
  ctx.fillStyle = '#9a3412';
  const ceremonyName = receiptData.ceremony?.name || 'Vedic Puja / Ceremony';
  const ceremonyDate = receiptData.ceremony?.date || receiptData.paymentDate;
  ctx.fillText(`${ceremonyName} (Conduct date: ${ceremonyDate})`, 110, bodyStartY + 292);

  // Payment mode
  ctx.fillStyle = '#1e293b';
  ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(`ಪಾವತಿ ವಿಧಾನ (Payment Mode): ${receiptData.paymentMode || 'Cash / UPI'}`, 110, bodyStartY + 345);

  if (receiptData.notes) {
    ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`ವಿವರಣೆ (Notes): ${receiptData.notes}`, 110, bodyStartY + 385);
  }

  // 9. Traditional Vedic Footer & Signatures
  const footerY = 1480;

  // Divider Line
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(75, footerY - 40);
  ctx.lineTo(width - 75, footerY - 40);
  ctx.stroke();

  // Left Blessing
  ctx.fillStyle = '#15803d';
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Kannada", sans-serif';
  ctx.fillText('॥ ಧರ್ಮೋ ರಕ್ಷತಿ ರಕ್ಷಿತಃ ॥', 85, footerY + 20);

  ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Kannada", sans-serif';
  ctx.fillStyle = '#166534';
  ctx.fillText('ಸರ್ವೇ ಜನಾಃ ಸುಖಿನೋ ಭವಂತು • ಶುಭಮಸ್ತು', 85, footerY + 56);

  // Right Signature Block
  ctx.textAlign = 'center';
  const sigX = width - 220;

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sigX - 110, footerY + 10);
  ctx.lineTo(sigX + 110, footerY + 10);
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(purohitName, sigX, footerY + 38);

  ctx.fillStyle = '#64748b';
  ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('Signature of Purohit', sigX, footerY + 64);

  // 10. Bottom Official Watermark
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Kannada", sans-serif';
  ctx.fillText('ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ • ಅಧಿಕೃತ ಕಂಪ್ಯೂಟರ್ ಮುದ್ರಿತ ದಕ್ಷಿಣೆ ರಸೀದಿ (Official Digital Receipt)', width / 2, height - 55);

  return canvas;
}

/**
 * Generates an actual, standalone .PDF Blob of the receipt.
 */
export async function generateReceiptPdfBlob(receiptData) {
  const [imgLeft, imgRight] = await Promise.all([
    loadImage(GURU_LEFT_BASE64),
    loadImage(GURU_RIGHT_BASE64)
  ]);
  const canvas = drawReceiptCanvas(receiptData, { imgLeft, imgRight });
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (jpegBlob) => {
      try {
        if (!jpegBlob) throw new Error('Canvas rendering failed');
        const pdfBlob = await buildPdfFromJpegBlob(jpegBlob, canvas.width, canvas.height);
        resolve({ pdfBlob, jpegBlob });
      } catch (e) {
        reject(e);
      }
    }, 'image/jpeg', 0.95);
  });
}

/**
 * Triggers native download of the actual .pdf file into the user's downloads folder.
 */
export function downloadReceiptPdf(pdfBlob, receiptNumber) {
  const filename = `Receipt_${receiptNumber || 'Dakshina'}.pdf`;
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  return filename;
}

/**
 * Copies the receipt as an image to the system clipboard so the user can
 * simply press Ctrl+V (or Cmd+V) directly into WhatsApp Web/Desktop.
 */
export async function copyReceiptImageToClipboard(jpegBlob) {
  if (!navigator.clipboard || !window.ClipboardItem) return false;
  try {
    // Clipboard item usually expects PNG, let's convert to PNG
    const img = new Image();
    const url = URL.createObjectURL(jpegBlob);
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const pngBlob = await new Promise(r => canvas.toBlob(r, 'image/png'));
    URL.revokeObjectURL(url);

    if (pngBlob) {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': pngBlob })
      ]);
      return true;
    }
  } catch (e) {
    console.warn('Clipboard image write not supported:', e);
  }
  return false;
}

