import PostList from '@/components/PostList';
import GithubService from '@/services/github.service';
import { GithubIssue } from '@/types';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';

type Props = {posts:GithubIssue[]}

const Blog : React.FC<Props>  = ({posts})=>{
  return (
    <>
      <NextSeo description='Pasquale Favella Blog'/>
      <main >   

      <PostList posts={posts}/>

      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  
 const { data } = await GithubService.getAllIssues();
   
  return {
    props: {
      posts : data
    }
  };
}

export default Blog