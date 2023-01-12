import PostList from '@/components/PostList';
import GithubService from '@/services/github.service';
import { GithubIssue } from '@/types';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { useState , useMemo } from 'react';
import { CiSearch } from 'react-icons/ci';
import { MdOutlineDoNotDisturb } from 'react-icons/md';

type Props = {posts:GithubIssue[]}

const Blog : React.FC<Props>  = ({posts})=>{

  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = useMemo(()=> posts.filter((post) =>{

    const insensiveTerm = searchTerm.toLowerCase();
    const insensiveTitle = post.title.toLowerCase();
    const insensiveBody = post.body.toLowerCase();

    return insensiveTitle.includes(insensiveTerm) || insensiveBody.includes(insensiveTerm)

  }),[searchTerm]);

  return (
    <>
      <NextSeo description='Pasquale Favella Blog'/>
      <main >   

        <div className='relative'>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search articles'
            aria-label='Search articles'
            className='w-full rounded-md border bg-base-100 border py-2 px-3 pl-12 transition-colors duration-200 ease-linear focus:border-primary focus:outline-none'
            id='search'
          />
          <label htmlFor='search'>
            <CiSearch
              className='absolute top-1/2 left-4 -translate-y-1/2'
              size={20}
            />
          </label>
        </div>

        {Boolean(filteredPosts.length) 
          ? <PostList posts={filteredPosts}/>
          : <div className='flex justify-items-center items-center'>
          <span
            
            className='group my-8 flex items-center gap-4 text-lg font-medium'
          >
            <MdOutlineDoNotDisturb size={20} className='transition duration-200 group-hover:scale-125' />
            <span>No post found</span>
          </span>
        </div>
        }
        

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