import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import Calendar from 'react-calendar';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Video,
  Phone,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const Appointments = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    reason: '',
    type: 'individual',
    mode: 'in-person',
    priority: 'medium'
  });

  // Get counselors
  const { data: counselors } = useQuery(
    'counselors',
    () => axios.get('/api/appointments/counselors'),
    {
      select: (response) => response.data
    }
  );

  // Get user's appointments
  const { data: appointments, isLoading } = useQuery(
    ['appointments', user._id],
    () => axios.get(`/api/appointments/student/${user._id}`),
    {
      enabled: !!user._id,
      select: (response) => response.data
    }
  );

  // Get available time slots
  const { data: availableSlots } = useQuery(
    ['availability', selectedCounselor, selectedDate],
    () => axios.get(`/api/appointments/availability/${selectedCounselor}`, {
      params: { date: selectedDate.toISOString().split('T')[0] }
    }),
    {
      enabled: !!selectedCounselor,
      select: (response) => response.data
    }
  );

  // Book appointment mutation
  const bookAppointmentMutation = useMutation(
    (appointmentData) => axios.post('/api/appointments/book', appointmentData),
    {
      onSuccess: () => {
        toast.success('Appointment booked successfully!');
        setShowBookingModal(false);
        queryClient.invalidateQueries(['appointments', user._id]);
        resetBookingForm();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to book appointment');
      }
    }
  );

  // Cancel appointment mutation
  const cancelAppointmentMutation = useMutation(
    ({ appointmentId, reason }) => axios.put(`/api/appointments/${appointmentId}/cancel`, { reason }),
    {
      onSuccess: () => {
        toast.success('Appointment cancelled successfully!');
        queryClient.invalidateQueries(['appointments', user._id]);
      },
      onError: (error) => {
        toast.error('Failed to cancel appointment');
      }
    }
  );

  const resetBookingForm = () => {
    setBookingForm({
      reason: '',
      type: 'individual',
      mode: 'in-person',
      priority: 'medium'
    });
    setSelectedCounselor(null);
    setSelectedTimeSlot(null);
  };

  const handleBookAppointment = () => {
    if (!selectedCounselor || !selectedTimeSlot) {
      toast.error('Please select a counselor and time slot');
      return;
    }

    const appointmentData = {
      studentId: user._id,
      counselorId: selectedCounselor,
      appointmentDate: selectedTimeSlot,
      reason: bookingForm.reason,
      type: bookingForm.type,
      mode: bookingForm.mode,
      priority: bookingForm.priority
    };

    bookAppointmentMutation.mutate(appointmentData);
  };

  const handleCancelAppointment = (appointmentId) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (reason) {
      cancelAppointmentMutation.mutate({ appointmentId, reason });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'online': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('appointments')}</h1>
          <p className="text-gray-600">Manage your counseling appointments</p>
        </div>
        <button
          onClick={() => setShowBookingModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{t('bookAppointment')}</span>
        </button>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Appointments</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : appointments?.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
              <p className="text-gray-600 mb-4">Book your first appointment to get started</p>
              <button
                onClick={() => setShowBookingModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments?.map((appointment) => (
                <div key={appointment._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {appointment.counselorId?.firstName} {appointment.counselorId?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.appointmentDate).toLocaleDateString()} at{' '}
                          {new Date(appointment.appointmentDate).toLocaleTimeString()}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            {getModeIcon(appointment.mode)}
                            <span className="capitalize">{appointment.mode}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.duration} minutes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        <span className="ml-1 capitalize">{appointment.status}</span>
                      </span>
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => handleCancelAppointment(appointment._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  {appointment.reason && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Reason:</strong> {appointment.reason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Book New Appointment</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Counselor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Counselor
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {counselors?.map((counselor) => (
                    <button
                      key={counselor._id}
                      onClick={() => setSelectedCounselor(counselor._id)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedCounselor === counselor._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium text-gray-900">
                        {counselor.firstName} {counselor.lastName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {counselor.department}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              {selectedCounselor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    minDate={new Date()}
                    className="mx-auto"
                  />
                </div>
              )}

              {/* Time Slot Selection */}
              {selectedCounselor && selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots?.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`p-2 border rounded-lg text-sm transition-colors ${
                          selectedTimeSlot === slot.time
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {slot.displayTime}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Appointment Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Appointment
                </label>
                <textarea
                  value={bookingForm.reason}
                  onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Please describe the reason for your appointment..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Type
                  </label>
                  <select
                    value={bookingForm.type}
                    onChange={(e) => setBookingForm({ ...bookingForm, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="individual">Individual</option>
                    <option value="group">Group</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode
                  </label>
                  <select
                    value={bookingForm.mode}
                    onChange={(e) => setBookingForm({ ...bookingForm, mode: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="in-person">In-Person</option>
                    <option value="online">Online</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookAppointment}
                  disabled={!selectedCounselor || !selectedTimeSlot || !bookingForm.reason}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;



