
import HeroSection from '@/components/HeroSection';
import PostList from '@/components/PostList';
import ProjectList from '@/components/ProjectList';
import GithubService from '@/services/github.service';
import { GithubIssue, GithubRepo } from '@/types';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import Link from "next/link"
import { BsArrowRight } from 'react-icons/bs';

type Props = {
  posts:GithubIssue[] ,
  projects : GithubRepo[]
}

const Home : React.FC<Props>  = ({posts , projects})=>{
  return (
    <>
      <NextSeo description='Pasquale Favella Blogfolio home' title='Home'/>
      <main >
        
        <HeroSection/>
        
        <h2 className='flex pb-6 text-3xl font-extrabold tracking-tight sm:text-3xl md:text-5xl'>Projects</h2>

        <ProjectList projects={projects}/>

        <div className='flex mb-5 md:mb-10'>
          <Link
            href='/projects'
            className='group my-8 flex items-center gap-4 text-lg font-medium text-primary'
          >
            <span>View All Projects</span>
            <BsArrowRight className='h-4 w-4 transition duration-200 group-hover:translate-x-1' />
          </Link>
        </div>

        <h2 className='flex pb-6 text-3xl font-extrabold tracking-tight sm:text-3xl md:text-5xl'>Latest Posts</h2>

        <PostList posts={posts}/>

        <div className='flex'>
          <Link
            href='/blog'
            className='group my-8 flex items-center gap-4 text-lg font-medium text-primary'
          >
            <span>View All Posts</span>
            <BsArrowRight className='h-4 w-4 transition duration-200 group-hover:translate-x-1' />
          </Link>
        </div>

      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {


  const [{data : posts} , {data : projects}] = await Promise.all([
    GithubService.getLatestIssues(),
    GithubService.getAllRepos()
  ]);
    
  return {
    props: {
      posts ,
      projects : projects.sort((a,b)=>b.stargazers_count - a.stargazers_count).slice(0,3)
    }
  };
}

export default Home