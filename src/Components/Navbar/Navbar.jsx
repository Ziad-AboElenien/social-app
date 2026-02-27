import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBars, faHouse, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/Auth.context";
import { notificationsApi, usersApi } from "../../services/api";
import fallbackAvatar from "../../assets/images/prof.png";

export default function Navbar() {
  const { logOut } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, unreadRes] = await Promise.all([
          usersApi.getProfileData(),
          notificationsApi.getUnreadCount(),
        ]);
        setProfile(profileRes.data.data.user);
        setUnreadCount(unreadRes.data.data?.count || unreadRes.data.count || 0);
      } catch {
        setProfile(null);
        setUnreadCount(0);
      }
    }
    loadData();
  }, []);

  const photo = profile?.photo && !profile.photo.includes("undefined") ? profile.photo : fallbackAvatar;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-2.5">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#0f3ca8] text-[9px] font-black text-white sm:h-11 sm:w-11 sm:rounded-xl sm:text-[10px]">
            Devs
          </div>
          <span className="text-lg font-black tracking-tight text-[#0d1b3a] sm:text-2xl">DEVHub</span>
        </NavLink>

        <div className="hidden items-center rounded-3xl border border-slate-200 bg-slate-50 p-1 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-2xl px-4 py-2 text-sm font-bold transition lg:px-6 ${isActive ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`
            }
          >
            <FontAwesomeIcon icon={faHouse} className="mr-2" />
            Feed
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `rounded-2xl px-6 py-2 text-sm font-bold transition ${isActive ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`
            }
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Profile
          </NavLink>
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `relative rounded-2xl px-6 py-2 text-sm font-bold transition ${isActive ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`
            }
          >
            <FontAwesomeIcon icon={faBell} className="mr-2" />
            Notifications
            {unreadCount > 0 ? (
              <span className="absolute right-2 top-0 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </NavLink>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((s) => !s)}
            className="flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-2 py-1 sm:px-3 sm:py-1.5"
          >
            <img src={photo} alt="user" className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10" />
            <span className="hidden text-sm font-bold text-slate-700 sm:block">{profile?.name || "user"}</span>
            <FontAwesomeIcon icon={faBars} className="text-slate-500" />
          </button>

          {menuOpen ? (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg sm:w-52">
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 md:hidden"
              >
                Feed
              </NavLink>
              <NavLink
                to="/notifications"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 md:hidden"
              >
                Notifications
              </NavLink>
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                My profile
              </NavLink>
              <NavLink
                to="/saved"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Saved posts
              </NavLink>
              <button
                type="button"
                onClick={logOut}
                className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
