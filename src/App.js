import { AppRoutes, Footer, Header } from "./components";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CursorGlow from "./components/CursorGlow";
import BootLoader from "./components/BootLoader";

function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isHackverse = location.pathname.startsWith('/hackverse');

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 600,
      offset: 80,
      easing: 'ease-out'
    });
    AOS.refresh();
  }, []);

  // Detect mobile screen to disable CursorGlow only on mobile
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    if (mq.addEventListener) mq.addEventListener('change', update);
    else if (mq.addListener) mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update);
      else if (mq.removeListener) mq.removeListener(update);
    };
  }, []);

  // Handle boot loader completion
  const handleBootComplete = () => {
    setIsLoading(false);
    // Small delay to ensure smooth transition
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <div className="font-manr bg-white font-courier-new dark:bg-dt-blue overflow-x-hidden">
      {/* Boot Loader - runs once on initial load */}
      {isLoading && <BootLoader onComplete={handleBootComplete} />}
      
      {/* Main app content - renders after boot */}
      {showContent && (
        <>
          {/* Show cursor glow only on non-mobile screens and non-hackverse pages */}
          {!isMobile && !isHackverse && <CursorGlow />}
          {!isHackverse && <Header/>}
          <AppRoutes/>
          {!isHackverse && <Footer/>}
        </>
      )}
    </div>
  );
}

export default App;
