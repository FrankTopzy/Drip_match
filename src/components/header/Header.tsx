import { FaSun } from "react-icons/fa6"
import { useDripmatch } from "../Context";


function Header() {
  const { isDark, setIsDark } = useDripmatch();

  return (
    <div className={`flex justify-center bg-linear-to-r from-(--bg-color) from-10% via-(--bg-color2) via-70% to-(--bg-color3) to-95% fixed w-full lg:px-20 z-99`} data-aos="fade-down">
      <header className="flex justify-between max-w-(--max-w) w-full py-5 text-(--text-color)">
        <div className="uppercase italic">Dripmatch</div>

        <div>
          <ul className="flex gap-15">
            <li>Home</li>
            <li>Guide</li>
            <li>Favorites</li>
            <li>Settings</li>
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
