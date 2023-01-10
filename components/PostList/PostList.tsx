import { GithubIssue } from "@/types"
import Link from "next/link"
import { BsArrowRight } from 'react-icons/bs';
import PostCard from "./PostCard"

type Props = {posts:GithubIssue[]}

const PostList : React.FC<Props>  = ({posts})=>{

    return (
        <>
        <ul className="border border-x-0 mt-5">
            {posts.map((post) => <PostCard key={post.id} post={post}/>)}
        </ul>
        <div className='flex'>
        <Link
          href='/blog'
          className='group my-8 flex items-center gap-4 text-lg font-medium'
        >
          <span>View All Posts</span>
          <BsArrowRight className='h-4 w-4 transition duration-200 group-hover:translate-x-1' />
        </Link>
      </div>
      </>
    )
}

export default PostList