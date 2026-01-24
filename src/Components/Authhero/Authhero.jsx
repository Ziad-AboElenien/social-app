import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faHeart, faImage, faMessage, faStar, faUsers } from "@fortawesome/free-solid-svg-icons";
import avater from '../../assets/images/test.jpg'
import bg from '../../assets/images/bg3.png'

export default function Authhero({
    title,
    desc
}) {

    const features = [
        {
            icon: faMessage,
            title: "Real-time Chat",
            description: "Instant Messaging",
            colors: 'bg-green-300/35 text-green-500'
        },
        {
            icon: faImage,
            title: "Share Media",
            description: "Photos and Videos",
            colors: 'bg-blue-300/35 text-blue-500'
        },
        {
            icon: faBell,
            title: "Smart Alerts",
            description: "Notifications and Updates",
            colors: 'bg-fuchsia-300/35 text-fuchsia-500'
        },
        {
            icon: faUsers,
            title: "Communities",
            description: "Connect with like-minded people",
            colors: 'bg-green-300/35 text-green-500'
        }
    ]

    const nums = [
        {
            icon: faUsers,
            color: 'text-green-500',
            number: '2M+',
            label: 'Active Users'
        },
        {
            icon: faHeart,
            color: 'text-fuchsia-500',
            number: '10M+',
            label: 'posts shared'
        },
        {
            icon: faBell,
            color: 'text-green-500',
            number: '50M+',
            label: 'Mesasages sent'
        }
    ]



    return (
        <>
            <div className="signuphero space-y-6 sm:space-y-9 min-h-screen text-white p-4 sm:p-6 md:p-10 overflow-hidden" style={{
                backgroundImage: `linear-gradient(rgba(48, 72, 253, 0.5), rgba(48, 72, 253, 0.5)), url(${bg})`
            }} >
                <header className="">
                    <Link className="flex items-center gap-x-3" to={'/'}>
                        <span className="bg-white/40 size-10 text-center border border-white/30  rounded-lg"><span className="translate-y-1">s</span></span>
                        <span className="text-xl font-bold">SocialHub</span>
                    </Link>
                </header>

                <div className="title">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl max-w-full sm:max-w-96 my-4 sm:my-8">{title.head} <span className="bg-linear-to-r from-cyan-300 to-cyan-50 bg-clip-text text-transparent ">{title.body}</span></h2>
                    <p className="text-xs sm:text-sm text-gray-300 max-w-full sm:max-w-96">{desc}</p>
                </div>

                <div className="sr-only">application features</div>
                <div className="features hidden md:block">
                    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                        {features.map((feature ,index) => {
                            return (
                                <li key={index} className="flex items-center gap-x-3 bg-white/30 px-3 py-2 rounded-lg backdrop-blur-2xl hover:scale-105 transition-transform duration-300">
                                    <FontAwesomeIcon className={`${feature.colors} p-2 rounded-md`} icon={feature.icon} />
                                    <div className="description">
                                        <p>{feature.title}</p>
                                        <p className="text-sm text-gray-300">{feature.description}</p>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className="numbers hidden md:block">
                    <ul className="flex gap-x-2 sm:gap-x-5 overflow-x-auto">
                        {nums.map((num ,index) => {
                            return (
                                <li key={index}>
                                    <div className="flex gap-2 items-center">
                                        <FontAwesomeIcon className={num.color} icon={num.icon} />
                                        <p className="text-xl">{num.number}</p>
                                    </div>
                                    <p className="text-sm text-gray-300">{num.label}</p>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <figure className="bg-white/30 p-5 rounded-2xl backdrop-blur-sm hover:backdrop-blur-xl transition-all duration-300">
                    <div className="mb-3 mt-2 ">
                        {[...Array(5)].map((index) => {
                            return (
                                <FontAwesomeIcon key={index} className="text-yellow-500 text-sm text-shadow-yellow-300 hover:scale-115 transition-transform duration-300" icon={faStar} />
                            )
                        })}
                    </div>

                    <blockquote className="italic text-gray-100">
                        <p>"socialHub has completely transformed the way I connect and share with others."</p>
                    </blockquote>

                    <figcaption className="flex items-center gap-x-3 mt-4">
                        <img src={avater} className="size-12 rounded-full" alt="" />
                        <div className="info">
                            <cite className="">Alex Johnson</cite>
                            <span className="block text-sm text-gray-200">Product Designer </span>
                        </div>
                    </figcaption>
                </figure>

            </div>
        </>
    )
}