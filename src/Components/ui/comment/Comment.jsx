import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import x from '../../../assets/images/prof.png'
import { faCheck, faThumbsUp, faTimes, faTrash, faEllipsisH, faImage, faFaceSmile, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import { useContext, useState, useEffect, useRef } from 'react'
import { AuthContext } from '../../../Context/Auth.context'
import axios from 'axios'
import { toast } from 'react-toastify'

function formatTimeAgo(dateString) {
    const now = new Date()
    const date = new Date(dateString)
    const seconds = Math.floor((now - date) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d`
    const weeks = Math.floor(days / 7)
    if (weeks < 4) return `${weeks}w`
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
}

export default function Comment({ commentInfo, onCommentUpdated }) {
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(commentInfo.content)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [currentContent, setCurrentContent] = useState(commentInfo.content)
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyContent, setReplyContent] = useState('')
    const [replyImage, setReplyImage] = useState(null)
    const [isReplying, setIsReplying] = useState(false)
    const [liked, setLiked] = useState(Boolean(commentInfo.isLiked))
    const [likesCount, setLikesCount] = useState(commentInfo.likes?.length || commentInfo.likesCount || 0)
    const [replies, setReplies] = useState([])
    const [loadingReplies, setLoadingReplies] = useState(false)
    const [showReplies, setShowReplies] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

    const menuRef = useRef(null)
    const { token } = useContext(AuthContext)

    const commentCreatorImage = commentInfo.commentCreator.photo.includes('undefined') ? x : commentInfo.commentCreator.photo

    async function fetchReplies() {
        setLoadingReplies(true)
        try {
            const commentBase = commentInfo.post || commentInfo.postId || commentInfo.post_id || null
            const url = commentBase
                ? `https://route-posts.routemisr.com/posts/${commentBase}/comments/${commentInfo._id}/replies`
                : `https://route-posts.routemisr.com/comments/${commentInfo._id}/replies`
            const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
            setReplies(data.data?.replies || [])
        } catch {
            setReplies([])
        } finally {
            setLoadingReplies(false)
        }
    }

    useEffect(() => {
        fetchReplies()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentInfo._id, token])

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    async function handleUpdateComment() {
        if (!editContent.trim()) { toast.error('Comment cannot be empty'); return }
        if (editContent.trim() === currentContent.trim()) { setIsEditing(false); return }
        setIsSubmitting(true)
        try {
            const commentBase = commentInfo.post || commentInfo.postId || commentInfo.post_id || null
            const url = commentBase
                ? `https://route-posts.routemisr.com/posts/${commentBase}/comments/${commentInfo._id}`
                : `https://route-posts.routemisr.com/comments/${commentInfo._id}`
            const formData = new FormData()
            formData.append('content', editContent.trim())
            const response = await axios({ method: 'PUT', url, headers: { Authorization: `Bearer ${token}` }, data: formData })
            if (response.status >= 200 && response.status < 300) {
                toast.success('Comment updated successfully!')
                setCurrentContent(editContent.trim())
                setIsEditing(false)
                if (onCommentUpdated) onCommentUpdated()
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'You can only edit your own comments')
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDeleteComment() {
        setIsDeleting(true)
        try {
            const commentBase = commentInfo.post || commentInfo.postId || commentInfo.post_id || null
            const url = commentBase
                ? `https://route-posts.routemisr.com/posts/${commentBase}/comments/${commentInfo._id}`
                : `https://route-posts.routemisr.com/comments/${commentInfo._id}`
            const response = await axios({ method: 'DELETE', url, headers: { Authorization: `Bearer ${token}` } })
            if (response.status >= 200 && response.status < 300) {
                toast.success('Comment deleted!')
                if (onCommentUpdated) onCommentUpdated()
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'You can only delete your own comments')
        } finally {
            setIsDeleting(false)
            setShowDeleteModal(false)
        }
    }

    async function handleCreateReply() {
        if (!replyContent.trim()) { toast.error('Reply cannot be empty'); return }
        setIsReplying(true)
        try {
            const commentBase = commentInfo.post || commentInfo.postId || commentInfo.post_id || null
            const url = commentBase
                ? `https://route-posts.routemisr.com/posts/${commentBase}/comments/${commentInfo._id}/replies`
                : `https://route-posts.routemisr.com/comments/${commentInfo._id}/replies`
            const formData = new FormData()
            formData.append('content', replyContent.trim())
            if (replyImage) formData.append('image', replyImage)
            const response = await axios({ method: 'POST', url, headers: { Authorization: `Bearer ${token}` }, data: formData })
            if (response.status >= 200 && response.status < 300) {
                toast.success('Reply added')
                setReplyContent('')
                setReplyImage(null)
                setShowReplyForm(false)
                setShowReplies(true)
                fetchReplies()
                if (onCommentUpdated) onCommentUpdated()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to add reply')
        } finally {
            setIsReplying(false)
        }
    }

    async function handleToggleLike() {
        try {
            const commentBase = commentInfo.post || commentInfo.postId || commentInfo.post_id || null
            const url = commentBase
                ? `https://route-posts.routemisr.com/posts/${commentBase}/comments/${commentInfo._id}/like`
                : `https://route-posts.routemisr.com/comments/${commentInfo._id}/like`
            const response = await axios({ method: 'PUT', url, headers: { Authorization: `Bearer ${token}` } })
            if (response.status >= 200 && response.status < 300) {
                setLiked(s => !s)
                setLikesCount(c => liked ? Math.max(0, c - 1) : c + 1)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to like comment')
        }
    }

    function handleCancelEdit() {
        setEditContent(currentContent)
        setIsEditing(false)
    }

    return (
        <>
            {/* ── Comment row ── */}
            <div className="flex gap-2 mt-3" style={{ fontFamily: 'Segoe UI, Helvetica, Arial, sans-serif' }}>
                <img src={commentCreatorImage} alt="" className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5" />

                <div className="flex-1 min-w-0">
                    {/* bubble */}
                    <div className="bg-gray-100 rounded-2xl px-3 py-2 inline-block max-w-full">
                        <p className="font-semibold text-[13px] text-gray-900 leading-tight">{commentInfo.commentCreator.name}</p>
                        <p className="text-[13px] text-gray-500 mb-0.5">member</p>

                        {isEditing ? (
                            <div className="mt-1">
                                <input
                                    type="text"
                                    value={editContent}
                                    onChange={e => setEditContent(e.target.value)}
                                    autoFocus
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') handleUpdateComment()
                                        if (e.key === 'Escape') handleCancelEdit()
                                    }}
                                    className="w-full bg-white border border-blue-400 rounded-lg px-2 py-1 text-[13px] outline-none"
                                />
                                <div className="flex gap-2 mt-1.5">
                                    <button
                                        onClick={handleUpdateComment}
                                        disabled={isSubmitting}
                                        className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        <FontAwesomeIcon icon={faCheck} /> {isSubmitting ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        disabled={isSubmitting}
                                        className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 disabled:opacity-50"
                                    >
                                        <FontAwesomeIcon icon={faTimes} /> Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-[14px] text-gray-800 break-words">{currentContent}</p>
                        )}
                    </div>

                    {/* like badge on bubble */}
                    {likesCount > 0 && (
                        <div className="inline-flex items-center gap-0.5 bg-white border border-gray-200 rounded-full px-1.5 py-0.5 shadow-sm text-[12px] ml-2 -mt-1">
                            <span>👍</span>
                            <span className="text-gray-600 font-semibold">{likesCount}</span>
                        </div>
                    )}

                    {/* action bar */}
                    <div className="flex items-center gap-3 mt-1 ml-1 text-[13px] font-semibold text-gray-500">
                        <span>{formatTimeAgo(commentInfo.createdAt)}</span>
                        <button
                            onClick={handleToggleLike}
                            className={`hover:underline ${liked ? 'text-blue-600' : 'text-gray-500'}`}
                        >
                            Like {likesCount > 0 && `(${likesCount})`}
                        </button>
                        <button
                            onClick={() => setShowReplyForm(s => !s)}
                            className="hover:underline text-gray-500"
                        >
                            Reply
                        </button>

                        {/* ··· menu */}
                        <div className="relative ml-auto" ref={menuRef}>
                            <button
                                onClick={() => setShowMenu(s => !s)}
                                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                            >
                                <FontAwesomeIcon icon={faEllipsisH} className="text-sm" />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 bottom-8 bg-white border border-gray-200 rounded-xl shadow-xl w-40 z-50 overflow-hidden">
                                    <button
                                        onClick={() => { setIsEditing(true); setShowMenu(false) }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-[14px] text-gray-800 hover:bg-gray-100"
                                    >
                                        <FontAwesomeIcon icon={faPenToSquare} className="text-gray-500" /> Edit
                                    </button>
                                    <div className="h-px bg-gray-100" />
                                    <button
                                        onClick={() => { setShowDeleteModal(true); setShowMenu(false) }}
                                        disabled={isDeleting}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-[14px] text-red-600 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        <FontAwesomeIcon icon={faTrash} /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Replies ── */}
                    {replies.length > 0 && (
                        <button
                            onClick={() => setShowReplies(s => !s)}
                            className="flex items-center gap-1 mt-2 ml-1 text-[13px] font-semibold text-blue-600 hover:underline"
                        >
                            <FontAwesomeIcon icon={faThumbsUp} className="text-gray-400 text-xs" />
                            {showReplies ? 'Hide replies' : `View ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
                        </button>
                    )}

                    {loadingReplies && (
                        <p className="text-[12px] text-gray-400 ml-1 mt-1">Loading replies...</p>
                    )}

                    {showReplies && !loadingReplies && replies.map(reply => (
                        <div key={reply._id} className="flex gap-2 mt-2 ml-4">
                            <img
                                src={reply.replyCreator?.photo?.includes('undefined') ? x : reply.replyCreator?.photo}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                            />
                            <div>
                                <div className="bg-gray-100 rounded-2xl px-3 py-2 inline-block">
                                    <p className="font-semibold text-[13px] text-gray-900 leading-tight">{reply.replyCreator?.name}</p>
                                    <p className="text-[14px] text-gray-800 break-words">{reply.content}</p>
                                </div>
                                <div className="flex items-center gap-2 ml-1 mt-0.5 text-[12px] text-gray-400">
                                    <span>{formatTimeAgo(reply.createdAt)}</span>
                                    <button className="font-semibold hover:underline text-gray-500">Like (0)</button>
                                </div>
                                {reply.image && (
                                    <img src={reply.image} alt="reply attachment" className="mt-1 rounded-xl border border-gray-200 max-w-[180px] max-h-36 object-cover" />
                                )}
                            </div>
                        </div>
                    ))}

                    {/* ── Reply form ── */}
                    {showReplyForm && (
                        <div className="mt-2 ml-4">
                            <p className="text-[12px] text-gray-500 mb-1">Replying to <span className="font-semibold text-gray-700">{commentInfo.commentCreator.name}</span></p>
                            <div className="flex gap-2 items-start bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm">
                                <img src={x} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={replyContent}
                                        onChange={e => setReplyContent(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') handleCreateReply() }}
                                        placeholder="Write a reply..."
                                        className="w-full outline-none text-[14px] text-gray-700 placeholder-gray-400 bg-transparent"
                                    />
                                    {/* reply input actions */}
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-3">
                                            <label htmlFor={`reply-img-${commentInfo._id}`} className="cursor-pointer text-gray-400 hover:text-blue-500 transition-colors">
                                                <FontAwesomeIcon icon={faImage} className="text-lg" />
                                            </label>
                                            <input
                                                type="file"
                                                id={`reply-img-${commentInfo._id}`}
                                                onChange={e => setReplyImage(e.currentTarget.files[0])}
                                                className="hidden"
                                            />
                                            <button type="button" className="text-gray-400 hover:text-yellow-500 transition-colors">
                                                <FontAwesomeIcon icon={faFaceSmile} className="text-lg" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleCreateReply}
                                            disabled={isReplying || !replyContent.trim()}
                                            className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete Comment"
                message="Are you sure you want to delete this comment? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isLoading={isDeleting}
                onConfirm={handleDeleteComment}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    )
}