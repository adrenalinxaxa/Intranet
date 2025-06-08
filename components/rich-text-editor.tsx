"use client"

import { useState, useRef, useEffect } from "react"
import { Icon } from "./icons"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const EDITOR_ICONS = {
  bold: "M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z",
  italic: "M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z",
  underline:
    "M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z",
  list: "M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z",
  numberedList:
    "M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z",
  link: "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
  alignLeft: "M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z",
  alignCenter: "M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z",
  alignRight: "M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z",
  quote: "M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z",
  code: "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
  table:
    "M20 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8 19H5v-3h3v3zm0-5H5v-3h3v3zm0-5H5V6h3v3zm6 10h-4v-3h4v3zm0-5h-4v-3h4v3zm0-5h-4V6h4v3zm5 10h-3v-3h3v3zm0-5h-3v-3h3v3zm0-5h-3V6h3v3z",
  image:
    "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
  undo: "M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z",
  redo: "M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z",
  pageBreak:
    "M7 21h2v-2H7v2zm0-8h2v-2H7v2zm4 0h2v-2h-2v2zm0 8h2v-2h-2v2zm-8-4h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2v-2H3v2zm0-4h2V7H3v2zm8 8h2v-2h-2v2zm8-8h2V7h-2v2zM3 3v2h18V3H3zm16 14h2v-2h-2v2zm-4 4h2v-2h-2v2zM11 9h2V7h-2v2zm8 12h2v-2h-2v2zm-4-8h2v-2h-2v2z",
  addPage: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
}

// Einfache Textformatierungsbefehle
type FormatCommand = {
  tag: string
  start: string
  end: string
}

const FORMAT_COMMANDS: Record<string, FormatCommand> = {
  bold: { tag: "b", start: "<b>", end: "</b>" },
  italic: { tag: "i", start: "<i>", end: "</i>" },
  underline: { tag: "u", start: "<u>", end: "</u>" },
  quote: { tag: "blockquote", start: "<blockquote>", end: "</blockquote>" },
  code: { tag: "pre", start: "<pre>", end: "</pre>" },
}

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const [pages, setPages] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")

  // Parse pages from value on initial load
  useEffect(() => {
    if (value) {
      try {
        const parsedPages = JSON.parse(value)
        if (Array.isArray(parsedPages)) {
          setPages(parsedPages)
          return
        }
      } catch (e) {
        // If parsing fails, treat the value as a single page
      }
      // Default to single page with the value
      setPages([value])
    } else {
      setPages([""])
    }
  }, [])

  // Update textarea content when changing pages
  useEffect(() => {
    if (textareaRef.current && pages[currentPage] !== undefined) {
      textareaRef.current.value = pages[currentPage]
      updatePreview()
    }
  }, [currentPage, pages])

  // Update preview when text changes
  const updatePreview = () => {
    if (textareaRef.current && previewRef.current) {
      previewRef.current.innerHTML = textareaRef.current.value
    }
  }

  // Save changes to the current page
  const saveCurrentPageContent = () => {
    if (textareaRef.current) {
      const newPages = [...pages]
      newPages[currentPage] = textareaRef.current.value
      setPages(newPages)
      onChange(JSON.stringify(newPages))
    }
  }

  const insertAtCursor = (textToInsert: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value

    const newText = text.substring(0, start) + textToInsert + text.substring(end)
    textarea.value = newText

    // Set cursor position after inserted text
    const newCursorPos = start + textToInsert.length
    textarea.selectionStart = newCursorPos
    textarea.selectionEnd = newCursorPos

    // Update state and preview
    saveCurrentPageContent()
    updatePreview()
    textarea.focus()
  }

  const wrapSelectedText = (before: string, after: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const text = textarea.value

    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
    textarea.value = newText

    // Set selection to include the wrapped text
    textarea.selectionStart = start + before.length
    textarea.selectionEnd = start + before.length + selectedText.length

    // Update state and preview
    saveCurrentPageContent()
    updatePreview()
    textarea.focus()
  }

  const insertTable = () => {
    const tableHTML = `
<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
  <tr>
    <td style="border: 1px solid #ccc; padding: 8px;">Zelle 1</td>
    <td style="border: 1px solid #ccc; padding: 8px;">Zelle 2</td>
    <td style="border: 1px solid #ccc; padding: 8px;">Zelle 3</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ccc; padding: 8px;">Zelle 4</td>
    <td style="border: 1px solid #ccc; padding: 8px;">Zelle 5</td>
    <td style="border: 1px solid #ccc; padding: 8px;">Zelle 6</td>
  </tr>
</table>
`
    insertAtCursor(tableHTML)
  }

  const insertLink = () => {
    if (linkUrl && linkText) {
      const linkHTML = `<a href="${linkUrl}" style="color: #3b82f6; text-decoration: underline;">${linkText}</a>`
      insertAtCursor(linkHTML)
      setIsLinkModalOpen(false)
      setLinkUrl("")
      setLinkText("")
    }
  }

  const insertImage = () => {
    const url = prompt("Bild-URL eingeben:")
    if (url) {
      const imageHTML = `<img src="${url}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="Eingefügtes Bild" />`
      insertAtCursor(imageHTML)
    }
  }

  const insertPageBreak = () => {
    // Save current content first
    saveCurrentPageContent()

    // Insert a new page after the current one
    const newPages = [...pages]
    newPages.splice(currentPage + 1, 0, "")
    setPages(newPages)

    // Navigate to the new page
    setCurrentPage(currentPage + 1)

    // Update the overall value
    onChange(JSON.stringify(newPages))
  }

  const addNewPage = () => {
    saveCurrentPageContent()
    setPages([...pages, ""])
    setCurrentPage(pages.length)
    onChange(JSON.stringify([...pages, ""]))
  }

  const deletePage = (pageIndex: number) => {
    if (pages.length <= 1) return // Don't delete the last page

    const newPages = pages.filter((_, index) => index !== pageIndex)
    setPages(newPages)

    // Adjust current page if needed
    if (currentPage >= newPages.length) {
      setCurrentPage(newPages.length - 1)
    } else if (currentPage === pageIndex) {
      // Force re-render of the current page
      const tempCurrentPage = currentPage
      setCurrentPage(-1)
      setTimeout(() => setCurrentPage(tempCurrentPage >= newPages.length ? newPages.length - 1 : tempCurrentPage), 0)
    }

    onChange(JSON.stringify(newPages))
  }

  const formatText = (format: string) => {
    if (FORMAT_COMMANDS[format]) {
      const { start, end } = FORMAT_COMMANDS[format]
      wrapSelectedText(start, end)
      return
    }

    switch (format) {
      case "list":
        wrapSelectedText("<ul>\n  <li>", "</li>\n</ul>")
        break
      case "numberedList":
        wrapSelectedText("<ol>\n  <li>", "</li>\n</ol>")
        break
      case "alignLeft":
        wrapSelectedText('<div style="text-align: left;">', "</div>")
        break
      case "alignCenter":
        wrapSelectedText('<div style="text-align: center;">', "</div>")
        break
      case "alignRight":
        wrapSelectedText('<div style="text-align: right;">', "</div>")
        break
      case "link":
        setIsLinkModalOpen(true)
        break
      case "table":
        insertTable()
        break
      case "image":
        insertImage()
        break
      case "pageBreak":
        insertPageBreak()
        break
      case "addPage":
        addNewPage()
        break
    }
  }

  const ToolbarButton = ({ format, icon, title }: { format: string; icon: string; title: string }) => (
    <button
      type="button"
      onClick={() => formatText(format)}
      className="p-2 rounded hover:bg-slate-200 transition-colors"
      title={title}
    >
      <Icon path={icon} className="w-4 h-4 text-slate-600" />
    </button>
  )

  return (
    <div className={`${className}`}>
      {/* Toolbar */}
      <div className="border border-slate-300 rounded-t-lg bg-white p-2 flex flex-wrap gap-1 sticky top-0 z-10">
        <div className="flex gap-1 border-r border-slate-200 pr-2 mr-2">
          <ToolbarButton format="bold" icon={EDITOR_ICONS.bold} title="Fett (Ctrl+B)" />
          <ToolbarButton format="italic" icon={EDITOR_ICONS.italic} title="Kursiv (Ctrl+I)" />
          <ToolbarButton format="underline" icon={EDITOR_ICONS.underline} title="Unterstrichen (Ctrl+U)" />
        </div>

        <div className="flex gap-1 border-r border-slate-200 pr-2 mr-2">
          <ToolbarButton format="alignLeft" icon={EDITOR_ICONS.alignLeft} title="Linksbündig" />
          <ToolbarButton format="alignCenter" icon={EDITOR_ICONS.alignCenter} title="Zentriert" />
          <ToolbarButton format="alignRight" icon={EDITOR_ICONS.alignRight} title="Rechtsbündig" />
        </div>

        <div className="flex gap-1 border-r border-slate-200 pr-2 mr-2">
          <ToolbarButton format="list" icon={EDITOR_ICONS.list} title="Aufzählung" />
          <ToolbarButton format="numberedList" icon={EDITOR_ICONS.numberedList} title="Nummerierte Liste" />
        </div>

        <div className="flex gap-1 border-r border-slate-200 pr-2 mr-2">
          <ToolbarButton format="quote" icon={EDITOR_ICONS.quote} title="Zitat" />
          <ToolbarButton format="code" icon={EDITOR_ICONS.code} title="Code" />
        </div>

        <div className="flex gap-1 border-r border-slate-200 pr-2 mr-2">
          <ToolbarButton format="link" icon={EDITOR_ICONS.link} title="Link einfügen" />
          <ToolbarButton format="image" icon={EDITOR_ICONS.image} title="Bild einfügen" />
          <ToolbarButton format="table" icon={EDITOR_ICONS.table} title="Tabelle einfügen" />
        </div>

        <div className="flex gap-1">
          <ToolbarButton format="pageBreak" icon={EDITOR_ICONS.pageBreak} title="Seitenumbruch einfügen" />
          <ToolbarButton format="addPage" icon={EDITOR_ICONS.addPage} title="Neue Seite hinzufügen" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-slate-600">
            Seite {currentPage + 1} von {pages.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => {
                saveCurrentPageContent()
                setCurrentPage(Math.max(0, currentPage - 1))
              }}
              disabled={currentPage === 0}
              className="p-1 rounded hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Vorherige Seite"
            >
              ◀
            </button>
            <button
              onClick={() => {
                saveCurrentPageContent()
                setCurrentPage(Math.min(pages.length - 1, currentPage + 1))
              }}
              disabled={currentPage === pages.length - 1}
              className="p-1 rounded hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Nächste Seite"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* Page thumbnails */}
      <div className="flex gap-2 p-2 bg-slate-100 border-x border-slate-300 overflow-x-auto">
        {pages.map((pageContent, index) => (
          <div
            key={index}
            onClick={() => {
              saveCurrentPageContent()
              setCurrentPage(index)
            }}
            className={`relative flex-shrink-0 w-20 h-28 border ${
              currentPage === index ? "border-blue-500" : "border-slate-300"
            } bg-white shadow-sm cursor-pointer hover:border-blue-300 transition-colors`}
          >
            <div
              className="absolute inset-0 p-1 overflow-hidden text-[4px]"
              dangerouslySetInnerHTML={{ __html: pageContent }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-slate-100 text-[8px] text-center">{index + 1}</div>
            {pages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deletePage(index)
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                title="Seite löschen"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Editor - DIN A4 format */}
      <div className="flex justify-center bg-slate-200 border-x border-slate-300 p-8 min-h-[800px]">
        <div
          className="bg-white shadow-lg"
          style={{
            width: "210mm", // DIN A4 width
            minHeight: "297mm", // DIN A4 height
            padding: "20mm",
          }}
        >
          <div className="flex flex-col h-full">
            {/* Hidden preview for rendering HTML */}
            <div ref={previewRef} className="hidden"></div>

            {/* Textarea for editing */}
            <textarea
              ref={textareaRef}
              className="w-full h-full min-h-[257mm] p-0 border-0 focus:outline-none resize-none font-sans text-base"
              style={{
                lineHeight: "1.6",
                fontSize: "14px",
              }}
              placeholder={placeholder}
              onChange={(e) => {
                updatePreview()
                saveCurrentPageContent()
              }}
              onKeyDown={(e) => {
                // Keyboard shortcuts
                if (e.ctrlKey || e.metaKey) {
                  switch (e.key) {
                    case "b":
                      e.preventDefault()
                      formatText("bold")
                      break
                    case "i":
                      e.preventDefault()
                      formatText("italic")
                      break
                    case "u":
                      e.preventDefault()
                      formatText("underline")
                      break
                  }
                }
              }}
            ></textarea>
          </div>
        </div>
      </div>

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-bold mb-4">Link einfügen</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link-Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="Anzuzeigender Text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setIsLinkModalOpen(false)
                  setLinkUrl("")
                  setLinkText("")
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Abbrechen
              </button>
              <button onClick={insertLink} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Einfügen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
