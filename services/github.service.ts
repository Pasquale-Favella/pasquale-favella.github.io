import { CONSTANTS } from "@/config"
import GitOwner from "@/config/owner"
import api from "@/lib/githubApi"
import { GithubIssue, GithubRepo, NextleGist } from "@/types"
import { Utils } from "@/utils"
import axios from "axios"

const getAllIssues = async () => {
  const params = {
    labels: CONSTANTS.LABELS.DOC,
    per_page: 5,
    sort: 'created',
    direction: 'desc',
    state: 'closed',
  };

  const fetchIssues = async (
    issues: GithubIssue[] = [],
    page = 1,
  ): Promise<GithubIssue[]> => {

    const { data: issuesOnPage } = await Utils.withRetry(()=> api.get<GithubIssue[]>(
        `repos/${GitOwner.owner}/${GitOwner.repo}/issues`,
        { params: { ...params, page } }
    ));

    issues.push(...issuesOnPage);

    if (issuesOnPage.length < params.per_page) {
      return issues;
    }

    return fetchIssues(issues, page + 1);
  };

  return await fetchIssues();
};

const getLatestIssues = async (qty = 3)=>{
    return await api.get<GithubIssue[]>(`repos/${GitOwner.owner}/${GitOwner.repo}/issues`,{
        params : {
            labels : CONSTANTS.LABELS.DOC,
            per_page : qty ,
            sort : 'created',
            direction : 'desc',
            state : 'closed'
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