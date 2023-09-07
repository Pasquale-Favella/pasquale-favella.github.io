import { AnchorHTMLAttributes, FC } from "react"
import Link from "next/link"
import { clsx } from "clsx"
import { HiHashtag } from "react-icons/hi"

interface TagProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
    tag : string
}


const Tag : FC<TagProps>  = ({tag , className , ...props})=>{
    return(
      <Link
        className={clsx(
            'badge badge-lg hover:border-primary no-underline py-4',
            className
        )}
        href={{
          pathname: '/blog',
          query: { tag },
        }}
        passHref
        shallow
        {...props}
      >
        <HiHashtag/>
        {tag}
      </Link>
    )
}

export default Tag;