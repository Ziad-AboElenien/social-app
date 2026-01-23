import AllPosts from "../../Components/AllPosts/AllPosts"
import { usePosts } from "../../Components/Hooks/usePosts"
import LeftSidebar from "../../Components/LeftSidebar/LeftSidebar"
import RightSidebar from "../../Components/RightSidebar/RightSidebar"
import UploadPost from "../../Components/UploadPost/UploadPost"
import PageNavbar from "../../Components/PageNavbar/PageNavbar"

export default function Home() {
  const {posts ,getAllPosts} =usePosts()
  return (
    <>
      {/* Show PageNavbar only on mobile (when sidebars are hidden) */}
      <div className="lg:hidden">
        <PageNavbar title="Home" showBack={false} />
      </div>
      
      <div className="container mx-auto max-w-6xl px-4 pt-4 lg:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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