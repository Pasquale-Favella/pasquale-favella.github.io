
import GithubService from '@/services/github.service';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { ParsedUrlQuery } from 'querystring';
import md from 'markdown-it';
import matter from 'gray-matter';
import { Comments } from '@/components/PostList';

interface Params extends ParsedUrlQuery {
    slug : string;
}

interface Props {
    content : string;
    slug : string;
    title : string
}

const BlogPage : React.FC<Props>  = ({content , title})=>{

  return (
    <>
      <NextSeo title={title} description={`Pasquale Favella Blog - ${title}`} />
      <main>   

        <h1 className='text-center text-primary text-2xl md:text-5xl lg:text-6xl mb-5'>{title}</h1>

        <article className="prose md:prose-lg lg:prose-xl mx-auto" dangerouslySetInnerHTML={{ __html: md().render(content) }} />

        <Comments />
      </main>
    </>
  )
}


export async function getStaticPaths() {
   
 
    const { data } = await GithubService.getAllIssues();

    
    const paths = data.map(post=>({ params: { slug : ""+post.number } }))

    
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