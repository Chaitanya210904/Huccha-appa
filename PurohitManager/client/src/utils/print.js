/**
 * Utility to print a specific DOM element cleanly on A4 paper
 * without printing background windows, sidebars, modals, or buttons.
 */
export function printElement(element, docTitle = 'Document') {
  if (!element) {
    window.print();
    return;
  }

  // Create an invisible iframe for isolated printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="kn">
      <head>
        <meta charset="utf-8" />
        <title>${docTitle}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Kannada", "Lohit Kannada", sans-serif;
            margin: 0;
            padding: 0;
            background: #fff;
            color: #1e293b;
            font-size: 13px;
            line-height: 1.6;
          }
          .printable-document {
            width: 100%;
            max-width: 100%;
            border: 2px solid #b45309;
            padding: 24px 28px;
            border-radius: 8px;
            background: #fff;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;
          }
          th, td {
            border: 1px solid #cbd5e1;
            padding: 6px 10px;
            font-size: 12px;
            text-align: left;
          }
          th {
            background-color: #f8fafc !important;
            font-weight: 700;
          }
          .badge {
            display: inline-block;
            padding: 2px 6px;
            font-size: 11px;
            border-radius: 4px;
            font-weight: 600;
          }
          .btn, button, .no-print {
            display: none !important;
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `);
  doc.close();

  // Allow styles to apply before triggering print dialog
  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      console.error("Print error:", e);
      window.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }
  }, 300);
}

