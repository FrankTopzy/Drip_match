import { Route, Routes } from "react-router-dom";
import { useDripmatch } from "./components/Context"
import Header from "./components/header/Header"
import Homepage from "./pages/home/Homepage";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
import Laboratory from "./pages/lab/Laboratory";
import Setting from "./pages/settings/Setting";
import Draft from "./pages/drafts/Draft";
import Guide from "./pages/guide/Guide";
import Favorite from "./pages/favorites/Favorite";


function App() {
  const { isDark, menuOpen, setMenuOpen } = useDripmatch();

  useEffect(() => {
    AOS.init({
      duration: 1000,     // animation duration
      //once: true,        // whether animation should happen only once
      offset: 100,       // offset (px) from original trigger point
    });
  }, []);
  
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`${isDark ? '' : 'light-mode'}`}>
     <Header/>
     <Routes>
      <Route path="/" element={<Homepage/>}/>
      <Route path="/lab" element={<Laboratory/>}/>
      <Route path="/favorites" element={<Favorite/>}/>
      <Route path="/guide" element={<Guide/>}/>
      <Route path="/drafts" element={<Draft/>}/>
      <Route path="/settings" element={<Setting/>}/>
     </Routes>
    </div>
  )
}

export default App
