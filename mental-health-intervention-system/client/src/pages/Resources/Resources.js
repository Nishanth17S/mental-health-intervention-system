import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './Resources.css';

const Resources = () => {
  const { t } = useTranslation();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: t('resources.categories.all') },
    { id: 'anxiety', name: t('resources.categories.anxiety') },
    { id: 'depression', name: t('resources.categories.depression') },
    { id: 'stress', name: t('resources.categories.stress') },
    { id: 'self-care', name: t('resources.categories.selfCare') },
    { id: 'crisis', name: t('resources.categories.crisis') }
  ];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/resources');
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  if (loading) {
    return (
      <div className="resources-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resources-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="resources-header"
      >
        <h1>{t('resources.title')}</h1>
        <p>{t('resources.subtitle')}</p>
      </motion.div>

      <div className="resources-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="resources-grid">
        {filteredResources.map((resource, index) => (
          <motion.div
            key={resource._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="resource-card"
          >
            <div className="resource-header">
              <h3>{resource.title}</h3>
              <span className={`category-badge ${resource.category}`}>
                {categories.find(cat => cat.id === resource.category)?.name}
              </span>
            </div>
            <p className="resource-description">{resource.description}</p>
            <div className="resource-actions">
              {resource.url && (
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  {t('resources.viewResource')}
                </a>
              )}
              {resource.fileUrl && (
                <a 
                  href={resource.fileUrl} 
                  download
                  className="btn btn-secondary"
                >
                  {t('resources.download')}
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="no-resources">
          <p>{t('resources.noResources')}</p>
        </div>
      )}
    </div>
  );
};

export default Resources;



