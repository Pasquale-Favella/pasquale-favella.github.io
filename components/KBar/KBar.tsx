
import { BiCodeAlt, BiCodeBlock } from 'react-icons/bi';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { RiArticleFill } from 'react-icons/ri';
import { DiGitPullRequest } from 'react-icons/di';
import { TfiThought } from 'react-icons/tfi';

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
import { useRouter } from 'next/router';
import GitOwner from '@/config/owner';
  
type KBarProps = WithChildren
  
const KBar = (props: KBarProps) => {
  const { children } = props;
  const router = useRouter()
  
  const actions: Action[] = [
    {
      id: 'flow',
      name: 'Idea Flow',
      keywords: 'Flow your ideas',
      section: 'Apps',
      perform: () => router.push('/flow'),
      icon: <TfiThought />,
    },
    {
      id: 'diff',
      name: 'Editor',
      keywords: 'code editor helper',
      section: 'Apps',
      perform: () => router.push('/editor'),
      icon: <BiCodeBlock />,
    },
    {
      id: 'projects',
      name: 'Projects',
      keywords: 'Visit Projects',
      section: 'General',
      perform: () => router.push('/projects'),
      icon: <DiGitPullRequest />,
    },
    {
      id: 'blog',
      name: 'Blog',
      keywords: 'Visit Blog',
      section: 'General',
      perform: () => router.push('/blog'),
      icon: <RiArticleFill />,
    },
    {
      id: 'source-code',
      name: 'Source code',
      keywords: 'source code github',
      section: 'General',
      perform: () => window.open(GitOwner.this_repo_url, '_blank'),
      icon: <BiCodeAlt />,
    },
    {
      id: 'github',
      name: 'GitHub',
      keywords: 'github',
      section: 'Social',
      perform: () => window.open(GitOwner.git_url, '_blank'),
      icon: <FiGithub />,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      keywords: 'linkedin',
      section: 'Social',
      perform: () => window.open(GitOwner.linkedin_url, '_blank'),
      icon: <FiLinkedin />,
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