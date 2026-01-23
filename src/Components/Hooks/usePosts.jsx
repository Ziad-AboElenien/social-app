import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../Context/Auth.context"
import axios from "axios"

export function usePosts() {
    const [posts, setPosts] = useState(null)
    const { token } = useContext(AuthContext)


    async function getAllPosts() {
        try {
            const options = {
                url: "https://linked-posts.routemisr.com/posts?limit=50&page=110",
                method: 'GET',
                headers: {
                    token
                }
            }
            const { data } = await axios.request(options)
            setPosts(data.posts.reverse())
            console.log(data);

        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        getAllPosts()
    }, [])

    return { posts ,getAllPosts};

}