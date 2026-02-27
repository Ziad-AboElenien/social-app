import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faComment,
  faEllipsisH,
  faPaperPlane,
  faShare,
  faThumbsUp,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useFormik } from "formik";
import { AuthContext } from "../../Context/Auth.context";
import fallbackAvatar from "../../assets/images/prof.png";
import Comment from "../ui/comment/Comment";
import ConfirmModal from "../ui/ConfirmModal/ConfirmModal";
import { commentsApi, postsApi, usersApi } from "../../services/api";
import { useUI } from "../Hooks/useUI";
import { isPostSaved, toggleSavedPost } from "../../lib/savedPosts";

function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString();
}

export default function PostCard({ postInfo, numOfComments, getAllPosts }) {
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState(postInfo.comments || []);
  const [isAllCommentsVisible, setIsAllCommentsVisible] = useState(false);
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiked, setIsLiked] = useState(postInfo.isLiked || false);
  const [likesCount, setLikesCount] = useState(postInfo.likes?.length || 0);
  const [likesUsers, setLikesUsers] = useState([]);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(
    Boolean(postInfo.user?.isFollowing || postInfo.user?.isFollowed)
  );
  const [followLoading, setFollowLoading] = useState(false);
  const menuRef = useRef(null);
  const { token } = useContext(AuthContext);
  const { showAlert } = useUI();
  const postId = postInfo.id || postInfo._id;

  useEffect(() => {
    setIsSaved(isPostSaved(postId));
  }, [postId]);

  useEffect(() => {
    if (!user) return;
    const likesArray = Array.isArray(postInfo.likes) ? postInfo.likes : [];
    const likedByUser = likesArray.some((likeUser) => {
      if (typeof likeUser === "string") return likeUser === user._id;
      return likeUser?._id === user._id;
    });
    setIsLiked(Boolean(postInfo.isLiked ?? likedByUser));
    setLikesCount(postInfo.likesCount ?? likesArray.length ?? 0);
  }, [user, postInfo]);

  async function fetchComments() {
    try {
      const { data } = await commentsApi.getPostComments(postId);
      setComments(data.data?.comments || []);
    } catch (error) {
      showAlert({
        type: "error",
        title: "Comments Error",
        message: error.response?.data?.message || "Failed to load comments.",
      });
    }
  }

  async function fetchCurrentUser() {
    if (!token) return;
    try {
      const { data } = await usersApi.getProfileData();
      setUser(data.data.user);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    fetchComments();
    fetchCurrentUser();
  }, [postId]);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpened(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  async function handleLikePost() {
    const oldLiked = isLiked;
    const oldCount = likesCount;
    setIsLiked(!oldLiked);
    setLikesCount((count) => (oldLiked ? Math.max(0, count - 1) : count + 1));
    try {
      await postsApi.toggleLike(postId);
    } catch {
      setIsLiked(oldLiked);
      setLikesCount(oldCount);
      showAlert({
        type: "error",
        title: "Like Failed",
        message: "Failed to update like status.",
      });
    }
  }

  async function handleFollowAuthor() {
    if (!postInfo.user?._id || !user || postInfo.user._id === user._id) return;
    const oldState = isFollowingAuthor;
    setFollowLoading(true);
    setIsFollowingAuthor(!oldState);
    try {
      if (oldState) {
        await usersApi.unfollowUser(postInfo.user._id);
      } else {
        await usersApi.followUser(postInfo.user._id);
      }
    } catch {
      setIsFollowingAuthor(oldState);
      showAlert({
        type: "error",
        title: "Follow Failed",
        message: "Failed to update follow status.",
      });
    } finally {
      setFollowLoading(false);
    }
  }

  async function handleSubmit(values, { resetForm }) {
    try {
      const formData = new FormData();
      formData.append("content", values.content);
      if (values.image) formData.append("image", values.image);
      await commentsApi.createPostComment(postId, formData);
      resetForm();
      fetchComments();
      showAlert({
        type: "success",
        title: "Comment Added",
        message: "Your comment has been added.",
      });
    } catch (error) {
      showAlert({
        type: "error",
        title: "Comment Failed",
        message: error.response?.data?.message || "Failed to add comment.",
      });
    }
  }

  async function handleDeletePost() {
    setIsDeleting(true);
    try {
      await postsApi.deletePost(postId);
      showAlert({
        type: "success",
        title: "Post Deleted",
        message: "Post was deleted successfully.",
      });
      if (getAllPosts) getAllPosts();
    } catch (error) {
      showAlert({
        type: "error",
        title: "Delete Failed",
        message: error.response?.data?.error || "You can only delete your own posts.",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setIsMenuOpened(false);
    }
  }

  async function handleBookmark() {
    try {
      await postsApi.toggleBookmark(postId);
      toggleSavedPost(postId);
      setIsSaved((s) => !s);
      showAlert({
        type: "success",
        title: isSaved ? "Removed" : "Saved",
        message: isSaved ? "Post removed from saved list." : "Post saved successfully.",
      });
      if (getAllPosts) getAllPosts();
    } catch {
      showAlert({
        type: "error",
        title: "Bookmark Failed",
        message: "Failed to update saved state.",
      });
    }
  }

  async function handleShare() {
    try {
      const { data } = await postsApi.sharePost(postId);
      const url = data.data?.shareUrl || data.shareUrl || window.location.origin + `/post/${postId}`;
      await navigator.clipboard.writeText(url);
      showAlert({
        type: "success",
        title: "Link Copied",
        message: "Share link copied to clipboard.",
      });
    } catch {
      showAlert({
        type: "error",
        title: "Share Failed",
        message: "Failed to share this post.",
      });
    }
  }

  async function handleOpenLikes() {
    try {
      const { data } = await postsApi.getPostLikes(postId, { page: 1, limit: 20 });
      setLikesUsers(data.data?.likes || data.likes || data.data || []);
      setShowLikesModal(true);
    } catch {
      showAlert({
        type: "error",
        title: "Likes Error",
        message: "Failed to load likes list.",
      });
    }
  }

  const formik = useFormik({
    initialValues: { content: "", image: null },
    onSubmit: handleSubmit,
  });

  const postCreatorImage =
    postInfo.user?.photo && !postInfo.user.photo.includes("undefined")
      ? postInfo.user.photo
      : fallbackAvatar;
  const isOwner = Boolean(user?._id && postInfo.user?._id && user._id === postInfo.user._id);

  return (
    <>
      <div className="mx-auto mb-4 max-w-2xl rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <Link to={`/profile/${postInfo.user?._id}`} className="flex items-center gap-2">
            <img src={postCreatorImage} alt="avatar" className="h-10 w-10 rounded-full object-cover" />
            <div className="hover:underline">
              <p className="text-[15px] font-semibold text-gray-900">{postInfo.user?.name}</p>
              <p className="text-[13px] text-gray-500">{formatTimeAgo(postInfo.createdAt)}</p>
            </div>
          </Link>

          <div className="relative flex items-center gap-2" ref={menuRef}>
            {!isOwner ? (
              <button
                type="button"
                onClick={handleFollowAuthor}
                disabled={followLoading}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  isFollowingAuthor ? "bg-slate-100 text-slate-700" : "bg-blue-600 text-white"
                } disabled:opacity-60`}
              >
                {followLoading ? "..." : isFollowingAuthor ? "Following" : "Follow"}
              </button>
            ) : null}
            <button type="button" onClick={() => setIsMenuOpened((s) => !s)} className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100">
              <FontAwesomeIcon icon={faEllipsisH} />
            </button>
            {isMenuOpened ? (
              <div className="absolute right-0 top-10 z-50 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                {isOwner ? (
                  <>
                    <Link to={`/update/${postId}`} onClick={() => setIsMenuOpened(false)} className="flex items-center gap-3 px-4 py-2.5 text-[15px] text-gray-800 hover:bg-gray-100">
                      <FontAwesomeIcon icon={faPenToSquare} className="text-gray-600" />
                      Edit post
                    </Link>
                    <div className="mx-2 h-px bg-gray-100" />
                    <button type="button" onClick={() => setShowDeleteModal(true)} className="flex w-full items-center gap-3 px-4 py-2.5 text-[15px] text-red-600 hover:bg-gray-100">
                      <FontAwesomeIcon icon={faTrash} />
                      Delete post
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={handleBookmark} className="flex w-full items-center gap-3 px-4 py-2.5 text-[15px] text-amber-700 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faBookmark} />
                    {isSaved ? "Unsave post" : "Save post"}
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {postInfo.body ? <p className="px-4 pb-3 text-[15px] text-gray-900">{postInfo.body}</p> : null}
        {postInfo.image ? <img src={postInfo.image} alt="post" className="w-full object-cover" style={{ maxHeight: 500 }} /> : null}

        <div className="flex items-center justify-between px-4 py-2 text-[13px] text-gray-500">
          <button onClick={handleOpenLikes}>{likesCount} likes</button>
          <button onClick={() => setIsAllCommentsVisible((s) => !s)}>{comments.length} comments</button>
        </div>

        <div className="flex items-center border-y border-gray-200">
          <button onClick={handleLikePost} className={`flex-1 py-2 text-[15px] font-semibold ${isLiked ? "text-blue-600" : "text-gray-600"}`}>
            <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
            Like
          </button>
          <button onClick={() => setIsAllCommentsVisible((s) => !s)} className="flex-1 py-2 text-[15px] font-semibold text-gray-600">
            <FontAwesomeIcon icon={faComment} className="mr-2" />
            Comment
          </button>
          <button onClick={handleBookmark} className={`flex-1 py-2 text-[15px] font-semibold ${isSaved ? "text-amber-600" : "text-gray-600"}`}>
            <FontAwesomeIcon icon={faBookmark} className="mr-2" />
            Save
          </button>
          <button onClick={handleShare} className="flex-1 py-2 text-[15px] font-semibold text-gray-600">
            <FontAwesomeIcon icon={faShare} className="mr-2" />
            Share
          </button>
        </div>

        <div className="px-4 pb-3 pt-3">
          <div className="space-y-1">
            {(isAllCommentsVisible ? comments : comments.slice(0, numOfComments)).map((comment, index) => (
              <Comment key={comment._id || index} commentInfo={comment} postId={postId} onCommentUpdated={fetchComments} />
            ))}
            {comments.length === 0 ? <p className="py-3 text-center text-sm text-gray-400">No comments yet.</p> : null}
          </div>

          <form onSubmit={formik.handleSubmit} className="mt-3">
            <div className="flex items-center gap-2">
              <img src={user?.photo || fallbackAvatar} alt="you" className="h-9 w-9 rounded-full object-cover" />
              <div className="flex-1 rounded-2xl bg-gray-100 px-4 py-2">
                <input
                  type="text"
                  name="content"
                  onChange={formik.handleChange}
                  value={formik.values.content}
                  placeholder="Write a comment..."
                  className="w-full bg-transparent text-[15px] text-gray-700 outline-none"
                />
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={!formik.values.content.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white disabled:opacity-40"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        onConfirm={handleDeletePost}
        onCancel={() => setShowDeleteModal(false)}
      />

      <ConfirmModal
        isOpen={showLikesModal}
        title="People who liked this post"
        message={
          likesUsers.length
            ? likesUsers
                .map((user) => user.name || user.username || "User")
                .slice(0, 10)
                .join(", ")
            : "No likes yet."
        }
        confirmText="Close"
        cancelText="Close"
        type="info"
        onConfirm={() => setShowLikesModal(false)}
        onCancel={() => setShowLikesModal(false)}
      />
    </>
  );
}
