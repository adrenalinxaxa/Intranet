"use client"

import { useState } from "react"
import { Icon, ICONS } from "./icons"
import { RECORD_STATUSES, PRIORITIES, RECORD_CATEGORIES } from "@/lib/constants"
import type { Record, User } from "@/types"

interface AdvancedSearchProps {
  records: Record[]
  users: User[]
  onResults: (results: Record[]) => void
  onClose: () => void
}

interface SearchFilters {
  name: string
  status: string
  priority: string
  category: string
  assignedTo: string
  department: string
  dateFrom: string
  dateTo: string
  tags: string
}

export default function AdvancedSearch({ records, users, onResults, onClose }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    name: "",
    status: "",
    priority: "",
    category: "",
    assignedTo: "",
    department: "",
    dateFrom: "",
    dateTo: "",
    tags: "",
  })

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    let filteredRecords = records

    // Name filter
    if (filters.name) {
      filteredRecords = filteredRecords.filter((record) =>
        record.name.toLowerCase().includes(filters.name.toLowerCase()),
      )
    }

    // Status filter
    if (filters.status) {
      filteredRecords = filteredRecords.filter((record) => record.status.id === filters.status)
    }

    // Priority filter
    if (filters.priority) {
      filteredRecords = filteredRecords.filter((record) => record.priority.id === filters.priority)
    }

    // Category filter
    if (filters.category) {
      filteredRecords = filteredRecords.filter((record) => record.category.id === filters.category)
    }

    // Assigned to filter
    if (filters.assignedTo) {
      filteredRecords = filteredRecords.filter((record) => record.assignedTo === filters.assignedTo)
    }

    // Date range filter
    if (filters.dateFrom) {
      filteredRecords = filteredRecords.filter((record) => new Date(record.createdAt) >= new Date(filters.dateFrom))
    }

    if (filters.dateTo) {
      filteredRecords = filteredRecords.filter((record) => new Date(record.createdAt) <= new Date(filters.dateTo))
    }

    // Tags filter
    if (filters.tags) {
      const searchTags = filters.tags
        .toLowerCase()
        .split(",")
        .map((tag) => tag.trim())
      filteredRecords = filteredRecords.filter((record) =>
        searchTags.some((tag) => record.tags.some((recordTag) => recordTag.toLowerCase().includes(tag))),
      )
    }

    onResults(filteredRecords)
    onClose()
  }

  const clearFilters = () => {
    setFilters({
      name: "",
      status: "",
      priority: "",
      category: "",
      assignedTo: "",
      department: "",
      dateFrom: "",
      dateTo: "",
      tags: "",
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-slate-800">Erweiterte Suche</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <Icon path={ICONS.close} className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
                placeholder="Name suchen..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              >
                <option value="">Alle Status</option>
                {RECORD_STATUSES.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priorität</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              >
                <option value="">Alle Prioritäten</option>
                {PRIORITIES.map((priority) => (
                  <option key={priority.id} value={priority.id}>
                    {priority.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kategorie</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              >
                <option value="">Alle Kategorien</option>
                {RECORD_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Zugewiesen an</label>
              <select
                value={filters.assignedTo}
                onChange={(e) => handleFilterChange("assignedTo", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              >
                <option value="">Alle Benutzer</option>
                {users.map((user) => (
                  <option key={user.id} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
              <input
                type="text"
                value={filters.tags}
                onChange={(e) => handleFilterChange("tags", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
                placeholder="Tags (kommagetrennt)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Von Datum</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bis Datum</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between p-6 border-t bg-slate-50">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Filter zurücksetzen
          </button>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Suchen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
