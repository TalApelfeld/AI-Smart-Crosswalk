import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Logo from '../components/Logo';
import './AlertsPage.css';

/**
 * AlertsPage Component
 * 
 * This page demonstrates:
 * - useState: Managing component state
 * - useEffect: Fetching data when component mounts
 * - Axios: Making API calls to backend
 * 
 * Basic display of alerts to verify backend communication
 */

function AlertsPage() {
  // State management using useState hook
  const [alerts, setAlerts] = useState([]); // Array of alerts
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [filter, setFilter] = useState({
    severity: '',
    status: '',
  });

  // Function to fetch alerts from backend
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call API using axios service
      const data = await api.getAlerts(filter);
      
      // Update state with fetched data
      setAlerts(data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch alerts');
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch alerts when component mounts using useEffect
  useEffect(() => {
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array = run once on mount

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchAlerts();
  };

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.updateAlertStatus(id, newStatus);
      // Refresh alerts after update
      fetchAlerts();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update alert status');
    }
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    const colors = {
      low: '#28a745',      // Green - Safe
      medium: '#ffc107',   // Yellow - Warning
      high: '#ff9800',     // Orange - Danger
      critical: '#dc3545'  // Red - Critical
    };
    return colors[severity] || '#6c757d';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="alerts-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading alerts...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="alerts-page">
        <div className="error">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={fetchAlerts}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="alerts-page">
      <header className="page-header">
        <h1><Logo size={60} /> AI Smart Crosswalk - Alerts Dashboard</h1>
        <p>Real-time alerts from crosswalk monitoring system</p>
      </header>

      {/* Filters Section */}
      <div className="filters">
        <div className="filter-group">
          <label>Severity:</label>
          <select name="severity" value={filter.severity} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select name="status" value={filter.status} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>

        <button className="apply-btn" onClick={applyFilters}>
          Apply Filters
        </button>
        <button className="refresh-btn" onClick={fetchAlerts}>
          Refresh
        </button>
      </div>

      {/* Stats Summary */}
      <div className="stats">
        <div className="stat-card">
          <h3>{alerts.length}</h3>
          <p>Total Alerts</p>
        </div>
        <div className="stat-card">
          <h3>{alerts.filter(a => a.status === 'active').length}</h3>
          <p>Active</p>
        </div>
        <div className="stat-card">
          <h3>{alerts.filter(a => a.severity === 'critical').length}</h3>
          <p>Critical</p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="alerts-container">
        {alerts.length === 0 ? (
          <div className="no-alerts">
            <h3>📭 No Alerts</h3>
            <p>No alerts found with the current filters</p>
          </div>
        ) : (
          <div className="alerts-grid">
            {alerts.map((alert) => (
              <div key={alert._id} className="alert-card">
                <div className="alert-header">
                  <span 
                    className="severity-badge"
                    style={{ backgroundColor: getSeverityColor(alert.severity) }}
                  >
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className={`status-badge status-${alert.status}`}>
                    {alert.status}
                  </span>
                </div>

                <div className="alert-body">
                  <h3>{alert.type.replace(/_/g, ' ').toUpperCase()}</h3>
                  <p className="alert-description">
                    {alert.description || 'No description provided'}
                  </p>
                  
                  {/* Display AI captured image */}
                  {alert.aiData && alert.aiData.imageUrl && (
                    <div className="alert-image">
                      <img 
                        src={`http://localhost:5000${alert.aiData.imageUrl}`}
                        alt="AI Detection" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Show detected objects */}
                  {alert.aiData && alert.aiData.detectedObjects && alert.aiData.detectedObjects.length > 0 && (
                    <div className="detected-objects">
                      <strong>Detected:</strong>
                      <div className="objects-list">
                        {alert.aiData.detectedObjects.map((obj, idx) => (
                          <span key={idx} className="object-tag">
                            {obj.type} ({(obj.confidence * 100).toFixed(0)}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {alert.aiData && alert.aiData.confidence && (
                    <div className="confidence">
                      Overall Confidence: {(alert.aiData.confidence * 100).toFixed(1)}%
                    </div>
                  )}
                  
                  <div className="alert-time">
                    🕐 {formatDate(alert.timestamp)}
                  </div>
                </div>

                <div className="alert-actions">
                  {alert.status === 'active' && (
                    <>
                      <button 
                        className="btn-resolve"
                        onClick={() => handleStatusUpdate(alert._id, 'resolved')}
                      >
                        ✓ Resolve
                      </button>
                      <button 
                        className="btn-dismiss"
                        onClick={() => handleStatusUpdate(alert._id, 'dismissed')}
                      >
                        ✕ Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertsPage;
