import { useEffect } from 'react';
import { useStorage } from './use-storage';

export const useTheme = ()=>{

    const [theme , setTheme] = useStorage("theme","dark");

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme])

    const toggleTheme = ()=> {
        setTheme((prevTheme: string) => prevTheme==='dark'?'light':'dark');
    };

    return {
        theme , toggleTheme
    }
}