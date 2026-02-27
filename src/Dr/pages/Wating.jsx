
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQueueStatus, cancelQueue, getPatientNotifications } from '../../QueueApi';
import { Card } from "@heroui/react";

export default function WaitingQueue() {
  const navigate = useNavigate();
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('waiting');
  const [notifications, setNotifications] = useState([]);
  const pollingInterval = useRef(null);

  // تحميل بيانات الـ Queue من localStorage
  useEffect(() => {
    const savedQueueData = localStorage.getItem('queueData');
    
    if (!savedQueueData) {
      console.error('❌ No queue data found');
      setError('لا توجد بيانات للقائمة. يرجى الحجز مرة أخرى.');
      setLoading(false);
      return;
    }

    try {
      const parsedData = JSON.parse(savedQueueData);
      console.log(' Queue data loaded:', parsedData);
      setQueueData(parsedData);
      setLoading(false);
   
      startPolling(parsedData.queue_id);
    } catch (err) {
      console.error('❌ Error parsing queue data:', err);
      setError('خطأ في تحميل البيانات');
      setLoading(false);
    }

 
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

 
  const startPolling = (queueId) => {
    // تحديث فوري
    updateQueueStatus(queueId);
    
    // تحديث كل 10 ثواني
    pollingInterval.current = setInterval(() => {
      updateQueueStatus(queueId);
    }, 10000);
  };

  /**
   * تحديث حالة الـ Queue
   */
  const updateQueueStatus = async (queueId) => {
    try {
      console.log('🔄 Updating queue status...');
      const status = await getQueueStatus(queueId);
      
      console.log('📊 Queue status:', status);
      
      // تحديث البيانات
      setQueueData(prev => ({
        ...prev,
        position: status.position || prev.position,
        estimated_wait_minutes: status.estimated_wait_minutes || prev.estimated_wait_minutes,
        status: status.status || prev.status
      }));

      setCurrentStatus(status.status || 'waiting');

     
      if (status.status === 'called' || status.status === 'ready') {
       
        console.log(' Doctor is ready! Redirecting...');
        
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
        }

        alert(' دورك الآن! سيتم توجيهك للطبيب...');
        
        setTimeout(() => {
          navigate('/dr');
        }, 1500);
      }

    } catch (err) {
      console.error('❌ Error updating queue:', err);
   
      if (err.message.includes('404') || err.message.includes('not found')) {
        setError('لم يتم العثور على القائمة. ربما تم إلغاؤها.');
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
        }
      }
    }
  };

  /**
   * إلغاء/مغادرة القائمة
   */
  const handleCancelQueue = async () => {
    if (!queueData?.queue_id) return;

    const confirmCancel = window.confirm(
      '⚠️ هل أنت متأكد من مغادرة قائمة الانتظار؟\nستفقد دورك في القائمة.'
    );

    if (!confirmCancel) return;

    try {
      setLoading(true);
      console.log('🚫 Cancelling queue:', queueData.queue_id);
      
      await cancelQueue(queueData.queue_id);
      
      // إيقاف التحديث
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }

      // حذف البيانات من localStorage
      localStorage.removeItem('queueData');
      
      alert('✅ تم مغادرة قائمة الانتظار بنجاح');
      
      // العودة للصفحة الرئيسية
      navigate('/');

    } catch (err) {
      console.error('❌ Error cancelling queue:', err);
      alert(`❌ خطأ في إلغاء القائمة: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !queueData) {
    return (
      <div className="min-h-screen bg-[#f4f8ff] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل بيانات القائمة...</p>
        </div>
      </div>
    );
  }

 
  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f8ff] flex justify-center items-center px-4">
        <Card className="bg-white p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            العودة للصفحة الرئيسية
          </button>
        </Card>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-[#f4f8ff] flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-blue-100 rounded-full p-4 mb-4">
            <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">قائمة الانتظار</h1>
          <p className="text-gray-600">يرجى الانتظار حتى يحين دورك</p>
        </div>

        {/* Queue Status Card */}
        <Card className="bg-white rounded-2xl shadow-xl p-8 mb-6 border-2 border-blue-100">
          
          {/* Doctor Info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">👨‍⚕️</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">
                Dr. {queueData?.doctor?.name || 'طبيب'}
              </h2>
              <p className="text-gray-600">
                {queueData?.doctor?.specialty_ar || queueData?.doctor?.specialty || 'تخصص'}
              </p>
              <p className="text-sm text-gray-500">
                📍 الطابق {queueData?.doctor?.floor || '-'} - غرفة {queueData?.doctor?.room || '-'}
              </p>
            </div>
          </div>

          {/* Queue Position */}
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">دورك في القائمة</p>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-3">
              <span className="text-5xl font-bold text-white">
                {queueData?.position || 1}
              </span>
            </div>
            <p className="text-gray-600 text-lg font-medium">
              الوقت المتوقع: <span className="text-blue-600 font-bold">{queueData?.estimated_wait_minutes || 15}</span> دقيقة
            </p>
          </div>

          {/* Status Indicator */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  currentStatus === 'called' ? 'bg-green-500' : 
                  currentStatus === 'waiting' ? 'bg-yellow-500' : 
                  'bg-gray-400'
                }`}></div>
                <span className="text-gray-700 font-medium">
                  {currentStatus === 'called' ? '✅ دورك الآن!' :
                   currentStatus === 'waiting' ? '⏱️ في الانتظار' :
                   '🔄 جاري التحديث...'}
                </span>
              </div>
              <span className="text-sm text-gray-500">يتم التحديث تلقائياً</span>
            </div>
          </div>

          {/* Patient Info */}
          {queueData?.patient && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">معلومات المريض</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">الاسم:</span>
                  <span className="font-medium text-gray-800 mr-2">
                    {queueData.patient.name || 'غير متوفر'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">العمر:</span>
                  <span className="font-medium text-gray-800 mr-2">
                    {queueData.patient.age || '-'}
                  </span>
                </div>
                {queueData.patient.gender && (
                  <div>
                    <span className="text-gray-600">الجنس:</span>
                    <span className="font-medium text-gray-800 mr-2">
                      {queueData.patient.gender === 'male' ? 'ذكر' : 'أنثى'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cancel Button */}
          <button
            onClick={handleCancelQueue}
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                جاري الإلغاء...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                مغادرة القائمة
              </>
            )}
          </button>
        </Card>

        {/* Information Box */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">ملاحظات هامة:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>سيتم تحديث موقعك في القائمة تلقائياً كل 10 ثواني</li>
                <li>عندما يحين دورك، سيتم توجيهك تلقائياً لغرفة الطبيب</li>
                <li>يرجى عدم إغلاق الصفحة أثناء الانتظار</li>
                <li>يمكنك إلغاء الحجز في أي وقت بالضغط على "مغادرة القائمة"</li>
              </ul>
            </div>
          </div>
        </div>

        
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}