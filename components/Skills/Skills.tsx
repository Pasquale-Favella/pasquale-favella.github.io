import { CONSTANTS } from "@/config"

const Skills = ()=> {
    return (
        <div className="pb-4 md:pb-10">
            <div className="my-8 grid grid-cols-2 gap-4 md:grid-cols-4 ">
                { CONSTANTS.SKILLS.map(skill=>
                <div key={skill.name} className="flex items-center justify-center space-x-2 rounded-md bg-base-300 px-3 py-4 text-sm transition duration-300 hover:bg-primary hover:text-base-300 md:text-sm" >
                    <skill.icon size={30}/>
                    <p>{skill.name}</p>
                </div>
                )}
            </div>
        </div>
    )
}

export default Skills