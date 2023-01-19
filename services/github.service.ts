import { CONSTANTS } from "@/config"
import GitOwner from "@/config/owner"
import api from "@/lib/githubApi"
import { GithubIssue, GithubRepo } from "@/types"


const getAllIssues = async ()=>{
    return await api.get<GithubIssue[]>(`repos/${GitOwner.owner}/${GitOwner.repo}/issues`,{
        params : {
            labels : CONSTANTS.LABELS.DOC,
            per_page : 100,
            sort : 'created',
            direction : 'desc'
        }
    })
}

const getLatestIssues = async (qty = 4)=>{
    return await api.get<GithubIssue[]>(`repos/${GitOwner.owner}/${GitOwner.repo}/issues`,{
        params : {
            labels : CONSTANTS.LABELS.DOC,
            per_page : qty ,
            sort : 'created',
            direction : 'desc'
        }
    })
}

const getIssueById = async (id : string)=>{
    return await api.get<GithubIssue>(`repos/${GitOwner.owner}/${GitOwner.repo}/issues/${id}`)
}

const getAllRepos = async ()=>{
    return await api.get<GithubRepo[]>(`users/${GitOwner.owner}/repos`)
}

const GithubService = {
    getAllIssues ,
    getLatestIssues ,
    getIssueById ,
    getAllRepos
} as const

export default GithubService;