import { FaMoon, FaSun } from "react-icons/fa6"
import { useDripmatch } from "../Context";
import Styles from './header.module.css'
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

type IsActiveType = '' | 'lab' | 'favorites' | 'drafts' | 'settings';

function Header() {
  const { isDark, setIsDark, menuOpen, setMenuOpen } = useDripmatch();
  const [isActive, setIsActive] = useState<IsActiveType>('')
  const location = useLocation();
  
  useEffect(() => {
    const path = location.pathname.slice(1);

    if (
      path === '' ||
      path === 'lab' ||
      path === 'favorites' ||
      path === 'drafts' ||
      path === 'settings'
    ) {
      setIsActive(path);
    }

    //console.log(path);
  }, [location.pathname]);


  return (
    <div className={`flex justify-center pt-5 to-95% fixed w-full px-4 lg:px-20 z-99`} data-aos="fade-down">
      <header className="flex justify-between items-center max-w-(--max-w) w-full px-5 lg:px-9 py-2 text-(--text-color) relative bg-(--navbg-color) rounded-full backdrop-blur-xl border border-(--text-color)/20">
        <Link to={'/'} className={`${Styles.logo} uppercase text-2xl xl:text-3xl text-shadow-lg/30 hover:scale-105 transition-all`}><span className="text-4xl lg:text-5xl font-sans italic">D</span>ripmatch</Link>

        <div className="hidden md:block border border-slate-700 rounded-full px-3 py-3">
          <ul className={`${Styles.nav_list} flex gap-3 xl:gap-5`}>
            <li><Link to={'/'} onClick={() => setIsActive('')} className={`${isActive === '' && `${Styles.isActive}`}`}>Home</Link></li>

            <li><Link to={'/lab'} onClick={() => setIsActive('lab')} className={`${isActive === 'lab' && `${Styles.isActive}`}`}>Laboratory</Link></li>

            <li><Link to={'/favorites'} onClick={() => setIsActive('favorites')} className={`${isActive === 'favorites' && `${Styles.isActive}`}`}>Favorites</Link></li>

            <li><Link to={'/drafts'} onClick={() => setIsActive('drafts')} className={`${isActive === 'drafts' && `${Styles.isActive}`}`}>[Drafts]</Link></li>
            <li><Link to={'/settings'} onClick={() => setIsActive('settings')} className={`${isActive === 'settings' && `${Styles.isActive}`}`}>Settings</Link></li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setIsDark(!isDark)} className="text-md">
           {isDark ? (<FaSun/>) : (<FaMoon className=""/>)}
          </button>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-0 p-1">
            <span className={`block w-6 h-0.5 bg-zinc-800 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-zinc-800 transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-zinc-800 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {
          menuOpen && (
            <div className="absolute md:hidden bg-(--bg-color) h-screen left-0 top-full w-full z-50 mt-5">
              <ul className={`p-5 flex flex-col gap-15`}>
                <Link to={'/'} onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to={'/lab'} onClick={() => setMenuOpen(false)}>Laboratory</Link>
                <Link to={'/favorites'} onClick={() => setMenuOpen(false)}>Favorites</Link>
                <Link to={'/drafts'} onClick={() => setMenuOpen(false)}>[Drafts]</Link>
                <Link to={'/settings'} onClick={() => setMenuOpen(false)}>Settings</Link>
              </ul>
            </div>
          )
        }
      </header>
    </div>
  )
}

export default Header
