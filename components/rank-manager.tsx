"use client"

import { useState } from "react"
import { Icon, ICONS } from "./icons"
import { PERMISSIONS } from "@/lib/constants"
import type { PoliceRank, Permission } from "@/types"

interface RankManagerProps {
  ranks: PoliceRank[]
  onSaveRank: (rank: PoliceRank) => void
  onDeleteRank: (rankId: string) => void
  onClose: () => void
}

export default function RankManager({ ranks, onSaveRank, onDeleteRank, onClose }: RankManagerProps) {
  const [editingRank, setEditingRank] = useState<PoliceRank | null>(null)
  const [newRank, setNewRank] = useState<boolean>(false)

  // Gruppiere Berechtigungen nach Kategorie
  const groupedPermissions = PERMISSIONS.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  const categoryNames = {
    records: "Akten",
    users: "Benutzer",
    system: "System",
    reports: "Berichte",
  }

  const handleCreateNewRank = () => {
    setEditingRank({
      id: "",
      name: "",
      level: ranks.length > 0 ? Math.max(...ranks.map((r) => r.level)) + 1 : 1,
      color: "from-blue-400 to-blue-500",
      permissions: [],
    })
    setNewRank(true)
  }

  const handleEditRank = (rank: PoliceRank) => {
    setEditingRank({ ...rank })
    setNewRank(false)
  }

  const handlePermissionToggle = (permissionId: string) => {
    if (!editingRank) return

    setEditingRank((prev) => {
      if (!prev) return prev

      const permissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId]

      return { ...prev, permissions }
    })
  }

  const handleSaveRank = () => {
    if (!editingRank || !editingRank.name || !editingRank.id) return

    onSaveRank(editingRank)
    setEditingRank(null)
  }

  const handleDeleteRank = (rankId: string) => {
    if (
      window.confirm(
        "Möchten Sie diesen Rang wirklich löschen? Dies kann Auswirkungen auf Benutzer haben, die diesen Rang besitzen.",
      )
    ) {
      onDeleteRank(rankId)
    }
  }

  const colorOptions = [
    { value: "from-blue-400 to-blue-500", label: "Blau" },
    { value: "from-green-400 to-green-500", label: "Grün" },
    { value: "from-red-400 to-red-500", label: "Rot" },
    { value: "from-yellow-400 to-yellow-500", label: "Gelb" },
    { value: "from-purple-400 to-purple-500", label: "Lila" },
    { value: "from-indigo-400 to-indigo-500", label: "Indigo" },
    { value: "from-pink-400 to-pink-500", label: "Pink" },
    { value: "from-gray-400 to-gray-500", label: "Grau" },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-slate-800">Ränge verwalten</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <Icon path={ICONS.close} className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!editingRank ? (
            <>
              <div className="flex justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-700">Verfügbare Ränge</h3>
                <button
                  onClick={handleCreateNewRank}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Icon path={ICONS.plus} className="w-5 h-5" />
                  <span>Neuen Rang erstellen</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ranks
                  .sort((a, b) => a.level - b.level)
                  .map((rank) => (
                    <div
                      key={rank.id}
                      className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div
                            className={`inline-block px-2 py-1 text-xs text-white rounded bg-gradient-to-r ${rank.color} mb-2`}
                          >
                            Level {rank.level}
                          </div>
                          <h4 className="text-lg font-semibold">{rank.name}</h4>
                          <p className="text-sm text-slate-500 mt-1">{rank.permissions.length} Berechtigungen</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditRank(rank)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100"
                          >
                            <Icon path={ICONS.edit} className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRank(rank.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                          >
                            <Icon path={ICONS.trash} className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-700">
                {newRank ? "Neuen Rang erstellen" : `Rang bearbeiten: ${editingRank.name}`}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name des Ranges</label>
                  <input
                    type="text"
                    value={editingRank.name}
                    onChange={(e) => setEditingRank({ ...editingRank, name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    placeholder="z.B. Polizeikommissar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ID (für System)</label>
                  <input
                    type="text"
                    value={editingRank.id}
                    onChange={(e) =>
                      setEditingRank({ ...editingRank, id: e.target.value.toLowerCase().replace(/\s+/g, "_") })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    placeholder="z.B. polizeikommissar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
                  <input
                    type="number"
                    value={editingRank.level}
                    onChange={(e) => setEditingRank({ ...editingRank, level: Number.parseInt(e.target.value) || 1 })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Farbe</label>
                  <select
                    value={editingRank.color}
                    onChange={(e) => setEditingRank({ ...editingRank, color: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className={`mt-2 h-6 rounded bg-gradient-to-r ${editingRank.color}`}></div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-3">Berechtigungen</h4>
                <div className="space-y-4">
                  {Object.entries(groupedPermissions).map(([category, permissions]) => (
                    <div key={category} className="border border-slate-200 rounded-lg p-4">
                      <h5 className="font-semibold text-slate-600 mb-3 flex items-center">
                        <Icon path={ICONS.shield} className="w-5 h-5 mr-2" />
                        {categoryNames[category as keyof typeof categoryNames]}
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {permissions.map((permission) => (
                          <label
                            key={permission.id}
                            className="flex items-start space-x-3 cursor-pointer hover:bg-slate-50 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={editingRank.permissions.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <div className="font-medium text-sm">{permission.name}</div>
                              <div className="text-xs text-slate-500">{permission.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setEditingRank(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSaveRank}
                  disabled={!editingRank.name || !editingRank.id}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Speichern
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
