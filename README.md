# Digital Psychological Intervention System

A comprehensive mental health support platform designed specifically for college students, featuring AI-guided support, confidential counseling appointments, peer support communities, and culturally sensitive resources.

## 🌟 Features

### 1. AI-Guided First-Aid Support
- **Interactive Chat System**: 24/7 AI-powered mental health assistant
- **Crisis Detection**: Automatic identification of high-risk situations
- **Coping Strategies**: Evidence-based interventions and techniques
- **Escalation System**: Seamless handoff to human counselors when needed

### 2. Confidential Booking System
- **Appointment Scheduling**: Easy booking with on-campus counselors
- **Multiple Modes**: In-person, online, and phone consultations
- **Reminder System**: Automated notifications and follow-ups
- **Feedback System**: Post-appointment evaluation and improvement

### 3. Psychoeducational Resource Hub
- **Multilingual Support**: Resources in English, Hindi, Tamil, and more
- **Diverse Content**: Videos, audio guides, articles, and worksheets
- **Categorized Resources**: Anxiety, depression, stress, sleep, relationships
- **Cultural Context**: Region-specific and culturally sensitive materials

### 4. Peer Support Platform
- **Moderated Forums**: Safe spaces for student discussions
- **Support Groups**: Topic-based communities (anxiety, depression, LGBTQ+, etc.)
- **Anonymous Posting**: Option for confidential sharing
- **Community Guidelines**: Clear rules and moderation policies

### 5. Admin Dashboard
- **Analytics**: Anonymous data insights and trends
- **User Management**: Counselor and student account administration
- **System Health**: Monitoring and maintenance tools
- **Data Export**: Compliance and reporting capabilities

### 6. Psychological Screening Tools
- **PHQ-9**: Depression assessment
- **GAD-7**: Anxiety screening
- **GHQ-12**: General health questionnaire
- **Automated Scoring**: Instant results and recommendations

### 7. Regional Language Support
- **Multi-language Interface**: English, Hindi, Tamil support
- **Cultural Sensitivity**: Region-specific content and approaches
- **Local Resources**: Integration with regional mental health services
- **Traditional Healing**: Ayurveda, yoga, and meditation resources

### 8. Offline Support Mapping
- **Crisis Helplines**: National and regional emergency contacts
- **Local Counseling Centers**: Institution-specific resources
- **Community Support**: Religious and traditional healing options
- **Emergency Contacts**: Quick access to immediate help

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mental-health-intervention-system
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if not running)
   mongod
   
   # The application will create necessary collections automatically
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
mental-health-intervention-system/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── contexts/      # React contexts (Auth, etc.)
│   │   ├── services/      # API services and utilities
│   │   ├── i18n/          # Internationalization
│   │   └── App.js         # Main application component
│   └── package.json
├── models/                # MongoDB data models
│   ├── User.js
│   ├── ChatSession.js
│   ├── Appointment.js
│   ├── Resource.js
│   ├── PeerSupport.js
│   └── Screening.js
├── routes/                # Express.js API routes
│   ├── auth.js
│   ├── chat.js
│   ├── appointments.js
│   ├── resources.js
│   ├── peerSupport.js
│   ├── screening.js
│   └── admin.js
├── server.js              # Main server file
├── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mental-health-system
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:3000

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# AI Chat Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Admin Credentials
ADMIN_EMAIL=admin@college.edu
ADMIN_PASSWORD=admin_password_here
```

### Database Configuration

The application uses MongoDB with the following collections:
- `users` - User accounts and profiles
- `chatsessions` - AI chat conversations
- `appointments` - Counseling appointments
- `resources` - Educational materials
- `posts` - Peer support posts
- `supportgroups` - Support group information
- `screeningresults` - Mental health assessments

## 🎯 Usage Guide

### For Students

1. **Registration**: Create an account with your student details
2. **AI Chat**: Start conversations for immediate support
3. **Book Appointments**: Schedule counseling sessions
4. **Access Resources**: Browse mental health materials
5. **Join Communities**: Participate in peer support groups
6. **Take Assessments**: Complete mental health screenings

### For Counselors

1. **Account Setup**: Admin creates counselor accounts
2. **View Appointments**: Manage scheduled sessions
3. **Chat Escalation**: Handle escalated AI conversations
4. **Resource Management**: Add and moderate content
5. **Student Support**: Provide ongoing assistance

### For Administrators

1. **Dashboard Access**: Monitor system usage and trends
2. **User Management**: Manage student and counselor accounts
3. **Content Moderation**: Review and approve resources
4. **Analytics**: Generate reports and insights
5. **System Maintenance**: Monitor health and performance

## 🔒 Security Features

- **Data Encryption**: All sensitive data is encrypted
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive data validation
- **Privacy Controls**: User-controlled data sharing
- **Audit Logging**: Track system access and changes

## 🌐 Internationalization

The platform supports multiple languages:
- **English**: Default language
- **Hindi (हिन्दी)**: Full interface translation
- **Tamil (தமிழ்)**: Complete localization
- **Extensible**: Easy to add more languages

## 📊 Analytics and Reporting

### Admin Dashboard Metrics
- Total users and active sessions
- Appointment booking trends
- Chat session analytics
- Screening result distributions
- Resource usage statistics
- System health monitoring

### Data Export
- User activity reports (anonymized)
- Appointment summaries
- Screening result trends
- System performance metrics

## 🚨 Crisis Support

### Immediate Help
- **Crisis Detection**: AI identifies high-risk situations
- **Emergency Contacts**: Quick access to helplines
- **Escalation Protocol**: Automatic counselor notification
- **Safety Planning**: Crisis intervention resources

### Regional Support
- **National Helplines**: 988, Crisis Text Line
- **Regional Services**: State-specific mental health support
- **Local Resources**: Institution-based counseling
- **Community Support**: Religious and traditional healing

## 🛠️ Development

### Adding New Features

1. **Backend**: Add routes in `/routes/` directory
2. **Frontend**: Create components in `/client/src/components/`
3. **Database**: Update models in `/models/` directory
4. **Testing**: Add tests in `/tests/` directory

### Code Style
- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages
- **JSDoc**: Comprehensive documentation

### Testing
```bash
# Run backend tests
npm test

# Run frontend tests
cd client
npm test

# Run integration tests
npm run test:integration
```

## 📱 Mobile Support

The platform is fully responsive and works on:
- **Desktop**: Full feature access
- **Tablet**: Optimized interface
- **Mobile**: Touch-friendly design
- **PWA**: Progressive Web App capabilities

## 🔄 Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_url
   JWT_SECRET=your_production_jwt_secret
   ```

3. **Deploy to your preferred platform**
   - **Heroku**: Easy deployment with buildpacks
   - **AWS**: EC2, ECS, or Lambda deployment
   - **DigitalOcean**: Droplet or App Platform
   - **Vercel**: Frontend deployment with serverless functions

### Docker Deployment

```bash
# Build Docker image
docker build -t mental-health-system .

# Run container
docker run -p 5000:5000 mental-health-system
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- **API Documentation**: Available at `/api/docs`
- **User Guide**: Comprehensive usage instructions
- **Developer Guide**: Technical implementation details

### Contact
- **Technical Issues**: Create an issue on GitHub
- **Feature Requests**: Submit via GitHub issues
- **Security Concerns**: Email security@mindcare.org

### Community
- **Discord**: Join our developer community
- **Forum**: User support and discussions
- **Newsletter**: Updates and announcements

## 🙏 Acknowledgments

- **Mental Health Professionals**: For clinical guidance and validation
- **Open Source Community**: For the amazing tools and libraries
- **Student Testers**: For feedback and improvement suggestions
- **Cultural Consultants**: For regional and linguistic expertise

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Core platform functionality
- ✅ AI chat system
- ✅ Appointment booking
- ✅ Basic analytics

### Phase 2 (Next)
- 🔄 Advanced AI capabilities
- 🔄 Mobile app development
- 🔄 Integration with external systems
- 🔄 Advanced analytics

### Phase 3 (Future)
- 📋 Machine learning insights
- 📋 Telehealth integration
- 📋 Wearable device support
- 📋 Advanced personalization

---

**Built with ❤️ for student mental health and wellness**

*This platform is designed to complement, not replace, professional mental health services. Always seek immediate help in crisis situations.*



