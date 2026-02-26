import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../Context/Auth.context"
import axios from "axios"

export function usePosts() {
    const [posts, setPosts] = useState(null)
    const { token } = useContext(AuthContext)


    async function getAllPosts() {
        try {
            const options = {
                url: "https://route-posts.routemisr.com/posts",
                method: 'GET',
                headers: {
                    token
                }
            }
            const { data } = await axios.request(options)
            setPosts(data.data.posts.reverse())
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        getAllPosts()
    }, [])

    return { posts ,getAllPosts};

}