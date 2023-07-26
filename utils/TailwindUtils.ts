import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from './../tailwind.config.js'
import { Config } from 'tailwindcss';

const tailwindConfigs = ()=> resolveConfig(tailwindConfig) as Config;

const daisyUI = tailwindConfigs().daisyui;

const getDaisyUiPalette = (isDarkMode : Boolean)=> {
    const daisyUiThemes = daisyUI.themes[0];
    return daisyUiThemes[isDarkMode ? 'dark' : 'light'];
}

export default {
    tailwindConfigs ,
    getDaisyUiPalette
} as const