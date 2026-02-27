import { useEffect, useState } from "react"
import { useParams } from "react-router"
import PostCard from "../../Components/PostCard/PostCard"
import PostCardSkelton from "../../Components/PostCardSkelton/PostCardSkelton"
import { postsApi } from "../../services/api"

export default function PostDetails() {
    const [post, setPost] = useState(null)
    const { postId } = useParams();

    async function getPostDetails() {

        try {
            const { data } = await postsApi.getPostById(postId)
            const resolvedPost = data.data?.post || data.post || data.data
            setPost({
                ...resolvedPost,
                id: resolvedPost?.id || resolvedPost?._id
            })

        } catch (error) {
            console.log("error.message")
        }
    }

    useEffect(() => {
        getPostDetails()
    }, [])

    return (
        <>
            <section className="post-details container mx-auto max-w-xl p-4">
                {post ? (<PostCard postInfo={post} numOfComments={10}/>) : <PostCardSkelton/>}
            </section>
        </>
    )
}
