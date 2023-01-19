import { GithubRepo } from "@/types"
import ProjectCard from "./ProjectCard"

type Props = {projects:GithubRepo[]}

const ProjectList : React.FC<Props>  = ({projects})=>{

    return (
        <div className=' flex flex-col'>
            <div className='flex flex-col gap-8'>
                {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
        </div>
    )
}

export default ProjectList