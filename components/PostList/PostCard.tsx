import { GithubIssue } from "@/types"
import Link from "next/link"

type Props = {post:GithubIssue}

const PostCard : React.FC<Props>  = ({post})=>{

    return (
              <li key={post.id} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="font-medium leading-6 text-slate-600">
                        <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link
                              href={`/blog/${post.title}`}
                              className="text-accent-content"
                            >
                              {post.title}
                            </Link>
                          </h2>
                        </div>
                        <div className="prose">
                          {/* */}Azz wee gefeege
                        </div>
                      </div>
                      <div className="text-base font-medium leading-6">
                        <Link
                          href={`/blog/${post.title}`}
                          className="text-primary hover:text-primary/60 transition duration-200"
                          aria-label={`Read "${post.title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
}

export default PostCard

const formatDate = (date : any) => {
    const options : Intl.DateTimeFormatOptions= {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    const now = new Date(date).toLocaleDateString('en-US', options)
  
    return now
}