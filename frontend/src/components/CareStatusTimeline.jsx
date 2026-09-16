import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  MapPin, 
  FileText, 
  UserCheck, 
  Stethoscope, 
  Pill, 
  Home, 
  Car, 
  Building2,
  CalendarCheck
} from 'lucide-react';

export const CARE_STAGES = [
  { key: 'requested', label: 'Request Created', icon: CalendarCheck },
  { key: 'assigned', label: 'Associate Assigned', icon: UserCheck },
  { key: 'accepted', label: 'Assignment Accepted', icon: CheckCircle2 },
  { key: 'on_the_way', label: 'Associate On The Way', icon: Car },
  { key: 'reached_home', label: "Reached Patient's Home", icon: Home },
  { key: 'patient_picked_up', label: 'Patient Accompanied', icon: UserCheck },
  { key: 'reached_hospital', label: 'Reached Hospital / Clinic', icon: Building2 },
  { key: 'registration_done', label: 'Registration Done', icon: FileText },
  { key: 'consultation_done', label: 'Doctor Consultation', icon: Stethoscope },
  { key: 'tests_coordinated', label: 'Diagnostic Tests Coordinated', icon: FileText },
  { key: 'prescription_received', label: 'Prescription Uploaded', icon: FileText },
  { key: 'medicine_coordinated', label: 'Medicines Coordinated', icon: Pill },
  { key: 'returning_home', label: 'Returning Home', icon: Car },
  { key: 'reached_home_safe', label: 'Patient Reached Home Safely', icon: Home },
  { key: 'completed', label: 'Visit Completed', icon: CheckCircle2 },
];

export default function CareStatusTimeline({ careRequest }) {
  if (!careRequest) return null;

  const currentStatus = careRequest.status || 'requested';
  const timelineEntries = careRequest.timeline || [];
  
  const currentStageIndex = CARE_STAGES.findIndex(s => s.key === currentStatus);
  const activeIndex = currentStageIndex === -1 ? 0 : currentStageIndex;

  const getTimelineDetails = (stageKey) => {
    return timelineEntries.find(t => t.stage === stageKey);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
      
      {/* Header with Representative profile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-700 text-xs font-bold rounded-full uppercase tracking-wider">
              {careRequest.service_type || 'Care Assistance'}
            </span>
            <span className="text-xs text-slate-400">ID: {careRequest.request_code}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Care Assistance for {careRequest.patient_name} ({careRequest.patient_relation})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
            {careRequest.pickup_address}
          </p>
        </div>

        {/* Matched Representative Card */}
        {careRequest.representative_name && (
          <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <img 
              src={careRequest.representative_photo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"} 
              alt={careRequest.representative_name}
              className="w-12 h-12 rounded-xl object-cover border border-teal-200"
            />
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-slate-900">{careRequest.representative_name}</span>
                <span className="px-1.5 py-0.2 bg-teal-600 text-[10px] font-semibold text-white rounded-md">
                  ★ {careRequest.representative_rating || 4.9}
                </span>
              </div>
              <p className="text-[11px] text-teal-700 font-medium">Verified Care Associate</p>
              <p className="text-[11px] text-slate-500">{careRequest.representative_phone || '+91 98722 34567'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress Stepper Log */}
      <div className="mt-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Real-Time Visit Timeline
        </h4>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:top-3 before:bottom-3 before:left-3 sm:before:left-4 before:w-0.5 before:bg-slate-200">
          {CARE_STAGES.map((stage, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const isPending = idx > activeIndex;
            const details = getTimelineDetails(stage.key);

            return (
              <div key={stage.key} className="relative group">
                
                {/* Milestone Node */}
                <div 
                  className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all ${
                    isCompleted 
                      ? 'bg-teal-600 text-white shadow-xs' 
                      : isCurrent 
                        ? 'bg-teal-500 text-white ring-4 ring-teal-100 animate-pulse' 
                        : 'bg-white border-2 border-slate-300 text-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Milestone Content */}
                <div className={`transition-opacity ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <span className={`text-xs font-bold ${isCurrent ? 'text-teal-700 text-sm' : isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
                      {stage.label}
                    </span>
                    {details?.timestamp && (
                      <span className="text-[11px] text-slate-400 flex items-center mt-0.5 sm:mt-0">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(details.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  {details?.notes && (
                    <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                      "{details.notes}"
                    </p>
                  )}

                  {/* Optional Document Attachment Thumbnail */}
                  {details?.attachment && (
                    <div className="mt-2 inline-flex items-center space-x-2 p-2 bg-teal-50/60 border border-teal-200/60 rounded-xl text-xs text-teal-800">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <span className="font-semibold">{details.attachment.title}</span>
                      <a 
                        href={details.attachment.file_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-teal-600 hover:underline font-bold text-[11px] ml-1"
                      >
                        View
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Uploaded Documents Gallery */}
      {careRequest.uploaded_documents?.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Documents Collected During Visit ({careRequest.uploaded_documents.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {careRequest.uploaded_documents.map((doc, idx) => (
              <a 
                key={idx} 
                href={doc.file_url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center space-x-3 p-3 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-2xl transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <h5 className="text-xs font-bold text-slate-900 truncate group-hover:text-teal-700">{doc.title}</h5>
                  <p className="text-[11px] text-slate-400">{doc.type} • Uploaded by Associate</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
