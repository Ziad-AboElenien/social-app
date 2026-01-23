import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import x from '../../assets/images/prof.png'
import { faComment, faEllipsisVertical, faHeart, faPaperPlane, faShare, faThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import Comment from '../ui/comment/Comment'
import { Link } from 'react-router';
import { useFormik } from 'formik';
import { useContext, useState } from 'react';
import { AuthContext } from '../../Context/Auth.context';
import axios from 'axios';
import { toast } from 'react-toastify';

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


export default function PostCard({ postInfo, numOfComments, getAllPosts }) {

    const [isAllCommentsVisible, setIsAllCommentsVisible] = useState(false);
    const [isOpened, setIsOpened] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [comments, setComments] = useState(postInfo.comments || []);
    const [selectedReaction, setSelectedReaction] = useState(null);
    const { token } = useContext(AuthContext);

    const reactions = [
        { emoji: '👍', name: 'Like', color: 'text-blue-600' },
        { emoji: '❤️', name: 'Love', color: 'text-red-500' },
        { emoji: '😂', name: 'Haha', color: 'text-yellow-500' },
        { emoji: '😮', name: 'Wow', color: 'text-yellow-500' },
        { emoji: '😢', name: 'Sad', color: 'text-yellow-500' },
        { emoji: '😡', name: 'Angry', color: 'text-orange-500' },
    ];

    function handleReaction(reaction) {
        if (selectedReaction?.name === reaction.name) {
            setSelectedReaction(null); // Remove reaction if clicked again
        } else {
            setSelectedReaction(reaction);
        }
    }

    async function fetchComments() {
        try {
            const options = {
                url: `https://linked-posts.routemisr.com/posts/${postInfo.id}/comments`,
                method: "GET",
                headers: {
                    token
                }
            }
            const { data } = await axios.request(options);
            setComments(data.comments || []);
        } catch (error) {
            console.log("error.message");
        }
    }

    // Refresh comments when a comment is updated or deleted
    function handleCommentUpdated() {
        fetchComments();
    }


    async function handleSubmit(values) {
        try {
            const options = {
                url: "https://linked-posts.routemisr.com/comments",
                method: "POST",
                headers: {
                    token
                },
                data: values
            }

            const { data } = await axios.request(options);
            console.log(data)
            formik.resetForm();
            fetchComments(); // Refresh comments after adding

        } catch (error) {
            console.log("error.message");
        }
    }

    const postCreatorImage =
        postInfo.user.photo.includes('undefined')
            ? x : postInfo.user.photo
        ;

    const formik = useFormik({
        initialValues: {
            content: "",
            post: postInfo.id
        },
        onSubmit: handleSubmit

    })

    async function handleDeletePost() {
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }
        
        setIsDeleting(true);
        try {
            const options = {
                url: `https://linked-posts.routemisr.com/posts/${postInfo.id}`,
                method: 'DELETE',
                headers: {
                    token
                }
            }
            const { data } = await axios.request(options);
            
            if (data.message === 'success') {
                toast.success('Post deleted successfully!');
                if (getAllPosts) {
                    getAllPosts();
                }
            }
        } catch (error) {
            console.error("Delete error:", error);
            const errorMsg = error.response?.data?.error || "You can only delete your own posts";
            toast.error(errorMsg);
        } finally {
            setIsDeleting(false);
            setIsOpened(false);
        }
    }

    return (
        <>
            <div className="card bg-white p-8 my-4 rounded-lg shadow-md">
                <header className='flex justify-between'>
                    <div className="info flex  gap-2 items-center">

                        <img src={postCreatorImage} alt="" className='size-12 rounded-full object-cover' />
                        <div className="details">
                            <p className='font-semibold pb-0'>{postInfo.user.name}</p>
                            <span className='block text-gray-500 text-sm'>{formatTimeAgo(postInfo.createdAt)}</span>
                        </div>
                    </div>
                    <div className='relative group'>
                        <button type='button' className='text-gray-500 hover:bg-gray-200 p-2 rounded-full' onClick={() => setIsOpened(!isOpened)}>
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </button>
                        {isOpened ? <><div className='absolute bg-white p-2 shadow-md rounded-md mt-2 right-7 top-2 w-40  group-hover:block'>
                            <ul>
                                <li className=''>
                                    <Link to={`/update/${postInfo.id}`}>
                                        <FontAwesomeIcon icon={faPenToSquare} className='me-2' />
                                        Edit post
                                    </Link>
                                </li>
                                <li className='h-0.5 my-1 bg-linear-to-r from-transparent via-gray-300 to-transparent'></li>
                                <li>
                                    <button type='button' onClick={handleDeletePost} disabled={isDeleting}>
                                        <FontAwesomeIcon icon={faTrash} className='me-2' />
                                        {isDeleting ? 'Deleting...' : 'Delete post'}
                                    </button>
                                </li>
                            </ul>
                        </div></> : null}
                    </div>
                </header>
                <div className="post-body">
                    <figure>
                        <figcaption>
                            <p className='my-4'>{postInfo.body}</p>
                        </figcaption>
                        <div className='-mx-8'>
                            {postInfo.image ? (<img src={postInfo.image} className='w-full h-140 object-cover' alt="" />) : null}
                        </div>
                    </figure>
                    <div className="likes-and-comment flex justify-between py-2">
                        <div className="icons">
                            <button className='text-blue-600'>
                                <FontAwesomeIcon icon={faThumbsUp} />
                            </button>
                            <button className='text-red-600'>
                                <FontAwesomeIcon icon={faHeart} />
                            </button>
                            <span className='text-gray-600 text-sm ps-1'>0 likes</span>
                        </div>
                        <span className='text-gray-600 text-sm'>{comments.length} comments</span>
                    </div>
                    <div className="reacts flex justify-around pt-2 border-y border-gray-300/50 -mx-8 *:text-gray-500 *:text-xl *:grow *:rounded-lg *:py-2 *:text-center">
                        {/* Like button with reactions */}
                        <div className="relative group">
                            <button 
                                onClick={() => handleReaction(reactions[0])}
                                className={`w-full hover:bg-gray-100 py-2 rounded-lg transition-colors ${selectedReaction ? selectedReaction.color : ''}`}
                            >
                                {selectedReaction ? (
                                    <span className="text-xl">{selectedReaction.emoji}</span>
                                ) : (
                                    <FontAwesomeIcon icon={faThumbsUp} />
                                )}
                            </button>
                            {/* Reactions popup on hover */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="bg-white rounded-full shadow-lg border border-gray-200 px-2 py-1 flex gap-1">
                                    {reactions.map((reaction) => (
                                        <button 
                                            key={reaction.name}
                                            onClick={() => handleReaction(reaction)}
                                            className={`text-2xl hover:scale-125 transition-transform p-1 ${selectedReaction?.name === reaction.name ? 'scale-125' : ''}`}
                                            title={reaction.name}
                                        >
                                            {reaction.emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button type='button' className="hover:bg-gray-100" onClick={(e) => {
                            fetchComments()
                            setIsAllCommentsVisible(!isAllCommentsVisible);
                        }} >
                            <FontAwesomeIcon icon={faComment} />
                        </button>
                        <button className="hover:bg-gray-100">
                            <FontAwesomeIcon icon={faShare} />
                        </button>
                    </div>
                    <div className="all-comment">
                        {isAllCommentsVisible 
                            ? comments.map((comment, index) => <Comment key={comment._id || index} commentInfo={comment} onCommentUpdated={handleCommentUpdated} />) 
                            : comments.length > 0 
                                ? comments.slice(0, numOfComments).map((comment, index) => <Comment key={comment._id || index} commentInfo={comment} onCommentUpdated={handleCommentUpdated} />) 
                                : (<><div className='text-gray-600 text-center mt-2'>No comment yet. be the first to comment</div></>)}
                        {comments.length > numOfComments ? <><Link to={`/profile/${postInfo.id}`}><button className='cursor-pointer text-blue-600 mt-2'>View more comments</button></Link></> : null}
                    </div>
                    <div className='flex items-center gap-1'>
                        <input
                            type="text"
                            name='content'
                            id='content'
                            onChange={formik.handleChange}
                            value={formik.values.content}
                            onBlur={formik.handleBlur}
                            className='bg-gray-100 mt-2 p-2 w-full rounded-full outline-none border border-transparent focus:border-blue-500' placeholder="Write a comment..." />
                        <button type='button' onClick={formik.handleSubmit} className='text-blue-600 text-xl cursor-pointer p-1 pt-2'><FontAwesomeIcon icon={faPaperPlane} className='' /></button>
                    </div>
                </div>
            </div>
        </>
    )
}