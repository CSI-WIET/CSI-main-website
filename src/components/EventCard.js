import React from 'react';

export const EventCard = ({ title, description, date, imageUrl }) => {
  return (
    <div className="flex flex-col lg:flex-row bg-white dark:bg-gray-800 rounded-lg shadow-custom-top-bottom-strong overflow-hidden w-full p-4 sm:p-6" data-aos='slide-up' data-aos-duration="1200">
      <div className="lg:w-2/3 p-4 sm:p-6" data-aos="fade" data-aos-duration="1000">
        <h2 className="text-lg sm:text-xl font-bold text-dt-blue dark:text-white">{title}</h2>
        <p className="mt-2 text-sm sm:text-base text-dt-blue dark:text-white">{description}</p>
        <div className="mt-4 border-2 inline-block rounded border py-2 px-4 sm:py-4 sm:px-6 text-dt-blue bg-white dark:bg-dt-blue dark:border-lt-blue dark:border-opacity-10">
          <p className="text-sm sm:text-base text-dt-blue dark:text-white">Date: {date}</p>
        </div>
      </div>
      <div className="lg:w-1/3 mt-4 lg:mt-0 rounded-lg" data-aos="fade" data-aos-duration="1000">
        {/* Fixed aspect ratio to keep card heights consistent and avoid partial renders */}
        <div className="w-full aspect-[3/4] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to a lightweight placeholder if the image is missing or truncated on the server
              e.currentTarget.src = '/event-images/placeholder.svg';
            }}
          />
        </div>
      </div>
    </div>
  );
};
