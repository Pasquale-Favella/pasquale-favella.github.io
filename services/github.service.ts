import { CONSTANTS } from "@/config"
import GitOwner from "@/config/owner"
import api from "@/lib/githubApi"
import { GithubIssue, GithubRepo, NextleGist } from "@/types"
import axios from "axios"


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

const getNextleWords = async ()=>{
    const {data : gistResponse } = await api.get<NextleGist>(`gists/${GitOwner.nextle_gist_id}`);
    return await axios.get<string[]>(gistResponse.files["words.json"].raw_url)
}

const GithubService = {
    getAllIssues ,
    getLatestIssues ,
    getIssueById ,
    getAllRepos ,
    getNextleWords
} as const

export default GithubService;