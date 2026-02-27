import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import PostCard from "../../Components/PostCard/PostCard";
import PostCardSkelton from "../../Components/PostCardSkelton/PostCardSkelton";
import fallbackAvatar from "../../assets/images/prof.png";
import { usersApi } from "../../services/api";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [followState, setFollowState] = useState("idle");
  const [loading, setLoading] = useState(true);

  async function loadUserProfile() {
    setLoading(true);
    try {
      const [postsRes, meRes] = await Promise.all([
        usersApi.getUserPosts(userId, { limit: 50 }),
        usersApi.getProfileData(),
      ]);
      const userPosts = (postsRes.data.data?.posts || []).map((post) => ({ ...post, id: post.id || post._id }));
      const me = meRes.data.data.user;
      setCurrentUserId(me._id);
      setPosts(userPosts);
      if (userPosts.length > 0) {
        setProfile(userPosts[0].user);
        setFollowState(userPosts[0].user?.isFollowing ? "followed" : "idle");
      } else {
        setProfile({ _id: userId, name: "User", username: "user", photo: fallbackAvatar });
      }
    } catch {
      setPosts([]);
      setProfile({ _id: userId, name: "User", username: "user", photo: fallbackAvatar });
    } finally {
      setLoading(false);
    }
  }

  async function handleFollowToggle() {
    if (!profile?._id || profile._id === currentUserId) return;
    const old = followState;
    setFollowState("loading");
    try {
      if (old === "followed") {
        await usersApi.unfollowUser(profile._id);
        setFollowState("idle");
      } else {
        await usersApi.followUser(profile._id);
        setFollowState("followed");
      }
    } catch {
      setFollowState(old);
    }
  }

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const photo = profile?.photo && !String(profile.photo).includes("undefined") ? profile.photo : fallbackAvatar;
  const canFollow = useMemo(() => currentUserId && profile?._id && currentUserId !== profile._id, [currentUserId, profile]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-6">
        <PostCardSkelton />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back
      </button>

      <div className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-40 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center sm:h-64" />
        <div className="-mt-8 px-3 pb-3 sm:-mt-10 sm:px-4 sm:pb-4">
          <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <img src={photo} alt={profile?.name} className="h-16 w-16 rounded-full object-cover ring-4 ring-white sm:h-20 sm:w-20" />
                <div>
                  <h1 className="text-xl font-black text-[#0d1b3a] sm:text-3xl">{profile?.name || "User"}</h1>
                  <p className="text-base font-semibold text-slate-500 sm:text-2xl">@{profile?.username || "user"}</p>
                </div>
              </div>

              {canFollow ? (
                <button
                  onClick={handleFollowToggle}
                  className={`w-full rounded-xl border px-5 py-2 text-sm font-black sm:w-auto ${
                    followState === "followed"
                      ? "border-slate-300 bg-slate-100 text-slate-700"
                      : "border-blue-200 bg-blue-50 text-blue-600"
                  }`}
                >
                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
                  {followState === "loading" ? "..." : followState === "followed" ? "Following" : "Follow"}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm">
          This user has no posts yet.
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} postInfo={post} numOfComments={2} getAllPosts={loadUserProfile} />
        ))
      )}
    </section>
  );
}
