import React, { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================================
// COMPLETE DOCTOR QUEUE SYSTEM - SINGLE FILE
// ============================================================================

export default function DoctorQueue() {
  // ========== STATE MANAGEMENT ==========
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [showNotificationBanner, setShowNotificationBanner] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [autoRefreshKey, setAutoRefreshKey] = useState(0);
  const previousPosition = useRef(null);

  // ========== MOCK DATA GENERATOR ==========
  const generateMockData = () => {
    const now = new Date();
    const joinedAt = new Date(now.getTime() - 20 * 60 * 1000);

    return {
      doctor: {
        id: 'dr_001',
        name: 'Dr. Mahmoud Khalid',
        specialty: 'Dermatology',
        rating: 4.8,
      
        initials: 'MK',
        status: 'with-patient',
        room: '205',
        floor: '2nd Floor'
      },
      yourEntry: {
        queueId: 'Q47',
        patientId: 'P001',
        position: {
          current: 3,
          total: 8,
          ahead: 2
        },
        status: 'waiting',
        joinedAt,
        estimatedWait: {
          min: 25,
          max: 35,
          unit: 'minutes',
          lastUpdated: now
        },
        isYou: true
      },
      queue: [
        {
          queueId: 'Q45',
          patientId: 'P102',
          position: { current: 1, total: 8, ahead: 0 },
          status: 'in-session',
          joinedAt: new Date(now.getTime() - 45 * 60 * 1000),
          estimatedWait: { min: 0, max: 0, unit: 'minutes', lastUpdated: now }
        },
        {
          queueId: 'Q46',
          patientId: 'P103',
          position: { current: 2, total: 8, ahead: 1 },
          status: 'waiting',
          joinedAt: new Date(now.getTime() - 30 * 60 * 1000),
          estimatedWait: { min: 10, max: 15, unit: 'minutes', lastUpdated: now }
        },
        {
          queueId: 'Q47',
          patientId: 'P001',
          position: { current: 3, total: 8, ahead: 2 },
          status: 'waiting',
          joinedAt,
          estimatedWait: { min: 25, max: 35, unit: 'minutes', lastUpdated: now },
          isYou: true
        }
      ],
      connectionStatus: 'connected',
      lastSync: now
    };
  };

  // ========== EFFECTS ==========
  // Initial data load
  useEffect(() => {
    setTimeout(() => {
      setData(generateMockData());
      setIsLoading(false);
    }, 1000);
  }, []);

  // Real-time updates simulation
  useEffect(() => {
    if (!data) return;

    const interval = setInterval(() => {
      setData(prev => {
        if (!prev) return prev;

        const newPosition = Math.max(1, prev.yourEntry.position.current - (Math.random() > 0.7 ? 1 : 0));
        const newAhead = Math.max(0, newPosition - 1);
        const baseWait = newPosition * 12;
        const minWait = Math.max(0, baseWait - 5);
        const maxWait = baseWait + 5;

        return {
          ...prev,
          yourEntry: {
            ...prev.yourEntry,
            position: {
              ...prev.yourEntry.position,
              current: newPosition,
              ahead: newAhead
            },
            estimatedWait: {
              min: minWait,
              max: maxWait,
              unit: 'minutes',
              lastUpdated: new Date()
            }
          },
          lastSync: new Date()
        };
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [data]);

  // Auto-refresh timestamps
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoRefreshKey(prev => prev + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowHelpModal(false);
        setShowLeaveModal(false);
      }
      if (e.key === 'r' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        window.location.reload();
      }
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setNotifyEnabled(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Position change announcements
  useEffect(() => {
    if (data?.yourEntry && previousPosition.current !== null) {
      const currentPos = data.yourEntry.position.current;
      if (currentPos < previousPosition.current) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Your position has moved up to number ${currentPos}`;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
      }
      previousPosition.current = currentPos;
    } else if (data?.yourEntry) {
      previousPosition.current = data.yourEntry.position.current;
    }
  }, [data?.yourEntry?.position.current]);

  // ========== HANDLERS ==========
  const handleNotifyToggle = () => {
    setNotifyEnabled(prev => !prev);
    if (!notifyEnabled) {
      setShowNotificationBanner(false);
    }
  };

  const handleLeaveQueue = () => {
    setShowLeaveModal(false);
    console.log('Left queue');
  };

  // ========== HELPER FUNCTIONS ==========
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffHours / 24)} day(s) ago`;
  };

  const formatAbsoluteTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateProgress = (current, total) => {
    if (total === 0) return 0;
    return Math.round(((total - current + 1) / total) * 100);
  };

  const maskId = (id) => {
    if (id.length <= 4) return id;
    return `***${id.slice(-4)}`;
  };

  const getGuidanceMessage = (position, estimatedMinutes) => {
    if (position === 1) {
      return {
        message: "🎯 You're next! Please stay nearby and listen for your name.",
        bgColor: 'bg-green-50 border-green-200',
        textColor: 'text-green-800'
      };
    } else if (position === 2) {
      return {
        message: "⏰ You're up soon! Please remain in the waiting area.",
        bgColor: 'bg-yellow-50 border-yellow-200',
        textColor: 'text-yellow-800'
      };
    } else if (estimatedMinutes > 30) {
      return {
        message: "☕ You have time. Feel free to grab a coffee, but stay within the building.",
        bgColor: 'bg-blue-50 border-blue-200',
        textColor: 'text-blue-800'
      };
    } else {
      return {
        message: "📍 Please stay in the waiting area. Your turn is coming up soon.",
        bgColor: 'bg-indigo-50 border-indigo-200',
        textColor: 'text-indigo-800'
      };
    }
  };

  // ========== LOADING STATE ==========
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Loading skeletons */}
          <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-12 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ========== ERROR STATE ==========
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Queue</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { doctor, yourEntry, queue, lastSync } = data;
  const progress = calculateProgress(yourEntry.position.current, yourEntry.position.total);
  const guidance = getGuidanceMessage(yourEntry.position.current, yourEntry.estimatedWait.min);
  const statusConfig = {
    'with-patient': { label: 'With Patient', color: 'text-orange-600', indicator: 'bg-orange-500' },
    'available': { label: 'Available', color: 'text-green-600', indicator: 'bg-green-500' },
    'on-break': { label: 'On Break', color: 'text-yellow-600', indicator: 'bg-yellow-500' },
    'offline': { label: 'Offline', color: 'text-gray-600', indicator: 'bg-gray-400' }
  }[doctor.status];

  // ========== MAIN RENDER ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <style>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Notification Banner */}
        {showNotificationBanner && !notifyEnabled && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 flex items-center justify-between gap-4 shadow-lg">
            <div className="flex items-start gap-3 flex-1">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div>
                <h3 className="font-bold text-sm mb-1">Enable Notifications</h3>
                <p className="text-xs text-blue-100">Get notified when you're next in line</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleNotifyToggle}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors"
              >
                Enable
              </button>
              <button
                onClick={() => setShowNotificationBanner(false)}
                className="px-3 py-2 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Doctor Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {doctor.initials}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${statusConfig.indicator} rounded-full ring-2 ring-white animate-pulse`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-slate-800 truncate">{doctor.name}</h1>
                <p className="text-slate-600 text-base">{doctor.specialty}</p>
                <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>{doctor.room} - {doctor.floor}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4].map(star => (
                    <svg key={star} className="w-5 h-5 fill-orange-400" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                  <svg className="w-5 h-5 fill-gray-300" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                </div>
                <span className="text-slate-700 text-sm font-medium ml-1">
                  {doctor.rating.toFixed(1)}
                  <span className="text-slate-400 ml-1">({doctor.totalReviews})</span>
                </span>
              </div>
              <div className="group relative">
                <div className={`${statusConfig.color.replace('text-', 'bg-')}-100 ${statusConfig.color} px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer`}>
                  <div className={`w-2 h-2 rounded-full ${statusConfig.indicator} animate-pulse`}></div>
                  <span>{statusConfig.label}</span>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                  Doctor is currently {statusConfig.label.toLowerCase()}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guidance Banner */}
        <div className={`${guidance.bgColor} ${guidance.textColor} border-2 rounded-xl p-4 flex items-start gap-3`} role="status" aria-live="polite">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm md:text-base font-medium flex-1">{guidance.message}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Position */}
          <div className={`bg-white rounded-2xl shadow-sm p-6 ${yourEntry.position.current <= 2 ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-slate-500 text-sm font-medium">Your Position</p>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="text-5xl md:text-6xl font-bold text-slate-800 leading-none">
              #{yourEntry.position.current}
            </div>
            <p className="text-slate-400 text-sm mt-2">
              {yourEntry.position.ahead} patient{yourEntry.position.ahead !== 1 ? 's' : ''} ahead
            </p>
          </div>

          {/* Estimated Wait */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <p className="text-slate-500 text-sm font-medium">Estimated Wait</p>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
                </svg>
              </div>
            </div>
            <div className="text-4xl md:text-5xl font-bold text-slate-800 leading-none">
              {yourEntry.estimatedWait.min === yourEntry.estimatedWait.max 
                ? `~${yourEntry.estimatedWait.min}` 
                : `${yourEntry.estimatedWait.min}-${yourEntry.estimatedWait.max}`}
            </div>
            <p className="text-slate-400 text-sm mt-2">{yourEntry.estimatedWait.unit}</p>
          </div>

          {/* Status */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <p className="text-slate-500 text-sm font-medium">Queue Status</p>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-medium text-base flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2"/>
                </svg>
                <span className="capitalize">{yourEntry.status}</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-2">Queue {yourEntry.queueId}</p>
          </div>
        </div>

        {/* Queue Visualization */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <h2 className="text-lg font-bold text-slate-800">Queue Visualization</h2>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mb-6 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Current Patient</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-700 ring-4 ring-blue-200"></div>
              <span>You</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              <span>Waiting</span>
            </div>
          </div>

          {/* Queue Positions */}
          <div className="flex items-center justify-center gap-8 mb-8">
            {queue.slice(0, 5).map((entry) => {
              const isCurrent = entry.status === 'in-session';
              const isYou = entry.isYou;
              return (
                <div key={entry.queueId} className="flex flex-col items-center">
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center
                    text-white text-xl font-bold transition-all
                    ${isCurrent ? 'bg-green-500 shadow-lg shadow-green-200' : ''}
                    ${isYou ? 'bg-slate-700 ring-4 ring-blue-200 shadow-lg' : ''}
                    ${!isCurrent && !isYou ? 'bg-slate-300' : ''}
                  `}>
                    {entry.position.current}
                  </div>
                  <p className={`text-xs mt-2 font-medium ${isYou ? 'text-slate-700' : 'text-slate-500'}`}>
                    {isCurrent ? 'Current' : isYou ? 'You' : '\u00A0'}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Joined Queue</span>
              <span>Your Turn</span>
            </div>
            <div className="relative">
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500">{progress}% through the queue</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
       

        {/* Queue Details */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2"/>
            </svg>
            <h2 className="text-lg font-bold text-slate-800">Queue Details</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-slate-500 text-xs mb-1">Queue Number</p>
              <p className="text-slate-800 font-bold text-lg">{maskId(yourEntry.queueId)}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-slate-500 text-xs mb-1">Patient ID</p>
              <p className="text-slate-800 font-bold text-lg">{maskId(yourEntry.patientId)}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-slate-500 text-xs mb-1">Joined At</p>
              <p className="text-slate-800 font-bold text-base">{formatAbsoluteTime(yourEntry.joinedAt)}</p>
              <p className="text-slate-400 text-xs mt-0.5">
                {yourEntry.joinedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-slate-500 text-xs mb-1">Time Waiting</p>
              <p className="text-slate-800 font-bold text-base">{formatRelativeTime(yourEntry.joinedAt)}</p>
              <p className="text-slate-400 text-xs mt-0.5">Updates live</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 flex items-start gap-2">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Some information is masked for your privacy. Full details are visible only to you and medical staff.</span>
            </p>
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <h2 className="text-lg font-bold text-slate-800">Where to Go</h2>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
            <div className="flex items-center justify-around flex-wrap gap-4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-3">
                  {doctor.floor.charAt(0)}
                </div>
                <p className="text-slate-500 text-xs">Floor</p>
                <p className="text-slate-800 font-bold text-sm">{doctor.floor}</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg mb-3">
                  {doctor.room}
                </div>
                <p className="text-slate-500 text-xs">Room Number</p>
                <p className="text-slate-800 font-bold text-sm">Room {doctor.room}</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center text-white shadow-lg mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <p className="text-slate-500 text-xs">Doctor</p>
                <p className="text-slate-800 font-bold text-sm">{doctor.name}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
            <p className="text-xs text-indigo-700 flex items-start gap-2">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Look for signs to <strong>{doctor.floor}</strong> and follow room numbers to <strong>{doctor.room}</strong>. Staff at reception can help if needed.</span>
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
          <span className={`text-sm font-medium ${connectionStatus === 'connected' ? 'text-green-600' : 'text-yellow-600'}`}>
            {connectionStatus === 'connected' ? 'Connected' : 'Reconnecting...'}
          </span>
          {lastSync && connectionStatus === 'connected' && (
            <span className="text-slate-400 text-xs ml-2">
              Updated {formatRelativeTime(lastSync)}
            </span>
          )}
        </div>

        {/* Keyboard Shortcuts */}
       
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowHelpModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Need Help?</h2>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">How accurate is the estimated wait time?</h4>
                    <p className="text-sm text-slate-600">Wait times are calculated based on average consultation duration and current queue position. Actual times may vary.</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Can I leave and come back?</h4>
                    <p className="text-sm text-slate-600">If you have more than 30 minutes, you may leave the waiting area but stay within the building. Enable notifications to be alerted.</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">What if I miss my turn?</h4>
                    <p className="text-sm text-slate-600">Speak to reception immediately. You may be placed at the end of the queue or need to reschedule.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Still Need Help?</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-100 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call Reception
                  </button>
                  <button className="px-4 py-3 bg-green-50 text-green-700 rounded-lg font-medium text-sm hover:bg-green-100 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Live Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leave Queue Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowLeaveModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-slate-800 text-center mb-2">Leave Queue?</h2>
            <p className="text-slate-600 text-center mb-6">
              {yourEntry.position.current <= 2 ? (
                <>
                  You're up soon (position #{yourEntry.position.current})! Are you sure you want to leave?
                  <strong className="block mt-2 text-red-600">You'll lose your current position.</strong>
                </>
              ) : (
                'Are you sure you want to cancel your appointment? You\'ll need to join the queue again if you change your mind.'
              )}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 px-4 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Stay in Queue
              </button>
              <button
                onClick={handleLeaveQueue}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Yes, Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}