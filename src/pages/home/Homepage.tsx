import { Link } from 'react-router-dom'
import heroPic1 from '../../assets/heroPic1.png'
import heroFIt1 from '/garments/testFit1.jpg'
import { FaArrowRight, FaLink } from 'react-icons/fa6'

function Homepage() {
  return (
    <div className="min-h-205 xl:min-h-250 bg-radial-[at_50%_70%] from-black/70 via-(--bg-color3) to-(--bg-color) to-90% flex justify-center lg:px-20 overflow-hidden">
      <section className={`text-(--text-color) uppercase relative flex justify-between max-w-(--max-w) w-full py-15`}>
        <div className="flex flex-col justify-between lg:py-5 xl:py-15">
          <h1 className='font-bold' data-aos="fade-right"
            data-aos-anchor="#example-anchor"
            data-aos-offset="500"
            data-aos-duration="500">
              Everyday <br/> Style
          </h1>
          
          <div>
            <p className='normal-case' >Try Outfits On Instantly See how clothes look on you before <br/> you buy with our AI-powered virtual try-on experience.</p>
            <Link to="/lab" className="bg-red-800 px-4 py-2 mt-7 text-white uppercase flex items-center gap-2 group">
              Go to Lab <FaArrowRight className='group-hover:translate-x-1 transition-all'/>
            </Link>
          </div>
        </div>

        <div className='absolute right-[30%] bottom-0'>
          <img src={heroPic1} alt="" className='lg:w-130 xl:w-150' data-aos='zoom-in-up'/>
        </div>

        <div className='flex flex-col justify-end pb-5'>
          <h1 data-aos="fade-left"
            data-aos-anchor="#example-anchor"
            data-aos-offset="500"
            data-aos-duration="500">Made <br/> seamless</h1>

          <div className='group w-50 p-2 bg-(--bg-color2) self-end' data-aos="zoom-in-left">
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
