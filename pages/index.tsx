import PostList from '@/components/PostList';
import GithubService from '@/services/github.service';
import { GithubIssue } from '@/types';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import Link from "next/link"
import { BsArrowRight } from 'react-icons/bs';

type Props = {posts:GithubIssue[]}

const Home : React.FC<Props>  = ({posts})=>{
  return (
    <>
      <NextSeo description='Pasquale Favella Blogfolio home'/>
      <main >
        
        <h1 className="text-3xl font-bold underline ">
          Hello world!
        </h1>
        

        <PostList posts={posts}/>

        <div className='flex'>
          <Link
            href='/blog'
            className='group my-8 flex items-center gap-4 text-lg font-medium'
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
  
 const { data } = await GithubService.getLatestIssues();
   
  return {
    props: {
      posts : data
    }
  };
}

export default Home