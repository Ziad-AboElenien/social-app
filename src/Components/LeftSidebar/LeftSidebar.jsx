import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faEarthAmericas, faFileLines, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router";

export default function LeftSidebar() {
  const menuItems = [
    { icon: faNewspaper, label: "Feed", path: "/" },
    { icon: faFileLines, label: "My Posts", path: "/profile" },
    { icon: faEarthAmericas, label: "Community", path: "/discover" },
    { icon: faBookmark, label: "Saved", path: "/saved" },
  ];

  return (
    <aside className="sticky top-24">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

