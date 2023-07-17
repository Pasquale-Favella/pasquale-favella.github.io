import { CONSTANTS } from '@/config';
import { GithubIssue } from '@/types';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import useDebounce from './use-debounce';

type Props = {
    posts:GithubIssue[] ,
    searchTerm : string
}

export const usePostSearch = ({posts , searchTerm} : Props)=>{

    const router = useRouter();

    const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);

    const tags = useMemo(
        () => Array.from(new Set([
            CONSTANTS.LABELS.ALL,
            ...posts.map(post => post.labels.map(label => label.name)).flat().filter(tag => tag !== CONSTANTS.LABELS.DOC).sort()
        ])),
        []
    );

    const selectedTag = router.query?.tag as string|undefined ?? CONSTANTS.LABELS.ALL;

    const onTagSelect = async (tagBeenSelected : string)=> await router.push({
            pathname : router.pathname ,
            query : {
                tag : tagBeenSelected
            }
     })
    

    const filteredPosts = useMemo(()=> posts.filter((post) =>{

        const insensiveTerm = searchTerm.toLowerCase();
        const insensiveTitle = post.title.toLowerCase();
        const insensiveBody = post.body.toLowerCase();

        const match = insensiveTitle.includes(insensiveTerm) || insensiveBody.includes(insensiveTerm)

        if(Boolean(selectedTag) && selectedTag !== CONSTANTS.LABELS.ALL){
            return post.labels.some(label => label.name.toLowerCase() === selectedTag?.toLowerCase()) && match
        }
    
        return match;
    
    }),[debouncedSearchTerm , selectedTag]);
    

    return {
        filteredPosts ,
        tags,
        selectedTag ,
        onTagSelect 
    }
}