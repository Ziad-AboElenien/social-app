import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import x from '../../../assets/images/prof.png'
import { faCheck, faPenToSquare, faThumbsUp, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import { useContext, useState } from 'react'
import { AuthContext } from '../../../Context/Auth.context'
import axios from 'axios'
import { toast } from 'react-toastify'

// Format time ago function
function formatTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    
    // For older posts, show the date
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

export default function Comment({ commentInfo, onCommentUpdated }) {
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(commentInfo.content)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [currentContent, setCurrentContent] = useState(commentInfo.content)
    
    const { token } = useContext(AuthContext)
    
    const commentCreatorImage = commentInfo.commentCreator.photo.includes("undefined") ? x : commentInfo.commentCreator.photo

    // Handle update comment
    async function handleUpdateComment() {
        if (!editContent.trim()) {
            toast.error("Comment cannot be empty")
            return
        }

        if (editContent.trim() === currentContent.trim()) {
            setIsEditing(false)
            return
        }

        setIsSubmitting(true)
        try {
            const response = await axios({
                method: 'PUT',
                url: `https://linked-posts.routemisr.com/comments/${commentInfo._id}`,
                headers: { token },
                data: { content: editContent.trim() }
            })

            if (response.data.message === 'success') {
                toast.success('Comment updated successfully!')
                setCurrentContent(editContent.trim())
                setIsEditing(false)
                if (onCommentUpdated) {
                    onCommentUpdated()
                }
            }
        } catch (error) {
            console.error("Update error:", error)
            const errorMsg = error.response?.data?.error || "You can only edit your own comments"
            toast.error(errorMsg)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handle delete comment
    async function handleDeleteComment() {
        setIsDeleting(true)
        try {
            const response = await axios({
                method: 'DELETE',
                url: `https://linked-posts.routemisr.com/comments/${commentInfo._id}`,
                headers: { token }
            })

            if (response.data.message === 'success') {
                toast.success('Comment deleted!')
                if (onCommentUpdated) {
                    onCommentUpdated()
                }
            }
        } catch (error) {
            console.error("Delete error:", error)
            const errorMsg = error.response?.data?.error || "You can only delete your own comments"
            toast.error(errorMsg)
        } finally {
            setIsDeleting(false)
            setShowDeleteModal(false)
        }
    }

    // Cancel editing
    function handleCancelEdit() {
        setEditContent(currentContent)
        setIsEditing(false)
    }

    return (
        <>
            <div className="comment flex gap-2 mt-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <img src={commentCreatorImage} alt="" className='size-8 sm:size-9 rounded-full object-cover flex-shrink-0' />
                <div className="comment-body flex-1 min-w-0">
                    <div className='bg-gray-100 hover:bg-gray-200 transition-colors duration-200 py-2 sm:py-3 px-3 sm:px-4 rounded-lg'>
                        <p className='font-semibold text-gray-700 text-sm'>{commentInfo.commentCreator.name}</p>
                        
                        {isEditing ? (
                            <div className="mt-1">
                                <input
                                    type="text"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="Edit your comment..."
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleUpdateComment()
                                        if (e.key === 'Escape') handleCancelEdit()
                                    }}
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={handleUpdateComment}
                                        disabled={isSubmitting}
                                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 transition-colors duration-150"
                                    >
                                        <FontAwesomeIcon icon={faCheck} />
                                        {isSubmitting ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        disabled={isSubmitting}
                                        className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-400 disabled:opacity-50 flex items-center gap-1 transition-colors duration-150"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <span className='text-gray-600 text-sm break-words'>{currentContent}</span>
                        )}
                    </div>
                    
                    <div className='text-xs sm:text-sm text-gray-600 space-x-2 sm:space-x-3 ms-1 mt-1 flex flex-wrap items-center'>
                        <button className="hover:bg-blue-100 px-2 py-1 rounded transition-colors duration-150 flex items-center gap-1">
                            <FontAwesomeIcon icon={faThumbsUp} className='text-gray-600 text-xs' />
                            <span className='hidden sm:inline'>Like</span>
                        </button>
                        <time className="text-xs text-gray-500">{formatTimeAgo(commentInfo.createdAt)}</time>
                        
                        {!isEditing && (
                            <>
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditing(true)}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 px-2 py-1 rounded transition-colors duration-150 flex items-center gap-1 text-xs"
                                >
                                    <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                                    <span>Edit</span>
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setShowDeleteModal(true)}
                                    disabled={isDeleting}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-100 px-2 py-1 rounded transition-colors duration-150 disabled:opacity-50 flex items-center gap-1 text-xs"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                    <span>Delete</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Delete Confirmation Modal */}
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