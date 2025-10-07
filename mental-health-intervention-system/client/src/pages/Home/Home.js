import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import {
  MessageCircle,
  Calendar,
  BookOpen,
  Users,
  ClipboardList,
  Heart,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const quickActions = [
    {
      title: t('chat'),
      description: 'Get immediate AI-powered mental health support',
      icon: MessageCircle,
      href: '/chat',
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: t('appointments'),
      description: 'Book an appointment with a counselor',
      icon: Calendar,
      href: '/appointments',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: t('resources'),
      description: 'Access mental health resources and guides',
      icon: BookOpen,
      href: '/resources',
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: t('peerSupport'),
      description: 'Connect with peer support groups',
      icon: Users,
      href: '/peer-support',
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      title: t('screening'),
      description: 'Take a mental health assessment',
      icon: ClipboardList,
      href: '/screening',
      color: 'bg-pink-500',
      textColor: 'text-pink-600'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Confidential & Secure',
      description: 'Your privacy is our priority. All interactions are encrypted and confidential.'
    },
    {
      icon: Heart,
      title: 'Culturally Sensitive',
      description: 'Support tailored to your cultural background and regional context.'
    },
    {
      icon: TrendingUp,
      title: 'Evidence-Based',
      description: 'Interventions based on proven psychological research and best practices.'
    },
    {
      icon: Clock,
      title: '24/7 Available',
      description: 'Access support whenever you need it, day or night.'
    }
  ];

  const stats = [
    { label: 'Students Helped', value: '2,500+' },
    { label: 'Counselors Available', value: '50+' },
    { label: 'Resources Available', value: '200+' },
    { label: 'Support Groups', value: '25+' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            {t('welcome')}, {user?.firstName}!
          </h1>
          <p className="text-xl mb-6 opacity-90">
            Your mental health matters. We're here to support you on your journey to wellness.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/chat"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Chat
            </Link>
            <Link
              to="/screening"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Take Assessment
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Our Platform?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Crisis Support */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Heart className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Need Immediate Help?
            </h3>
            <p className="text-red-700 mb-4">
              If you're experiencing a mental health crisis or having thoughts of self-harm, 
              please reach out for immediate support.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:988"
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Call 988 (Suicide & Crisis Lifeline)
              </a>
              <Link
                to="/chat"
                className="border-2 border-red-600 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-colors"
              >
                Start Crisis Chat
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity (if any) */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Welcome to MindCare!</p>
              <p className="text-sm text-gray-600">Your account has been successfully created.</p>
            </div>
          </div>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity to display.</p>
            <p className="text-sm">Start exploring our features to see your activity here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;



