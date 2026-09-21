import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api/client';
import { 
  Bot, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  AlertTriangle, 
  Calendar, 
  HeartHandshake, 
  Search, 
  PhoneCall, 
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export default function FloatingAskApnoCare({ onTriggerAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Namaste! I am **Ask ApnoCare**, your family healthcare navigator.\n\nHow can I assist you or your family members today?",
      action: null,
      is_emergency: false
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [emergencyModal, setEmergencyModal] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Web Speech API for real voice recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Also understands Hinglish / Hindi

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if ((!message.trim() && !selectedFile) || loading) return;

    const userText = message.trim();
    const userMsg = {
      sender: 'user',
      text: userText || (selectedFile ? `Uploaded document: ${selectedFile.name}` : ''),
      file: selectedFile ? selectedFile.name : null
    };

    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    const fileToUpload = selectedFile;
    setSelectedFile(null);

    try {
      const res = await api.askAI({
        message: userText,
        report_text: fileToUpload ? `Document Analysis: ${fileToUpload.name}. Blood test / prescription document review requested.` : ''
      });

      if (res.is_emergency) {
        setEmergencyModal(res.action);
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: res.reply,
          action: res.action,
          is_emergency: res.is_emergency
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "I apologize, but I am momentarily experiencing connectivity difficulties. How else may I assist your family?",
          action: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action) => {
    if (onTriggerAction) {
      onTriggerAction(action);
    }
  };

  const quickPrompts = [
    "Book a doctor for Mom tomorrow morning",
    "Arrange care representative to take Dad to hospital",
    "Find a cardiologist in Jalandhar",
    "Explain this CBC blood test report"
  ];

  return (
    <>
      {/* Persistent Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center space-x-3 px-5 py-3.5 bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white rounded-full shadow-2xl hover:shadow-teal-600/40 border border-teal-400/30 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
            title="Ask ApnoCare AI Assistant"
          >
            {/* Ambient Pulse Ring */}
            <span className="absolute -inset-1 rounded-full bg-teal-500/25 animate-pulse-ring -z-10 pointer-events-none"></span>
            
            <div className="relative">
              <Bot className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold tracking-wide uppercase block font-heading">Ask ApnoCare</span>
              <span className="text-[10px] text-teal-100 font-medium">AI Healthcare Navigator</span>
            </div>
          </button>
        )}
      </div>

      {/* Expandable Conversational Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-105 max-h-[85vh] h-[640px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-700 to-teal-800 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm leading-tight">Ask ApnoCare</h3>
                  <span className="px-2 py-0.5 bg-white/20 text-[9px] font-semibold tracking-wider rounded-full uppercase">
                    AI Assistant
                  </span>
                </div>
                <p className="text-[11px] text-teal-100/90">Connects intent to real healthcare actions</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/15 transition text-teal-100 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Emergency Alert Banner */}
                {m.is_emergency && (
                  <div className="mb-2 p-3 bg-rose-50 border border-rose-300 rounded-2xl flex items-start space-x-2 text-rose-900 w-full shadow-xs">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-rose-700">Urgent Safety Warning</p>
                      <p className="text-[11px] text-rose-600 mt-0.5">Please dial 108 immediately if patient is in critical distress.</p>
                    </div>
                  </div>
                )}

                <div 
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">
                    {m.text}
                  </div>
                </div>

                {/* Platform Action Dispatch Card */}
                {m.action && m.action.type !== 'EMERGENCY_TRIAGE' && (
                  <div className="mt-2 w-[88%] bg-white rounded-2xl p-3.5 border-2 border-teal-500/30 shadow-md">
                    <div className="flex items-center space-x-2 text-teal-700 font-semibold text-xs mb-1.5">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span>Suggested Platform Action</span>
                    </div>

                    {m.action.type === 'BOOK_APPOINTMENT' && (
                      <div className="text-[11px] text-slate-600 mb-2">
                        <p><strong>Doctor:</strong> {m.action.parameters?.doctor_name}</p>
                        <p><strong>Patient:</strong> {m.action.parameters?.patient_name}</p>
                        <p><strong>Suggested Slot:</strong> {m.action.parameters?.appointment_date} at {m.action.parameters?.appointment_time}</p>
                      </div>
                    )}

                    {m.action.type === 'REQUEST_CARE' && (
                      <div className="text-[11px] text-slate-600 mb-2">
                        <p><strong>Service:</strong> {m.action.parameters?.service_type}</p>
                        <p><strong>Patient:</strong> {m.action.parameters?.patient_name}</p>
                        <p><strong>Pickup:</strong> {m.action.parameters?.location}</p>
                      </div>
                    )}

                    <button
                      onClick={() => handleActionClick(m.action)}
                      className="w-full mt-1 flex items-center justify-center space-x-2 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                    >
                      <span>{m.action.action_label || 'Proceed with Action'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 p-3 bg-white border border-slate-200 rounded-2xl w-28 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Pills */}
          {messages.length < 3 && (
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => setMessage(qp)}
                  className="whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 rounded-full font-medium transition"
                >
                  {qp}
                </button>
              ))}
            </div>
          )}

          {/* Selected File Chip */}
          {selectedFile && (
            <div className="px-4 py-1.5 bg-teal-50 border-t border-teal-100 flex items-center justify-between text-xs text-teal-800">
              <span className="truncate max-w-[240px]">📎 {selectedFile.name}</span>
              <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-rose-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200">
            <div className="flex items-center space-x-2 bg-slate-100 rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-teal-500/40 transition">
              
              {/* File / Prescription attachment */}
              <label className="cursor-pointer p-1.5 text-slate-500 hover:text-teal-700 rounded-lg hover:bg-slate-200/60 transition">
                <Paperclip className="w-4 h-4" />
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  className="hidden" 
                  onChange={(e) => setSelectedFile(e.target.files[0])} 
                />
              </label>

              {/* Text Input */}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isListening ? "Listening... Speak now" : "Ask or speak (English, Hindi, Punjabi)..."}
                className="flex-1 bg-transparent border-none focus:outline-none text-xs text-slate-800 placeholder-slate-400 py-1.5"
              />

              {/* Voice Microphone Toggle */}
              <button
                type="button"
                onClick={toggleVoice}
                className={`p-1.5 rounded-lg transition ${
                  isListening 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'text-slate-500 hover:text-teal-700 hover:bg-slate-200/60'
                }`}
                title={isListening ? "Stop listening" : "Voice AI: Speak your request"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={(!message.trim() && !selectedFile) || loading}
                className="p-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl transition shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Emergency Modal Triage */}
      {emergencyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border-4 border-rose-500 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-7 h-7 animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Critical Medical Emergency Guidance</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              If the patient has collapsed, has severe chest pain, or is unresponsive, please summon immediate emergency ambulance personnel:
            </p>

            <div className="mt-4 space-y-2">
              <a 
                href="tel:108" 
                className="flex items-center justify-between p-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-sm shadow-md transition"
              >
                <div className="flex items-center space-x-2">
                  <PhoneCall className="w-5 h-5" />
                  <span>Call Emergency Ambulance</span>
                </div>
                <span className="text-lg">108</span>
              </a>

              <a 
                href="tel:112" 
                className="flex items-center justify-between p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-semibold text-xs transition"
              >
                <span>National Emergency Number</span>
                <span className="font-bold">112</span>
              </a>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-left">
              <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Nearby 24/7 Trauma Centers</p>
              <div className="space-y-1.5 text-xs text-slate-600">
                {emergencyModal.nearby_emergency_hospitals?.map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="font-medium text-slate-900">{h.name}</span>
                    <a href={`tel:${h.phone}`} className="text-teal-700 font-bold hover:underline">
                      {h.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setEmergencyModal(null)}
              className="mt-5 w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              Dismiss Emergency Guidance
            </button>
          </div>
        </div>
      )}
    </>
  );
}
