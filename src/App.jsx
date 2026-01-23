import { createBrowserRouter, RouterProvider } from "react-router"
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import NotFound from "./pages/NotFound/NotFound"
import Profile from "./pages/Profile/Profile"
import PostDetails from "./pages/PostDetails/PostDetails"
import SignUp from "./pages/Signup/Signup"
import { Bounce, ToastContainer } from "react-toastify"
import AuthProvider from "./Context/Auth.context"
import Protectedroute from "./Components/Protectedroute/Protectedroute"
import Authroute from "./Components/Authroute/Authroute"
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage"
import UpdatePost from "./pages/UpdatePost/UpdatePost"
function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Protectedroute><Home /></Protectedroute>
    },
    {
      path: '/login',
      element: <Authroute><Login /></Authroute>
    },
    {
      path: '*',
      element: <NotFound />
    },
    {
      path: '/post/:userId',
      element: <Protectedroute><PostDetails/></Protectedroute>
    },
    {
      path: '/update/:postId',
      element: <Protectedroute><UpdatePost/></Protectedroute>
    },
    {
      path: '/profile',
      element: <Protectedroute><Profile /></Protectedroute>
    },
    {
      path: '/signup',
      element: <Authroute><SignUp /></Authroute>
    }
    ,{
      path: '/forgot-password',
      element: <Authroute><ForgotPasswordPage /></Authroute>
    }
  ])

  return (


    <>
      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </AuthProvider>
    </>
  )
}

export default App
