import React from 'react'
import Link from 'next/link'
import { CONSTANTS } from '@/config'
import DateUtils from '@/utils/DateUtils'



const HeroSection = () => {

    return (
        <section className='space-y-6 md:my-16'>
          <div className='flex flex-col-reverse gap-8 md:flex-row md:justify-between'>
            <div className='space-y-4 md:max-w-lg'>

              <h1 className="pb-6 text-3xl font-extrabold leading-9 tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                Hi, I am <span className="text-primary">Pasquale</span>
                </h1>
              <h2 className='text-lg font-medium text-primary'>
                {DateUtils.calculateAge()} yrs • Musician • Full-stack Developer
              </h2>
              <p className='text-lg'>
              Welcome to my full stack developer portfolio! <br/>
              I am a highly passionated for creating web and mobile applications.           
              Let&apos;s work together to bring your ideas to life and create an exceptional product.
              </p>
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
