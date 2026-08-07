import { FaSun } from "react-icons/fa6"
import { useDripmatch } from "../Context";
import Styles from './header.module.css'
import { Link } from "react-router-dom";
import { useState } from "react";


function Header() {
  const { isDark, setIsDark } = useDripmatch();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  

  return (
    <div className={`flex justify-center bg-linear-to-r from-(--bg-color) from-10% via-(--bg-color2) via-70% to-(--bg-color3) to-95% fixed w-full lg:px-20 z-10`} data-aos="fade-down">
      <header className="flex justify-between items-center max-w-(--max-w) w-full px-5 md:px-0 py-5 text-(--text-color) relative">
        <Link to={'/'} className={`${Styles.logo} uppercase text-2xl md:text-3xl`}>Dripmatch</Link>

        <div className="hidden md:block">
          <ul className={`${Styles.nav_list} flex gap-15`}>
            <li><Link to={'/'}>Home</Link></li>
            <li><Link to={'/lab'}>Laboratory</Link></li>
            <li><Link to={'/favorites'}>Favorites</Link></li>
            <li><Link to={'/drafts'}>[Drafts]</Link></li>
            <li><Link to={'/settings'}>Settings</Link></li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setIsDark(!isDark)}>
            <FaSun/>
          </button>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-0 p-1">
            <span className={`block w-6 h-0.5 bg-zinc-800 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-zinc-800 transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-zinc-800 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {
          menuOpen && (
            <div className="absolute md:hidden bg-(--bg-color) h-screen left-0 top-full w-full z-50">
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
