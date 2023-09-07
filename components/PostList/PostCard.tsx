import { useMemo } from "react";
import { CONSTANTS } from "@/config"
import Link from "next/link"
import { GithubIssue } from "@/types"
import { default as DateUtils , Utils } from "@/utils"
import Tag from "./Tag";

type Props = {
  post : GithubIssue
}

const PostReadMore : React.FC<Props>  = ({post})=>{
  return(
    <Link
      href={`/blog/${post.number}`}
      className="font-medium leading-6 text-primary hover:text-primary/60 transition duration-200"
      aria-label={`Read "${post.title}"`}
    >
      Read more &rarr;
    </Link>
  )
}

const PostCard : React.FC<Props>  = ({post})=>{

  const filteredLabels = post.labels.filter(label => label.name.toLowerCase() !== CONSTANTS.LABELS.DOC);

  const articleContentPreview = useMemo(()=> {
    const extractedWords = Utils.extractWords(post.body , 40);
    return `${extractedWords}...`
  } , [post.body]);

  return (
            <div 
              className="group flex bg-transparent bg-opacity-20 px-2 transition duration-300 hover:scale-105 hover:rounded-md hover:bg-base-300" 
            >
              <li className="py-2 w-full">
                <article>
                  <div className="animate-tilt space-y-2 bg-transparent bg-opacity-20 p-2 transition duration-200 hover:rounded-md xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-sm font-normal leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={post.created_at}>{DateUtils.formatDateEN(post.created_at)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-4">
                      <div className="space-y-1">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight"> 
                            <Link
                              href={`/blog/${post.number}`}
                              className=" transition duration-500 ease-in-out hover:text-primary"
                            >
                              {post.title}
                            </Link>
                          </h2>
                          <small className="line-clamp-3">{articleContentPreview}</small>
                        </div>

                        <div className="flex flex-col justify-between items-start md:flex-row md:items-center gap-2 pt-1">

                          <div className="flex flex-wrap">
                            {filteredLabels.map(label => <Tag key={label.id} tag={label.name} className="!py-2 hover:bg-base-300" />)}
                          </div>

                          <PostReadMore post={post}/>
                        </div>
                      </div>               
                    </div>
                  </div>
                </article>
              </li>
            </div>
          )
}
export default PostCard


