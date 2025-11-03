import { useEffect, useMemo } from 'react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { CONSTANTS } from '@/config';
import { GithubIssue } from '@/types';

type Props = {
  posts: GithubIssue[];
  pageSize?: number;
  debounceMs?: number;
};

export const useBlogPosts = ({ 
  posts, 
  pageSize = 10,
  debounceMs = 300 
}: Props) => {
  const [state, setState] = useQueryStates(
    {
      search: parseAsString.withDefault(''),
      tag: parseAsString.withDefault(CONSTANTS.LABELS.ALL),
      page: parseAsInteger.withDefault(0),
    },
    {
      history: 'push',
      shallow: true,
      scroll: true,
      limitUrlUpdates: {
        method: 'debounce',
        timeMs: debounceMs
      }
    }
  );

  // Generate available tags from posts
  const tags = useMemo(
    () =>
      Array.from(
        new Set([
          CONSTANTS.LABELS.ALL,
          ...posts
            .flatMap(post => post.labels.map(label => label.name))
            .filter(tag => tag !== CONSTANTS.LABELS.DOC)
            .sort(),
        ])
      ),
    [posts]
  );

  // Filter posts based on search and tag
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const searchLower = state.search.toLowerCase();
      const titleLower = post.title.toLowerCase();
      const bodyLower = post.body.toLowerCase();

      const matchesSearch =
        !state.search ||
        titleLower.includes(searchLower) ||
        bodyLower.includes(searchLower);

      if (state.tag && state.tag !== CONSTANTS.LABELS.ALL) {
        const matchesTag = post.labels.some(
          label => label.name.toLowerCase() === state.tag.toLowerCase()
        );
        return matchesTag && matchesSearch;
      }

      return matchesSearch;
    });
  }, [posts, state.search, state.tag]);

  // Pagination calculations
  const totalItems = filteredPosts.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const validPageIndex = Math.max(0, Math.min(state.page, Math.max(0, totalPages - 1)));

  const paginatedPosts = filteredPosts.slice(
    validPageIndex * pageSize,
    (validPageIndex + 1) * pageSize
  );

  // Reset to first page when filters change
  useEffect(() => {
    if (state.page !== 0 && filteredPosts.length > 0) {
      setState({ page: 0 });
    }
  }, [state.search, state.tag]);

  // Ensure page is within bounds
  useEffect(() => {
    if (validPageIndex !== state.page && filteredPosts.length > 0) {
      setState({ page: validPageIndex });
    }
  }, [validPageIndex, state.page, filteredPosts.length]);

  const isPageable = totalPages > 1;
  const hasNextPage = validPageIndex < totalPages - 1;
  const hasPreviousPage = validPageIndex > 0;

  // Action handlers
  const setSearchTerm = (search: string) => {
    setState({ search });
  };

  const setSelectedTag = (tag: string) => {
    setState({ tag });
  };

  const setPageIndex = (page: number) => {
    setState({ page });
  };

  const nextPage = () => {
    if (hasNextPage) {
      setState({ page: validPageIndex + 1 });
    }
  };

  const previousPage = () => {
    if (hasPreviousPage) {
      setState({ page: validPageIndex - 1 });
    }
  };

  const goToFirstPage = () => setState({ page: 0 });
  
  const goToLastPage = () => setState({ page: totalPages - 1 });

  const clearFilters = () => {
    setState({
      search: '',
      tag: CONSTANTS.LABELS.ALL,
      page: 0,
    });
  };

  return {
    // State
    searchTerm: state.search,
    selectedTag: state.tag,
    pageIndex: validPageIndex,
    
    // Data
    paginatedPosts,
    filteredPosts,
    allPosts: posts,
    tags,
    
    // Pagination info
    totalItems,
    totalPages,
    pageSize,
    isPageable,
    hasNextPage,
    hasPreviousPage,
    
    // Actions
    setSearchTerm,
    setSelectedTag,
    setPageIndex,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    clearFilters,
  };
};