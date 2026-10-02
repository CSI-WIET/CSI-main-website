import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import lightLogo from "../assets/light_logo.jpg";
import darkLogo from "../assets/dark_logo.jpg";

export const Header = () => {
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Magnetic effect
  const magneticEffect = (e) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    element.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  };

  const resetMagnetic = (e) => {
    e.currentTarget.style.transform = "translate(0px, 0px)";
  };

  // Navbar link active/inactive classes
  const activeClasses =
    "ml-1 block py-2 px-3 text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-lt-blue relative after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-400 transition-all duration-200";
  const inactiveClasses =
    "ml-1 block py-2 px-3 text-sm font-medium text-dt-blue dark:text-gray-300 transition transform duration-200 hover:text-lt-blue hover:scale-105";

  // Icons
  const lightModeIcon = (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" strokeWidth="2">
      <path
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        className="fill-lt-blue stroke-lt-blue"
      />
      <path
        d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
        className="stroke-lt-blue"
      />
    </svg>
  );

  const darkModeIcon = (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path
        d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
        className="fill-white"
      />
    </svg>
  );

  // Effects
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
    // Update the CSS theme variable so the page background switches immediately.
    try {
      const bg = darkMode ? '#0f1724' : '#ffffff';
      document.documentElement.style.setProperty('--page-bg', bg);
      // fallback for environments that may not read the CSS variable immediately
      document.body.style.transition = 'background-color 220ms ease';
      document.body.style.backgroundColor = bg;
    } catch (e) {
      // ignore if document/body isn't available
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollPosition = document.documentElement.scrollTop;
      setScrollProgress(totalHeight ? (scrollPosition / totalHeight) * 100 : 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const closeMenu = () => setIsMobileMenuVisible(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/60 shadow-lg dark:bg-dt-blue/60 backdrop-blur-xl border-b border-white/20 dark:border-white/10 rounded-b-2xl transition-all duration-500">
        
        {/* Scroll Progress Bar (GPU-accelerated transform for smoothness) */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] w-full overflow-hidden pointer-events-none">
          <div
            aria-hidden
            className="origin-left transform-gpu h-full bg-gradient-to-r from-lt-blue to-blue-400 dark:from-blue-500 dark:to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style={{
              transform: `scaleX(${Math.max(0, Math.min(1, scrollProgress / 100))})`,
              transition: 'transform 120ms cubic-bezier(.2,.8,.2,1)',
              willChange: 'transform'
            }}
          />
        </div>

        <div className="max-w-screen-xl flex items-center justify-between mx-auto px-6 py-3">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3 hover:opacity-90 transition">
            <img
              src={darkMode ? darkLogo : lightLogo}
              alt="CSI Logo"
              className="h-10 md:h-12 w-auto rounded-md shadow-sm"
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {["/", "/events", "/hackverse", "/faculty", "/committee", "/devs"].map(
              (path, i) => (
                <NavLink
                  key={i}
                  to={path}
                  onMouseMove={magneticEffect}
                  onMouseLeave={resetMagnetic}
                  className={({ isActive }) =>
                    isActive ? activeClasses : inactiveClasses
                  }
                >
                  {["Home", "Events", "Hackathon", "Faculty", "Committee", "Devs"][i]}
                </NavLink>
              )
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            <button
              onMouseMove={magneticEffect}
              onMouseLeave={resetMagnetic}
              onClick={openModal}
              className="hidden md:inline-flex items-center gap-3 px-4 py-2 rounded-full text-white bg-gradient-to-r from-blue-500 to-cyan-400 shadow-md hover:scale-[1.02] transition"
            >
              <span className="text-sm font-medium">Contact Us</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
              className="p-2 w-10 h-10 rounded-xl bg-white/60 dark:bg-white/8 text-lt-blue dark:text-white shadow-sm hover:scale-105 transition flex items-center justify-center"
            >
              {darkMode ? darkModeIcon : lightModeIcon}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuVisible(!isMobileMenuVisible)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 bg-white/40 dark:bg-black/20 shadow-sm"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${isMobileMenuVisible ? "block" : "hidden"} md:hidden w-full bg-white/95 dark:bg-dt-blue/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700`}
        >
          <ul className="flex flex-col p-4 space-y-3">
            {["/", "/events", "/hackverse", "/faculty", "/committee", "/devs"].map(
              (path, i) => (
                <NavLink
                  key={i}
                  to={path}
                  className={({ isActive }) =>
                    isActive ? activeClasses : inactiveClasses
                  }
                  onClick={closeMenu}
                >
                  {["Home", "Events", "Hackathon", "Faculty", "Committee", "Devs"][i]}
                </NavLink>
              )
            )}

            <button
              onClick={openModal}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium shadow-md"
            >
              Contact Us
            </button>
          </ul>
        </div>
      </nav>

      {/* Contact Modal */}
      {modalOpen && (
        <>
          <div
            onClick={closeModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50"
          />

          <div className="fixed top-1/2 left-1/2 z-50 w-[90%] sm:w-[30rem] bg-white/95 dark:bg-dt-blue/95 p-6 rounded-2xl shadow-2xl transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 backdrop-blur-sm border border-white/20 dark:border-black/30">
            <h2 className="text-center text-2xl font-bold dark:text-white text-dt-blue">
              Contact Us
            </h2>
            <p className="text-center text-sm mb-4 dark:text-gray-300">
              We will get back to you soon.
            </p>

            <form
              className="space-y-5"
              method="POST"
              action="https://docs.google.com/forms/d/e/1FAIpQLSc7QrMUvbtkJUQDco2_Y0Aehl7TvbBcLYrgSa7Zh6SOvlaHDQ/formResponse"
            >
              <input
                className="w-full border-b-2 bg-transparent p-2 outline-none text-dt-blue dark:text-white focus:border-lt-blue"
                type="text"
                placeholder="Name"
                name="entry.2005620554"
              />
              <input
                className="w-full border-b-2 bg-transparent p-2 outline-none text-dt-blue dark:text-white focus:border-lt-blue"
                type="email"
                placeholder="Email"
                name="entry.1045781291"
              />
              <textarea
                className="w-full h-24 border-b-2 bg-transparent p-2 outline-none text-dt-blue dark:text-white focus:border-lt-blue"
                placeholder="Message"
                name="entry.1166974658"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-lt-blue text-white font-semibold hover:scale-[1.02] transition"
              >
                Submit
              </button>
            </form>

            <button
              type="button"
              className="absolute top-4 right-4 bg-lt-blue text-white p-1 rounded-full"
              onClick={closeModal}
            >
              ✕
            </button>
          </div>
        </>
      )}
    </>
  );
};
