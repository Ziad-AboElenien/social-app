import { NavLink } from "react-router"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faBell, faCompass, faEnvelope, faHouse, faMagnifyingGlass, faPeopleGroup, faPlus, faShareNodes } from "@fortawesome/free-solid-svg-icons"


export default function Navbar() {
    return (
        <>
            <nav className="bg-gray-100 z-50 fixed top-0 left-0 right-0 text-lg shadow">
                <div className="max-w-6xl container mx-auto py-4 flex justify-between">
                    <div className="left-side flex gap-5 ">
                        <h1>
                            <Link className="flex space-x-1 items-center text-2xl " to="/">
                                <FontAwesomeIcon className="text-blue-600" icon={faShareNodes} />
                                <p className="font-bold text-black">SocialHub</p>
                            </Link>
                        </h1>
                        <ul className="links hidden  md:flex gap-5">
                            <li className="link flex items-center"><NavLink to="/" className={({ isActive }) => `${isActive && 'text-blue-500'} space-x-1 hover:text-blue-500 transition-colors duration-300`} >
                                <FontAwesomeIcon icon={faHouse} /> Home
                            </NavLink></li>
                            <li className="link flex items-center">
                                <NavLink to="/explore" className={({ isActive }) => `${isActive && 'text-blue-500'} space-x-1 hover:text-blue-500 transition-colors duration-300`}>
                                    <FontAwesomeIcon icon={faCompass} /> Explore
                                </NavLink>
                            </li>
                            <li className="link flex items-center">
                                <NavLink to="/communications" className={({ isActive }) => `${isActive && 'text-blue-500'} space-x-1 hover:text-blue-500 transition-colors duration-300`}>
                                    <FontAwesomeIcon icon={faPeopleGroup} /> Communications
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className="right-side hidden md:flex items-center ">
                        <div className="relative hidden xl:block">
                            <input className="border border-2 border-transparent bg-gray-200 rounded-2xl ps-9 px-3 min-w-80 py-1 focus:outline-0  focus:border-blue-500 transition-colors duraation-300" type="text" placeholder="Search posts,people,topics..." />
                            <FontAwesomeIcon className="absolute top-1/2 -translate-y-1/2 left-1/25 text-gray-700" icon={faMagnifyingGlass} />
                        </div>
                        <div className="icons space-x-3 ps-3">
                            <button className="notifications-btn cursor-pointer after:w-2 after:h-2 after:bg-red-500 after:absolute  relative  -after:translate-y-0.5 after:rounded-4xl">
                                <FontAwesomeIcon icon={faBell} />
                            </button>
                            <button className="messages-btn cursor-pointer after:w-2 after:h-2 after:bg-red-500 after:absolute  relative  -after:translate-y-0.5 after:rounded-4xl">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </button>
                            <button className="bg-blue-600 text-white px-4 py-1 rounded-3xl space-x-0.5 ms-2 hover:bg-blue-500 transition-colors duration-300">
                                <FontAwesomeIcon icon={faPlus} />
                                <span>Create Post</span>
                            </button>
                        </div>
                        

                    </div>
                    <button className="md:hidden cursor-pointer ">
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                </div>
            </nav>
        </>
    )
}