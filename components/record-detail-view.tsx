"use client"

import type React from "react"
import { useState } from "react"
import { Icon, ICONS } from "./icons"
import SimpleTextEditor from "./simple-text-editor"
import type { User, Record, RecordEntry } from "@/types"

interface RecordDetailViewProps {
  editedRecord: Record
  setEditedRecord: (record: Record) => void
  closeRecord: () => void
  saveRecord: () => void
  currentUser: User
  formatDate: (dateString: string) => string
  getSecurityLevelClass: (level: string) => string
}

export default function RecordDetailView({
  editedRecord,
  setEditedRecord,
  closeRecord,
  saveRecord,
  currentUser,
  formatDate,
  getSecurityLevelClass,
}: RecordDetailViewProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [newEntryText, setNewEntryText] = useState("[]") // Empty JSON array for pages
  const [editingEntry, setEditingEntry] = useState<RecordEntry | null>(null)
  const [summary, setSummary] = useState("")
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const [summaryError, setSummaryError] = useState("")
  const [viewingEntry, setViewingEntry] = useState<RecordEntry | null>(null)

  const generateSummary = async () => {
    if (!editedRecord || editedRecord.entries.length === 0) {
      setSummaryError("Keine Einträge zum Zusammenfassen vorhanden.")
      return
    }
    setIsSummaryLoading(true)
    setSummaryError("")
    setSummary("")

    // Convert HTML entries to plain text for summary
    const stripHtml = (html: string) => {
      try {
        // If it's a JSON string of pages, parse and join
        const pages = JSON.parse(html)
        if (Array.isArray(pages)) {
          return pages.join("\n\n")
        }
      } catch (e) {
        // If not JSON, treat as regular HTML
        return html
      }
      return ""
    }

    try {
      // API key für Gemini
      const apiKey = "AIzaSyAqU7jin0My-9q9iQJtYpRLdDlRzQiX7lM"

      // Wenn kein API-Schlüssel vorhanden ist, generiere eine lokale Zusammenfassung
      if (!apiKey) {
        // Lokale Zusammenfassung generieren
        const entries = editedRecord.entries.map((e) => ({
          author: e.author,
          date: formatDate(e.timestamp),
          text: stripHtml(e.text),
        }))

        // Einfache Zusammenfassung erstellen
        const localSummary = generateLocalSummary(entries)
        setSummary(localSummary)
        setIsSummaryLoading(false)
        return
      }

      // Wenn ein API-Schlüssel vorhanden ist, verwende die Gemini API
      const prompt = `Fasse die folgenden Akteneinträge für einen Polizeibeamten prägnant zusammen. Konzentriere dich auf die wichtigsten Ereignisse, Personen und Fakten. Antworte in Stichpunkten:\n\n---\n\n${editedRecord.entries
        .map((e) => `[${formatDate(e.timestamp)} - ${e.author}]: ${stripHtml(e.text)}`)
        .join("\n\n")}\n\n---\n\nZusammenfassung:`

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      })

      if (!response.ok) {
        throw new Error(`API-Fehler: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts[0].text) {
        setSummary(result.candidates[0].content.parts[0].text)
      } else {
        throw new Error("Keine gültige Zusammenfassung von der API erhalten.")
      }
    } catch (error) {
      console.error("Fehler bei der Generierung der Zusammenfassung:", error)
      setSummaryError(`Fehler: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`)
    } finally {
      setIsSummaryLoading(false)
    }
  }

  // Füge diese Hilfsfunktion hinzu, um eine lokale Zusammenfassung zu generieren
  const generateLocalSummary = (entries: { author: string; date: string; text: string }[]) => {
    // Extrahiere wichtige Informationen aus den Einträgen
    const totalEntries = entries.length
    const authors = [...new Set(entries.map((e) => e.author))]
    const firstEntry = entries[entries.length - 1] // Ältester Eintrag (am Ende der Liste)
    const lastEntry = entries[0] // Neuester Eintrag (am Anfang der Liste)

    // Extrahiere wichtige Wörter (einfacher Ansatz)
    const allText = entries.map((e) => e.text).join(" ")
    const words = allText.split(/\s+/)
    const wordFrequency: Record<string, number> = {}

    words.forEach((word) => {
      // Ignoriere kurze Wörter und bereinige das Wort
      const cleanWord = word.toLowerCase().replace(/[.,;:!?()]/g, "")
      if (cleanWord.length > 4) {
        wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1
      }
    })

    // Finde die häufigsten Wörter
    const topWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)

    // Erstelle die Zusammenfassung
    return `
• Akte enthält ${totalEntries} Einträge von ${authors.length} Bearbeiter(n): ${authors.join(", ")}
• Erster Eintrag: ${firstEntry.date} von ${firstEntry.author}
• Letzter Eintrag: ${lastEntry.date} von ${lastEntry.author}
• Häufig erwähnte Begriffe: ${topWords.join(", ")}
• Gesamtlänge der Einträge: ca. ${Math.round(allText.length / 5)} Wörter

Hinweis: Dies ist eine automatisch generierte Zusammenfassung ohne KI-Unterstützung. Für eine detaillierte Analyse ist ein API-Schlüssel für die Gemini API erforderlich.
`
  }

  const handleEditRecordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedRecord({
      ...editedRecord,
      [name]: value,
      history: [
        ...(editedRecord.history || []),
        {
          user: currentUser.username,
          action: `Personendatenfeld '${name}' geändert`,
          timestamp: new Date().toISOString(),
        },
      ],
    })
  }

  // Ändere die addEntry-Funktion, um einen Titel hinzuzufügen
  const addEntry = () => {
    if (newEntryText === "[]") return // Don't add empty entries

    // Generiere einen Standardtitel basierend auf Datum und Zeit
    const now = new Date()
    const defaultTitle = `Eintrag vom ${now.toLocaleDateString("de-DE")} um ${now.toLocaleTimeString("de-DE")}`

    // Frage nach einem benutzerdefinierten Titel
    const entryTitle = prompt("Bitte geben Sie einen Titel für diesen Eintrag ein:", defaultTitle) || defaultTitle

    const newEntry: RecordEntry = {
      id: Date.now(),
      author: currentUser.username,
      timestamp: now.toISOString(),
      text: newEntryText,
      title: entryTitle,
    }
    setEditedRecord({
      ...editedRecord,
      entries: [newEntry, ...editedRecord.entries],
      history: [
        ...(editedRecord.history || []),
        {
          user: currentUser.username,
          action: "Neuen Eintrag hinzugefügt",
          timestamp: now.toISOString(),
        },
      ],
    })
    setNewEntryText("[]") // Reset to empty pages array
  }

  const startEditing = (entry: RecordEntry) => setEditingEntry({ ...entry })
  const cancelEditing = () => setEditingEntry(null)

  // Ändere die saveEntryEdit-Funktion, um den Titel zu bearbeiten
  const saveEntryEdit = () => {
    if (!editingEntry) return

    // Frage nach einem neuen Titel
    const newTitle =
      prompt("Bitte geben Sie einen neuen Titel für diesen Eintrag ein:", editingEntry.title) || editingEntry.title

    const updatedEntry = {
      ...editingEntry,
      title: newTitle,
    }

    setEditedRecord({
      ...editedRecord,
      entries: editedRecord.entries.map((e) => (e.id === editingEntry.id ? updatedEntry : e)),
      history: [
        ...(editedRecord.history || []),
        {
          user: currentUser.username,
          action: `Eintrag #${editingEntry.id} bearbeitet`,
          timestamp: new Date().toISOString(),
        },
      ],
    })
    setEditingEntry(null)
  }

  const deleteEntry = (entryId: number) => {
    setEditedRecord({
      ...editedRecord,
      entries: editedRecord.entries.filter((e) => e.id !== entryId),
      history: [
        ...(editedRecord.history || []),
        {
          user: currentUser.username,
          action: `Eintrag #${entryId} gelöscht`,
          timestamp: new Date().toISOString(),
        },
      ],
    })
  }

  // Füge diese neue Funktion nach der deleteEntry-Funktion hinzu
  const viewEntryDetail = (entry: RecordEntry) => {
    setViewingEntry(entry)
  }

  const closeEntryDetail = () => {
    setViewingEntry(null)
  }

  // Neue Funktion zum Rendern von Textinhalten mit Zeilenumbrüchen
  const renderTextContent = (content: string) => {
    try {
      // Versuche, den Inhalt als JSON zu parsen (für mehrseitige Dokumente)
      const pages = JSON.parse(content)
      if (Array.isArray(pages)) {
        return (
          <div className="space-y-8">
            {pages.map((pageContent, index) => (
              <div key={index} className="page-content">
                {index > 0 && (
                  <div className="page-separator">
                    <hr className="border-t-2 border-dashed border-slate-300 my-6" />
                    <div className="text-center text-xs text-slate-500 mb-4">Seite {index + 1}</div>
                  </div>
                )}
                <pre className="whitespace-pre-wrap font-sans text-base">{pageContent}</pre>
              </div>
            ))}
          </div>
        )
      }
    } catch (e) {
      // Wenn es kein JSON ist, zeige den Inhalt direkt an
      return <pre className="whitespace-pre-wrap font-sans text-base">{content}</pre>
    }
    return <pre className="whitespace-pre-wrap font-sans text-base">{content}</pre>
  }

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{editedRecord.name}</h2>
          <span
            className={`mt-2 inline-block px-4 py-1 text-sm font-bold text-white rounded-full bg-gradient-to-r shadow-lg ${getSecurityLevelClass(
              editedRecord.securityLevel,
            )}`}
          >
            {editedRecord.securityLevel}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={generateSummary}
            disabled={isSummaryLoading}
            className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-all flex items-center space-x-2 disabled:bg-slate-400 disabled:cursor-wait"
          >
            <Icon path={ICONS.sparkles} className="w-5 h-5" />
            <span>{isSummaryLoading ? "Wird generiert..." : "✨ Akte zusammenfassen"}</span>
          </button>
          <button
            onClick={closeRecord}
            className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 transition-all"
          >
            Zurück
          </button>
        </div>
      </div>

      {(summary || summaryError) && (
        <div
          className={`p-4 mb-6 rounded-lg border ${
            summaryError ? "bg-red-50 border-red-200 text-red-800" : "bg-blue-50 border-blue-200"
          }`}
        >
          <h4 className="font-bold mb-2 text-lg">{summaryError ? "Fehler" : "✨ KI-Zusammenfassung"}</h4>
          <p className="whitespace-pre-wrap">{summary || summaryError}</p>
        </div>
      )}

      <div className="border-b border-slate-200 mb-6">
        <nav className="flex space-x-2">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-3 px-4 font-semibold ${
              activeTab === "details"
                ? "border-b-2 border-slate-800 text-slate-800"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-3 px-4 font-semibold ${
              activeTab === "history"
                ? "border-b-2 border-slate-800 text-slate-800"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Verlauf
          </button>
        </nav>
      </div>

      {activeTab === "details" && (
        <div>
          <h3 className="text-xl font-bold text-slate-700 mb-4">Personendaten</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-slate-50/70 rounded-lg border border-slate-200">
            <div className="col-span-1">
              <label className="font-semibold text-slate-600 block mb-1">Name</label>
              <input
                name="name"
                type="text"
                value={editedRecord.name}
                onChange={handleEditRecordChange}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Geburtsdatum</label>
              <input
                name="birthdate"
                type="date"
                value={editedRecord.birthdate}
                onChange={handleEditRecordChange}
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-semibold text-slate-600 block mb-1">Adresse</label>
              <input
                name="address"
                type="text"
                value={editedRecord.address}
                onChange={handleEditRecordChange}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Telefonnummer</label>
              <input
                name="phone"
                type="tel"
                value={editedRecord.phone}
                onChange={handleEditRecordChange}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Sicherheitsstufe</label>
              <select
                name="securityLevel"
                value={editedRecord.securityLevel}
                onChange={handleEditRecordChange}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option>Stufe 1</option>
                <option>Stufe 2</option>
                <option>Stufe 3</option>
                <option>Stufe 4</option>
                <option>Stufe 5</option>
              </select>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-700 mb-4">Akteneinträge</h3>
          <div className="space-y-4 mb-6">
            {editedRecord.entries.map((entry) => (
              <div key={entry.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                {editingEntry?.id === entry.id ? (
                  <div>
                    <SimpleTextEditor
                      value={editingEntry.text}
                      onChange={(value) => setEditingEntry({ ...editingEntry, text: value })}
                      placeholder="Eintrag bearbeiten..."
                      className="mb-4"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={cancelEditing}
                        className="bg-slate-200 text-slate-800 px-3 py-1 rounded-md text-sm"
                      >
                        Abbrechen
                      </button>
                      <button onClick={saveEntryEdit} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">
                        Speichern
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-2 rounded-md -m-2"
                      onClick={() => viewEntryDetail(entry)}
                    >
                      <h4 className="font-bold text-slate-800 text-lg">{entry.title || "Unbenannter Eintrag"}</h4>
                      <button className="text-slate-400 hover:text-slate-600">
                        <Icon path={ICONS.folder} className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-3 text-slate-500 text-sm flex justify-between items-center border-t border-slate-100 pt-3">
                      <span>
                        {entry.author} - {formatDate(entry.timestamp)} Uhr
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditing(entry)
                          }}
                          className="text-slate-500 hover:text-slate-900 text-xs font-semibold"
                        >
                          Bearbeiten
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteEntry(entry.id)
                          }}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold"
                        >
                          Löschen
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {editedRecord.entries.length === 0 && (
              <p className="text-slate-500 italic p-4 text-center">Noch keine Einträge vorhanden.</p>
            )}
          </div>

          <div className="bg-slate-50/70 p-6 rounded-lg mt-8 border border-slate-200">
            <h4 className="font-bold text-lg mb-4 text-slate-700">Neuen Eintrag hinzufügen</h4>
            <SimpleTextEditor
              value={newEntryText}
              onChange={setNewEntryText}
              placeholder="Fügen Sie hier einen neuen Eintrag hinzu..."
              className="mb-4"
            />
            <button
              onClick={addEntry}
              className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Eintrag hinzufügen
            </button>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-slate-50/70 p-6 rounded-lg border border-slate-200">
          <h3 className="text-xl font-bold text-slate-700 mb-4">Aktenverlauf</h3>
          <ul className="space-y-3">
            {(editedRecord.history || []).map((event, index) => (
              <li key={index} className="text-sm text-slate-600 flex items-center">
                <Icon path={ICONS.history} className="w-4 h-4 mr-3 text-slate-400" />
                <span className="font-semibold">{event.user}</span>&nbsp;{event.action} -{" "}
                <span className="text-slate-500 ml-1">{formatDate(event.timestamp)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 text-right">
        <button
          onClick={saveRecord}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 font-bold text-base shadow-sm"
        >
          Alle Änderungen speichern
        </button>
      </div>
      {viewingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">{viewingEntry.title}</h3>
              <button onClick={closeEntryDetail} className="text-slate-500 hover:text-slate-800">
                <Icon path={ICONS.close} className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-slate-100">
              <div
                className="bg-white shadow-lg mx-auto print-container"
                style={{
                  width: "210mm", // DIN A4 width
                  minHeight: "297mm", // DIN A4 height
                  padding: "20mm",
                }}
              >
                <div className="mb-6 pb-4 border-b border-slate-200">
                  <h1 className="text-2xl font-bold text-slate-800 mb-2">{viewingEntry.title}</h1>
                  <div className="text-sm text-slate-500">
                    <p>Verfasst von: {viewingEntry.author}</p>
                    <p>Datum: {formatDate(viewingEntry.timestamp)}</p>
                    <p>
                      Akte: {editedRecord.name} (DOJ-{String(editedRecord.id).padStart(5, "0")})
                    </p>
                  </div>
                </div>

                <div className="entry-content">{renderTextContent(viewingEntry.text)}</div>
              </div>
            </div>

            <div className="p-4 border-t bg-slate-50 text-sm text-slate-500 flex justify-between">
              <span>
                Verfasst von {viewingEntry.author} am {formatDate(viewingEntry.timestamp)}
              </span>
              <button onClick={() => window.print()} className="flex items-center text-slate-700 hover:text-slate-900">
                <span>Drucken</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
