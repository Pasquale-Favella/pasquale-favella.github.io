import { GithubRepo } from '@/types';
import { useMemo } from 'react';
import useDebounce from './use-debounce';

type Props = {
    projects:GithubRepo[] ,
    searchTerm : string
}

export const useProjectSearch = ({projects , searchTerm} : Props)=>{

    const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);

    const filteredProjects = useMemo(()=> projects.filter((project) =>{

        const insensiveTerm = searchTerm.toLowerCase();

        const insensiveProjectName = project.name.toLowerCase();

        const insensitiveProjectDesc = project.description?.toLowerCase();

        const topicMatch = project.topics.some(topic=> topic.toLowerCase().includes(insensiveTerm));

        const match = insensiveProjectName.includes(insensiveTerm) || insensitiveProjectDesc?.includes(insensiveTerm) || topicMatch;
    
        return match;
    
    }),[debouncedSearchTerm]);
    

    return {
        filteredProjects ,
    }
}