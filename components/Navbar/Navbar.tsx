import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Typewriter from 'typewriter-effect'

import ThemeToggle from './ThemeToggle'
import CommandToggle from './CommandToggle'

const Navbar = () => {

  const pathname = usePathname();

  return (
      <header className='fixed top-0 left-0 right-0 z-40 shadow-sm backdrop-blur-[10px] bg-base-100/80 saturate-100'>
      <div className='mx-auto flex h-[60px] max-w-6xl items-center justify-between px-8'>
        <div>
          <Link href="/" aria-label="Pasquale's website">
            <div className="flex items-center justify-between text-xl font-semibold">
              {`~ P: /${pathname?.split('/')[1]}`}
              <Typewriter
                options={{
                  strings: [],
                  autoStart: true,
                  loop: true,
                }}
              />
            </div>
          </Link>
        </div>
        <div className='flex items-center gap-2'>

          <CommandToggle/>

          <ThemeToggle/>
          
        </div>
      </div>
    </header>
  )
}

export default Navbar
