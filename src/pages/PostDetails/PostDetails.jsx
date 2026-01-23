import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../Context/Auth.context"
import axios from "axios"
import { useParams } from "react-router"
import PostCard from "../../Components/PostCard/PostCard"
import PostCardSkelton from "../../Components/PostCardSkelton/PostCardSkelton"
import PageNavbar from "../../Components/PageNavbar/PageNavbar"

export default function PostDetails() {
    const [post, setPost] = useState(null)
    const { token } = useContext(AuthContext)
    const { userId } = useParams();

    async function getPostDetails() {

        try {
            const options = {
                url: `https://linked-posts.routemisr.com/posts/${userId}`,
                method: 'GET',
                headers: {
                    token
                }
            }

            const { data } = await axios.request(options)
            setPost(data.post)
            console.log(data.post);

        } catch (error) {
            console.log("error.message")
        }
    }

    useEffect(() => {
        getPostDetails()
    }, [])

    return (
        <>
            <PageNavbar title="Post Details" />
            <section className="post-details container mx-auto max-w-xl p-4">
                {post ? (<PostCard postInfo={post} numOfComments={10}/>) : <PostCardSkelton/>}
            </section>
        </>
    )
}