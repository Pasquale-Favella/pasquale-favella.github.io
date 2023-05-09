import { FaAngular, FaReact } from 'react-icons/fa';
import { FiGithub , FiLinkedin} from 'react-icons/fi';
import { SiExpress, SiMongodb, SiNextdotjs, SiSpringboot, SiTailwindcss } from 'react-icons/si';
import { AiOutlineConsoleSql } from 'react-icons/ai';
import GitOwner from './owner';

export default {

    LABELS : {
        DOC : 'documentation',
        ALL : 'All Tags'
    },

    HERO_LINKS : [
        {
            icon: FiGithub,
            href: GitOwner.git_url,
        },
        {
            icon : FiLinkedin,
            href: GitOwner.linkedin_url,
        }
    ],

    SKILLS : [
        {
            icon: FaReact,
            name: 'React.js',
        },
        {
            icon : SiNextdotjs,
            name: 'Next.js',
        },
        {
            icon : FaAngular,
            name: 'Angular',
        },
        {
            icon : SiTailwindcss,
            name: 'Tailwind',
        },
        {
            icon : SiExpress,
            name: 'Express.js',
        },
        {
            icon : SiSpringboot,
            name: 'Spring Boot',
        },
        {
            icon : AiOutlineConsoleSql,
            name: 'SQL',
        },
        {
            icon : SiMongodb,
            name: 'MongoDB',
        }
    ]

} as const

export const EDITOR_INITIALS = {
    htmlInitialValue : `
    <div class="hello">Hello, world!</div>
    <button id="color-button">Change Color</button>
    `,
    cssInitialValue : `
    /* Style for the hello world text */
    .hello {
        font-size: 5rem;
        font-weight: bold;
        text-align: center;
        color: white;
        background-color: blue;
        border-radius: 0.5rem;
        padding: 1rem;
        position: relative;
        animation: slidein 1s ease-out forwards;
    }

    /* Keyframes for the slidein animation */
    @keyframes slidein {
        0% {
            transform: translateY(-100%);
            opacity: 0;
        }

        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }

    /* Style for the button to change the background color */
    button {
        display: block;
        margin: 1rem auto;
        padding: 1rem;
        font-size: 1rem;
        background-color: white;
        border: 1px solid black;
        border-radius: 0.5rem;
        cursor: pointer;
    }
    `,
    jsInitialValue : `
    // JavaScript for changing the background color on button click
    const hello = document.querySelector('.hello');
    const colorButton = document.querySelector('#color-button');
    colorButton.addEventListener('click', () => {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    const color = "rgb(" + red +"," + green+"," + blue +")";
    hello.style.backgroundColor = color;
    });
    `
}

export const QWERTY = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];