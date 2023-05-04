import { useMemo } from 'react'
import GithubService from '@/services/github.service';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { ParsedUrlQuery } from 'querystring';
import md from 'markdown-it';
import highlightjs from 'markdown-it-highlightjs';
import codecopy from 'markdown-it-code-copy'
import matter from 'gray-matter';
import { Comments } from '@/components/PostList';
import Link from 'next/link';
import { MdKeyboardArrowLeft } from 'react-icons/md';

interface Params extends ParsedUrlQuery {
    slug : string;
}

interface Props {
    content : string;
    slug : string;
    title : string
}

const BlogPage : React.FC<Props>  = ({content , title})=>{

  const articleContent = useMemo(()=> md().use(highlightjs).use(codecopy,{
    buttonClass : 'btn btn-ghost btn-circle btn-sm',
    iconClass : 'fa fa-solid fa-clone text-neutral-content'
  }).render(content) , [content]);

  return (
    <>
      <NextSeo title={title} description={`Pasquale Favella Blog - ${title}`} />
       
      <Link
        href='/blog'
        className='group fixed top-[6.5rem] hidden items-center justify-center text-sm font-medium xl:inline-flex'
      >
        <MdKeyboardArrowLeft className='h-4 w-4 transition duration-200 group-hover:translate-x-1' />
        <span>See all Posts</span>
      </Link>

      <div className='prose md:prose-lg lg:prose-xl mx-auto  mb-3 lg:mb-5'>
        <h1 className='text-4xl font-extrabold leading-tight md:text-5xl'>{title}</h1>
      </div>

      <article className='prose md:prose-lg lg:prose-xl mx-auto' dangerouslySetInnerHTML={{ __html: articleContent }} />

      <Comments />
    </>
  )
}


export async function getStaticPaths() {
   
 
    const { data } = await GithubService.getAllIssues();

    
    const paths = data.map(post=>({ params: { slug : post.number.toString() } }))

    
    return {
      paths,
      fallback: false,
    };
}
    
  
    
  
export const getStaticProps: GetStaticProps<Props , Params> = async (context) => {
  
    const { data : post} = await GithubService.getIssueById(context.params!.slug);
  
    const { content } = matter(post.body);
  
    return {
      props: {
        content,
        slug :context.params!.slug ,
        title : post.title
      }
    };
}

export default BlogPage