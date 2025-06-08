"use client"

import type React from "react"

import { useState } from "react"

interface SimpleTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SimpleTextEditor({ value, onChange, placeholder, className }: SimpleTextEditorProps) {
  // Versuche, den Wert als JSON zu parsen, falls es ein mehrseitiges Dokument ist
  const [text, setText] = useState(() => {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return parsed.join("\n\n--- Seitenumbruch ---\n\n")
      }
      return value
    } catch (e) {
      return value
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)

    // Konvertiere den Text in ein JSON-Array von Seiten, wenn Seitenumbrüche vorhanden sind
    if (newText.includes("--- Seitenumbruch ---")) {
      const pages = newText.split("--- Seitenumbruch ---").map((page) => page.trim())
      onChange(JSON.stringify(pages))
    } else {
      onChange(JSON.stringify([newText]))
    }
  }

  return (
    <div className={`border border-slate-300 rounded-lg bg-white ${className}`}>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-96 p-4 resize-none focus:outline-none rounded-lg font-mono text-sm"
        style={{ whiteSpace: "pre-wrap" }}
      />
    </div>
  )
}
