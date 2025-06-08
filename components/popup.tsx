"use client"

import { Icon, ICONS } from "./icons"

interface PopupProps {
  title: string
  message: string
  onClose: () => void
}

export default function Popup({ title, message, onClose }: PopupProps) {
  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message).catch((err) => console.error("Could not copy text: ", err))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in-fast">
      <div className="bg-slate-800 border border-slate-700 text-white p-6 rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <Icon path={ICONS.close} />
          </button>
        </div>

        <div className="bg-slate-900 p-4 rounded mb-4 font-mono text-sm text-slate-300">
          <pre className="whitespace-pre-wrap break-all">{message}</pre>
        </div>

        <div className="flex justify-end">
          <button
            onClick={copyToClipboard}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2 transition-all"
          >
            <Icon path={ICONS.copy} className="w-5 h-5" />
            <span>Kopieren</span>
          </button>
        </div>
      </div>
    </div>
  )
}
