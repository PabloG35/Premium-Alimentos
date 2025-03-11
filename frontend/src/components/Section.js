import React from 'react'

export default function Section({ children }) {
    return (
      <section className="relative w-full">
        {/* Content */}
        <div className="py-16">{children}</div>
  
        {/* Separator Line */}
        <div className="separator-line w-full mx-auto border-t border-gray-300"></div>
      </section>
    );
  }
  