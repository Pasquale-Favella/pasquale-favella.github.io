import {useState} from 'react';
import GithubService from '@/services/github.service';
import { GithubRepo } from '@/types';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import ProjectList from '@/components/ProjectList';
import ContentNotFound from '@/components/ContentNotFound';
import { CiSearch } from "react-icons/ci"
import { useProjectSearch } from '@/hooks/use-projectSearch';
import { AiOutlineProject } from 'react-icons/ai';

type Props = {projects:GithubRepo[]};

const Projects : React.FC<Props>  = ({projects})=>{

  const [searchTerm, setSearchTerm] = useState('');

  const {filteredProjects} = useProjectSearch({projects , searchTerm});


  return (
    <>
      <NextSeo title='Projects' description='Pasquale Favella Projects'/>

      
      <main>

        <div className='relative mb-5'>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search project'
            aria-label='Search project'
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

        {Boolean(filteredProjects.length) 
          ? <ProjectList projects={filteredProjects}/>
          : <ContentNotFound Icon={AiOutlineProject} body='No projects found' />
        }

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