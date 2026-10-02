import React from 'react'

export const Footer = () => {
    return (
        <footer
            className="relative z-50 bg-gradient-to-tr from-white/3 to-sky-50/2 dark:from-black/10 dark:to-[#041426]/30 pt-10 md:pt-12"
            style={{ paddingBottom: 'calc(clamp(2.5rem, 2.2rem + 1vw, 3rem) + env(safe-area-inset-bottom, 20px))' }}
        >
            <div className="mx-auto max-w-7xl px-6">
                <div className="bg-white/60 dark:bg-dt-blue/40 dark:bg-opacity-20 backdrop-blur-sm border border-white/10 dark:border-black/20 rounded-2xl shadow-lg p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-dt-blue dark:text-white">CSI WIET</div>
                                <div className="text-xs text-dt-blue/70 dark:text-white/70">Student Chapter • Watumull Institute</div>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-dt-blue/70 dark:text-white/60">© {new Date().getFullYear()} CSI-WIET. All rights reserved.</p>
                    </div>

                    {/* Center: institute info */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-full max-w-md flex items-center justify-center">
                            <div className="hidden md:block flex-1">
                                <svg width="100" height="2" viewBox="0 0 100 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 1H100" stroke="#60A5FA" strokeWidth="2" strokeDasharray="6 4"/>
                                </svg>
                            </div>
                            <div className="px-4">
                                <p className="text-sm font-medium text-dt-blue dark:text-white">A Student Body Chapter of</p>
                                <a 
                                    href="https://www.watumull.edu/2024/index.php" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="mt-1 inline-block text-base font-semibold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 transition"
                                >
                                    Watumull Institute of Engineering and Technology
                                </a>
                            </div>
                            <div className="hidden md:block flex-1">
                                <svg width="100" height="2" viewBox="0 0 100 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 1H100" stroke="#60A5FA" strokeWidth="2" strokeDasharray="6 4"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="flex items-center justify-center md:justify-end space-x-4">
                        <a href="https://www.linkedin.com/company/csi-wiet/" className="group">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white border border-white/10 shadow-sm hover:scale-105 transform transition">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="h-6 w-6 text-dt-blue group-hover:text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                            </div>
                        </a>
                        <a href="https://www.instagram.com/csi_wiet/" className="group">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white border border-white/10 shadow-sm hover:scale-105 transform transition">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6 text-dt-blue group-hover:text-pink-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </a>
                    </div>
                </div>
                <div className="mt-4 text-center text-xs text-dt-blue/60 dark:text-white/50">Designed with ♥ for the CSI community</div>
            </div>
        </footer>
    )
}

// import React from 'react'

// export const Footer = () => {
//     return (
//         <div className="bg-white bg-opacity-5 py-6 backdrop-blur-md dark:bg-dt-blue dark:bg-opacity-5 md:py-10 dark:shadow-2xl">
//             <div className="container flex flex-col items-center gap-y-2 text-dt-blue text-opacity-80 dark:text-white dark:text-opacity-40">
//                 <p>All rights reserved @CSI-WIET <span className="text-lt-blue text-opacity-80 dark:text-lt-blue dark:text-opacity-80">2023 - 2024 -present</span></p>
//                 <div className="mx-auto flex w-full max-w-[1200px] items-center justify-center gap-4">
//                     <svg width="292" height="12" viewBox="0 0 292 12" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M291.774 6L286 0.226497L280.226 6L286 11.7735L291.774 6ZM0 7L286 7V5L0 5V7Z" fill="#FFA2A2"/>
//                     </svg>
//                     <p className="text-center leading-7">A Student Body Chapter of<br className="block md:hidden"/><a href="https://www.watumull.edu/2024/index.php" target="_blank" rel="noreferrer" className="pl-2 text-lt-blue text-opacity-80 underline dark:text-dt-lavender dark:text-opacity-80">Watumull Institute of Engineering and Technology</a></p>
//                     <svg width="292" height="12" viewBox="0 0 292 12" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M0.226497 6L6 11.7735L11.7735 6L6 0.226497L0.226497 6ZM292 5H6V7H292V5Z" fill="#FFA2A2"/>
//                     </svg>
//                 </div>
//             </div>
//         </div>
//     )
// }
