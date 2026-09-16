import { toast as toastify, type Id, type ToastContent, type ToastOptions } from 'react-toastify'

// react-toastify assigns a new random id per call by default, so clicking the
// same action repeatedly (e.g. spamming "Save") stacks up one toast per click.
// Defaulting toastId to the message text makes react-toastify treat identical,
// still-visible toasts as the same one instead of creating duplicates —
// callers can still pass their own toastId/options to override this.
const withId = (content: ToastContent, options?: ToastOptions): ToastOptions => {
  const toastId: Id | undefined = typeof content === 'string' ? content : undefined
  return { toastId, ...options }
}

export const toast = {
  success: (content: ToastContent, options?: ToastOptions) =>
    toastify.success(content, withId(content, options)),
  error: (content: ToastContent, options?: ToastOptions) =>
    toastify.error(content, withId(content, options)),
  warning: (content: ToastContent, options?: ToastOptions) =>
    toastify.warning(content, withId(content, options)),
  info: (content: ToastContent, options?: ToastOptions) =>
    toastify.info(content, withId(content, options)),
}
