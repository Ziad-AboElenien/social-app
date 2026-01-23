import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import x from '../../../assets/images/prof.png'
import { faCheck, faPenToSquare, faThumbsUp, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useContext, useState } from 'react'
import { AuthContext } from '../../../Context/Auth.context'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Comment({ commentInfo, onCommentUpdated }) {
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(commentInfo.content)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
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
        if (!window.confirm("Delete this comment?")) {
            return
        }

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
        }
    }

    // Cancel editing
    function handleCancelEdit() {
        setEditContent(currentContent)
        setIsEditing(false)
    }

    return (
        <>
            <div className="comment flex gap-2 mt-3">
                <img src={commentCreatorImage} alt="" className='size-9 rounded-full object-cover' />
                <div className="comment-body flex-1">
                    <div className='bg-gray-100 py-3 px-3 rounded-lg'>
                        <p className='font-semibold text-gray-700'>{commentInfo.commentCreator.name}</p>
                        
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
                                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                                    >
                                        <FontAwesomeIcon icon={faCheck} />
                                        {isSubmitting ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        disabled={isSubmitting}
                                        className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-400 disabled:opacity-50 flex items-center gap-1"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <span className='text-gray-600 text-sm'>{currentContent}</span>
                        )}
                    </div>
                    
                    <div className='text-sm text-gray-600 space-x-3 ms-1 mt-1'>
                        <span className="hover:scale-105 transition-all duration-300 cursor-pointer">
                            <FontAwesomeIcon icon={faThumbsUp} className='text-gray-600' />
                        </span>
                        <time className="text-xs">{new Date(commentInfo.createdAt).toLocaleString()}</time>
                        
                        {!isEditing && (
                            <>
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditing(true)}
                                    className="text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    <FontAwesomeIcon icon={faPenToSquare} className="mr-1" />
                                    Edit
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleDeleteComment}
                                    disabled={isDeleting}
                                    className="text-red-600 hover:text-red-700 hover:underline disabled:opacity-50"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}