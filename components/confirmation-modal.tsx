"use client"

import { Icon, ICONS } from "./icons"

interface ConfirmationModalProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmationModal({ title, message, onConfirm, onCancel }: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in-fast">
      <div className="bg-slate-800 border border-slate-700 text-white p-6 rounded-lg shadow-2xl w-full max-w-md">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-300 mb-6">{message}</p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-slate-600 text-slate-100 px-4 py-2 rounded-md hover:bg-slate-500 transition-all"
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center space-x-2 transition-all"
          >
            <Icon path={ICONS.trash} className="w-5 h-5" />
            <span>Löschen</span>
          </button>
        </div>
      </div>
    </div>
  )
}
