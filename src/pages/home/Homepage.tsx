import { Link } from 'react-router-dom'
import heroPic1 from '../../assets/heroPic1.png'
import heroFIt1 from '/garments/testFit1.jpg'
import { FaArrowRight, FaLink } from 'react-icons/fa6'

function Homepage() {
  return (
    <div className="min-h-screen xl:min-h-250 bg-radial-[at_50%_70%] from-black/70 via-(--bg-color3) to-(--bg-color) to-90% flex justify-center lg:px-20 overflow-hidden">
      <section className={`text-(--text-color) uppercase relative flex justify-between max-w-(--max-w) w-full pt-13 md:pt-24`}>
        <div className="flex flex-col justify-between py-15 xl:py-15">
          <p className='font-semibold text-4xl md:text-6xl px-5 md:px-0 text-center md:text-left md:w-50'
            data-aos="fade-right"
            data-aos-anchor="#example-anchor"
            data-aos-offset="500"
            data-aos-duration="500">
              Everyday Style <span className='md:hidden'>Made Seamless</span>
          </p>

          <div className='md:hidden group w-80 p-1 bg-(--bg-color2) self-center my-5' data-aos="flip-left">
            <div className='relative'>
              <div className='absolute bg-black/80 w-full h-0 justify-center items-center translate-y-full opacity-0 flex group-hover:translate-y-0 group-hover:opacity-100 transition-all group-hover:h-full'>
                <Link to={'/guide'} className='hover:underline'> 
                  <FaLink className='text-red-800 flex items-center w-full'/> 
                  <p className='normal-case text-[10px]'>Try Cloth</p>
                </Link>
              </div>

              <img src={heroFIt1} alt="" />
            </div>
          </div>
          
          <div className='text-center md:text-left'>
            <p className='normal-case md:w-110 px-5 md:px-0' >Try outfits on instantly and see how clothes look on you before you buy with our AI-powered virtual try-on experience.</p>
            <Link to="/lab" className="bg-red-800 px-4 py-2 mt-5 text-white uppercase inline-flex items-center gap-2 group">
              Go to Lab <FaArrowRight className='group-hover:translate-x-1 transition-all'/>
            </Link>
          </div>
        </div>

        <div className='opacity-0 md:opacity-100 absolute right-[30%] bottom-0 -z-1 md:z-1'>
          <img src={heroPic1} alt="" className='lg:w-130 xl:w-145' data-aos='flip-left'/>
        </div>

        <div className='hidden md:flex flex-col md:justify-end pb-5'>
          <p data-aos="fade-left"
          className='font-semibold text-3xl md:text-6xl mb-5'
            data-aos-anchor="#example-anchor"
            data-aos-offset="500"
            data-aos-duration="500">Made <br/> seamless
          </p>

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
          </div>
        </div>
      </section>
      
    </div>
  )
}

export default Homepage
