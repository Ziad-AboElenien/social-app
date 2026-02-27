import { useEffect, useState } from "react";
import PostCard from "../../Components/PostCard/PostCard";
import PostCardSkelton from "../../Components/PostCardSkelton/PostCardSkelton";
import { postsApi } from "../../services/api";
import { getSavedPostIds } from "../../lib/savedPosts";

export default function SavedPosts() {
  const [posts, setPosts] = useState(null);

  async function loadSavedPosts() {
    const ids = getSavedPostIds();
    if (ids.length === 0) {
      setPosts([]);
      return;
    }

    const results = await Promise.all(
      ids.map(async (id) => {
        try {
          const { data } = await postsApi.getPostById(id);
          const post = data.data?.post || data.post || data.data;
          return post ? { ...post, id: post.id || post._id } : null;
        } catch {
          return null;
        }
      })
    );
    setPosts(results.filter(Boolean));
  }

  useEffect(() => {
    loadSavedPosts();
  }, []);

  return (
    <section className="container mx-auto max-w-3xl px-4 py-4">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Saved Posts</h1>
      {posts === null ? (
        <>
          <PostCardSkelton />
          <PostCardSkelton />
        </>
      ) : posts.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-center text-slate-500 shadow">No saved posts yet.</div>
      ) : (
        posts.map((post) => <PostCard key={post.id} postInfo={post} numOfComments={2} getAllPosts={loadSavedPosts} />)
      )}
    </section>
  );
}

