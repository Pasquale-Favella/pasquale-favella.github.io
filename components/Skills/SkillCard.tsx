import { FC } from "react"
import { CONSTANTS } from "@/config";

type SkillCardProps = typeof CONSTANTS.SKILLS[number];

const SkillCard : FC<SkillCardProps> = (skill)=> {
    return (
        <div className="flex items-center justify-center space-x-2 rounded-md bg-base-300 px-3 py-4 text-sm transition duration-300 hover:bg-primary hover:text-base-300 md:text-sm" >
            <skill.Icon size={30}/>
            <p>{skill.name}</p>
        </div>
    )
}

export default SkillCard