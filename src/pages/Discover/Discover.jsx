import { useEffect, useState } from "react";
import { postsApi, usersApi } from "../../services/api";
import fallbackAvatar from "../../assets/images/prof.png";

export default function Discover() {
  const [users, setUsers] = useState([]);
  const [followState, setFollowState] = useState({});

  useEffect(() => {
    async function loadSuggestions() {
      try {
        const { data } = await usersApi.getSuggestions({ limit: 20 });
        let suggestions = [];
        if (Array.isArray(data?.data?.users)) suggestions = data.data.users;
        else if (Array.isArray(data?.data)) suggestions = data.data;
        else if (Array.isArray(data)) suggestions = data;
        else if (data?.data && typeof data.data === "object") suggestions = Object.values(data.data);
        else suggestions = [];
        if (!suggestions.length) {
          const feedRes = await postsApi.getAllPosts();
          const posts = feedRes.data?.data?.posts || [];
          const uniqueUsersMap = new Map();
          posts.forEach((post) => {
            const user = post.user;
            if (user?._id && !uniqueUsersMap.has(user._id)) {
              uniqueUsersMap.set(user._id, user);
            }
          });
          suggestions = Array.from(uniqueUsersMap.values());
        }
        setUsers(suggestions);
      } catch {
        try {
          const feedRes = await postsApi.getAllPosts();
          const posts = feedRes.data?.data?.posts || [];
          const uniqueUsersMap = new Map();
          posts.forEach((post) => {
            const user = post.user;
            if (user?._id && !uniqueUsersMap.has(user._id)) {
              uniqueUsersMap.set(user._id, user);
            }
          });
          setUsers(Array.from(uniqueUsersMap.values()));
        } catch {
          setUsers([]);
        }
      }
    }
    loadSuggestions();
  }, []);

  async function handleFollowToggle(user) {
    const userId = user._id;
    const current = followState[userId] ?? (user.isFollowing ? "followed" : "idle");
    setFollowState((prev) => ({ ...prev, [userId]: "loading" }));
    try {
      if (current === "followed") {
        await usersApi.unfollowUser(userId);
        setFollowState((prev) => ({ ...prev, [userId]: "idle" }));
      } else {
        await usersApi.followUser(userId);
        setFollowState((prev) => ({ ...prev, [userId]: "followed" }));
      }
    } catch {
      setFollowState((prev) => ({ ...prev, [userId]: current }));
    }
  }

  return (
    <section className="container mx-auto max-w-4xl px-4 py-4">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Discover People</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {(Array.isArray(users) ? users : []).map((user) => {
          const photo = user.photo && !user.photo.includes("undefined") ? user.photo : fallbackAvatar;
          return (
            <div key={user._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                <img src={photo} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-500">@{user.username || user.name?.toLowerCase().replace(/\s+/g, "")}</p>
                </div>
                </div>
                <button
                  onClick={() => handleFollowToggle(user)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                    (followState[user._id] ?? (user.isFollowing ? "followed" : "idle")) === "followed"
                      ? "bg-slate-100 text-slate-700"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {(followState[user._id] ?? (user.isFollowing ? "followed" : "idle")) === "loading"
                    ? "..."
                    : (followState[user._id] ?? (user.isFollowing ? "followed" : "idle")) === "followed"
                    ? "Unfollow"
                    : "Follow"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
