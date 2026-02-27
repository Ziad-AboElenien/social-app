import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckDouble, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { notificationsApi } from "../../services/api";
import { useUI } from "../../Components/Hooks/useUI";
import profileImg from "../../assets/images/prof.png";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { showAlert } = useUI();

  async function loadNotifications() {
    setLoading(true);
    try {
      const { data } = await notificationsApi.getAll({ page: 1, limit: 50 });
      setNotifications(data.data?.notifications || data.notifications || data.data || []);
    } catch (error) {
      setNotifications([]);
      showAlert({
        type: "error",
        title: "Notifications Error",
        message: error.response?.data?.error || "Failed to fetch notifications.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id) {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) => prev.map((item) => (item._id === id ? { ...item, isRead: true } : item)));
    } catch {
      showAlert({ type: "error", title: "Action Failed", message: "Failed to mark notification as read." });
    }
  }

  async function markAllAsRead() {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      showAlert({ type: "success", title: "Done", message: "All notifications marked as read." });
    } catch {
      showAlert({ type: "error", title: "Action Failed", message: "Failed to mark all as read." });
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);
  const renderedNotifications =
    filter === "unread" ? notifications.filter((item) => !item.isRead) : notifications;

  return (
    <section className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-5 sm:px-6 sm:py-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-black text-[#0d1b3a] sm:text-5xl">Notifications</h1>
              <p className="mt-1 text-sm text-slate-500 sm:text-base">Realtime updates for likes, comments, shares, and follows.</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`rounded-full px-5 py-2 text-sm font-black ${filter === "all" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`rounded-full px-5 py-2 text-sm font-black ${filter === "unread" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}
                >
                  Unread
                  <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{unreadCount}</span>
                </button>
              </div>
            </div>

            <button
              onClick={markAllAsRead}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-black text-slate-700 sm:w-auto sm:px-5 sm:py-3"
            >
              <FontAwesomeIcon icon={faCheckDouble} className="mr-2" />
              Mark all as read
            </button>
          </div>
        </div>

        <div className="px-3 py-4 sm:px-4">
          {loading ? (
            <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500">Loading...</div>
          ) : renderedNotifications.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500">No notifications found.</div>
          ) : (
            <div className="space-y-3">
              {renderedNotifications.map((item) => {
                const actorName = item.user?.name || item.sender?.name || item.actor?.name || "Someone";
                const actorPhoto = item.user?.photo || item.sender?.photo || item.actor?.photo || profileImg;
                const content = item.message || item.content || item.title || "interacted with your post";
                return (
                  <div
                    key={item._id}
                    className={`rounded-2xl border px-4 py-4 ${
                      item.isRead ? "border-slate-200 bg-white" : "border-blue-100 bg-blue-50/50"
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <img src={actorPhoto} alt={actorName} className="h-10 w-10 rounded-full object-cover sm:h-14 sm:w-14" />
                        <div>
                          <p className="text-base font-bold text-[#0d1b3a] sm:text-xl">
                            {actorName} <span className="font-medium text-slate-700">{content}</span>
                          </p>
                          <p className="text-sm text-slate-700 sm:text-[20px]">{item.post?.body || ""}</p>
                          {!item.isRead ? (
                            <button
                              onClick={() => markAsRead(item._id)}
                              className="mt-2 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-sm font-bold text-blue-600"
                            >
                              <FontAwesomeIcon icon={faCheck} className="mr-2" />
                              Mark as read
                            </button>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pl-12 text-xs text-slate-500 sm:pl-0 sm:text-sm">
                        <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "recently"}</span>
                        {!item.isRead ? <span className="h-2 w-2 rounded-full bg-blue-500"></span> : null}
                      </div>
                    </div>
                    <div className="mt-2 text-blue-500">
                      <FontAwesomeIcon icon={faCommentDots} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
