import { useTheme } from '@/hooks/use-theme';

import { FaSun } from 'react-icons/fa';
import { RiMoonClearLine } from 'react-icons/ri';

const ThemeToggle = ()=>{

    const { toggleTheme } = useTheme();

    return(
        <div className="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)]" data-tip="change theme">
            <label className="swap swap-rotate btn btn-ghost btn-circle btn-sm">
                <input type="checkbox" onClick={toggleTheme} />       
                <FaSun size={20} className="swap-off" />
                <RiMoonClearLine size={20} className="swap-on" />
            </label>
        </div>
    )
}

export default ThemeToggle