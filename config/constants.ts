import { FiGithub , FiLinkedin} from 'react-icons/fi';
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
      ]

} as const


