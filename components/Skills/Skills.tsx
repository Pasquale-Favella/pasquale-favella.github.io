import { CONSTANTS } from "@/config"
import SkillCard from "./SkillCard"

const Skills = ()=> {
    return (
        <div className="pb-4 md:pb-10">
            <div className="my-8 grid grid-cols-2 gap-4 md:grid-cols-4 ">
                { CONSTANTS.SKILLS.map(skill=> <SkillCard key={skill.name} {...skill}/> )}
            </div>
        </div>
    )
}

export default Skills