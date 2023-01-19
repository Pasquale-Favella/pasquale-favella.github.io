import { GithubRepo } from "@/types"
import Link from "next/link"
import { TbFileDigit } from "react-icons/tb"

type Props = {project:GithubRepo}

const ProjectCard : React.FC<Props>  = ({project})=>{

  return (
            <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className='flex w-full flex-1 items-center justify-start rounded-lg border  p-4 transition-all duration-300 hover:scale-105 sm:px-6'
            >
                <TbFileDigit size={30}/>
                <div className='px-4'>
                    <h2 className="text-2xl text-primary font-bold">{project.name}</h2>
                    <p>{project.description}</p>
                </div>
            </Link>
          )
}
export default ProjectCard


