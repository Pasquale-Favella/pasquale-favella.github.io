import { FC } from "react"
import { CONSTANTS } from "@/config";

type SkillCardProps = typeof CONSTANTS.SKILLS[number];

const SkillCard: FC<SkillCardProps> = (skill) => {
    return (
        <div className="group flex items-center justify-center space-x-3 px-3 py-4 rounded-md bg-base-300 transition-all duration-300 hover:scale-105">
            {/* Icon */}
            <skill.Icon
                size={32}
                className="transition-all duration-300 group-hover:scale-110 group-hover:text-primary"
            />

            {/* Text */}
            <p className="font-medium text-sm md:text-base transition-colors duration-300 group-hover:text-primary">
                {skill.name}
            </p>
        </div>
    )
}

export default SkillCard