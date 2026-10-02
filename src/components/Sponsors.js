import React from 'react';

export const SponsorCard = ({ name, logoUrl }) => {
  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-50 w-[90%] sm:w-[40%] border border-gray-300 dark:border-gray-600">
      {/* Sponsor Logo */}
      <div className="w-full flex justify-center">
        <img
          src={logoUrl}
          alt={name}
          className="h-50 object-cover rounded-lg"
          loading="lazy"
          decoding="async"
          onError={(e) => { e.currentTarget.src = '/event-images/placeholder.svg'; }}
        />
      </div>
      {/* Sponsor Name */}
      {/* 
      <div className="text-center">
        <h2 className="text-lg sm:text-xl font-bold text-dt-blue dark:text-white">{name}</h2>
      </div>
      */}
    </div>
  );
};