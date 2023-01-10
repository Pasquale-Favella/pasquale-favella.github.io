import PostList from '@/components/PostList';
import GithubService from '@/services/github.service';
import { GithubIssue } from '@/types';
import { GetStaticProps } from 'next';
import Head from 'next/head'

type Props = {posts:GithubIssue[]}

const Home : React.FC<Props>  = ({posts})=>{
  return (
    <>
      <Head>
        <title>Pasquale blogfolio</title>
        <meta name="description" content="Pasquale blogfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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