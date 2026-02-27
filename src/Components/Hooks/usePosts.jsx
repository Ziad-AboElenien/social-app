import { useEffect, useState } from "react";
import { postsApi } from "../../services/api";

export function usePosts(only = "all") {
  const [posts, setPosts] = useState(null);

  async function getAllPosts() {
    try {
      const { data } = await postsApi.getFeed({ only, page: 1, limit: 30 });
      const normalizedPosts = (data.data?.posts || data.posts || data.data || []).map((post) => ({
        ...post,
        id: post.id || post._id,
      }));
      setPosts(normalizedPosts.reverse());
    } catch (error) {
      try {
        const { data } = await postsApi.getAllPosts();
        const fallbackPosts = (data.data?.posts || data.posts || []).map((post) => ({
          ...post,
          id: post.id || post._id,
        }));
        setPosts(fallbackPosts.reverse());
      } catch {
        setPosts([]);
      }
    }
  }

  useEffect(() => {
    getAllPosts();
  }, [only]);

  return { posts, getAllPosts };
}
