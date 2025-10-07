import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      welcome: 'Welcome',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information',
      
      // Navigation
      home: 'Home',
      chat: 'AI Chat',
      appointments: 'Appointments',
      resources: 'Resources',
      peerSupport: 'Peer Support',
      screening: 'Mental Health Screening',
      admin: 'Admin Dashboard',
      profile: 'Profile',
      settings: 'Settings',
      
      // Authentication
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      studentId: 'Student ID',
      college: 'College',
      department: 'Department',
      year: 'Year',
      phone: 'Phone',
      preferredLanguage: 'Preferred Language',
      
      // Chat
      startChat: 'Start Chat',
      sendMessage: 'Send Message',
      typeMessage: 'Type your message...',
      aiAssistant: 'AI Mental Health Assistant',
      chatHistory: 'Chat History',
      newChat: 'New Chat',
      
      // Appointments
      bookAppointment: 'Book Appointment',
      myAppointments: 'My Appointments',
      counselor: 'Counselor',
      appointmentDate: 'Appointment Date',
      appointmentTime: 'Appointment Time',
      reason: 'Reason for Appointment',
      status: 'Status',
      scheduled: 'Scheduled',
      confirmed: 'Confirmed',
      completed: 'Completed',
      cancelled: 'Cancelled',
      
      // Resources
      browseResources: 'Browse Resources',
      categories: 'Categories',
      types: 'Types',
      difficulty: 'Difficulty',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      viewResource: 'View Resource',
      likeResource: 'Like Resource',
      rateResource: 'Rate Resource',
      
      // Peer Support
      createPost: 'Create Post',
      myPosts: 'My Posts',
      supportGroups: 'Support Groups',
      joinGroup: 'Join Group',
      leaveGroup: 'Leave Group',
      createGroup: 'Create Group',
      postTitle: 'Post Title',
      postContent: 'Post Content',
      category: 'Category',
      tags: 'Tags',
      anonymous: 'Anonymous',
      
      // Screening
      takeScreening: 'Take Mental Health Screening',
      phq9: 'PHQ-9 (Depression)',
      gad7: 'GAD-7 (Anxiety)',
      startScreening: 'Start Screening',
      nextQuestion: 'Next Question',
      previousQuestion: 'Previous Question',
      submitScreening: 'Submit Screening',
      screeningResults: 'Screening Results',
      severity: 'Severity',
      recommendations: 'Recommendations',
      
      // Admin
      dashboard: 'Dashboard',
      userManagement: 'User Management',
      analytics: 'Analytics',
      systemHealth: 'System Health',
      exportData: 'Export Data',
      totalUsers: 'Total Users',
      totalAppointments: 'Total Appointments',
      totalChatSessions: 'Total Chat Sessions',
      totalScreeningResults: 'Total Screening Results',
      
      // Mental Health Categories
      anxiety: 'Anxiety',
      depression: 'Depression',
      stress: 'Stress',
      sleep: 'Sleep',
      relationships: 'Relationships',
      academic: 'Academic',
      general: 'General',
      
      // Resource Types
      video: 'Video',
      audio: 'Audio',
      article: 'Article',
      guide: 'Guide',
      exercise: 'Exercise',
      meditation: 'Meditation',
      worksheet: 'Worksheet',
      
      // Severity Levels
      minimal: 'Minimal',
      mild: 'Mild',
      moderate: 'Moderate',
      moderatelySevere: 'Moderately Severe',
      severe: 'Severe',
      
      // Crisis Support
      crisisSupport: 'Crisis Support',
      emergencyContact: 'Emergency Contact',
      helpline: 'Helpline',
      immediateHelp: 'Immediate Help',
      safetyPlan: 'Safety Plan',
      
      // Cultural Context
      culturalSensitivity: 'Cultural Sensitivity',
      familySupport: 'Family Support',
      communityResources: 'Community Resources',
      traditionalHealing: 'Traditional Healing',
      religiousSupport: 'Religious Support'
    }
  },
  hi: {
    translation: {
      // Common
      welcome: 'स्वागत है',
      login: 'लॉगिन',
      register: 'रजिस्टर',
      logout: 'लॉगआउट',
      save: 'सेव करें',
      cancel: 'रद्द करें',
      delete: 'डिलीट करें',
      edit: 'एडिट करें',
      view: 'देखें',
      search: 'खोजें',
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      warning: 'चेतावनी',
      info: 'जानकारी',
      
      // Navigation
      home: 'होम',
      chat: 'AI चैट',
      appointments: 'अपॉइंटमेंट',
      resources: 'संसाधन',
      peerSupport: 'सहकर्मी सहायता',
      screening: 'मानसिक स्वास्थ्य जांच',
      admin: 'एडमिन डैशबोर्ड',
      profile: 'प्रोफाइल',
      settings: 'सेटिंग्स',
      
      // Authentication
      email: 'ईमेल',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      firstName: 'पहला नाम',
      lastName: 'अंतिम नाम',
      studentId: 'छात्र आईडी',
      college: 'कॉलेज',
      department: 'विभाग',
      year: 'वर्ष',
      phone: 'फोन',
      preferredLanguage: 'पसंदीदा भाषा',
      
      // Chat
      startChat: 'चैट शुरू करें',
      sendMessage: 'मैसेज भेजें',
      typeMessage: 'अपना मैसेज टाइप करें...',
      aiAssistant: 'AI मानसिक स्वास्थ्य सहायक',
      chatHistory: 'चैट इतिहास',
      newChat: 'नई चैट',
      
      // Appointments
      bookAppointment: 'अपॉइंटमेंट बुक करें',
      myAppointments: 'मेरे अपॉइंटमेंट',
      counselor: 'काउंसलर',
      appointmentDate: 'अपॉइंटमेंट की तारीख',
      appointmentTime: 'अपॉइंटमेंट का समय',
      reason: 'अपॉइंटमेंट का कारण',
      status: 'स्थिति',
      scheduled: 'निर्धारित',
      confirmed: 'पुष्टि की गई',
      completed: 'पूर्ण',
      cancelled: 'रद्द',
      
      // Resources
      browseResources: 'संसाधन ब्राउज़ करें',
      categories: 'श्रेणियां',
      types: 'प्रकार',
      difficulty: 'कठिनाई',
      beginner: 'शुरुआती',
      intermediate: 'मध्यम',
      advanced: 'उन्नत',
      viewResource: 'संसाधन देखें',
      likeResource: 'संसाधन को लाइक करें',
      rateResource: 'संसाधन को रेट करें',
      
      // Peer Support
      createPost: 'पोस्ट बनाएं',
      myPosts: 'मेरी पोस्ट्स',
      supportGroups: 'सहायता समूह',
      joinGroup: 'समूह में शामिल हों',
      leaveGroup: 'समूह छोड़ें',
      createGroup: 'समूह बनाएं',
      postTitle: 'पोस्ट का शीर्षक',
      postContent: 'पोस्ट की सामग्री',
      category: 'श्रेणी',
      tags: 'टैग्स',
      anonymous: 'अनाम',
      
      // Screening
      takeScreening: 'मानसिक स्वास्थ्य जांच करें',
      phq9: 'PHQ-9 (अवसाद)',
      gad7: 'GAD-7 (चिंता)',
      startScreening: 'जांच शुरू करें',
      nextQuestion: 'अगला प्रश्न',
      previousQuestion: 'पिछला प्रश्न',
      submitScreening: 'जांच सबमिट करें',
      screeningResults: 'जांच परिणाम',
      severity: 'गंभीरता',
      recommendations: 'सुझाव',
      
      // Admin
      dashboard: 'डैशबोर्ड',
      userManagement: 'उपयोगकर्ता प्रबंधन',
      analytics: 'विश्लेषण',
      systemHealth: 'सिस्टम स्वास्थ्य',
      exportData: 'डेटा निर्यात करें',
      totalUsers: 'कुल उपयोगकर्ता',
      totalAppointments: 'कुल अपॉइंटमेंट',
      totalChatSessions: 'कुल चैट सत्र',
      totalScreeningResults: 'कुल जांच परिणाम',
      
      // Mental Health Categories
      anxiety: 'चिंता',
      depression: 'अवसाद',
      stress: 'तनाव',
      sleep: 'नींद',
      relationships: 'रिश्ते',
      academic: 'शैक्षणिक',
      general: 'सामान्य',
      
      // Resource Types
      video: 'वीडियो',
      audio: 'ऑडियो',
      article: 'लेख',
      guide: 'गाइड',
      exercise: 'अभ्यास',
      meditation: 'ध्यान',
      worksheet: 'वर्कशीट',
      
      // Severity Levels
      minimal: 'न्यूनतम',
      mild: 'हल्का',
      moderate: 'मध्यम',
      moderatelySevere: 'मध्यम-गंभीर',
      severe: 'गंभीर',
      
      // Crisis Support
      crisisSupport: 'संकट सहायता',
      emergencyContact: 'आपातकालीन संपर्क',
      helpline: 'हेल्पलाइन',
      immediateHelp: 'तत्काल सहायता',
      safetyPlan: 'सुरक्षा योजना',
      
      // Cultural Context
      culturalSensitivity: 'सांस्कृतिक संवेदनशीलता',
      familySupport: 'पारिवारिक सहायता',
      communityResources: 'सामुदायिक संसाधन',
      traditionalHealing: 'पारंपरिक उपचार',
      religiousSupport: 'धार्मिक सहायता'
    }
  },
  ta: {
    translation: {
      // Common
      welcome: 'வரவேற்கிறோம்',
      login: 'உள்நுழைய',
      register: 'பதிவு',
      logout: 'வெளியேறு',
      save: 'சேமி',
      cancel: 'ரத்து செய்',
      delete: 'நீக்கு',
      edit: 'திருத்து',
      view: 'பார்க்க',
      search: 'தேடு',
      loading: 'ஏற்றுகிறது...',
      error: 'பிழை',
      success: 'வெற்றி',
      warning: 'எச்சரிக்கை',
      info: 'தகவல்',
      
      // Navigation
      home: 'முகப்பு',
      chat: 'AI அரட்டை',
      appointments: 'நேரம்',
      resources: 'வளங்கள்',
      peerSupport: 'சக உதவி',
      screening: 'மன ஆரோக்கிய சோதனை',
      admin: 'நிர்வாக டாஷ்போர்டு',
      profile: 'சுயவிவரம்',
      settings: 'அமைப்புகள்',
      
      // Authentication
      email: 'மின்னஞ்சல்',
      password: 'கடவுச்சொல்',
      confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்து',
      firstName: 'முதல் பெயர்',
      lastName: 'கடைசி பெயர்',
      studentId: 'மாணவர் ஐடி',
      college: 'கல்லூரி',
      department: 'துறை',
      year: 'ஆண்டு',
      phone: 'தொலைபேசி',
      preferredLanguage: 'விருப்பமான மொழி',
      
      // Chat
      startChat: 'அரட்டை தொடங்கு',
      sendMessage: 'செய்தி அனுப்பு',
      typeMessage: 'உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்...',
      aiAssistant: 'AI மன ஆரோக்கிய உதவியாளர்',
      chatHistory: 'அரட்டை வரலாறு',
      newChat: 'புதிய அரட்டை',
      
      // Appointments
      bookAppointment: 'நேரம் பதிவு செய்',
      myAppointments: 'எனது நேரங்கள்',
      counselor: 'ஆலோசகர்',
      appointmentDate: 'நேரம் தேதி',
      appointmentTime: 'நேரம் நேரம்',
      reason: 'நேரம் காரணம்',
      status: 'நிலை',
      scheduled: 'திட்டமிடப்பட்டது',
      confirmed: 'உறுதிப்படுத்தப்பட்டது',
      completed: 'முடிந்தது',
      cancelled: 'ரத்து செய்யப்பட்டது',
      
      // Resources
      browseResources: 'வளங்களை உலாவு',
      categories: 'வகைகள்',
      types: 'வகைகள்',
      difficulty: 'கடினம்',
      beginner: 'தொடக்கநிலை',
      intermediate: 'இடைநிலை',
      advanced: 'மேம்பட்ட',
      viewResource: 'வளத்தை பார்க்க',
      likeResource: 'வளத்தை விரும்பு',
      rateResource: 'வளத்தை மதிப்பிடு',
      
      // Peer Support
      createPost: 'இடுகையை உருவாக்கு',
      myPosts: 'எனது இடுகைகள்',
      supportGroups: 'ஆதரவு குழுக்கள்',
      joinGroup: 'குழுவில் சேர',
      leaveGroup: 'குழுவை விட்டு வெளியேறு',
      createGroup: 'குழுவை உருவாக்கு',
      postTitle: 'இடுகை தலைப்பு',
      postContent: 'இடுகை உள்ளடக்கம்',
      category: 'வகை',
      tags: 'குறிச்சொற்கள்',
      anonymous: 'அடையாளம் தெரியாத',
      
      // Screening
      takeScreening: 'மன ஆரோக்கிய சோதனை எடுக்க',
      phq9: 'PHQ-9 (மனச்சோர்வு)',
      gad7: 'GAD-7 (கவலை)',
      startScreening: 'சோதனை தொடங்கு',
      nextQuestion: 'அடுத்த கேள்வி',
      previousQuestion: 'முந்தைய கேள்வி',
      submitScreening: 'சோதனை சமர்ப்பி',
      screeningResults: 'சோதனை முடிவுகள்',
      severity: 'கடுமை',
      recommendations: 'பரிந்துரைகள்',
      
      // Admin
      dashboard: 'டாஷ்போர்டு',
      userManagement: 'பயனர் மேலாண்மை',
      analytics: 'பகுப்பாய்வு',
      systemHealth: 'கணினி ஆரோக்கியம்',
      exportData: 'தரவை ஏற்றுமதி செய்',
      totalUsers: 'மொத்த பயனர்கள்',
      totalAppointments: 'மொத்த நேரங்கள்',
      totalChatSessions: 'மொத்த அரட்டை அமர்வுகள்',
      totalScreeningResults: 'மொத்த சோதனை முடிவுகள்',
      
      // Mental Health Categories
      anxiety: 'கவலை',
      depression: 'மனச்சோர்வு',
      stress: 'மன அழுத்தம்',
      sleep: 'தூக்கம்',
      relationships: 'உறவுகள்',
      academic: 'கல்வி',
      general: 'பொது',
      
      // Resource Types
      video: 'வீடியோ',
      audio: 'ஆடியோ',
      article: 'கட்டுரை',
      guide: 'வழிகாட்டி',
      exercise: 'பயிற்சி',
      meditation: 'தியானம்',
      worksheet: 'வேலைத்தாள்',
      
      // Severity Levels
      minimal: 'குறைந்த',
      mild: 'மிதமான',
      moderate: 'நடுத்தர',
      moderatelySevere: 'நடுத்தர-கடுமையான',
      severe: 'கடுமையான',
      
      // Crisis Support
      crisisSupport: 'நெருக்கடி ஆதரவு',
      emergencyContact: 'அவசர தொடர்பு',
      helpline: 'உதவி வரி',
      immediateHelp: 'உடனடி உதவி',
      safetyPlan: 'பாதுகாப்பு திட்டம்',
      
      // Cultural Context
      culturalSensitivity: 'கலாச்சார உணர்வு',
      familySupport: 'குடும்ப ஆதரவு',
      communityResources: 'சமூக வளங்கள்',
      traditionalHealing: 'பாரம்பரிய சிகிச்சை',
      religiousSupport: 'மத ஆதரவு'
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
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;



