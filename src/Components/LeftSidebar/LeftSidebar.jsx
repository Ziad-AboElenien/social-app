import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faHouse, 
    faCompass, 
    faBookmark, 
    faPeopleGroup, 
    faCalendarDays, 
    faGear, 
    faArrowRightFromBracket,
    faUser
} from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router'
import profileImg from '../../assets/images/prof.png'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Context/Auth.context'
import axios from 'axios'

export default function LeftSidebar() {
    const [user, setUser] = useState(null)
    const [postsCount, setPostsCount] = useState(0)
    
    const menuItems = [
        { icon: faHouse, label: 'Home', path: '/' },
        { icon: faCompass, label: 'Explore', path: '/explore' },
        { icon: faBookmark, label: 'Saved', path: '/saved' },
        { icon: faPeopleGroup, label: 'Communities', path: '/communities' },
        { icon: faCalendarDays, label: 'Events', path: '/events' },
    ]

    const { logOut, token } = useContext(AuthContext)

    // Fetch user profile data
    async function getUserData() {
        try {
            const { data } = await axios.get('https://route-posts.routemisr.com/users/profile-data', {
                headers: { token }
            })
            setUser(data.data.user)
            // Get user posts count
            getUserPostsCount(data.data.user._id)
        } catch (error) {
            console.log("Error fetching user data")
        }
    }

    async function getUserPostsCount(userId) {
        try {
            const { data } = await axios.get(`https://route-posts.routemisr.com/users/${userId}/posts?limit=100`, {
                headers: { token }
            })
            setPostsCount(data.data.posts?.length || 0)
        } catch (error) {
            console.log("Error fetching posts count")
        }
    }

    useEffect(() => {
        getUserData()
    }, [])

    const userPhoto = user?.photo?.includes('undefined') ? profileImg : user?.photo
    const userName = user?.name || 'Loading...'
    const userHandle = user?.name ? `@${user.name.toLowerCase().replace(/\s+/g, '')}` : ''

    return (
        <aside className=" rounded-lg  p-4 sticky top-5">
            {/* Profile Section */}
            <div className="profile-section pb-4 border-b border-gray-200">
                <NavLink to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <img 
                        src={userPhoto || profileImg} 
                        alt="Profile" 
                        className="size-14 rounded-full object-cover border-2 border-blue-500" 
                    />
                    <div>
                        <h3 className="font-semibold text-gray-800">{userName}</h3>
                        <p className="text-sm text-gray-500">{userHandle}</p>
                    </div>
                </NavLink>
                <div className="flex justify-around mt-4 text-center">
                    <div>
                        <p className="font-bold text-gray-800">{postsCount}</p>
                        <p className="text-xs text-gray-500">Posts</p>
                    </div>
                    <div className="border-x border-gray-200 px-4">
                        <p className="font-bold text-gray-800">0</p>
                        <p className="text-xs text-gray-500">Followers</p>
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">0</p>
                        <p className="text-xs text-gray-500">Following</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="menu-section py-4 border-b border-gray-200">
                <ul className="space-y-1">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <NavLink 
                                to={item.path}
                                className={({ isActive }) => 
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-300 ${
                                        isActive 
                                            ? 'bg-blue-50 text-blue-600' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <FontAwesomeIcon icon={item.icon} className="w-5" />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Settings Section */}
            <div className="settings-section pt-4">
                <ul className="space-y-1">
                    <li>
                        <NavLink 
                            to="/profile"
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-300 ${
                                    isActive 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`
                            }
                        >
                            <FontAwesomeIcon icon={faUser} className="w-5" />
                            <span className="font-medium">My Profile</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/settings"
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-300 ${
                                    isActive 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`
                            }
                        >
                            <FontAwesomeIcon icon={faGear} className="w-5" />
                            <span className="font-medium">Settings</span>
                        </NavLink>
                    </li>
                    <li>
                        <button type='button' onClick={logOut} className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-red-500 hover:bg-red-50 transition-colors duration-300">
                            <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
    )
}
