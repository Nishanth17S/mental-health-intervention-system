import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: '',
    preferredLanguage: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        college: user.college || '',
        department: user.department || '',
        year: user.year || '',
        preferredLanguage: user.preferredLanguage || 'en'
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        updateUser(data.user);
        setMessage(t('profile.updateSuccess'));
      } else {
        setMessage(t('profile.updateError'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(t('profile.updateError'));
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { currentPassword, newPassword, confirmPassword } = e.target;

    if (newPassword.value !== confirmPassword.value) {
      setMessage(t('profile.passwordMismatch'));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: currentPassword.value,
          newPassword: newPassword.value
        })
      });

      if (response.ok) {
        setMessage(t('profile.passwordSuccess'));
        e.target.reset();
      } else {
        setMessage(t('profile.passwordError'));
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage(t('profile.passwordError'));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="profile-header"
      >
        <h1>{t('profile.title')}</h1>
        <p>{t('profile.subtitle')}</p>
      </motion.div>

      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          {t('profile.personalInfo')}
        </button>
        <button
          className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          {t('profile.changePassword')}
        </button>
        <button
          className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          {t('profile.preferences')}
        </button>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`message ${message.includes('Success') ? 'success' : 'error'}`}
        >
          {message}
        </motion.div>
      )}

      {activeTab === 'personal' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="personal-info-section"
        >
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">{t('profile.firstName')}</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">{t('profile.lastName')}</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('profile.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">{t('profile.phone')}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="college">{t('profile.college')}</label>
                <input
                  type="text"
                  id="college"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="department">{t('profile.department')}</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="year">{t('profile.year')}</label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
              >
                <option value="">{t('profile.selectYear')}</option>
                <option value="1">{t('profile.firstYear')}</option>
                <option value="2">{t('profile.secondYear')}</option>
                <option value="3">{t('profile.thirdYear')}</option>
                <option value="4">{t('profile.fourthYear')}</option>
                <option value="5">{t('profile.fifthYear')}</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? t('common.saving') : t('profile.updateProfile')}
            </button>
          </form>
        </motion.div>
      )}

      {activeTab === 'password' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="password-section"
        >
          <form onSubmit={changePassword} className="profile-form">
            <div className="form-group">
              <label htmlFor="currentPassword">{t('profile.currentPassword')}</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">{t('profile.newPassword')}</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">{t('profile.confirmPassword')}</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                minLength="6"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? t('common.saving') : t('profile.changePassword')}
            </button>
          </form>
        </motion.div>
      )}

      {activeTab === 'preferences' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="preferences-section"
        >
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="preferredLanguage">{t('profile.preferredLanguage')}</label>
              <select
                id="preferredLanguage"
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleInputChange}
              >
                <option value="en">{t('profile.english')}</option>
                <option value="es">{t('profile.spanish')}</option>
                <option value="fr">{t('profile.french')}</option>
                <option value="de">{t('profile.german')}</option>
                <option value="zh">{t('profile.chinese')}</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? t('common.saving') : t('profile.updatePreferences')}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;













