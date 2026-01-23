import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../Context/Auth.context"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar, faCamera, faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons"
import x from '../../assets/images/prof.png'
import { toast } from "react-toastify"
import PostCard from "../../Components/PostCard/PostCard"
import PostCardSkelton from "../../Components/PostCardSkelton/PostCardSkelton"
import PageNavbar from "../../Components/PageNavbar/PageNavbar"

export default function Profile() {
    const [profile, setProfile] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [postsLoading, setPostsLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const { token } = useContext(AuthContext)

    async function getProfileData() {
        try {
            const options = {
                url: "https://linked-posts.routemisr.com/users/profile-data",
                method: "GET",
                headers: { token }
            }
            const { data } = await axios.request(options)
            setProfile(data.user)
            // Fetch user posts after getting profile
            getUserPosts(data.user._id)
        } catch (error) {
            console.error("Error fetching profile:", error)
            toast.error("Failed to load profile data")
        } finally {
            setLoading(false)
        }
    }

    async function getUserPosts(userId) {
        setPostsLoading(true)
        try {
            const options = {
                url: `https://linked-posts.routemisr.com/users/${userId}/posts?limit=50`,
                method: "GET",
                headers: { token }
            }
            const { data } = await axios.request(options)
            setPosts((data.posts || []).reverse())
        } catch (error) {
            console.error("Error fetching posts:", error)
        } finally {
            setPostsLoading(false)
        }
    }

    async function handlePhotoUpload(e) {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append("photo", file)

        setUploading(true)
        try {
            const options = {
                url: "https://linked-posts.routemisr.com/users/upload-photo",
                method: "PUT",
                headers: { token },
                data: formData
            }
            const { data } = await axios.request(options)
            if (data.message === "success") {
                toast.success("Profile photo updated!")
                getProfileData() // Refresh profile data
            }
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Failed to upload photo")
        } finally {
            setUploading(false)
        }
    }

    // Refresh posts after delete
    function refreshPosts() {
        if (profile?._id) {
            getUserPosts(profile._id)
        }
    }

    useEffect(() => {
        getProfileData()
    }, [])

    if (loading) {
        return (
            <>
                <PageNavbar title="My Profile" />
                <div className="container mx-auto max-w-2xl p-4">
                    <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>
                            <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-64 mb-4"></div>
                            <div className="h-4 bg-gray-300 rounded w-40"></div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    if (!profile) {
        return (
            <>
                <PageNavbar title="My Profile" />
                <div className="container mx-auto max-w-2xl p-4">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600">Failed to load profile data</p>
                    </div>
                </div>
            </>
        )
    }

    const profileImage = profile.photo?.includes("undefined") ? x : profile.photo

    return (
        <>
            <PageNavbar title="My Profile" />
            <section className="container mx-auto max-w-2xl p-4">
                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Cover Photo */}
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                
                {/* Profile Info */}
                <div className="relative px-6 pb-6">
                    {/* Profile Photo */}
                    <div className="relative -mt-16 mb-4">
                        <div className="relative inline-block">
                            <img 
                                src={profileImage} 
                                alt={profile.name}
                                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                            />
                            {/* Upload Photo Button */}
                            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-md">
                                <FontAwesomeIcon icon={faCamera} className={uploading ? "animate-pulse" : ""} />
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Name */}
                    <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
                    
                    {/* Info Items */}
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center text-gray-600">
                            <FontAwesomeIcon icon={faEnvelope} className="w-5 mr-3 text-blue-500" />
                            <span>{profile.email}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                            <FontAwesomeIcon icon={faUser} className="w-5 mr-3 text-blue-500" />
                            <span>@{profile.name.toLowerCase().replace(/\s+/g, '')}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                            <FontAwesomeIcon icon={faCalendar} className="w-5 mr-3 text-blue-500" />
                            <span>Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                                month: 'long', 
                                year: 'numeric' 
                            })}</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex justify-around text-center">
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{posts.length}</p>
                                <p className="text-gray-500 text-sm">Posts</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">0</p>
                                <p className="text-gray-500 text-sm">Followers</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">0</p>
                                <p className="text-gray-500 text-sm">Following</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Posts Section */}
            <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">My Posts</h2>
                
                {postsLoading ? (
                    <>
                        <PostCardSkelton />
                        <PostCardSkelton />
                    </>
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <PostCard 
                            key={post._id || post.id} 
                            postInfo={post} 
                            numOfComments={2}
                            getAllPosts={refreshPosts}
                        />
                    ))
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-500">You haven't posted anything yet.</p>
                    </div>
                )}
            </div>
        </section>
        </>
    )
}