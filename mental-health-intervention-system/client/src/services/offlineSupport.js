// Offline Support Mapping Service
// This service provides mapping to local mental health resources and support systems

export const offlineSupportData = {
  // Regional Crisis Helplines
  crisisHelplines: {
    national: [
      {
        name: 'National Suicide Prevention Lifeline',
        number: '988',
        available: '24/7',
        languages: ['English', 'Spanish'],
        description: 'Free, confidential support for people in distress'
      },
      {
        name: 'Crisis Text Line',
        number: 'Text HOME to 741741',
        available: '24/7',
        languages: ['English'],
        description: 'Free, 24/7 crisis support via text message'
      }
    ],
    regional: {
      'north': [
        {
          name: 'Delhi Mental Health Helpline',
          number: '+91-11-23389090',
          available: '24/7',
          languages: ['Hindi', 'English'],
          description: 'Delhi government mental health support'
        }
      ],
      'south': [
        {
          name: 'Tamil Nadu Mental Health Helpline',
          number: '+91-44-24640050',
          available: '24/7',
          languages: ['Tamil', 'English'],
          description: 'Tamil Nadu state mental health support'
        }
      ],
      'east': [
        {
          name: 'West Bengal Mental Health Helpline',
          number: '+91-33-24637401',
          available: '24/7',
          languages: ['Bengali', 'English'],
          description: 'West Bengal state mental health support'
        }
      ],
      'west': [
        {
          name: 'Maharashtra Mental Health Helpline',
          number: '+91-22-25521111',
          available: '24/7',
          languages: ['Marathi', 'English'],
          description: 'Maharashtra state mental health support'
        }
      ]
    }
  },

  // Local Counseling Centers
  counselingCenters: {
    'delhi': [
      {
        name: 'AIIMS Department of Psychiatry',
        address: 'Ansari Nagar, New Delhi - 110029',
        phone: '+91-11-26588500',
        services: ['Individual Therapy', 'Group Therapy', 'Medication Management'],
        languages: ['Hindi', 'English'],
        timings: '9:00 AM - 5:00 PM (Mon-Fri)',
        emergency: true
      },
      {
        name: 'VIMHANS (Vidyasagar Institute of Mental Health)',
        address: 'Nehru Nagar, New Delhi - 110065',
        phone: '+91-11-26925858',
        services: ['Individual Therapy', 'Family Therapy', 'Rehabilitation'],
        languages: ['Hindi', 'English'],
        timings: '9:00 AM - 6:00 PM (Mon-Sat)',
        emergency: true
      }
    ],
    'mumbai': [
      {
        name: 'Tata Institute of Social Sciences (TISS)',
        address: 'Deonar, Mumbai - 400088',
        phone: '+91-22-25525000',
        services: ['Counseling', 'Group Therapy', 'Community Support'],
        languages: ['Marathi', 'Hindi', 'English'],
        timings: '9:00 AM - 5:00 PM (Mon-Fri)',
        emergency: false
      }
    ],
    'chennai': [
      {
        name: 'Institute of Mental Health, Chennai',
        address: 'Kilpauk, Chennai - 600010',
        phone: '+91-44-26425555',
        services: ['Individual Therapy', 'Group Therapy', 'Crisis Intervention'],
        languages: ['Tamil', 'English'],
        timings: '8:00 AM - 4:00 PM (Mon-Fri)',
        emergency: true
      }
    ]
  },

  // Community Support Groups
  supportGroups: {
    'anxiety': [
      {
        name: 'Anxiety Support Group - Delhi',
        location: 'Community Center, Connaught Place',
        schedule: 'Every Saturday, 3:00 PM',
        contact: '+91-9876543210',
        facilitator: 'Dr. Priya Sharma',
        languages: ['Hindi', 'English']
      }
    ],
    'depression': [
      {
        name: 'Depression Support Circle - Mumbai',
        location: 'Andheri West Community Hall',
        schedule: 'Every Sunday, 10:00 AM',
        contact: '+91-9876543211',
        facilitator: 'Ms. Anjali Patel',
        languages: ['Marathi', 'Hindi', 'English']
      }
    ],
    'lgbtq+': [
      {
        name: 'LGBTQ+ Support Group - Chennai',
        location: 'Anna Nagar Community Center',
        schedule: 'Every Friday, 6:00 PM',
        contact: '+91-9876543212',
        facilitator: 'Mr. Rajesh Kumar',
        languages: ['Tamil', 'English']
      }
    ]
  },

  // Religious and Spiritual Support
  religiousSupport: {
    'hindu': [
      {
        name: 'ISKCON Counseling Services',
        description: 'Spiritual counseling based on Vedic principles',
        contact: '+91-9876543213',
        languages: ['Hindi', 'English', 'Sanskrit']
      }
    ],
    'muslim': [
      {
        name: 'Islamic Counseling Center',
        description: 'Faith-based counseling and support',
        contact: '+91-9876543214',
        languages: ['Urdu', 'Hindi', 'English']
      }
    ],
    'christian': [
      {
        name: 'Christian Counseling Services',
        description: 'Christian faith-based mental health support',
        contact: '+91-9876543215',
        languages: ['English', 'Hindi', 'Tamil']
      }
    ],
    'sikh': [
      {
        name: 'Gurudwara Counseling Services',
        description: 'Sikh community mental health support',
        contact: '+91-9876543216',
        languages: ['Punjabi', 'Hindi', 'English']
      }
    ]
  },

  // Traditional Healing Resources
  traditionalHealing: {
    'ayurveda': [
      {
        name: 'Ayurvedic Mental Health Center',
        description: 'Traditional Ayurvedic approach to mental wellness',
        services: ['Meditation', 'Yoga Therapy', 'Herbal Treatment'],
        contact: '+91-9876543217',
        languages: ['Hindi', 'English', 'Sanskrit']
      }
    ],
    'yoga': [
      {
        name: 'Yoga for Mental Health',
        description: 'Yoga-based therapy for anxiety and depression',
        services: ['Asana Practice', 'Pranayama', 'Meditation'],
        contact: '+91-9876543218',
        languages: ['Hindi', 'English']
      }
    ],
    'meditation': [
      {
        name: 'Vipassana Meditation Center',
        description: '10-day meditation courses for mental wellness',
        services: ['Silent Meditation', 'Mindfulness Training'],
        contact: '+91-9876543219',
        languages: ['Hindi', 'English']
      }
    ]
  },

  // Educational Resources
  educationalResources: {
    'colleges': [
      {
        name: 'University Counseling Center',
        description: 'On-campus mental health services for students',
        services: ['Individual Counseling', 'Group Therapy', 'Crisis Support'],
        eligibility: 'Current students only',
        languages: ['Hindi', 'English', 'Regional languages']
      }
    ],
    'schools': [
      {
        name: 'School Counseling Services',
        description: 'Mental health support for school students',
        services: ['Academic Counseling', 'Behavioral Support', 'Family Counseling'],
        eligibility: 'School students and parents',
        languages: ['Hindi', 'English', 'Regional languages']
      }
    ]
  }
};

// Service functions
export const getOfflineSupport = (userLocation, userLanguage, issueType) => {
  const support = {
    crisisHelplines: [],
    counselingCenters: [],
    supportGroups: [],
    religiousSupport: [],
    traditionalHealing: [],
    educationalResources: []
  };

  // Get crisis helplines
  support.crisisHelplines = [
    ...offlineSupportData.crisisHelplines.national,
    ...(offlineSupportData.crisisHelplines.regional[userLocation] || [])
  ].filter(helpline => 
    helpline.languages.includes(userLanguage) || 
    helpline.languages.includes('English')
  );

  // Get counseling centers
  support.counselingCenters = offlineSupportData.counselingCenters[userLocation] || [];

  // Get relevant support groups
  if (issueType && offlineSupportData.supportGroups[issueType]) {
    support.supportGroups = offlineSupportData.supportGroups[issueType];
  }

  // Get religious support (if user has specified religion)
  // This would be populated based on user's religious preferences

  // Get traditional healing resources
  support.traditionalHealing = [
    ...offlineSupportData.traditionalHealing.ayurveda,
    ...offlineSupportData.traditionalHealing.yoga,
    ...offlineSupportData.traditionalHealing.meditation
  ];

  // Get educational resources
  support.educationalResources = [
    ...offlineSupportData.educationalResources.colleges,
    ...offlineSupportData.educationalResources.schools
  ];

  return support;
};

export const getEmergencyContacts = (userLocation) => {
  return {
    police: '100',
    ambulance: '102',
    fire: '101',
    womenHelpline: '181',
    childHelpline: '1098',
    mentalHealthHelpline: '1800-599-0019',
    localCrisisLine: offlineSupportData.crisisHelplines.regional[userLocation]?.[0]?.number || '988'
  };
};

export const getCulturalContext = (userLanguage, userRegion) => {
  const culturalContext = {
    language: userLanguage,
    region: userRegion,
    considerations: [],
    resources: []
  };

  // Add cultural considerations based on region and language
  if (userLanguage === 'hi' || userRegion === 'north') {
    culturalContext.considerations.push(
      'Family plays a central role in mental health decisions',
      'Stigma around mental health is prevalent but changing',
      'Traditional healing methods are often preferred initially'
    );
  }

  if (userLanguage === 'ta' || userRegion === 'south') {
    culturalContext.considerations.push(
      'Strong community support systems exist',
      'Religious and spiritual practices are integrated with mental health',
      'Education and career pressure are significant stressors'
    );
  }

  // Add region-specific resources
  if (userRegion === 'north') {
    culturalContext.resources.push(
      'Delhi has several world-class mental health institutions',
      'Strong network of community health workers',
      'Government initiatives for mental health awareness'
    );
  }

  return culturalContext;
};

export default {
  offlineSupportData,
  getOfflineSupport,
  getEmergencyContacts,
  getCulturalContext
};



