import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    totalResources: 0,
    supportGroups: 0
  });
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, appointmentsRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/admin/appointments', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json();
        setAppointments(appointmentsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const response = await fetch(`/api/admin/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="dashboard-header"
      >
        <h1>{t('admin.dashboard.title')}</h1>
        <p>{t('admin.dashboard.subtitle')}</p>
      </motion.div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          {t('admin.dashboard.overview')}
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          {t('admin.dashboard.users')}
        </button>
        <button
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          {t('admin.dashboard.appointments')}
        </button>
        <button
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          {t('admin.dashboard.reports')}
        </button>
      </div>

      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="overview-section"
        >
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{t('admin.stats.totalUsers')}</h3>
              <div className="stat-value">{stats.totalUsers}</div>
            </div>
            <div className="stat-card">
              <h3>{t('admin.stats.activeUsers')}</h3>
              <div className="stat-value">{stats.activeUsers}</div>
            </div>
            <div className="stat-card">
              <h3>{t('admin.stats.totalAppointments')}</h3>
              <div className="stat-value">{stats.totalAppointments}</div>
            </div>
            <div className="stat-card">
              <h3>{t('admin.stats.pendingAppointments')}</h3>
              <div className="stat-value">{stats.pendingAppointments}</div>
            </div>
            <div className="stat-card">
              <h3>{t('admin.stats.totalResources')}</h3>
              <div className="stat-value">{stats.totalResources}</div>
            </div>
            <div className="stat-card">
              <h3>{t('admin.stats.supportGroups')}</h3>
              <div className="stat-value">{stats.supportGroups}</div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="users-section"
        >
          <div className="section-header">
            <h2>{t('admin.users.title')}</h2>
            <button className="btn btn-primary">
              {t('admin.users.addUser')}
            </button>
          </div>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>{t('admin.users.name')}</th>
                  <th>{t('admin.users.email')}</th>
                  <th>{t('admin.users.role')}</th>
                  <th>{t('admin.users.status')}</th>
                  <th>{t('admin.users.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => updateUserStatus(user._id, user.status === 'active' ? 'inactive' : 'active')}
                        >
                          {user.status === 'active' ? t('admin.users.deactivate') : t('admin.users.activate')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'appointments' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="appointments-section"
        >
          <div className="section-header">
            <h2>{t('admin.appointments.title')}</h2>
          </div>
          <div className="appointments-table">
            <table>
              <thead>
                <tr>
                  <th>{t('admin.appointments.student')}</th>
                  <th>{t('admin.appointments.counselor')}</th>
                  <th>{t('admin.appointments.date')}</th>
                  <th>{t('admin.appointments.time')}</th>
                  <th>{t('admin.appointments.status')}</th>
                  <th>{t('admin.appointments.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{appointment.student?.firstName} {appointment.student?.lastName}</td>
                    <td>{appointment.counselor?.firstName} {appointment.counselor?.lastName}</td>
                    <td>{new Date(appointment.date).toLocaleDateString()}</td>
                    <td>{appointment.time}</td>
                    <td>
                      <span className={`status-badge ${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                            >
                              {t('admin.appointments.confirm')}
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                            >
                              {t('admin.appointments.cancel')}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'reports' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="reports-section"
        >
          <div className="section-header">
            <h2>{t('admin.reports.title')}</h2>
            <button className="btn btn-primary">
              {t('admin.reports.generateReport')}
            </button>
          </div>
          <div className="reports-grid">
            <div className="report-card">
              <h3>{t('admin.reports.userActivity')}</h3>
              <p>{t('admin.reports.userActivityDesc')}</p>
              <button className="btn btn-secondary">
                {t('admin.reports.viewReport')}
              </button>
            </div>
            <div className="report-card">
              <h3>{t('admin.reports.appointmentStats')}</h3>
              <p>{t('admin.reports.appointmentStatsDesc')}</p>
              <button className="btn btn-secondary">
                {t('admin.reports.viewReport')}
              </button>
            </div>
            <div className="report-card">
              <h3>{t('admin.reports.resourceUsage')}</h3>
              <p>{t('admin.reports.resourceUsageDesc')}</p>
              <button className="btn btn-secondary">
                {t('admin.reports.viewReport')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;










