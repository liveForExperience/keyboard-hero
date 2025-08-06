import React from 'react';

export default function TextDisplay({ currentText, userInput }) {
  return (
    <div className="text-2xl leading-relaxed font-mono tracking-wide p-6 min-h-32 flex flex-wrap items-start gap-1 bg-slate-50 rounded-t-2xl">
      {currentText.split('').map((char, index) => {
        let className = 'transition-all duration-75';
        
        if (index < userInput.length) {
          if (userInput[index] === char) {
            className += ' text-green-600 bg-green-100 rounded px-0.5';
          } else {
            className += ' text-red-600 bg-red-100 rounded px-0.5';
          }
        } else if (index === userInput.length) {
          className += ' bg-blue-500 text-white rounded px-0.5 animate-pulse';
        } else {
          className += ' text-gray-400';
        }
        
        return (
          <span key={index} className={className}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </div>
  );
}
