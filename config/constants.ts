import { FaAngular, FaReact } from 'react-icons/fa';
import { FiGithub , FiLinkedin} from 'react-icons/fi';
import { SiExpress, SiMongodb, SiNextdotjs, SiSpringboot, SiTailwindcss } from 'react-icons/si';
import { BiLogoPostgresql } from 'react-icons/bi';
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
            Icon: FaReact,
            name: 'React.js',
        },
        {
            Icon : SiNextdotjs,
            name: 'Next.js',
        },
        {
            Icon : FaAngular,
            name: 'Angular',
        },
        {
            Icon : SiTailwindcss,
            name: 'Tailwind',
        },
        {
            Icon : SiExpress,
            name: 'Express.js',
        },
        {
            Icon : SiSpringboot,
            name: 'Spring Boot',
        },
        {
            Icon : BiLogoPostgresql,
            name: 'PostgreSQL',
        },
        {
            Icon : SiMongodb,
            name: 'MongoDB',
        }
    ]

} as const

export const QWERTY = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];