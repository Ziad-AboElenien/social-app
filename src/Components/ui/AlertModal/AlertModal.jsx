import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleInfo, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default function AlertModal({ isOpen, title, message, type = "info", onClose }) {
  if (!isOpen) return null;

  const styles = {
    success: {
      icon: faCircleCheck,
      iconColor: "text-green-600",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    error: {
      icon: faCircleXmark,
      iconColor: "text-red-600",
      buttonColor: "bg-red-600 hover:bg-red-700",
    },
    info: {
      icon: faCircleInfo,
      iconColor: "text-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const current = styles[type] || styles.info;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="mb-4 flex items-center gap-3">
            <FontAwesomeIcon icon={current.icon} className={`text-2xl ${current.iconColor}`} />
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <p className="text-sm text-gray-600">{message}</p>
          <button
            type="button"
            onClick={onClose}
            className={`mt-6 w-full rounded-lg px-4 py-2 text-sm font-semibold text-white ${current.buttonColor}`}
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
}

