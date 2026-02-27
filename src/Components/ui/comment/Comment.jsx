import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faPaperPlane,
  faPenToSquare,
  faThumbsUp,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import fallbackAvatar from "../../../assets/images/prof.png";
import { commentsApi } from "../../../services/api";
import { useUI } from "../../Hooks/useUI";

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
  return `${days}d`;
}

export default function Comment({ commentInfo, postId, onCommentUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(commentInfo.content || "");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [liked, setLiked] = useState(Boolean(commentInfo.isLiked));
  const [likesCount, setLikesCount] = useState(commentInfo.likes?.length || 0);
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const { showAlert } = useUI();
  const avatar =
    commentInfo.commentCreator?.photo && !commentInfo.commentCreator.photo.includes("undefined")
      ? commentInfo.commentCreator.photo
      : fallbackAvatar;

  async function loadReplies() {
    try {
      const { data } = await commentsApi.getReplies(postId, commentInfo._id);
      setReplies(data.data?.replies || data.replies || data.data || []);
    } catch {
      setReplies([]);
    }
  }

  useEffect(() => {
    loadReplies();
  }, [postId, commentInfo._id]);

  async function updateComment() {
    if (!editContent.trim()) {
      showAlert({ type: "error", title: "Invalid Comment", message: "Comment cannot be empty." });
      return;
    }
    setLoadingAction(true);
    try {
      const formData = new FormData();
      formData.append("content", editContent.trim());
      await commentsApi.updatePostComment(postId, commentInfo._id, formData);
      setIsEditing(false);
      onCommentUpdated?.();
      showAlert({ type: "success", title: "Comment Updated", message: "Comment updated successfully." });
    } catch (error) {
      showAlert({
        type: "error",
        title: "Update Failed",
        message: error.response?.data?.error || "You can only edit your own comments.",
      });
    } finally {
      setLoadingAction(false);
    }
  }

  async function deleteComment() {
    setLoadingAction(true);
    try {
      await commentsApi.deletePostComment(postId, commentInfo._id);
      onCommentUpdated?.();
      showAlert({ type: "success", title: "Comment Deleted", message: "Comment deleted successfully." });
    } catch (error) {
      showAlert({
        type: "error",
        title: "Delete Failed",
        message: error.response?.data?.error || "You can only delete your own comments.",
      });
    } finally {
      setShowDeleteModal(false);
      setLoadingAction(false);
    }
  }

  async function toggleLike() {
    try {
      await commentsApi.toggleCommentLike(postId, commentInfo._id);
      setLiked((s) => !s);
      setLikesCount((count) => (liked ? Math.max(0, count - 1) : count + 1));
    } catch {
      showAlert({ type: "error", title: "Like Failed", message: "Failed to like comment." });
    }
  }

  async function createReply() {
    if (!replyContent.trim()) return;
    setLoadingAction(true);
    try {
      const formData = new FormData();
      formData.append("content", replyContent.trim());
      await commentsApi.createReply(postId, commentInfo._id, formData);
      setReplyContent("");
      setShowReplyForm(false);
      loadReplies();
      onCommentUpdated?.();
      showAlert({ type: "success", title: "Reply Added", message: "Reply added successfully." });
    } catch {
      showAlert({ type: "error", title: "Reply Failed", message: "Failed to add reply." });
    } finally {
      setLoadingAction(false);
    }
  }

  return (
    <>
      <div className="mt-3 flex gap-2">
        <img src={avatar} alt="" className="mt-0.5 h-9 w-9 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <div className="inline-block max-w-full rounded-2xl bg-gray-100 px-3 py-2">
            <p className="text-[13px] font-semibold text-gray-900">{commentInfo.commentCreator?.name}</p>
            {isEditing ? (
              <input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="mt-1 w-full rounded border border-blue-300 bg-white px-2 py-1 text-sm outline-none"
              />
            ) : (
              <p className="text-[14px] text-gray-800 break-words">{editContent}</p>
            )}
          </div>

          <div className="ml-1 mt-1 flex items-center gap-3 text-[13px] font-semibold text-gray-500">
            <span>{formatTimeAgo(commentInfo.createdAt)}</span>
            <button onClick={toggleLike} className={liked ? "text-blue-600" : ""}>
              <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
              Like ({likesCount})
            </button>
            <button onClick={() => setShowReplyForm((s) => !s)}>Reply</button>
            {isEditing ? (
              <>
                <button onClick={updateComment} disabled={loadingAction} className="text-green-700">
                  <FontAwesomeIcon icon={faCheck} className="mr-1" />
                  Save
                </button>
                <button onClick={() => setIsEditing(false)} className="text-gray-600">
                  <FontAwesomeIcon icon={faTimes} className="mr-1" />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)}>
                  <FontAwesomeIcon icon={faPenToSquare} className="mr-1" />
                  Edit
                </button>
                <button onClick={() => setShowDeleteModal(true)} className="text-red-600">
                  <FontAwesomeIcon icon={faTrash} className="mr-1" />
                  Delete
                </button>
              </>
            )}
          </div>

          {showReplyForm ? (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <button
                onClick={createReply}
                disabled={loadingAction || !replyContent.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
              </button>
            </div>
          ) : null}

          {replies.length > 0 ? (
            <button onClick={() => setShowReplies((s) => !s)} className="mt-2 text-xs font-semibold text-blue-600">
              {showReplies ? "Hide replies" : `View replies (${replies.length})`}
            </button>
          ) : null}

          {showReplies ? (
            <div className="mt-2 space-y-2">
              {replies.map((reply) => (
                <div key={reply._id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <p className="font-semibold">{reply.replyCreator?.name || "User"}</p>
                  <p>{reply.content}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={loadingAction}
        onConfirm={deleteComment}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}
