import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons'

export default function ConfirmModal({ 
    isOpen, 
    title = "Confirm Action", 
    message = "Are you sure?", 
    onConfirm, 
    onCancel, 
    isLoading = false,
    confirmText = "Delete",
    cancelText = "Cancel",
    type = "danger" // danger, warning, info
}) {
    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            icon: faExclamationTriangle,
            iconColor: 'text-red-500',
            bgColor: 'bg-red-50',
            buttonColor: 'bg-red-600 hover:bg-red-700',
            borderColor: 'border-red-200'
        },
        warning: {
            icon: faExclamationTriangle,
            iconColor: 'text-yellow-500',
            bgColor: 'bg-yellow-50',
            buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
            borderColor: 'border-yellow-200'
        },
        info: {
            icon: faExclamationTriangle,
            iconColor: 'text-blue-500',
            bgColor: 'bg-blue-50',
            buttonColor: 'bg-blue-600 hover:bg-blue-700',
            borderColor: 'border-blue-200'
        }
    };

    const style = typeStyles[type] || typeStyles.danger;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onCancel}
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div 
                    className={`bg-white rounded-xl shadow-2xl border ${style.borderColor} max-w-md w-full animate-in zoom-in-95 fade-in duration-300`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={`${style.bgColor} px-6 py-4 border-b ${style.borderColor} flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                            <div className={`${style.bgColor} p-2 rounded-full`}>
                                <FontAwesomeIcon 
                                    icon={style.icon} 
                                    className={`${style.iconColor} text-xl`}
                                />
                            </div>
                            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                        </div>
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-4">
                        <p className="text-gray-600 text-sm">{message}</p>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex gap-3 justify-end">
                        <button
                            onClick={onCancel}
                            disabled={isLoading}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`px-4 py-2 ${style.buttonColor} text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Deleting...</span>
                                </>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
