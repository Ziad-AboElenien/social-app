import PostCard from "../PostCard/PostCard";
import PostCardSkelton from "../PostCardSkelton/PostCardSkelton";

export default function AllPosts({posts, getAllPosts}) {

    return (
        <>
            <section className="all-posts mt-5">
                {posts ? (
                    posts.map((post, index) => (
                        <PostCard key={post.id || index} postInfo={post} numOfComments={3} getAllPosts={getAllPosts} />
                    ))
                ) : (
                    [...Array(3)].map((_, index) => <PostCardSkelton key={index} />)
                )}
            </section>
        </>
    )
}