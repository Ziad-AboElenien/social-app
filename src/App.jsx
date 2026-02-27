import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";
import Profile from "./pages/Profile/Profile";
import PostDetails from "./pages/PostDetails/PostDetails";
import SignUp from "./pages/Signup/Signup";
import AuthProvider from "./Context/Auth.context";
import Protectedroute from "./Components/Protectedroute/Protectedroute";
import Authroute from "./Components/Authroute/Authroute";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import UpdatePost from "./pages/UpdatePost/UpdatePost";
import UIProvider from "./Context/UI.context";
import ProtectedLayout from "./Layouts/ProtectedLayout";
import Discover from "./pages/Discover/Discover";
import Notifications from "./pages/Notifications/Notifications";
import SavedPosts from "./pages/SavedPosts/SavedPosts";
import UserProfile from "./pages/UserProfile/UserProfile";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Protectedroute>
          <ProtectedLayout />
        </Protectedroute>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "post/:postId",
          element: <PostDetails />,
        },
        {
          path: "update/:postId",
          element: <UpdatePost />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "profile/:userId",
          element: <UserProfile />,
        },
        {
          path: "discover",
          element: <Discover />,
        },
        {
          path: "notifications",
          element: <Notifications />,
        },
        {
          path: "saved",
          element: <SavedPosts />,
        },
      ],
    },
    {
      path: "/login",
      element: (
        <Authroute>
          <Login />
        </Authroute>
      ),
    },
    {
      path: "/signup",
      element: (
        <Authroute>
          <SignUp />
        </Authroute>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <Authroute>
          <ForgotPasswordPage />
        </Authroute>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <>
      <AuthProvider>
        <UIProvider>
          <RouterProvider router={router}></RouterProvider>
        </UIProvider>
      </AuthProvider>
    </>
  );
}

export default App;
