import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './PeerSupport.css';

const PeerSupport = () => {
  const { t } = useTranslation();
  const [supportGroups, setSupportGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('groups');

  useEffect(() => {
    fetchSupportGroups();
  }, []);

  const fetchSupportGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/peer-support');
      if (response.ok) {
        const data = await response.json();
        setSupportGroups(data);
      }
    } catch (error) {
      console.error('Error fetching support groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId) => {
    try {
      const response = await fetch(`/api/peer-support/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        // Refresh groups
        fetchSupportGroups();
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  if (loading) {
    return (
      <div className="peer-support-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="peer-support-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="peer-support-header"
      >
        <h1>{t('peerSupport.title')}</h1>
        <p>{t('peerSupport.subtitle')}</p>
      </motion.div>

      <div className="peer-support-tabs">
        <button
          className={`tab-btn ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          {t('peerSupport.supportGroups')}
        </button>
        <button
          className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          {t('peerSupport.resources')}
        </button>
        <button
          className={`tab-btn ${activeTab === 'guidelines' ? 'active' : ''}`}
          onClick={() => setActiveTab('guidelines')}
        >
          {t('peerSupport.guidelines')}
        </button>
      </div>

      {activeTab === 'groups' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="support-groups-section"
        >
          <div className="groups-grid">
            {supportGroups.map((group, index) => (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group-card"
              >
                <div className="group-header">
                  <h3>{group.name}</h3>
                  <span className="group-type">{group.type}</span>
                </div>
                <p className="group-description">{group.description}</p>
                <div className="group-stats">
                  <span className="member-count">
                    {group.memberCount} {t('peerSupport.members')}
                  </span>
                  <span className="group-status">
                    {group.isActive ? t('peerSupport.active') : t('peerSupport.inactive')}
                  </span>
                </div>
                <div className="group-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => joinGroup(group._id)}
                    disabled={!group.isActive}
                  >
                    {t('peerSupport.joinGroup')}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'resources' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="resources-section"
        >
          <div className="resource-cards">
            <div className="resource-card">
              <h3>{t('peerSupport.selfHelpResources')}</h3>
              <p>{t('peerSupport.selfHelpDescription')}</p>
              <a href="#" className="btn btn-secondary">
                {t('peerSupport.exploreResources')}
              </a>
            </div>
            <div className="resource-card">
              <h3>{t('peerSupport.crisisSupport')}</h3>
              <p>{t('peerSupport.crisisDescription')}</p>
              <a href="#" className="btn btn-primary">
                {t('peerSupport.getHelp')}
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'guidelines' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="guidelines-section"
        >
          <div className="guidelines-content">
            <h3>{t('peerSupport.communityGuidelines')}</h3>
            <ul className="guidelines-list">
              <li>{t('peerSupport.guideline1')}</li>
              <li>{t('peerSupport.guideline2')}</li>
              <li>{t('peerSupport.guideline3')}</li>
              <li>{t('peerSupport.guideline4')}</li>
              <li>{t('peerSupport.guideline5')}</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PeerSupport;



