import { useEffect, useState } from "react";

type UsePaginatedArrayProps<T> = {
  array: T[];
  pageSize: number;
};

type UsePaginatedArrayType<T> = {
  pageIndex: number;
  pageSize: number;
  paginatedArray: T[];
  totalPages: number;
  totalItems: number;
  setPageIndex: (index: number) => void;
};

export const usePaginatedArray = <T>({
  array,
  pageSize,
}: UsePaginatedArrayProps<T>): UsePaginatedArrayType<T> => {
  const [pageIndex, setPageIndex] = useState(0);

  const totalItems = array.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedArray = array.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  useEffect(() => {
    setPageIndex(0);
  }, [array]);

  const isPageable = pageIndex !== 0 && pageIndex !== totalPages - 1;

  return {
    pageIndex,
    pageSize,
    paginatedArray,
    totalPages,
    totalItems,
    setPageIndex,
    isPageable,
  };
};
