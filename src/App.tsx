import { Route, Routes } from "react-router-dom";
import { useDripmatch } from "./components/Context"
import Header from "./components/header/Header"
import Homepage from "./pages/home/Homepage";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";


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
     </Routes>
    </div>
  )
}

export default App
