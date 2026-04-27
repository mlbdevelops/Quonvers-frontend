type ToastData = {
  id: string
  message: string
  duration: number
  position: string
}

type Listener = (toast: ToastData) => void

let listeners: Listener[] = []

function generateId() {
  return Math.random().toString(36).slice(2)
}

function emit(toast: ToastData) {
  listeners.forEach((listener) => listener(toast))
}

export function subscribe(listener: Listener) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

export function toast(message: string, duration = 3000, position) {
  emit({
    id: generateId(),
    message,
    duration,
    position,
  })
}