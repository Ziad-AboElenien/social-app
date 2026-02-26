import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFire, faUserPlus, faHashtag, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons'
import profileImg from '../../assets/images/prof.png'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Context/Auth.context'
import axios from 'axios'

export default function RightSidebar() {
    const [suggestions, setSuggestions] = useState([])
    const [filteredSuggestions, setFilteredSuggestions] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [followState, setFollowState] = useState({}) // { userId: 'idle' | 'loading' | 'followed' }
    const [showAll, setShowAll] = useState(false)
    const [loadingSuggestions, setLoadingSuggestions] = useState(true)

    const { token } = useContext(AuthContext)

    const trendingTopics = [
        { id: 1, tag: '#ReactJS', posts: '12.5K posts' },
        { id: 2, tag: '#JavaScript', posts: '8.2K posts' },
        { id: 3, tag: '#WebDev', posts: '6.8K posts' },
        { id: 4, tag: '#TailwindCSS', posts: '4.3K posts' },
        { id: 5, tag: '#Frontend', posts: '3.1K posts' },
    ]

    // ✅ Fetch suggestions from API
    async function fetchSuggestions() {
        setLoadingSuggestions(true)
        try {
            const { data } = await axios.get(
                'https://route-posts.routemisr.com/users/suggestions?limit=10',
                { headers: { Authorization: `Bearer ${token}` } }
            )
            const users = data.data?.users || data.data || []
            setSuggestions(users)
            setFilteredSuggestions(users)
        } catch (error) {
            console.log('Error fetching suggestions:', error)
        } finally {
            setLoadingSuggestions(false)
        }
    }

    // ✅ Follow a user
    async function handleFollow(userId) {
        setFollowState(prev => ({ ...prev, [userId]: 'loading' }))
        try {
            await axios({
                method: 'POST',
                url: `https://route-posts.routemisr.com/users/${userId}/follow`,
                headers: { Authorization: `Bearer ${token}` }
            })
            setFollowState(prev => ({ ...prev, [userId]: 'followed' }))
        } catch (error) {
            console.log('Error following user:', error)
            setFollowState(prev => ({ ...prev, [userId]: 'idle' }))
        }
    }

    // ✅ Search filter
    function handleSearch(e) {
        const q = e.target.value
        setSearchQuery(q)
        if (!q.trim()) {
            setFilteredSuggestions(suggestions)
        } else {
            setFilteredSuggestions(
                suggestions.filter(u =>
                    u.name?.toLowerCase().includes(q.toLowerCase()) ||
                    u.username?.toLowerCase().includes(q.toLowerCase())
                )
            )
        }
    }

    useEffect(() => {
        fetchSuggestions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Defensive: ensure filteredSuggestions is always treated as an array
    const safeFiltered = Array.isArray(filteredSuggestions) ? filteredSuggestions : []
    const displayedSuggestions = showAll ? safeFiltered : safeFiltered.slice(0, 5)

    function getUserPhoto(user) {
        return user?.photo?.includes('undefined') || !user?.photo ? profileImg : user.photo
    }

    function getUserHandle(user) {
        return user?.username ? `@${user.username}` : `@${user?.name?.toLowerCase().replace(/\s+/g, '') || ''}`
    }

    function truncateName(name = '', max = 14) {
        return name.length > max ? name.slice(0, max) + '...' : name
    }

    return (
        <aside className="space-y-4 sticky top-5">

            {/* ── Suggested Friends ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faUserPlus} className="text-blue-600 text-lg" />
                        <h3 className="font-bold text-gray-900 text-[15px]">Suggested Friends</h3>
                    </div>
                    {!loadingSuggestions && (
                        <span className="bg-blue-100 text-blue-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {filteredSuggestions.length}
                        </span>
                    )}
                </div>

                {/* Search */}
                <div className="relative mb-3">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search friends..."
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"
                    />
                </div>

                {/* List */}
                {loadingSuggestions ? (
                    <div className="flex items-center justify-center py-6 text-gray-400 gap-2">
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        <span className="text-sm">Loading...</span>
                    </div>
                ) : filteredSuggestions.length === 0 ? (
                    <p className="text-center text-sm text-gray-400 py-4">No suggestions found</p>
                ) : (
                    <ul className="space-y-2">
                        {displayedSuggestions.map((suggestedUser) => {
                            const state = followState[suggestedUser._id] || 'idle'
                            const isLoading = state === 'loading'
                            const isFollowed = state === 'followed'

                            return (
                                <li
                                    key={suggestedUser._id}
                                    className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <img
                                                src={getUserPhoto(suggestedUser)}
                                                alt={suggestedUser.name}
                                                className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 text-[14px] truncate">
                                                    {truncateName(suggestedUser.name)}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {getUserHandle(suggestedUser)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Follow button */}
                                        {isFollowed ? (
                                            <span className="text-xs text-gray-400 font-medium shrink-0 ml-2">Following</span>
                                        ) : (
                                            <button
                                                onClick={() => handleFollow(suggestedUser._id)}
                                                disabled={isLoading}
                                                className="shrink-0 ml-2 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[10px]" />
                                                        <span>Updating...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon={faUserPlus} className="text-[11px]" />
                                                        <span>Follow</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Followers count */}
                                    <p className="text-xs text-gray-400 mt-1.5 ml-12">
                                        {suggestedUser.followersCount ?? suggestedUser.followers?.length ?? 0} followers
                                    </p>
                                </li>
                            )
                        })}
                    </ul>
                )}

                {/* View more / less */}
                {!loadingSuggestions && filteredSuggestions.length > 5 && (
                    <button
                        onClick={() => setShowAll(s => !s)}
                        className="mt-3 w-full py-2 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
                    >
                        {showAll ? 'View less' : 'View more'}
                    </button>
                )}
            </div>

            {/* ── Trending Topics ── */}
            <div className="rounded-lg shadow-md p-4">
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

            {/* ── Footer Links ── */}
            <div className="rounded-lg shadow-md p-4">
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