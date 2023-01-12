import GitOwner from "@/config/owner"
import api from "@/lib/githubApi"
import { GithubIssue } from "@/types"


const getAllIssues = async ()=>{
    return await api.get<GithubIssue[]>(`repos/${GitOwner.owner}/${GitOwner.repo}/issues`,{
        params : {
            labels : 'documentation',
            per_page : 100,
            sort : 'created',
            direction : 'desc'
        }
    })
}

const getLatestIssues = async (qty = 4)=>{
    return await api.get<GithubIssue[]>(`repos/${GitOwner.owner}/${GitOwner.repo}/issues`,{
        params : {
            labels : 'documentation',
            per_page : qty ,
            sort : 'created',
            direction : 'desc'
        }
    })
}

const GithubService = {
    getAllIssues ,
    getLatestIssues
} as const

export default GithubService;