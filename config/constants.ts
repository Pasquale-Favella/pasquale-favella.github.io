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


