import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import x from '../../assets/images/prof.png'
import { faComment, faEllipsisH, faPaperPlane, faShare, faThumbsUp, faTrash, faImage, faFaceSmile } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import Comment from '../ui/comment/Comment'
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal'
import { Link } from 'react-router'
import { useFormik } from 'formik'
import { useContext, useState, useEffect, useRef } from 'react'
import { AuthContext } from '../../Context/Auth.context'
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

export default function PostCard({ postInfo, numOfComments, getAllPosts }) {
    const [user, setUser] = useState(null)
    const [isAllCommentsVisible, setIsAllCommentsVisible] = useState(false)
    const [isOpened, setIsOpened] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [comments, setComments] = useState(postInfo.comments || [])
    const [selectedReaction, setSelectedReaction] = useState(null)
    const [showReactionPicker, setShowReactionPicker] = useState(false)
    const [isLiked, setIsLiked] = useState(postInfo.isLiked || false)
    const [likesCount, setLikesCount] = useState(postInfo.likes?.length || postInfo.likesCount || 0)

    const menuRef = useRef(null)
    const reactionTimeout = useRef(null)
    const { token } = useContext(AuthContext)

    const reactions = [
        { emoji: '👍', name: 'Like' },
        { emoji: '❤️', name: 'Love' },
        { emoji: '😂', name: 'Haha' },
        { emoji: '😮', name: 'Wow' },
        { emoji: '😢', name: 'Sad' },
        { emoji: '😡', name: 'Angry' },
    ]

    function handleReaction(reaction) {
        if (selectedReaction?.name === reaction.name) {
            setSelectedReaction(null)
        } else {
            setSelectedReaction(reaction)
        }
        setShowReactionPicker(false)
    }

    async function fetchComments() {
        try {
            const { data } = await axios.get(
                `https://route-posts.routemisr.com/posts/${postInfo.id}/comments`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setComments(data.data.comments || [])
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch comments')
        }
    }

    async function fetchPostLikes() {
        try {
            const { data } = await axios.get(
                `https://route-posts.routemisr.com/posts/${postInfo.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            const post = data.data?.post || data.data || {}
            setLikesCount(post.likes?.length || post.likesCount || 0)
            setIsLiked(post.isLiked || false)
        } catch (error) {
            console.error('Failed to fetch post likes:', error)
        }
    }

    async function handleLikePost() {
        setIsLiked(prev => !prev)
        setLikesCount(prev => isLiked ? Math.max(0, prev - 1) : prev + 1)
        try {
            await axios({
                method: 'PUT',
                url: `https://route-posts.routemisr.com/posts/${postInfo.id}/like`,
                headers: { Authorization: `Bearer ${token}` }
            })
        } catch (error) {
            setIsLiked(prev => !prev)
            setLikesCount(prev => isLiked ? prev + 1 : Math.max(0, prev - 1))
            toast.error(error.response?.data?.message || 'Failed to like post')
        }
    }
    // Fetch user profile data
    async function getUserData() {
        try {
            const { data } = await axios.get('https://route-posts.routemisr.com/users/profile-data', {
                headers: { token }
            })
            setUser(data.data.user)
        } catch (error) {
            console.log("Error fetching user data")
        }
    }

    useEffect(() => {
        fetchComments()
        fetchPostLikes()
        getUserData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postInfo.id])

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpened(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function handleCommentUpdated() {
        fetchComments()
    }

    async function handleSubmit(values) {
        try {
            const formData = new FormData()
            formData.append('content', values.content)
            if (values.image) formData.append('image', values.image)
            const { data } = await axios.post(
                `https://route-posts.routemisr.com/posts/${postInfo.id}/comments`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (data?.success) {
                toast.success('Comment added')
                formik.resetForm()
                fetchComments()
            } else {
                toast.error(data?.message || 'Failed to add comment')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to add comment')
        }
    }

    async function handleDeletePost() {
        setIsDeleting(true)
        try {
            const { data } = await axios.delete(
                `https://route-posts.routemisr.com/posts/${postInfo.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (data.success) {
                toast.success('Post deleted successfully!')
                if (getAllPosts) getAllPosts()
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'You can only delete your own posts')
        } finally {
            setIsDeleting(false)
            setShowDeleteModal(false)
            setIsOpened(false)
        }
    }

    const postCreatorImage = postInfo.user.photo.includes('undefined') ? x : postInfo.user.photo

    const formik = useFormik({
        initialValues: { content: '', image: null },
        onSubmit: handleSubmit
    })

    return (
        <>
            <div className="bg-white max-w-2xl mx-auto rounded-xl shadow-sm border border-gray-200 mb-4" style={{ fontFamily: 'Segoe UI, Helvetica, Arial, sans-serif' }}>

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                        <img src={postCreatorImage} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <p className="font-semibold text-[15px] text-gray-900 leading-tight">{postInfo.user.name}</p>
                            <p className="text-[13px] text-gray-500 flex items-center gap-1">
                                {formatTimeAgo(postInfo.createdAt)}
                                <span>·</span>
                                <span>🌐 Public</span>
                            </p>
                        </div>
                    </div>

                    {/* 3-dot menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => setIsOpened(!isOpened)}
                            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <FontAwesomeIcon icon={faEllipsisH} />
                        </button>
                        {isOpened && (
                            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-xl w-48 z-50 overflow-hidden">
                                <Link
                                    to={`/update/${postInfo.id}`}
                                    onClick={() => setIsOpened(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-[15px] text-gray-800 hover:bg-gray-100 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faPenToSquare} className="text-gray-600" />
                                    Edit post
                                </Link>
                                <div className="h-px bg-gray-100 mx-2" />
                                <button
                                    type="button"
                                    onClick={() => { setShowDeleteModal(true); setIsOpened(false) }}
                                    disabled={isDeleting}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-red-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                    Delete post
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Body ── */}
                {postInfo.body && (
                    <p className="px-4 pb-3 text-[15px] text-gray-900 leading-relaxed whitespace-pre-line">{postInfo.body}</p>
                )}
                {postInfo.image && (
                    <img src={postInfo.image} alt="post" className="w-full object-cover" style={{ maxHeight: 500 }} />
                )}

                {/* ── Stats row ── */}
                <div className="flex items-center justify-between px-4 py-2 text-[13px] text-gray-500">
                    <div className="flex items-center gap-1">
                        <span className="w-[18px] h-[18px] rounded-full bg-blue-500 inline-flex items-center justify-center text-white text-[10px]">👍</span>
                        <span>{likesCount} likes</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span>0 shares</span>
                        <button
                            onClick={() => { fetchComments(); setIsAllCommentsVisible(!isAllCommentsVisible) }}
                            className="hover:underline"
                        >
                            {comments.length} comments
                        </button>
                        <button className="text-blue-600 font-semibold hover:underline">View details</button>
                    </div>
                </div>

                {/* ── Action buttons ── */}
                <div className="flex items-center border-t border-b border-gray-200 mx-0 py-0.5">
                    {/* Like with reaction picker */}
                    <div
                        className="relative flex-1"
                        onMouseEnter={() => {
                            clearTimeout(reactionTimeout.current)
                            reactionTimeout.current = setTimeout(() => setShowReactionPicker(true), 400)
                        }}
                        onMouseLeave={() => {
                            clearTimeout(reactionTimeout.current)
                            reactionTimeout.current = setTimeout(() => setShowReactionPicker(false), 300)
                        }}
                    >
                        {showReactionPicker && (
                            <div className="absolute bottom-full left-2 mb-2 bg-white rounded-full shadow-xl border border-gray-200 px-3 py-2 flex gap-1 z-50">
                                {reactions.map(r => (
                                    <button
                                        key={r.name}
                                        onClick={() => handleReaction(r)}
                                        title={r.name}
                                        className={`text-2xl transition-transform hover:scale-125 p-0.5 ${selectedReaction?.name === r.name ? 'scale-125' : ''}`}
                                    >
                                        {r.emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={handleLikePost}
                            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[15px] font-semibold hover:bg-gray-100 transition-colors ${isLiked ? 'text-blue-600' : 'text-gray-600'}`}
                        >
                            {selectedReaction
                                ? <span className="text-lg leading-none">{selectedReaction.emoji}</span>
                                : <FontAwesomeIcon icon={faThumbsUp} />
                            }
                            <span>{selectedReaction ? selectedReaction.name : 'Like'}</span>
                        </button>
                    </div>

                    <button
                        onClick={() => { fetchComments(); setIsAllCommentsVisible(!isAllCommentsVisible) }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[15px] font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <FontAwesomeIcon icon={faComment} />
                        <span>Comment</span>
                    </button>

                    <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[15px] font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                        <FontAwesomeIcon icon={faShare} />
                        <span>Share</span>
                    </button>
                </div>

                {/* ── Comments Section ── */}
                <div className="px-4 pt-3 pb-3">

                    {/* Comments header */}
                    {comments.length > 0 && (
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-[15px] text-gray-900">
                                Comments{' '}
                                <span className="bg-gray-200 text-gray-700 text-xs font-bold rounded-full px-2 py-0.5 ml-1">{comments.length}</span>
                            </span>
                            <button className="flex items-center gap-1 text-[14px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                                Most relevant <span className="ml-1 text-xs">▾</span>
                            </button>
                        </div>
                    )}

                    {/* Comments list */}
                    <div className="space-y-1">
                        {(isAllCommentsVisible ? comments : comments.slice(0, numOfComments)).map((comment, index) => (
                            <div key={comment._id || index}>
                                <Comment commentInfo={comment} onCommentUpdated={handleCommentUpdated} />
                                {comment.image && (
                                    <img
                                        src={comment.image}
                                        alt="comment attachment"
                                        className="ml-12 mt-1 rounded-xl border border-gray-200 max-w-xs max-h-48 object-cover"
                                    />
                                )}
                            </div>
                        ))}

                        {comments.length === 0 && (
                            <p className="text-gray-400 text-center text-sm py-3">No comments yet. Be the first to comment.</p>
                        )}

                        {!isAllCommentsVisible && comments.length > numOfComments && (
                            <Link to={`/profile/${postInfo.id}`}>
                                <button className="text-gray-500 font-semibold text-sm hover:underline mt-1">
                                    View more comments
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* ── Comment input ── */}
                    <form onSubmit={formik.handleSubmit} className="mt-3">
                        <div className="flex items-center gap-2">
                            <img src={user.photo} alt="you" className="w-9 h-9 rounded-full object-cover shrink-0" />
                            <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2">
                                <input
                                    type="text"
                                    name="content"
                                    onChange={formik.handleChange}
                                    value={formik.values.content}
                                    onBlur={formik.handleBlur}
                                    placeholder={`Comment as ${postInfo.user.name}...`}
                                    className="w-full bg-transparent outline-none text-[15px] text-gray-700 placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* input actions */}
                        <div className="flex items-center justify-between mt-2 pl-11">
                            <div className="flex items-center gap-3">
                                <label htmlFor={`image-${postInfo.id}`} className="cursor-pointer text-gray-400 hover:text-blue-500 transition-colors">
                                    <FontAwesomeIcon icon={faImage} className="text-xl" />
                                </label>
                                <input
                                    type="file"
                                    id={`image-${postInfo.id}`}
                                    name="image"
                                    onChange={(e) => formik.setFieldValue('image', e.currentTarget.files[0])}
                                    className="hidden"
                                />
                                <button type="button" className="text-gray-400 hover:text-yellow-500 transition-colors">
                                    <FontAwesomeIcon icon={faFaceSmile} className="text-xl" />
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={!formik.values.content.trim()}
                                className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
        </>
    )
}