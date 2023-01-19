import GithubService from '@/services/github.service';
import { GithubRepo } from '@/types';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import ProjectList from '@/components/ProjectList';


type Props = {projects:GithubRepo[]};

const Projects : React.FC<Props>  = ({projects})=>{


  return (
    <>
      <NextSeo title='Projects' description='Pasquale Favella Projects'/>
      <main>
        <ProjectList projects={projects}/>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  
 const { data } = await GithubService.getAllRepos();
   
  return {
    props: {
        projects : data.sort((a,b)=>b.stargazers_count - a.stargazers_count)
    }
  };
}

export default Projects