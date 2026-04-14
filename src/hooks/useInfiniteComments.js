import { useCallback, useEffect, useRef, useState } from "react";
import { getPostComments } from "../services/postService";

export default function useInfiniteComments(postId, isOpen) {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchedOnceRef = useRef(false);

  const loadComments = useCallback(
    async (targetPage = 1, reset = false) => {
      if (!postId || loading) return;
      if(loading) return;
      if (!hasNextPage && !reset) return;

      try {
        setError("");

        if (targetPage === 1) {
          setInitialLoading(true);
        } else {
          setLoading(true);
        }

        const response = await getPostComments({
          postId,
          page: targetPage,
          limit: 5,
        });

        const nextComments = response?.data || [];
        const nextHasNextPage =
          response?.pagination?.hasNextPage ?? nextComments.length > 0;

        setComments((prev) =>
          reset ? nextComments : [...prev, ...nextComments],
        );
        setPage(targetPage);
        setHasNextPage(nextHasNextPage);
      } catch (err) {
        setError(
          err?.response?.data?.message || err.message || "Load comments failed",
        );
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [postId, loading, hasNextPage],
  );

  useEffect(() => {
    if (!isOpen || !postId) return;

    if (!fetchedOnceRef.current) {
      fetchedOnceRef.current = true;
      loadComments(1, true);
    }
  }, [isOpen, postId, loadComments]);

  const loadMore = useCallback(() => {
    if (loading || initialLoading || !hasNextPage) return;
    loadComments(page + 1, false);
  }, [loading, initialLoading, hasNextPage, loadComments, page]);

  const refresh = useCallback(() => {
    setHasNextPage(true);
    loadComments(1, true);
  }, [loadComments]);

  return {
    comments,
    loading,
    initialLoading,
    error,
    hasNextPage,
    loadMore,
    refresh,
  };
}
