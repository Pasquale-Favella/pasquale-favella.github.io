import PostList from '@/components/PostList';
import { CONSTANTS } from '@/config';
import { usePostSearch } from '@/hooks/use-postSearch';
import GithubService from '@/services/github.service';
import { GithubIssue } from '@/types';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';

import { useState } from 'react';
import { MdOutlineDoNotDisturb } from 'react-icons/md';

type Props = {posts:GithubIssue[]}

const Blog : React.FC<Props>  = ({posts})=>{

  const [searchTerm, setSearchTerm] = useState('');

  const {filteredPosts , selectedTag , tags , onTagSelect} = usePostSearch({posts , searchTerm});

  return (
    <>
      <NextSeo title='Blog' description='Pasquale Favella Blog'/>
      <main >   

        <div className="form-control">
          <label className="input-group">
            <select className="select select-bordered focus:outline-none focus:border-primary  max-w-xs"
              defaultValue={CONSTANTS.LABELS.ALL} value={selectedTag}
              onChange={e => onTagSelect(e.target.value)}
            >
              {tags.map(tag=><option key={tag} value={tag}>{tag}</option>)}
            </select>
            <input type="text" 
              placeholder='Search articles'
              aria-label='Search articles' 
              className="input input-bordered w-full focus:outline-none focus:border-primary" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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