import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Invoices', value: '1,234', change: '+12%', positive: true },
    { label: 'Matched', value: '1,156', change: '+8%', positive: true },
    { label: 'Mismatched', value: '45', change: '-3%', positive: true },
    { label: 'Missing', value: '33', change: '+2%', positive: false }
  ];

  const recentActivity = [
    { id: 1, action: 'GSTR2B file uploaded', time: '2 hours ago', status: 'success' },
    { id: 2, action: 'Reconciliation completed', time: '4 hours ago', status: 'success' },
    { id: 3, action: 'Purchase invoice imported', time: '6 hours ago', status: 'success' },
    { id: 4, action: 'Report generated', time: '1 day ago', status: 'success' }
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <span className="gst-text">GST</span>
            <span className="r2b-text">R2B</span>
          </div>
          <nav className="nav-menu">
            <button 
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={activeTab === 'reconcile' ? 'active' : ''}
              onClick={() => setActiveTab('reconcile')}
            >
              Reconcile
            </button>
            <button 
              className={activeTab === 'reports' ? 'active' : ''}
              onClick={() => setActiveTab('reports')}
            >
              Reports
            </button>
            <button 
              className={activeTab === 'settings' ? 'active' : ''}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </nav>
          <div className="user-menu">
            <button className="logout-btn">
              <Link to="/login">Logout</Link>
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h1>Welcome to GSTR2B Reconciliation</h1>
          <p>Manage your GST reconciliation process efficiently</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="stat-header">
                <h3>{stat.label}</h3>
                <span className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                  {stat.change}
                </span>
              </div>
              <div className="stat-value">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="content-grid">
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-btn primary">
                <span className="btn-icon">📁</span>
                Upload GSTR2B
              </button>
              <button className="action-btn secondary">
                <span className="btn-icon">📊</span>
                Import Purchase Data
              </button>
              <button className="action-btn tertiary">
                <span className="btn-icon">🔄</span>
                Start Reconciliation
              </button>
              <button className="action-btn quaternary">
                <span className="btn-icon">📈</span>
                Generate Report
              </button>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-status">
                    <div className={`status-dot ${activity.status}`}></div>
                  </div>
                  <div className="activity-content">
                    <p>{activity.action}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
