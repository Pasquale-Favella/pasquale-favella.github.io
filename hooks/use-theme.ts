import { useMemo } from 'react';
import { useTheme as useNextThemes} from 'next-themes';
import { Theme } from '@/types';

export const useTheme = ()=>{

    const { resolvedTheme : theme , setTheme } = useNextThemes();

    const isDarkMode = useMemo(()=> theme === Theme.dark , [theme]);

    const toggleTheme = ()=> setTheme( isDarkMode ? Theme.light : Theme.dark);

    return {
        theme , toggleTheme , isDarkMode
    }
}