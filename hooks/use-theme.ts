import { useMemo } from 'react';
import { useTheme as useNextThemes} from 'next-themes';
import { Theme } from '@/types';

export const useTheme = ()=>{

    const { theme, setTheme } = useNextThemes();

    const toggleTheme = ()=> setTheme(theme === Theme.dark ? Theme.light : Theme.dark);

    const isDarkMode = useMemo(()=>theme === Theme.dark , [theme]);

    const nextThemeTip = useMemo(()=>isDarkMode ? 'Light': 'Dark' , [theme]);

    return {
        theme , toggleTheme , isDarkMode , nextThemeTip
    }
}