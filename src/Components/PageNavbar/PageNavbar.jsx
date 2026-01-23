import { NavLink, Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
    faArrowLeft,
    faArrowRightFromBracket,
    faBars,
    faBookmark,
    faCompass, 
    faGear, 
    faHouse, 
    faPeopleGroup,
    faShareNodes,
    faUser,
    faXmark
} from "@fortawesome/free-solid-svg-icons"
import { useContext, useState } from "react"
import { AuthContext } from "../../Context/Auth.context"

export default function PageNavbar({ title = "SocialHub", showBack = true }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const { logOut } = useContext(AuthContext)

    const menuItems = [
        { icon: faHouse, label: 'Home', path: '/' },
        { icon: faCompass, label: 'Explore', path: '/explore' },
        { icon: faBookmark, label: 'Saved', path: '/saved' },
        { icon: faPeopleGroup, label: 'Communities', path: '/communities' },
        { icon: faUser, label: 'My Profile', path: '/profile' },
        { icon: faGear, label: 'Settings', path: '/settings' },
    ]

    return (
        <>
            <nav className="bg-white z-50 fixed top-0 left-0 right-0 shadow-md">
                <div className="container mx-auto max-w-2xl px-4 py-3 flex justify-between items-center">
                    {/* Left - Back button or Logo */}
                    <div className="flex items-center gap-3">
                        {showBack ? (
                            <Link 
                                to="/" 
                                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                                <span className="hidden sm:inline">Back</span>
                            </Link>
                        ) : (
                            <Link className="flex items-center gap-1 text-xl" to="/">
                                <FontAwesomeIcon className="text-blue-600" icon={faShareNodes} />
                                <span className="font-bold text-black">SocialHub</span>
                            </Link>
                        )}
                    </div>

                    {/* Center - Title */}
                    <h1 className="font-semibold text-gray-800 text-lg">{title}</h1>

                    {/* Right - Menu button */}
                    <button 
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="text-gray-700" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {menuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Slide-in Menu */}
            <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4">
                    {/* Menu Header */}
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <h2 className="font-semibold text-gray-800">Menu</h2>
                        <button 
                            onClick={() => setMenuOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <nav className="py-4">
                        <ul className="space-y-1">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <NavLink 
                                        to={item.path}
                                        onClick={() => setMenuOpen(false)}
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

                    {/* Logout */}
                    <div className="pt-4 border-t border-gray-200">
                        <button 
                            type="button" 
                            onClick={() => {
                                setMenuOpen(false)
                                logOut()
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-red-500 hover:bg-red-50 transition-colors duration-300"
                        >
                            <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Spacer for fixed navbar */}
            <div className="h-14"></div>
        </>
    )
}
