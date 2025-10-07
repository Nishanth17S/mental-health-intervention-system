import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Auth
      welcome: 'Welcome',
      email: 'Email Address',
      password: 'Password',
      login: 'Sign In',
      register: 'Sign Up',
      // Navigation
      nav: {
        home: 'Home',
        chat: 'Chat',
        appointments: 'Appointments',
        resources: 'Resources',
        peerSupport: 'Peer Support',
        screening: 'Screening',
        profile: 'Profile',
        admin: 'Admin Dashboard',
        logout: 'Logout'
      },
      // Common
      common: {
        welcome: 'Welcome',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        submit: 'Submit',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
