import { GithubRepo } from "@/types"
import { SiGithub } from "react-icons/si"

type Props = {project:GithubRepo}

const ProjectTopic : React.FC<{topic : string}>  = ({topic})=>{

    return (
        <a href={`https://github.com/topics/${topic}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 transition duration-100 hover:scale-105 hover:text-primary">
            <small key={topic} className="">
                {topic}
            </small>
        </a>
    )
}

const GitHubTooltip : React.FC<Props> = ({project})=>{
    return (
        <div className="tooltip tooltip-right tooltip-primary before:text-xs before:content-[attr(data-tip)]" data-tip={`view ${project.name} repo`}>
            <a className="btn btn-ghost btn-circle normal-case btn-sm" href={`${project.html_url}`} target="_blank" rel="noopener noreferrer">
                <SiGithub size={30}/>
            </a>
        </div>
    )
}

const ProjectCard : React.FC<Props>  = ({project})=>{

    const projectTopics = project.topics;

    return (
                <div
                    className='flex w-full flex-1 items-center justify-start rounded-lg border  p-4 transition-all duration-300 hover:scale-105 sm:px-6'
                >
                    <GitHubTooltip project={project}/>
                    <div className='px-4'>
                        <h2 className="text-2xl text-primary font-bold">{project.name}</h2>
                        <p>{project.description}</p>

                        {Boolean(projectTopics.length) &&
                        <div className="flex gap-x-2 flex-wrap">
                            {projectTopics.map(topic => <ProjectTopic key={topic} topic={topic} />)}
                        </div>
                        }

                    </div>
                        
                </div>
            )
}
export default ProjectCard


