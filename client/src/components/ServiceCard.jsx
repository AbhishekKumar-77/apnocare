import React from 'react';
import {
  HeartHandshake,
  Stethoscope,
  Activity,
  ShieldPlus,
  Check,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

const iconMap = {
  HeartHandshake,
  Stethoscope,
  Activity,
  ShieldPlus,
};

export default function ServiceCard({ service, onSelect }) {
  const IconComponent = iconMap[service.icon] || HeartHandshake;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-300 border bg-white hover:-translate-y-1 hover:shadow-xl ${
        service.isPopular
          ? 'border-sky-300 ring-2 ring-sky-500/20 shadow-lg shadow-sky-500/5'
          : 'border-slate-200/80 hover:border-sky-200 shadow-xs'
      }`}
    >
      {service.isPopular && (
        <div className="absolute -top-3.5 right-6 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-sky-600 to-teal-500 text-white text-xs font-semibold shadow-md">
          <Sparkles className="w-3 h-3" />
          <span>Most Requested</span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="h-12 w-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
            {service.category}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
          {service.title}
        </h3>

        <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
          {service.description}
        </p>

        {service.pricePerDay && (
          <div className="mt-5 flex items-baseline gap-1 text-slate-900">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              ₹{service.pricePerDay}
            </span>
            <span className="text-xs font-medium text-slate-500">/ shift or day</span>
          </div>
        )}

        <div className="mt-6 border-t border-slate-100 pt-5 space-y-2.5">
          {service.features?.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600">
              <div className="h-4 w-4 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-4">
        <button
          onClick={() => onSelect(service)}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer bg-slate-100 text-slate-800 hover:bg-sky-600 hover:text-white group/btn"
        >
          <span>Request This Care</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
