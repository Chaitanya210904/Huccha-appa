import React, { useState, useEffect } from 'react';
import { api } from '../../api/index.js';
import { useI18n } from '../../hooks/useI18n.jsx';
import { BarChart3, TrendingUp, Calendar, DollarSign } from 'lucide-react';

export function Reports() {
  const { t } = useI18n();
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport(selectedYear);
  }, [selectedYear]);

  async function loadReport(yr) {
    setLoading(true);
    try {
      const data = await api.getFinancialSummary(yr);
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Financial & Workload Reports</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Select Year:</span>
            <input
              type="number"
              className="form-control"
              style={{ width: '100px', padding: '4px 8px' }}
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {report && (
        <div>
          {/* Key Totals */}
          <div className="grid-3" style={{ marginBottom: '20px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Dakshina Received</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#16a34a' }}>
                ₹{(report.totalIncome || 0).toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Expenses</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#dc2626' }}>
                ₹{(report.totalExpenses || 0).toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Net Purohit Earnings</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)' }}>
                ₹{(report.netEarnings || 0).toLocaleString('en-IN')}
              </h3>
            </div>
          </div>

          <div className="grid-2">
            {/* Monthly Trend Table */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Monthly Breakdown ({selectedYear})</h3>
              </div>
              <div className="table-container">
                <table style={{ fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Income</th>
                      <th>Expenses</th>
                      <th>Net</th>
                      <th>Ceremonies</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.monthly?.map((m) => (
                      <tr key={m.month}>
                        <td><strong>{m.monthName}</strong></td>
                        <td style={{ color: '#16a34a' }}>₹{m.income.toLocaleString('en-IN')}</td>
                        <td style={{ color: '#dc2626' }}>₹{m.expenses.toLocaleString('en-IN')}</td>
                        <td><strong>₹{m.net.toLocaleString('en-IN')}</strong></td>
                        <td>{m.ceremonies}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Breakdown by Ceremony & Mode */}
            <div>
              <div className="card" style={{ marginBottom: '20px' }}>
                <div className="card-header">
                  <h3 className="card-title">By Ceremony Type</h3>
                </div>
                <div className="table-container">
                  <table style={{ fontSize: '0.85rem' }}>
                    <thead>
                      <tr>
                        <th>Ceremony Name</th>
                        <th>Conducted</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(report.byService || {}).map(([name, data]) => (
                        <tr key={name}>
                          <td><strong>{name}</strong></td>
                          <td>{data.count}</td>
                          <td>₹{data.revenue.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Payment Mode Distribution</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cash</span>
                    <h4 style={{ fontWeight: 700, color: 'var(--text-main)' }}>₹{(report.byMode?.Cash || 0).toLocaleString('en-IN')}</h4>
                  </div>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>UPI (Online)</span>
                    <h4 style={{ fontWeight: 700, color: '#16a34a' }}>₹{(report.byMode?.UPI || 0).toLocaleString('en-IN')}</h4>
                  </div>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bank Transfer</span>
                    <h4 style={{ fontWeight: 700, color: '#2563eb' }}>₹{(report.byMode?.BankTransfer || 0).toLocaleString('en-IN')}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

