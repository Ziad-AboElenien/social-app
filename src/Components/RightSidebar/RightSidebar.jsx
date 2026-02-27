import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faSpinner, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import profileImg from "../../assets/images/prof.png";
import { useEffect, useState } from "react";
import { usersApi } from "../../services/api";
import { Link } from "react-router";

export default function RightSidebar() {
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [followState, setFollowState] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  async function fetchSuggestions() {
    setLoadingSuggestions(true);
    try {
      const { data } = await usersApi.getSuggestions({ limit: 15 });
      const users = data.data?.users || data.data || [];
      setSuggestions(users);
      setFilteredSuggestions(users);
    } catch {
      setSuggestions([]);
      setFilteredSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }

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

  function handleSearch(e) {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredSuggestions(suggestions);
      return;
    }
    setFilteredSuggestions(
      suggestions.filter(
        (u) =>
          u.name?.toLowerCase().includes(query.toLowerCase()) ||
          u.username?.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const safeFiltered = Array.isArray(filteredSuggestions) ? filteredSuggestions : [];
  const displayedSuggestions = showAll ? safeFiltered : safeFiltered.slice(0, 5);

  function getUserPhoto(user) {
    return user?.photo?.includes("undefined") || !user?.photo ? profileImg : user.photo;
  }

  return (
    <aside className="sticky top-24">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUsers} className="text-blue-600" />
            <h3 className="text-xl font-extrabold text-slate-800">Suggested Friends</h3>
          </div>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
            {safeFiltered.length}
          </span>
        </div>

        <div className="relative mb-4">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search friends..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-300"
          />
        </div>

        {loadingSuggestions ? (
          <div className="flex items-center justify-center py-6 text-slate-500">
            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            Loading...
          </div>
        ) : (
          <ul className="space-y-3">
            {displayedSuggestions.map((user) => {
              const state = followState[user._id] ?? (user.isFollowing ? "followed" : "idle");
              const isLoading = state === "loading";
              const isFollowed = state === "followed";

              return (
                <li key={user._id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Link to={`/profile/${user._id}`} className="flex min-w-0 items-center gap-2">
                      <img src={getUserPhoto(user)} alt={user.name} className="h-11 w-11 rounded-full object-cover" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-slate-900">{user.name}</p>
                        <p className="truncate text-sm text-xs text-slate-500">@{user.username || "route_user"}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleFollowToggle(user)}
                      disabled={isLoading}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                        isFollowed ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      <FontAwesomeIcon icon={faUserPlus} className="mr-1" />
                      {isLoading ? "..." : isFollowed ? "Following" : "Follow"}
                    </button>
                  </div>
                  <div className="mt-2 flex gap-2 text-xs">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">
                      {user.followersCount ?? user.followers?.length ?? 0} followers
                    </span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-600">1 mutual</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {safeFiltered.length > 5 ? (
          <button
            onClick={() => setShowAll((s) => !s)}
            className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-sm font-bold text-slate-600"
          >
            {showAll ? "View less" : "View more"}
          </button>
        ) : null}
      </div>
    </aside>
  );
}
