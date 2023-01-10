import React from 'react'
import clsx from 'clsx'
import { useKBar } from 'kbar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Typewriter from 'typewriter-effect'

import { FiCommand , FiMenu } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  const pathname = usePathname()
  const { query } = useKBar()

  //<header className='fixed top-0 left-0 right-0 z-40 bg-white/80 shadow-sm saturate-[1.8] backdrop-blur-[10px] dark:bg-black/50 dark:saturate-100'>

  return (
      <header className='fixed top-0 left-0 right-0 z-40 shadow-sm backdrop-blur-[10px] bg-base-100/80 saturate-100'>
      <div className='mx-auto flex h-[60px] max-w-5xl items-center justify-between px-8'>
        <div>
          <Link href="/" aria-label="Pasquale's website">
            <div className="flex items-center justify-between text-xl font-semibold">
              {`~ P: ${pathname}`}
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

          <div className="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)]" data-tip="commands">
            <button className="btn btn-ghost btn-circle normal-case btn-sm"
              onClick={() => query.toggle()}
            >
              <FiCommand size={20} />
            </button>
          </div>

          <ThemeToggle/>
          
        </div>
      </div>
    </header>
  )
}

export default Navbar
