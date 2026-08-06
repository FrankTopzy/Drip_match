import { FaSun } from "react-icons/fa6"
import { useDripmatch } from "../Context";
import Styles from './header.module.css'
import { Link } from "react-router-dom";


function Header() {
  const { isDark, setIsDark } = useDripmatch();

  return (
    <div className={`flex justify-center bg-linear-to-r from-(--bg-color) from-10% via-(--bg-color2) via-70% to-(--bg-color3) to-95% fixed w-full lg:px-20 z-99`} data-aos="fade-down">
      <header className="flex justify-between items-center max-w-(--max-w) w-full py-5 text-(--text-color)">
        <Link to={'/'} className={`${Styles.logo} uppercase text-3xl`}>Dripmatch</Link>

        <div>
          <ul className={`${Styles.nav_list} flex gap-15`}>
            <Link to={'/'}>Home</Link>
            <Link to={'/lab'}>Laboratory</Link>
            <Link to={'/favorites'}>Favorites</Link>
            <Link to={'/drafts'}>[Drafts]</Link>
            <Link to={'/settings'}>Settings</Link>
          </ul>
        </div>

        <div>
          <button onClick={() => setIsDark(!isDark)}>
            <FaSun/>
          </button>
        </div>
      </header>
    </div>
  )
}

export default Header
