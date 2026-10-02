// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; 

// export const DevelopersPage = () => {
//   const [selectedYear, setSelectedYear] = useState('2024-25');
//   const [developersdata, setDevelopersData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetch('/data/db.json') 
//       .then(response => response.json())
//       .then(data => {
//         if (data?.data?.devs) {
//           setDevelopersData(data.data.devs); 
//           console.log(data.data.devs); 
//           setIsLoading(false);
//         }
//       })
//       .catch(error => {
//         console.error("Error fetching data:", error);
//         setIsLoading(false);
//       });
//   }, []);

//   // Function to handle year button clicks
//   const handleYearClick = (year) => {
//     setSelectedYear(year);
//   };

//   // Get profiles based on selected year
//   const profiles = developersdata || [];
//   // In the future, this can be filtered by year when the data structure is updated
//   // const filteredProfiles = profiles.filter(profile => profile.year === selectedYear);
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-dt-blue">
//       <div className="container mx-auto px-4 py-12 lg:py-16">
//         <div className="py-10 px-4 md:px-10 md:pt-8">
//           {/* Header Section with Animation */}
//           <div className="flex items-center justify-center mb-8" data-aos="fade-down" data-aos-duration="800">
//             <svg width="91" height="12" viewBox="0 0 91 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
//               <path d="M0.226497 6L6 11.7735L11.7735 6L6 0.226497L0.226497 6ZM91 5H6V7H91V5Z" fill="#FFA2A2" />
//             </svg>
//             <p className="text-dt-blue dark:text-white text-3xl md:text-4xl font-bold capitalize tracking-wide mx-4 relative group">
//               Our Developer Members
//               <span className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
//             </p>
//             <svg width="91" height="12" viewBox="0 0 91 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
//               <path d="M90.7735 6L85 0.226497L79.2265 6L85 11.7735L90.7735 6ZM0 7L85 7V5L0 5V7Z" fill="#FFA2A2" />
//             </svg>
//           </div>
          
//           {/* Year Selector with Modern Styling */}
//           <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md mb-8 transform transition-all duration-300 hover:shadow-lg" data-aos="fade-up" data-aos-duration="800">
//             <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Select Academic Year</h3>
//             <div className="flex flex-wrap justify-center gap-4">
//               <button
//                 onClick={() => handleYearClick('2024-25')}
//                 className={`relative overflow-hidden font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 ${selectedYear === '2024-25' 
//                   ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md' 
//                   : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
//               >
//                 <span className="relative z-10">2024-25</span>
//                 {selectedYear === '2024-25' && (
//                   <span className="absolute inset-0 bg-blue-600 animate-pulse opacity-30"></span>
//                 )}
//               </button>
//               <button
//                 onClick={() => handleYearClick('2025-26')}
//                 className={`relative overflow-hidden font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 ${selectedYear === '2025-26' 
//                   ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md' 
//                   : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
//               >
//                 <span className="relative z-10">2025-26</span>
//                 {selectedYear === '2025-26' && (
//                   <span className="absolute inset-0 bg-blue-600 animate-pulse opacity-30"></span>
//                 )}
//               </button>
//             </div>
//           </div>
          
//           {/* Team Description with Animation */}
//           <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">
//             <p className="mt-2 text-dt-blue dark:text-white text-lg md:text-xl font-medium tracking-wide max-w-3xl mx-auto px-4">
//               We have proudly assigned developer members. Looking back, here are developer members of CSI!
//             </p>
//           </div>
          
//           {/* Loading State */}
//           {isLoading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : profiles.length === 0 || (selectedYear === '2025-26') ? (
//             <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md max-w-lg mx-auto" data-aos="fade-up">
//               <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
//               </svg>
//               <h3 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">No Developer Members Yet</h3>
//               <p className="mt-2 text-gray-600 dark:text-gray-400">Developer information for {selectedYear} will be added soon.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
//               {profiles.map((profile, index) => (
//                 <div 
//                   key={index} 
//                   className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl" 
//                   data-aos="fade-up" 
//                   data-aos-duration="800" 
//                   data-aos-delay={index * 100}
//                 >
//                   {/* Image Container with Overlay Effect */}
//                   <div className="relative overflow-hidden group h-80">
//                     <img 
//                       className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
//                       src={profile.image} 
//                       alt={profile.name} 
//                       loading="lazy"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
//                       <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
//                         <p className="text-sm font-light">{selectedYear} Developer Member</p>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Profile Info with Modern Layout */}
//                   <div className="p-6">
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1">
//                         <h2 className="text-xl font-bold text-dt-blue dark:text-white mb-1 transition-colors duration-300">{profile.name}</h2>
//                         <div className="h-0.5 w-16 bg-blue-500 mb-3 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
//                         <h3 className="text-md text-gray-600 dark:text-gray-300 font-medium">{profile.position}</h3>
//                       </div>
//                       <div className="flex space-x-2">
//                         <Link 
//                           to={profile.linkedin} 
//                           target="_blank" 
//                           rel="noopener noreferrer"
//                           className="bg-blue-50 dark:bg-gray-700 p-3 rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-blue-100 dark:hover:bg-gray-600"
//                           aria-label={`LinkedIn profile of ${profile.name}`}
//                         >
//                           <img
//                             src="https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg"
//                             alt="LinkedIn"
//                             className="w-6 h-6"
//                           />
//                         </Link>
//                         <Link 
//                           to={profile.github || "#"} 
//                           target="_blank" 
//                           rel="noopener noreferrer"
//                           className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-gray-200 dark:hover:bg-gray-600"
//                           aria-label={`GitHub profile of ${profile.name}`}
//                         >
//                           <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//                             <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5807 20.2772 21.0497 21.7437 19.0074C23.2101 16.965 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z" />
//                           </svg>
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
        
//         {/* Back to top button */}
//         <div className="fixed bottom-8 right-8 z-50">
//           <button 
//             onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
//             className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transform transition-transform hover:scale-110 focus:outline-none"
//             aria-label="Back to top"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import SpotlightGrid from '../components/SpotlightGrid';
import { useHtmlDark } from '../hooks/useHtmlDark';
import MemberCard from '../components/MemberCard';

export const DevelopersPage = () => {
  const [selectedYear, setSelectedYear] = useState('2025-26');
  // Changed initial state to an object to hold data by year
  const [developersdata, setDevelopersData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/data/db.json') 
      .then(response => response.json())
      .then(data => {
        // The fetch logic now expects an object for devs
        if (data?.data?.devs) {
          setDevelopersData(data.data.devs); 
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  // Function to handle year button clicks
  const handleYearClick = (year) => {
    setSelectedYear(year);
  };

  // Get profiles based on the selected year from the developersdata object
  const profiles = developersdata[selectedYear] || [];
  
  const isDark = useHtmlDark();

  return (
    <SpotlightGrid isDarkMode={isDark}>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="py-10 px-4 md:px-10 md:pt-8">
          {/* Premium header like Committee page (decorative dots + title) */}
          <div className="w-full flex flex-col items-center text-center mb-8">
              <div className="relative">
                <svg aria-hidden className="absolute -z-10 opacity-10 w-[420px] h-[120px] hidden md:block" viewBox="0 0 420 120" fill="none">
                  <defs>
                    <pattern id="dev-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="1" fill={isDark ? '#94a3b8' : '#cbd5e1'} />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dev-dots)" />
                </svg>

                <div className="flex items-center justify-center gap-4">
                  <span className={`text-cyan-400 font-mono text-xl tracking-wide select-none ${isDark ? 'opacity-90' : 'opacity-95'}`}>//</span>
                  <h1
                    className={`text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight bg-clip-text text-transparent`}
                    style={{
                      backgroundImage: isDark
                        ? 'linear-gradient(90deg,#ffffff, #94a3b8)'
                        : 'linear-gradient(90deg,#0f1724, #475569)'
                    }}
                  >
                    Meet Our Developers
                  </h1>
                </div>

                <p className={`mt-3 text-sm ${isDark ? 'text-slate-300/90' : 'text-slate-600'}`}>The council behind CSI-WIET — leading events and community efforts.</p>
              </div>

            {/* Year toggle pill matching Committee style */}
              <div className="mt-6 w-full flex justify-center">
              <div
                role="tablist"
                aria-label="Academic year toggle"
                className={`relative rounded-full px-1 py-1 flex items-center ${isDark ? 'bg-slate-900/60 border border-white/10' : 'bg-slate-200/60'} max-w-[420px] w-full`}
              >
                <div
                  aria-hidden
                  className={`absolute top-1 bottom-1 left-1 w-1/2 rounded-full transition-transform duration-300 ease-out ${isDark ? 'bg-slate-700 shadow-sm' : 'bg-white shadow-sm'}`}
                  style={{ transform: selectedYear === '2025-26' ? 'translateX(100%)' : 'translateX(0%)' }}
                />

                <button
                  role="tab"
                  aria-selected={selectedYear === '2024-25'}
                  onClick={() => handleYearClick('2024-25')}
                  className={`relative z-10 flex-1 text-center py-2 px-5 rounded-full text-sm font-medium ${selectedYear === '2024-25' ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-slate-300' : 'text-gray-500')}`}
                >
                  2024-25
                </button>

                <button
                  role="tab"
                  aria-selected={selectedYear === '2025-26'}
                  onClick={() => handleYearClick('2025-26')}
                  className={`relative z-10 flex-1 text-center py-2 px-5 rounded-full text-sm font-medium ${selectedYear === '2025-26' ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-slate-300' : 'text-gray-500')}`}
                >
                  2025-26
                </button>
              </div>
            </div>
          </div>

          {/* Neutral developer hero (centered, no committee photos) */}
          <div className="mb-8">
            <div className={`rounded-3xl p-8 shadow-md ${isDark ? 'bg-slate-900/40 border border-slate-800' : 'bg-gradient-to-r from-sky-50 to-white'}`}>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className={`text-3xl md:text-4xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Developer Team • {selectedYear}</h2>
                <p className={`mt-3 text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>This section highlights developer contributors and project maintainers. Profiles are shown below.</p>
                <div className="mt-6 flex justify-center">
                  {selectedYear === '2024-25' ? (
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-gray-700 text-slate-200' : 'bg-gray-100 text-gray-700'}`}>
                      <span className="text-sm font-medium">Deactivated</span>
                    </div>
                  ) : (
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-sky-600 text-white' : 'bg-sky-500 text-white'}`}>
                      <svg className="w-4 h-4 opacity-90" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : profiles.length === 0 ? (
            // Updated condition to dynamically check if profiles for the selected year exist
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md max-w-lg mx-auto" data-aos="fade-up">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">No Developer Members Yet</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Developer information for {selectedYear} will be added soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {profiles.map((profile, index) => (
                <div
                  key={index}
                  className="w-full max-w-sm"
                  data-aos="fade-up"
                  data-aos-duration="800"
                  data-aos-delay={index * 100}
                >
                  <MemberCard member={profile} isDarkMode={isDark} yearLabel={selectedYear} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Back to top button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transform transition-transform hover:scale-110 focus:outline-none"
            aria-label="Back to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
          </button>
        </div>
        </div>
      </div>
    </SpotlightGrid>
  )
}
