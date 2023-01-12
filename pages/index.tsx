import PostList from '@/components/PostList';
import GithubService from '@/services/github.service';
import { GithubIssue } from '@/types';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';

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