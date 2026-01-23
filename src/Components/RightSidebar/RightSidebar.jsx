import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFire, faUserPlus, faHashtag } from '@fortawesome/free-solid-svg-icons'
import profileImg from '../../assets/images/prof.png'

export default function RightSidebar() {
    const suggestedUsers = [
        { id: 1, name: 'Sarah Wilson', username: '@sarahw', avatar: profileImg },
        { id: 2, name: 'Mike Johnson', username: '@mikej', avatar: profileImg },
        { id: 3, name: 'Emma Davis', username: '@emmad', avatar: profileImg },
    ]

    const trendingTopics = [
        { id: 1, tag: '#ReactJS', posts: '12.5K posts' },
        { id: 2, tag: '#JavaScript', posts: '8.2K posts' },
        { id: 3, tag: '#WebDev', posts: '6.8K posts' },
        { id: 4, tag: '#TailwindCSS', posts: '4.3K posts' },
        { id: 5, tag: '#Frontend', posts: '3.1K posts' },
    ]

    return (
        <aside className="space-y-4 sticky top-5">
            {/* Who to Follow Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-2 mb-4">
                    <FontAwesomeIcon icon={faUserPlus} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Who to Follow</h3>
                </div>
                <ul className="space-y-3">
                    {suggestedUsers.map((user) => (
                        <li key={user.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img 
                                    src={user.avatar} 
                                    alt={user.name} 
                                    className="size-10 rounded-full object-cover" 
                                />
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.username}</p>
                                </div>
                            </div>
                            <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full hover:bg-blue-500 transition-colors duration-300">
                                Follow
                            </button>
                        </li>
                    ))}
                </ul>
                <button className="text-blue-600 text-sm mt-4 hover:underline w-full text-center">
                    Show more
                </button>
            </div>

            {/* Trending Topics Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-2 mb-4">
                    <FontAwesomeIcon icon={faFire} className="text-orange-500" />
                    <h3 className="font-semibold text-gray-800">Trending Topics</h3>
                </div>
                <ul className="space-y-3">
                    {trendingTopics.map((topic) => (
                        <li 
                            key={topic.id} 
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-300"
                        >
                            <div className="size-10 bg-blue-50 rounded-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faHashtag} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 text-sm">{topic.tag}</p>
                                <p className="text-xs text-gray-500">{topic.posts}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer Links */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <a href="#" className="hover:text-blue-600 hover:underline">About</a>
                    <span>•</span>
                    <a href="#" className="hover:text-blue-600 hover:underline">Privacy</a>
                    <span>•</span>
                    <a href="#" className="hover:text-blue-600 hover:underline">Terms</a>
                    <span>•</span>
                    <a href="#" className="hover:text-blue-600 hover:underline">Help</a>
                </div>
                <p className="text-xs text-gray-400 mt-2">© 2026 SocialHub</p>
            </div>
        </aside>
    )
}
