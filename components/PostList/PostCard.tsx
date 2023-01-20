import { CONSTANTS } from "@/config"
import { GithubIssue } from "@/types"
import { HiHashtag } from 'react-icons/hi';
import DateUtils from "@/utils/DateUtils"
import Link from "next/link"

type Props = {post:GithubIssue}

const PostCard : React.FC<Props>  = ({post})=>{

  return (
            <div 
              className="group flex bg-transparent bg-opacity-20 px-2 transition duration-300 hover:scale-105 hover:rounded-md hover:bg-base-300" 
            >
              <li className="py-6 w-full">
                <article>
                  <div className=" animate-tilt space-y-2 bg-transparent bg-opacity-20 p-2 transition duration-200 hover:rounded-md xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
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
                        </div>
                        <div className="flex flex-wrap">
                          {post.labels?.length && post.labels.filter(label => label.name.toLowerCase() !== CONSTANTS.LABELS.DOC).map(label =>
                          <Link className="mt-2 mr-3 btn btn-ghost btn-sm text-primary"  key={label.id}
                            href={{
                              pathname: '/blog',
                              query: { tag :  label.name},
                            }}
                            passHref
                            shallow
                          >
                            <HiHashtag/>
                            {label.name}
                          </Link>)}
                        </div>
                      </div>               
                    </div>
                  </div>
                  
                </article>
                <div className="text-base font-medium leading-6 flex justify-end">
                  <Link
                    href={`/blog/${post.number}`}
                    className="text-primary hover:text-primary/60 transition duration-200"
                    aria-label={`Read "${post.title}"`}
                  >
                    Read more &rarr;
                  </Link>
                </div>
              </li>

            </div>
          )
}
export default PostCard


