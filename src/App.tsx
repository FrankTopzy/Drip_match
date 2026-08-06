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


function App() {
  const { isDark } = useDripmatch();
  useEffect(() => {
    AOS.init({
      duration: 1000,     // animation duration
      //once: true,        // whether animation should happen only once
      offset: 100,       // offset (px) from original trigger point
    });
  }, []);

  return (
    <div className={isDark ? '' : 'light-mode'}>
     <Header/>
     <Routes>
      <Route path="/" element={<Homepage/>}/>
      <Route path="/lab" element={<Laboratory/>}/>
      <Route path="/guide" element={<Guide/>}/>
      <Route path="/drafts" element={<Draft/>}/>
      <Route path="/settings" element={<Setting/>}/>
     </Routes>
    </div>
  )
}

export default App
