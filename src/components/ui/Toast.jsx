import React from 'react'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { removeToast, selectToasts } from '@/features/ui/uiSlice'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/utils/cn'
import { TOAST_TYPES } from '@/utils/constants'

const Toast = ({ toast }) => {
  const dispatch = useAppDispatch()
  
  const handleClose = () => {
    dispatch(removeToast(toast.id))
  }
  
  const icons = {
    [TOAST_TYPES.SUCCESS]: CheckCircle,
    [TOAST_TYPES.ERROR]: XCircle,
    [TOAST_TYPES.WARNING]: AlertTriangle,
    [TOAST_TYPES.INFO]: Info
  }
  
  const Icon = icons[toast.type]
  
  const variants = {
    [TOAST_TYPES.SUCCESS]: "bg-success-50 border-success-200 text-success-800",
    [TOAST_TYPES.ERROR]: "bg-error-50 border-error-200 text-error-800",
    [TOAST_TYPES.WARNING]: "bg-warning-50 border-warning-200 text-warning-800",
    [TOAST_TYPES.INFO]: "bg-info-50 border-info-200 text-info-800"
  }
  
  const iconColors = {
    [TOAST_TYPES.SUCCESS]: "text-success-600",
    [TOAST_TYPES.ERROR]: "text-error-600",
    [TOAST_TYPES.WARNING]: "text-warning-600",
    [TOAST_TYPES.INFO]: "text-info-600"
  }
  
  React.useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, toast.duration)
      
      return () => clearTimeout(timer)
    }
  }, [toast.duration])
  
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md animate-slide-in",
        variants[toast.type]
      )}
    >
      {Icon && <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", iconColors[toast.type])} />}
      
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{toast.message}</p>
        
        {toast.actions && toast.actions.length > 0 && (
          <div className="flex gap-2 mt-2">
            {toast.actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="text-xs font-medium underline hover:no-underline"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

const ToastContainer = () => {
  const toasts = useAppSelector(selectToasts)
  
  if (toasts.length === 0) return null
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

export { Toast, ToastContainer }
