import React from 'react'
import Link from 'next/link'
import { CONSTANTS } from '@/config'
import DateUtils from '@/utils/DateUtils'
import Typewriter from 'typewriter-effect'
import { BsArrowRight } from 'react-icons/bs';



const HeroSection = () => {

    return (
        <section className='space-y-6 mb-10 md:my-16'>
          <div className='flex flex-col-reverse gap-8 md:flex-row md:justify-between'>
            <div className='space-y-4 md:max-w-lg'>

              <h1 className="pb-6 text-3xl font-extrabold leading-9 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 flex md:inline-block gap-2">
                Hi, I am <span className="text-primary">
                  <Typewriter
                    options={{
                      strings: ['Pasquale' , 'Musician', 'Engineer'],
                      autoStart: true,
                      loop: true,
                    }}
                  />
                </span>
                </h1>
              <h2 className='text-lg font-medium text-primary'>
                {DateUtils.calculateAge()} yrs • Musician • Full-stack Developer
              </h2>
              <p className='text-lg'>
              Welcome to my full stack developer portfolio! <br/>
              I am a highly passionated for creating web and mobile applications.           
              Let&apos;s work together to bring your ideas to life and create an exceptional product.
              </p>
              <a className="link link-primary text-xl group" aria-label="Email to pasquale.favella@gmail.com" title="Email to pasquale.favella@gmail.com" href="mailto:pasquale.favella@gmail.com">
                <span className='flex items-center gap-x-1'>Get in touch <BsArrowRight className='h-4 w-4 transition duration-200 group-hover:translate-x-1' /></span>
              </a>
            </div>
            <div >
                <div className="mockup-code">
                    <pre data-prefix="$"><code>npm i fullstack</code></pre> 
                    <pre data-prefix=">" className="text-warning"><code>installing...</code></pre> 
                    <pre data-prefix=">" className="text-success"><code>Done!</code></pre>
                </div>
            </div>
          </div>
          <div className='flex gap-6'>
            {CONSTANTS.HERO_LINKS.map((link, i) => (
              <Link key={i} href={link.href} className='hover:text-primary'>
                <link.icon size={28}/>
              </Link>
            ))}
          </div>
        </section>
      )


}

export default HeroSection
