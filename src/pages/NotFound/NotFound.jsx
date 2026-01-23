import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome } from "@fortawesome/free-solid-svg-icons"
import PageNavbar from "../../Components/PageNavbar/PageNavbar"

export default function NotFound() {
    return (
        <>
            <PageNavbar title="Not Found" />
            <div className="container mx-auto max-w-2xl p-4 text-center py-20">
                <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-6">Page Not Found</p>
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <FontAwesomeIcon icon={faHome} />
                    Back to Home
                </Link>
            </div>
        </>
    )
}