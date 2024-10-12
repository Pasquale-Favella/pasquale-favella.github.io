import { useRef } from "react";
import { cn } from "@/utils"
import { usePaginatedArray } from "@/hooks/use-paginated-array";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { GithubIssue } from "@/types";
import PostCard from "./PostCard";

type Props = {
  posts: GithubIssue[];
};

const PostList: React.FC<Props> = ({ posts }) => {
  const { pageIndex, paginatedArray, totalPages, setPageIndex, isPageable } = usePaginatedArray({array: posts, pageSize: 5});

  const ulRef = useRef<HTMLUListElement>(null);

  useScrollTop(Boolean(pageIndex));

  const handlePrevPage = () => {
    setPageIndex(pageIndex - 1);
  };

  const handleNextPage = () => {
    setPageIndex(pageIndex + 1);
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      <ul ref={ulRef}>
        {paginatedArray.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ul>
<div className={cn("join grid grid-cols-2 m-auto max-w-fit", { hidden: !isPageable })}>
        <button
          className="join-item btn btn-sm btn-outline btn-primary"
          onClick={handlePrevPage}
          disabled={pageIndex === 0}
        >
          Previous page
        </button>
        <button
          className="join-item btn btn-sm btn-outline btn-primary"
          onClick={handleNextPage}
          disabled={pageIndex === totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostList