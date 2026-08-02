import { Route, Routes } from "react-router-dom";
import { useDripmatch } from "./components/Context"
import Header from "./components/header/Header"
import Homepage from "./pages/home/Homepage";


function App() {
  const { isDark } = useDripmatch();

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
