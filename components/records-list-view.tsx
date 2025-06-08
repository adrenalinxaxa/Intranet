"use client"

import type React from "react"
import { Icon, ICONS } from "./icons"
import { SECURITY_LEVEL_MAP } from "@/lib/constants"
import type { User, Record } from "@/types"

interface RecordsListViewProps {
  currentUser: User
  searchTerm: string
  setSearchTerm: (term: string) => void
  showForm: boolean
  setShowForm: (show: boolean) => void
  addRecord: (e: React.FormEvent) => void
  newRecord: {
    name: string
    securityLevel: string
    birthdate: string
    address: string
    phone: string
  }
  handleNewRecordChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  filteredRecords: Record[]
  openRecord: (record: Record) => void
  getSecurityLevelClass: (level: string) => string
  requestDeleteRecord: (recordId: number) => void
}

export default function RecordsListView({
  currentUser,
  searchTerm,
  setSearchTerm,
  showForm,
  setShowForm,
  addRecord,
  newRecord,
  handleNewRecordChange,
  filteredRecords,
  openRecord,
  getSecurityLevelClass,
  requestDeleteRecord,
}: RecordsListViewProps) {
  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <input
          type="text"
          placeholder="Akte suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-auto flex-grow bg-slate-100 text-slate-800 px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center space-x-2"
        >
          <Icon path={ICONS.plus} className="w-5 h-5" />
          <span>Neue Akte</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={addRecord} className="mb-8 p-6 bg-slate-100/50 rounded-lg animate-fade-in">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Neue Akte erstellen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="name"
              type="text"
              value={newRecord.name}
              onChange={handleNewRecordChange}
              placeholder="Name des Bürgers"
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg"
              required
            />
            <input
              name="birthdate"
              type="date"
              value={newRecord.birthdate}
              onChange={handleNewRecordChange}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-500"
            />
            <input
              name="address"
              type="text"
              value={newRecord.address}
              onChange={handleNewRecordChange}
              placeholder="Adresse"
              className="md:col-span-2 w-full px-4 py-2 bg-white border border-slate-300 rounded-lg"
            />
            <input
              name="phone"
              type="tel"
              value={newRecord.phone}
              onChange={handleNewRecordChange}
              placeholder="Telefonnummer"
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg"
            />
            <select
              name="securityLevel"
              value={newRecord.securityLevel}
              onChange={handleNewRecordChange}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg"
            >
              <option>Stufe 1</option>
              <option>Stufe 2</option>
              <option>Stufe 3</option>
              <option>Stufe 4</option>
              <option>Stufe 5</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300"
          >
            Akte anlegen & öffnen
          </button>
        </form>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-sm tracking-wider">
                Akten-ID
              </th>
              <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-sm tracking-wider">
                Name
              </th>
              <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-sm tracking-wider">
                Geburtsdatum
              </th>
              <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-sm tracking-wider">
                Sicherheitsstufe
              </th>
              <th className="text-right py-3 px-6 font-semibold text-slate-600 uppercase text-sm tracking-wider">
                Aktion
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => {
                const canAccess =
                  currentUser.securityLevel >=
                  SECURITY_LEVEL_MAP[record.securityLevel as keyof typeof SECURITY_LEVEL_MAP]
                return (
                  <tr
                    key={record.id}
                    onClick={() => canAccess && openRecord(record)}
                    className={`transition-all duration-200 ${
                      !canAccess ? "opacity-50 cursor-not-allowed bg-slate-50" : "cursor-pointer hover:bg-blue-50"
                    }`}
                    title={!canAccess ? "Keine ausreichende Sicherheitsfreigabe" : `Akte ${record.name} öffnen`}
                  >
                    <td className="py-4 px-6 text-slate-700 font-mono">DOJ-{String(record.id).padStart(5, "0")}</td>
                    <td className="py-4 px-6 text-slate-900 font-semibold">{record.name}</td>
                    <td className="py-4 px-6 text-slate-600">{record.birthdate || "N/A"}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 text-sm font-bold text-white rounded-full bg-gradient-to-r shadow-md ${getSecurityLevelClass(
                          record.securityLevel,
                        )}`}
                      >
                        {record.securityLevel}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {canAccess && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            requestDeleteRecord(record.id)
                          }}
                          className="text-slate-400 hover:text-red-600 p-2 rounded-full hover:bg-red-100 transition-all"
                        >
                          <Icon path={ICONS.trash} className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-500">
                  Keine Akten gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
