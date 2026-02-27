import AllPosts from "../../Components/AllPosts/AllPosts"
import { usePosts } from "../../Components/Hooks/usePosts"
import LeftSidebar from "../../Components/LeftSidebar/LeftSidebar"
import RightSidebar from "../../Components/RightSidebar/RightSidebar"
import UploadPost from "../../Components/UploadPost/UploadPost"

export default function Home() {
  const {posts ,getAllPosts} =usePosts("all")
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <LeftSidebar />
          </div>
          
          {/* Main Content */}
          <main className="col-span-1 lg:col-span-6">
            <UploadPost getAllPosts={getAllPosts} />
            <AllPosts posts={posts} getAllPosts={getAllPosts} />
          </main>
          
          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
