import React from 'react';

export function TithiBadge({ tithi, paksha, nakshatra, size = 'md' }) {
  const isShukla = paksha === 'Shukla';
  const padding = size === 'sm' ? '3px 8px' : '5px 12px';
  const fontSize = size === 'sm' ? '0.75rem' : '0.85rem';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding,
        fontSize,
        fontWeight: 700,
        borderRadius: '20px',
        background: isShukla
          ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #ede9fe 100%)',
        color: isShukla ? '#92400e' : '#4338ca',
        border: `1px solid ${isShukla ? '#fde68a' : '#ddd6fe'}`,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
      }}
    >
      <span>{isShukla ? '☀️' : '🌙'}</span>
      <span>{paksha === 'Shukla' ? 'ಶುಕ್ಲ' : 'ಕೃಷ್ಣ'} {tithi}</span>
      {nakshatra && (
        <>
          <span style={{ opacity: 0.4 }}>•</span>
          <span style={{ fontWeight: 600 }}>{nakshatra}</span>
        </>
      )}
    </span>
  );
}

