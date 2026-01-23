import { useContext, useEffect, useState, useRef } from "react"
import { AuthContext } from "../../Context/Auth.context"
import axios from "axios"
import { useNavigate, useParams } from "react-router"
import PostCardSkelton from "../../Components/PostCardSkelton/PostCardSkelton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
    faSave, 
    faTimes, 
    faTrash, 
    faEdit, 
    faCamera,
    faExclamationCircle,
    faArrowLeft,
    faUndo
} from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"
import PageNavbar from "../../Components/PageNavbar/PageNavbar"

export default function UpdatePost() {
    // States
    const [post, setPost] = useState(null)
    const [body, setBody] = useState("")
    const [originalBody, setOriginalBody] = useState("")
    const [selectedImage, setSelectedImage] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [removeCurrentImage, setRemoveCurrentImage] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)
    
    // Refs
    const fileInputRef = useRef(null)
    
    // Hooks
    const { token } = useContext(AuthContext)
    const { postId } = useParams()
    const navigate = useNavigate()

    // Check if there are changes
    const hasTextChanges = body.trim() !== originalBody.trim()
    const hasImageChanges = selectedImage !== null || removeCurrentImage
    const hasChanges = hasTextChanges || hasImageChanges

    // Get display image
    const displayImage = previewUrl || (!removeCurrentImage ? post?.image : null)
    const hasCurrentImage = post?.image && !removeCurrentImage && !previewUrl

    // Fetch post on mount
    useEffect(() => {
        fetchPost()
        
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [postId])

    // Fetch post details
    async function fetchPost() {
        setLoading(true)
        setError(null)
        
        try {
            const response = await axios({
                method: 'GET',
                url: `https://linked-posts.routemisr.com/posts/${postId}`,
                headers: { token }
            })
            
            const postData = response.data.post
            setPost(postData)
            setBody(postData.body || "")
            setOriginalBody(postData.body || "")
            
        } catch (err) {
            console.error("Fetch error:", err)
            setError("Failed to load post")
            toast.error("Failed to load post details")
        } finally {
            setLoading(false)
        }
    }

    // Handle form submit
    async function handleSubmit(e) {
        e.preventDefault()
        
        if (!body.trim()) {
            toast.error("Post content cannot be empty")
            return
        }
        
        if (!hasChanges) {
            toast.info("No changes to save")
            return
        }

        setSubmitting(true)
        
        try {
            const formData = new FormData()
            formData.append("body", body.trim())
            
            if (selectedImage) {
                formData.append("image", selectedImage)
            }

            const response = await axios({
                method: 'PUT',
                url: `https://linked-posts.routemisr.com/posts/${postId}`,
                headers: { token },
                data: formData
            })
            
            if (response.data.message === 'success') {
                toast.success('Post updated successfully!')
                navigate('/')
            }
            
        } catch (err) {
            console.error("Update error:", err)
            const message = err.response?.data?.error || err.response?.data?.message || "Failed to update post"
            toast.error(message)
        } finally {
            setSubmitting(false)
        }
    }

    // Handle image selection
    function handleSelectImage(e) {
        const file = e.target.files?.[0]
        if (!file) return

        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            toast.error("Image must be less than 5MB")
            clearFileInput()
            return
        }

        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
        if (!validTypes.includes(file.type)) {
            toast.error("Invalid image type. Use PNG, JPG, GIF or WebP")
            clearFileInput()
            return
        }

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
        }

        setSelectedImage(file)
        setPreviewUrl(URL.createObjectURL(file))
        setRemoveCurrentImage(false)
        toast.success("Image selected")
    }

    // Remove new image
    function handleRemoveNewImage() {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
        }
        setSelectedImage(null)
        setPreviewUrl(null)
        clearFileInput()
    }

    // Remove current image
    function handleRemoveCurrentImage() {
        setRemoveCurrentImage(true)
        toast.info("Current image will be removed when you save")
    }

    // Restore current image
    function handleRestoreCurrentImage() {
        setRemoveCurrentImage(false)
        toast.info("Current image restored")
    }

    // Clear file input
    function clearFileInput() {
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    // Handle cancel
    function handleCancel() {
        if (hasChanges) {
            if (!window.confirm("Discard unsaved changes?")) {
                return
            }
        }
        navigate('/')
    }

    // Loading state
    if (loading) {
        return (
            <>
                <PageNavbar title="Edit Post" />
                <div className="container mx-auto max-w-2xl px-4 py-8">
                    <PostCardSkelton />
                </div>
            </>
        )
    }

    // Error state
    if (error || !post) {
        return (
            <>
                <PageNavbar title="Edit Post" />
                <div className="container mx-auto max-w-2xl px-4 py-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                        <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 text-5xl mb-4" />
                        <h2 className="text-xl font-bold text-red-700 mb-2">Unable to Load Post</h2>
                        <p className="text-red-600 mb-6">{error || "Post not found"}</p>
                        <button 
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                            Back to Home
                        </button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <PageNavbar title="Edit Post" />
            <div className="container mx-auto max-w-2xl px-4 py-4">
                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* User Info */}
                    <div className="p-4 bg-gray-50 border-b flex items-center gap-3">
                        <img 
                            src={post.user?.photo} 
                            alt={post.user?.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                    />
                    <div>
                        <p className="font-semibold text-gray-800">{post.user?.name}</p>
                        <p className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Text Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content
                            {hasTextChanges && (
                                <span className="ml-2 text-xs text-blue-600">(modified)</span>
                            )}
                        </label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="What's on your mind?"
                            rows={5}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">
                            {body.length} characters
                        </p>
                    </div>

                    {/* Image Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image
                            {hasImageChanges && (
                                <span className="ml-2 text-xs text-blue-600">
                                    {removeCurrentImage && !previewUrl ? '(will be removed)' : '(new image selected)'}
                                </span>
                            )}
                        </label>

                        {/* Removed Image Notice */}
                        {removeCurrentImage && !previewUrl && post?.image && (
                            <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faTrash} className="text-yellow-600" />
                                    <span className="text-sm text-yellow-700">Current image will be removed</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRestoreCurrentImage}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <FontAwesomeIcon icon={faUndo} />
                                    Undo
                                </button>
                            </div>
                        )}

                        {/* Image Preview */}
                        {displayImage && (
                            <div className="relative mb-3">
                                <img 
                                    src={displayImage} 
                                    alt="Post" 
                                    className="w-full max-h-80 object-cover rounded-lg border"
                                />
                                
                                {/* Badge */}
                                <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded ${
                                    previewUrl ? 'bg-green-500 text-white' : 'bg-gray-700 text-white'
                                }`}>
                                    {previewUrl ? 'New Image' : 'Current Image'}
                                </span>

                                {/* Remove button for new image */}
                                {previewUrl && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveNewImage}
                                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg"
                                        title="Remove new image"
                                    >
                                        <FontAwesomeIcon icon={faTrash} size="sm" />
                                    </button>
                                )}

                                {/* Remove button for current image */}
                                {hasCurrentImage && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveCurrentImage}
                                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg"
                                        title="Remove current image"
                                    >
                                        <FontAwesomeIcon icon={faTrash} size="sm" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Upload Button */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                            onChange={handleSelectImage}
                            className="hidden"
                            id="image-input"
                        />
                        <label
                            htmlFor="image-input"
                            className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        >
                            <FontAwesomeIcon icon={faCamera} className="text-gray-500" />
                            <span className="text-gray-600">
                                {displayImage ? 'Change Image' : 'Add Image'}
                            </span>
                        </label>
                        <p className="text-xs text-gray-400 mt-1">
                            Supported: PNG, JPG, GIF, WebP (max 5MB)
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        {hasChanges ? (
                            <span className="text-blue-600 font-medium">• Unsaved changes</span>
                        ) : (
                            <span>No changes</span>
                        )}
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={submitting}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                            Cancel
                        </button>
                        
                        <button
                            type="submit"
                            disabled={submitting || !body.trim() || !hasChanges}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faSave} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
        </>
    )
}
