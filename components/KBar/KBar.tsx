
import { BiCodeAlt } from 'react-icons/bi';
import { FiGithub } from 'react-icons/fi';
import {
  Action,
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
} from 'kbar'

import React from 'react'
import { WithChildren } from '@/types'
import Results from './Results';
  
type KBarProps = WithChildren
  
  const KBar = (props: KBarProps) => {
    const { children } = props
  
  const actions: Action[] = [
    
    {
      id: 'source-code',
      name: 'Source code',
      keywords: 'source code github',
      section: 'General',
      perform: () =>
        window.open('https://github.com/Pasquale-Favella/pasquale-favella.github.io', '_blank'),
      icon: <BiCodeAlt />,
    },
    
    {
      id: 'github',
      name: 'GitHub',
      keywords: 'github',
      section: 'Social',
      perform: () => window.open('https://github.com/Pasquale-Favella', '_blank'),
      icon: <FiGithub />,
    }
  ]

  return (
    <>
      <KBarProvider actions={actions}>
        <KBarPortal>
          <KBarPositioner className='z-50 bg-black/10 backdrop-blur'>
            <KBarAnimator className='w-full max-w-lg rounded-lg border border-primary '>
              <KBarSearch className='w-full bg-transparent py-3 px-6 outline-none placeholder-primary' />
              <Results />
              <div className='h-4'></div>
            </KBarAnimator>
          </KBarPositioner>
        </KBarPortal>
        {children}
      </KBarProvider>
    </>
  )
  
}

export default KBar