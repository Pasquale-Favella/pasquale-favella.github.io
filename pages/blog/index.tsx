import ContentNotFound from '@/components/ContentNotFound';
import PostList from '@/components/PostList';
import { usePostSearch } from '@/hooks/use-postSearch';
import GithubService from '@/services/github.service';
import { GithubIssue } from '@/types';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';

import { useState } from 'react';
import { BsPostcardFill } from 'react-icons/bs';

type Props = {posts:GithubIssue[]}

const Blog : React.FC<Props>  = ({posts})=>{

  const [searchTerm, setSearchTerm] = useState('');

  const {filteredPosts , selectedTag , tags , onTagSelect} = usePostSearch({posts , searchTerm});

  return (
    <>
      <NextSeo title='Blog' description='Pasquale Favella Blog'/>
      <main >   

        <label className="join w-full mb-3">
          <select className="select select-bordered focus:outline-none focus:border-primary max-w-xs join-item"
            id="select-tag"
            value={selectedTag}
            onChange={e => onTagSelect(e.target.value)}
          >
            {tags.map(tag=><option key={tag} value={tag}>{tag}</option>)}
          </select>
          <input type="text"
            id="search-article" 
            placeholder='Search articles'
            aria-label='Search articles' 
            className="input input-bordered w-full focus:outline-none focus:border-primary join-item" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        
        {Boolean(filteredPosts.length) 
          ? <PostList posts={filteredPosts}/>
          : <ContentNotFound Icon={BsPostcardFill} body='No post found'/>
        }
        
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {

  const posts = await GithubService.getAllIssues();

  return {
    props: { posts }
  };
}

export default Blog