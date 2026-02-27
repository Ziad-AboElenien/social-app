import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faFileLines, faUserGroup, faBookmark } from "@fortawesome/free-solid-svg-icons";
import PostCard from "../../Components/PostCard/PostCard";
import PostCardSkelton from "../../Components/PostCardSkelton/PostCardSkelton";
import { usersApi } from "../../services/api";
import { useUI } from "../../Components/Hooks/useUI";
import fallbackAvatar from "../../assets/images/prof.png";
import { getSavedPostIds } from "../../lib/savedPosts";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [tab, setTab] = useState("posts");
  const { showAlert } = useUI();

  async function getProfileData() {
    try {
      const { data } = await usersApi.getProfileData();
      const user = data.data.user;
      setProfile(user);
      getUserPosts(user._id);
    } catch {
      showAlert({
        type: "error",
        title: "Profile Error",
        message: "Failed to load profile data.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function getUserPosts(userId) {
    setPostsLoading(true);
    try {
      const { data } = await usersApi.getUserPosts(userId, { limit: 100 });
      const normalized = (data.data?.posts || []).map((post) => ({ ...post, id: post.id || post._id }));
      setPosts(normalized);
    } catch {
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  }

  function refreshPosts() {
    if (profile?._id) getUserPosts(profile._id);
  }

  useEffect(() => {
    getProfileData();
  }, []);

  const savedIds = useMemo(() => getSavedPostIds(), [tab, posts.length]);
  const savedPosts = posts.filter((post) => savedIds.includes(post.id || post._id));
  const postsToRender = tab === "saved" ? savedPosts : posts;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Failed to load profile data.</p>
        </div>
      </div>
    );
  }

  const profileImage = profile.photo?.includes("undefined") ? fallbackAvatar : profile.photo || fallbackAvatar;
  const userHandle = profile.username || profile.name.toLowerCase().replace(/\s+/g, "");

  return (
    <section className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="h-40 rounded-t-3xl bg-gradient-to-r from-[#1b2c53] via-[#264978] to-[#5f96c4] sm:h-56 lg:h-72" />

        <div className="-mt-8 px-3 pb-3 sm:-mt-10 sm:px-6 sm:pb-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <img src={profileImage} alt={profile.name} className="h-20 w-20 rounded-full border-4 border-white object-cover shadow sm:h-28 sm:w-28" />
                  <div>
                    <h1 className="text-2xl font-black text-[#0d1b3a] sm:text-4xl lg:text-5xl">{profile.name}</h1>
                    <p className="text-base font-bold text-slate-500 sm:text-xl lg:text-2xl">@{userHandle}</p>
                    <span className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                      <FontAwesomeIcon icon={faUserGroup} className="mr-2" />
                      Route Posts member
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 sm:mt-6">
                  <p className="mb-2 text-sm font-black text-slate-800">About</p>
                  <p className="text-slate-600">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    {profile.email}
                  </p>
                  <p className="mt-2 text-slate-500">Active on Route Posts</p>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                    <p className="text-xs font-black text-slate-500">FOLLOWERS</p>
                    <p className="mt-2 text-3xl font-black text-[#0d1b3a]">{profile.followersCount ?? 0}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                    <p className="text-xs font-black text-slate-500">FOLLOWING</p>
                    <p className="mt-2 text-3xl font-black text-[#0d1b3a]">{profile.followingCount ?? 0}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                    <p className="text-xs font-black text-slate-500">BOOKMARKS</p>
                    <p className="mt-2 text-3xl font-black text-[#0d1b3a]">{savedPosts.length}</p>
                  </div>
                </div>
                <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-sm font-black text-blue-800">MY POSTS</p>
                  <p className="text-3xl font-black text-[#0d1b3a] sm:text-4xl">{posts.length}</p>
                </div>
                <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-sm font-black text-blue-800">SAVED POSTS</p>
                  <p className="text-3xl font-black text-[#0d1b3a] sm:text-4xl">{savedPosts.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center gap-2 rounded-xl bg-slate-100 p-1 sm:w-auto">
            <button
              onClick={() => setTab("posts")}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-black sm:flex-none sm:px-5 ${tab === "posts" ? "bg-white text-blue-600 shadow" : "text-slate-600"}`}
            >
              <FontAwesomeIcon icon={faFileLines} className="mr-2" />
              My Posts
            </button>
            <button
              onClick={() => setTab("saved")}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-black sm:flex-none sm:px-5 ${tab === "saved" ? "bg-white text-blue-600 shadow" : "text-slate-600"}`}
            >
              <FontAwesomeIcon icon={faBookmark} className="mr-2" />
              Saved
            </button>
          </div>
          <span className="grid h-9 w-9 place-items-center self-end rounded-full bg-blue-50 text-sm font-black text-blue-600 sm:self-auto">
            {postsToRender.length}
          </span>
        </div>
      </div>

      <div className="mt-4">
        {postsLoading ? (
          <>
            <PostCardSkelton />
            <PostCardSkelton />
          </>
        ) : postsToRender.length > 0 ? (
          postsToRender.map((post) => (
            <PostCard key={post.id} postInfo={post} numOfComments={2} getAllPosts={refreshPosts} />
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            No posts to show.
          </div>
        )}
      </div>
    </section>
  );
}
