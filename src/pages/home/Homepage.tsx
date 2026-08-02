import { Link } from 'react-router-dom'
import heroPic1 from '../../assets/heroPic1.png'
import heroFIt1 from '../../assets/testFit1.jpg'
import { FaLink } from 'react-icons/fa6'

function Homepage() {
  return (
    <div className="min-h-235 bg-radial-[at_50%_70%] from-black/70 via-(--bg-color3) to-(--bg-color) to-90% flex justify-center">
      <section className={`text-(--text-color) uppercase relative flex justify-between max-w-(--max-w) w-full`}>
        <div className="flex flex-col justify-between py-30">
          <h1 className='font-bold'>Everyday <br/> Style</h1>
          
          <div>
            <p className='normal-case'>Discover elevated essentials and trend <br/> peices crafted to fit your lifestyle</p>
            <button className="bg-red-800 px-4 py-2 mt-7 text-white">Explore Collection</button>
          </div>
        </div>

        <div className='absolute right-[25%] bottom-0'>
          <img src={heroPic1} alt="" width={600}/>
        </div>

        <div className='flex flex-col justify-end pb-5'>
          <h1>Made <br/> seamleass</h1>

          <div className='group w-50 p-2 bg-(--bg-color2) self-end'>
            <div className='relative'>
              <div className='absolute bg-black/80 w-full h-0 justify-center items-center translate-y-full opacity-0 flex group-hover:translate-y-0 group-hover:opacity-100 transition-all group-hover:h-full'>
                <Link to={'/guide'} className='hover:underline'> 
                  <FaLink className='text-red-800 flex items-center w-full'/> 
                  <p className='normal-case text-[10px]'>Try Cloth</p>
                </Link>
              </div>

              <img src={heroFIt1} alt="" />
            </div>

            <div>
              <p>Casual Polo Shirt</p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  )
}

export default Homepage
