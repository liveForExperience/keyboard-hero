import React from 'react';

export default function StatsCard({ icon, value, label }) {
  return (
    <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-105">
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-blue-600">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
