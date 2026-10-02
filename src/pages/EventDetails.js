// // import React, { useState, useEffect } from 'react';
// // import { Link, useParams } from 'react-router-dom';

// // export const EventDetails = () => {
// //   const { eventYear, eventId } = useParams();
// //   const [event, setEvent] = useState(null);

// //   useEffect(() => {
// //     fetch('/data/db.json')
// //       .then(response => response.json())
// //       .then(data => {
// //         if (data?.data?.events?.[eventYear]) {
// //           const yearData = data.data.events[eventYear];
// //           const foundEvent = yearData.find(event => event.id === eventId);
// //           setEvent(foundEvent || null);
// //         }
// //       })
// //       .catch(error => console.error("Error fetching data:", error));
// //   }, [eventYear, eventId]);

// //   if (!event) {
// //     return <div>Event not found.</div>;
// //   }

// //   return (
// //     <div className="">
// //         <div className="container py-[24px] lg:py-[32px]">
// //         <div className="py-6 px-4 sm:px-6 md:px-8">
// //           <div className="flex flex-row items-center justify-start sm:justify-around text-center" >
// //             <div className="flex items-center justify-center mr-8">
// //               <Link to="/events">
// //                 <div className="group rounded-full bg-white p-1 border border-2 border-dt-blue hover:bg-lt-blue hover:border-lt-blue dark:bg-dt-blue dark:border-lt-blue dark:hover:bg-lt-blue">
// //                   <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
// //                     <path className="group-hover:stroke-white group-hover:fill-white dark:stroke-white dark:fill-white" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4"/>
// //                   </svg>
// //                 </div>
// //               </Link>
// //             </div>
// //             <div className="flex items-center justify-start sm:mr-52">
// //               <svg className="my-auto" width="70" height="12" viewBox="0 0 70 12" fill="none" xmlns="http://www.w3.org/2000/svg">
// //                 <path d="M0.226497 6L6 11.7735L11.7735 6L6 0.226497L0.226497 6ZM70 5H6V7H70V5Z" fill="#FFA2A2" />
// //               </svg>
// //               <p className="text-dt-blue dark:text-white text-2xl sm:text-3xl font-semibold capitalize tracking-wide mx-2 mt-0 md:mt-0">
// //                   {event.title}
// //               </p>
// //               <svg className="my-auto" width="70" height="12" viewBox="0 0 70 12" fill="none" xmlns="http://www.w3.org/2000/svg">
// //                   <path d="M69.7735 6L65 0.226497L59.2265 6L65 11.7735L69.7735 6ZM0 7L65 7V5L0 5V7Z" fill="#FFA2A2" />
// //               </svg>
// //             </div>

// //           </div>
// //           <div className="flex flex-col items-center mt-8 md:mt-12">
// //             <div className="flex flex-col md:flex-row items-center justify-start">
// //               <div className="w-full md:w-1/3 lg:w-1/4 rounded-lg mb-4 md:mb-0 md:ml-8" data-aos="fade" data-aos-duration="3000">
// //                 <img src={event.image} alt={event.title} className="w-full h-auto object-cover rounded-lg" />
// //               </div>
// //               {event.description && event.description.length > 0 && (
// //                 <div className="w-full md:w-2/3 lg:w-3/5 rounded-lg md:ml-10" data-aos="fade" data-aos-duration="3000">
// //                   {/* Conditional Buttons for Year 2024-25 and PDF Rules */ }
// //                   {/* 
// //                   {eventYear === '2024-25' && (event.registrationLink || event.rulesLink) && (
// //                    <div className="flex flex-col sm:flex-row justify-start items-center mb-8 sm:px-20 lg:px-40 space-y-8 sm:space-y-0 sm:space-x-8">
// //                       {event.registrationLink && (
// //                         <a
// //                           href={event.registrationLink}
// //                           target="_blank"
// //                           rel="noopener noreferrer"
// //                           className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-300 text-center"
// //                         >
// //                           REGISTER 📌
// //                         </a>
// //                       )}

// //                       {event.rulesLink && (
// //                         <a
/* Removed duplicate legacy EventDetails component block to avoid redeclaration and keep a single modern component below */
//                       {event.details.map((detail, index) => (
//                         <li key={index} className="flex items-center text-lg">
//                           <svg className="mr-2" width="38" height="12" viewBox="0 0 38 12" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M26.6667 6C26.6667 8.94552 29.0545 11.3333 32 11.3333C34.9455 11.3333 37.3333 8.94552 37.3333 6C37.3333 3.05448 34.9455 0.666667 32 0.666667C29.0545 0.666667 26.6667 3.05448 26.6667 6ZM0 7H32V5H0V7Z" fill="#FFA2A2"/>
//                           </svg>
//                           <span>{detail}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   )}

//                   {/* 3. ADDED THE NEW RULEBOOK BUTTON HERE */}
//                   <div className="mt-8">
//     <a
//       // Use the dynamic link from your JSON data
//       href={event.rulebookPdf}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="inline-flex items-center justify-center py-2 px-4 border border-dt-blue dark:border-lt-blue rounded-lg text-dt-blue dark:text-lt-blue font-semibold transition-colors duration-300 hover:bg-dt-blue hover:text-white dark:hover:bg-lt-blue dark:hover:text-dt-blue"
//     >
//       <FileText className="w-5 h-5 mr-2" />
//       <span>View Rulebook</span>
//     </a>
//   </div>

//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {event.images && event.images.length > 0 && (
//           <div className="mt-12 py-6 px-4 sm:px-6 md:px-8 bg-white dark:bg-gray-800/20 rounded-xl shadow-lg">
//             <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left">
//               <svg width="91" height="12" viewBox="0 0 91 12" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M0.226497 6L6 11.7735L11.7735 6L6 0.226497L0.226497 6ZM91 5H6V7H91V5Z" fill="#FFA2A2" />
//               </svg>
//               <p className="text-dt-blue dark:text-white text-2xl sm:text-3xl font-semibold capitalize tracking-wide mx-4 mt-4 md:mt-0">
//                 {event.title} {'(Images)'}
//               </p>
//               <svg width="91" height="12" viewBox="0 0 91 12" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M90.7735 6L85 0.226497L79.2265 6L85 11.7735L90.7735 6ZM0 7L85 7V5L0 5V7Z" fill="#FFA2A2" />
//               </svg>
//             </div>
//             <div className="flex flex-col items-center mt-8">
//               <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {event.images.map((image, index) => (
//                   <img key={index} src={image} alt={`Event ${event.name}`} className="w-full h-auto rounded-lg shadow-md" data-aos="fade-up" data-aos-duration="1500" />
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//         {event.videos && event.videos.length > 0 && (
//           <div className="mt-12 py-6 px-4 sm:px-6 md:px-8 bg-white dark:bg-gray-800/20 rounded-xl shadow-lg">
//             <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left">
//               <svg width="91" height="12" viewBox="0 0 91 12" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M0.226497 6L6 11.7735L11.7735 6L6 0.226497L0.226497 6ZM91 5H6V7H91V5Z" fill="#FFA2A2" />
//               </svg>
//               <p className="text-dt-blue dark:text-white text-2xl sm:text-3xl font-semibold capitalize tracking-wide mx-4 mt-4 md:mt-0">
//                 {event.title} {'(Videos)'}
//               </p>
//               <svg width="91" height="12" viewBox="0 0 91 12" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M90.7735 6L85 0.226497L79.2265 6L85 11.7735L90.7735 6ZM0 7L85 7V5L0 5V7Z" fill="#FFA2A2" />
//               </svg>
//             </div>
//             <div className="flex flex-col items-center mt-8">
//               <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {event.videos.map((video, index) => (
//                   <video controls className="w-full h-auto rounded-lg shadow-md" data-aos="fade-up" data-aos-duration="2000" src={video} key={index}></video>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
// 1. IMPORT THE NEW ICON FOR THE REGISTER BUTTON
import { FileText, ClipboardPenLine } from 'lucide-react';
import { motion } from 'framer-motion';

export const EventDetails = () => {
  const { eventYear, eventId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch('/data/db.json')
      .then(response => response.json())
      .then(data => {
        if (data?.data?.events?.[eventYear]) {
          const yearData = data.data.events[eventYear];
          const foundEvent = yearData.find(event => event.id === eventId);
          setEvent(foundEvent || null);
        }
      })
      .catch(error => console.error("Error fetching data:", error));
  }, [eventYear, eventId]);

  if (!event) {
    return <div>Event not found.</div>;
  }

  return (
    <div className="">
      <div className="container py-[24px] lg:py-[32px]">
        {/* Ambient tech glow */}
        <div className="relative mx-auto max-w-7xl">
          <div className="absolute -inset-8 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-indigo-500/10 blur-3xl rounded-3xl pointer-events-none" aria-hidden />
        </div>

        <motion.div
          className="relative bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-24px_rgba(0,0,0,0.35)] border border-slate-200/70 dark:border-white/10 mx-auto max-w-7xl min-h-[520px] md:min-h-[580px] lg:min-h-[620px] p-6 sm:p-8 md:p-10 overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {/* subtle grid */}
          <div className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-25" aria-hidden
            style={{
              backgroundImage:
                'linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.12) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-cyan-500/5 dark:from-white/5 dark:via-transparent dark:to-cyan-500/10" aria-hidden />

          <div className="flex flex-row items-center justify-start sm:justify-around text-center" >
            <div className="flex items-center justify-center mr-8">
              <Link to={`/events?year=${eventYear}`}>
                <div className="group rounded-full bg-white p-1 border-2 border-dt-blue hover:bg-lt-blue hover:border-lt-blue dark:bg-dt-blue dark:border-lt-blue dark:hover:bg-lt-blue">
                  <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path className="group-hover:stroke-white group-hover:fill-white dark:stroke-white dark:fill-white" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4"/>
                  </svg>
                </div>
              </Link>
            </div>
            <div className="flex items-center justify-start sm:mr-52">
              <svg className="my-auto" width="70" height="12" viewBox="0 0 70 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.226497 6L6 11.7735L11.7735 6L6 0.226497L0.226497 6ZM70 5H6V7H70V5Z" fill="#FFA2A2" />
              </svg>
              <p className="text-dt-blue dark:text-white text-2xl sm:text-3xl font-semibold capitalize tracking-wide mx-2 mt-0 md:mt-0">
                  {event.title}
              </p>
              <svg className="my-auto" width="70" height="12" viewBox="0 0 70 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M69.7735 6L65 0.226497L59.2265 6L65 11.7735L69.7735 6ZM0 7L65 7V5L0 5V7Z" fill="#FFA2A2" />
              </svg>
            </div>
          </div>
          <motion.div className="flex flex-col items-center mt-8 md:mt-12" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <div className="flex flex-col md:flex-row items-start justify-start gap-8">
              <div className="w-full md:w-2/5 lg:w-2/5 rounded-lg md:ml-4">
                <motion.div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-cyan-500/20 dark:border-cyan-400/25 bg-slate-100/80 dark:bg-slate-800/70 shadow-[0_10px_40px_-18px_rgba(6,182,212,0.45)]" whileHover={{ scale: 1.015 }} transition={{ type: 'spring', stiffness: 220, damping: 24 }}>
                  <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-contain p-3" />
                  {/* scanning line over poster */}
                  <motion.div
                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_16px_rgba(34,211,238,0.6)]"
                    initial={{ top: '0%', opacity: 0 }}
                    animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                  />
                  {/* corner brackets */}
                  <div className="absolute inset-0 pointer-events-none">
                    <motion.div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-400/0" animate={{ width: '32px', height: '32px', borderColor: 'rgba(34,211,238,0.85)' }} transition={{ duration: 0.3 }} />
                    <motion.div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyan-400/0" animate={{ width: '32px', height: '32px', borderColor: 'rgba(34,211,238,0.85)' }} transition={{ duration: 0.3 }} />
                    <motion.div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyan-400/0" animate={{ width: '32px', height: '32px', borderColor: 'rgba(34,211,238,0.85)' }} transition={{ duration: 0.3 }} />
                    <motion.div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-400/0" animate={{ width: '32px', height: '32px', borderColor: 'rgba(34,211,238,0.85)' }} transition={{ duration: 0.3 }} />
                  </div>
                </motion.div>
              </div>
              {event.description && event.description.length > 0 && (
                <div className="w-full md:w-2/3 lg:w-3/5 rounded-lg md:ml-10" data-aos="fade" data-aos-duration="3000">
                  <h2 className="text-2xl sm:text-3xl font-bold text-dt-blue dark:text-white">What is <span className="text-lt-blue">{event.title}?</span></h2>
                  <p className="mt-4 text-lg sm:text-xl text-dt-blue dark:text-white leading-relaxed">{event.description}</p>
                  {event.details && event.details.length > 0 && (
                    <ul className="mt-4 space-y-2 text-dt-blue dark:text-white" data-aos="fade" data-aos-duration="2000">
                      {event.details.map((detail, index) => (
                        <li key={index} className="flex items-center text-lg">
                          <svg className="mr-2" width="38" height="12" viewBox="0 0 38 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M26.6667 6C26.6667 8.94552 29.0545 11.3333 32 11.3333C34.9455 11.3333 37.3333 8.94552 37.3333 6C37.3333 3.05448 34.9455 0.666667 32 0.666667C29.0545 0.666667 26.6667 3.05448 26.6667 6ZM0 7H32V5H0V7Z" fill="#FFA2A2"/>
                          </svg>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* 2. UPDATED BUTTONS SECTION */}
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    {/* Register Button */}
                    {event.registrationLink && (
                       <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-[1.03]"
                      >
                        <ClipboardPenLine className="w-5 h-5 mr-2" />
                        <span>Register Now</span>
                      </a>
                    )}

                    {/* Rulebook Button */}
                    {event.rulebookPdf && (
                      <a
                        href={event.rulebookPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center py-2 px-4 border border-cyan-500/60 dark:border-cyan-400/60 rounded-lg text-cyan-700 dark:text-cyan-200 font-semibold transition-all duration-300 hover:bg-cyan-500 hover:text-white hover:shadow-lg"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        <span>View Rulebook</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Media sections */}
        {event.images && event.images.length > 0 && (
          <motion.section className="mt-10 bg-white/95 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200/60 dark:border-white/10 p-4 sm:p-6 md:p-8" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Images</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.images.map((image, index) => (
                <motion.div key={index} className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-cyan-500/20 dark:border-cyan-400/20 bg-slate-100/80 dark:bg-slate-800/70" initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.02 }} viewport={{ once: true }} transition={{ duration: 0.25 }}>
                  <img src={image} alt={`${event.title} image ${index+1}`} className="absolute inset-0 w-full h-full object-contain p-2" loading="lazy" />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {event.videos && event.videos.length > 0 && (
          <motion.section className="mt-10 bg-white/95 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200/60 dark:border-white/10 p-4 sm:p-6 md:p-8" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Videos</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.videos.map((video, index) => (
                <motion.div key={index} className="relative w-full aspect-video rounded-xl overflow-hidden border border-cyan-500/20 dark:border-cyan-400/20 bg-slate-100/80 dark:bg-slate-800/70" initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.02 }} viewport={{ once: true }} transition={{ duration: 0.25 }}>
                  <video controls className="absolute inset-0 w-full h-full" src={video} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

      </div>
    </div>
  );
};