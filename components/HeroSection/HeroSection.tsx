import React from 'react'
import Link from 'next/link'
import { CONSTANTS } from '@/config'
import DateUtils from '@/utils/DateUtils'
import Typewriter from 'typewriter-effect'
import { BsArrowRight } from 'react-icons/bs';



const HeroSection = () => {

    const age = DateUtils.calculateAge();

    return (
        <section className='space-y-6 mb-10 md:mb-16'>
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
                {age} yrs • Musician • Full-stack Developer
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
            <div className='flex flex-col justify-center relative'>

                <div className="mockup-code bg-base-300 text-primary absolute -left-28 md:-left-8 bottom-[40px] md:bottom-[20px] hidden md:block">
                  <pre data-prefix="$"><code>sudo apt-get update</code></pre>
                </div>

                <div className="mockup-code bg-base-200 text-warning absolute -left-44 top-[20px] hidden lg:block">
                  <pre data-prefix="$"><code>docker run -it --name pakydev -p 80:80 -d nginx</code></pre>
                </div>

                <div className="mockup-code z-20">
                    <pre data-prefix="$" className='flex'>
                      <code >
                        <Typewriter
                          options={{
                            strings: 'npm i fullstack',
                            autoStart: true,
                            loop: false,
                          }}
                        />
                      </code>
                    </pre> 

                    <pre data-prefix=">" className='flex text-warning'>
                      <code >
                        <Typewriter
                          onInit={(typewriter) => {
                            typewriter.typeString('')
                              .pauseFor(2100)
                              .typeString('installing...')
                              .start();
                          }}
                        />
                      </code>
                    </pre> 

                    <pre data-prefix=">" className='flex text-success'>
                      <code >
                        <Typewriter
                          onInit={(typewriter) => {
                            typewriter.typeString('')
                              .pauseFor(5500)
                              .typeString('Done!')
                              .start();
                          }}
                        />
                      </code>
                    </pre> 
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
