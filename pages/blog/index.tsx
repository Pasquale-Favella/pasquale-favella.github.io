import ContentNotFound from '@/components/ContentNotFound';
import PostList from '@/components/PostList';
import { useBlogPosts } from '@/hooks/use-blog-posts';
import { useScrollTop } from '@/hooks/use-scroll-top';
import GithubService from '@/services/github.service';
import { GithubIssue } from '@/types';
import { cn } from '@/utils';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { BsPostcardFill } from 'react-icons/bs';

type Props = {
  posts: GithubIssue[];
};

const Blog: React.FC<Props> = ({ posts }) => {
  const {
    searchTerm,
    setSearchTerm,
    selectedTag,
    setSelectedTag,
    tags,
    paginatedPosts,
    isPageable,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
  } = useBlogPosts({
    posts,
    pageSize: 5,
  });

  return (
    <>
      <NextSeo title="Blog" description="Pasquale Favella Blog" />
      <main>
        <label className="join w-full mb-3">
          <select
            className="select select-bordered focus:outline-none focus:border-primary max-w-xs join-item"
            id="select-tag"
            value={selectedTag}
            onChange={e => setSelectedTag(e.target.value)}
          >
            {tags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <input
            type="text"
            id="search-article"
            placeholder="Search articles"
            aria-label="Search articles"
            className="input input-bordered w-full focus:outline-none focus:border-primary join-item"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </label>

        {paginatedPosts.length > 0 ? (
          <>
            <PostList posts={paginatedPosts} />

            {/* Pagination Controls */}
            <div className={cn("join grid grid-cols-2 mx-auto mt-3 max-w-fit", { hidden: !isPageable })}>
              <button
                className="join-item btn btn-sm btn-outline btn-primary"
                onClick={previousPage}
                disabled={!hasPreviousPage}
              >
                Previous page
              </button>
              <button
                className="join-item btn btn-sm btn-outline btn-primary"
                onClick={nextPage}
                disabled={!hasNextPage}
              >
                Next
              </button>
            </div>

          </>
        ) : (
          <ContentNotFound Icon={BsPostcardFill} body="No post found" />
        )}
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = await GithubService.getAllIssues();

  return {
    props: { posts },
  };
};

export default Blog;