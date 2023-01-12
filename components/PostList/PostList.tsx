import { GithubIssue } from "@/types"
import PostCard from "./PostCard"

type Props = {posts:GithubIssue[]}

const PostList : React.FC<Props>  = ({posts})=>{

    return (
      <ul className="border border-x-0 mt-5">
        {posts.map((post) => <PostCard key={post.id} post={post}/>)}
      </ul>
    )
}

export default PostList