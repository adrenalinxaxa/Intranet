"use client"

import { useState } from "react"
import { Icon, ICONS } from "./icons"
import { PERMISSIONS } from "@/lib/constants"
import type { User, Permission } from "@/types"

interface PermissionsManagerProps {
  user: User
  onUpdateUser: (user: User) => void
  onClose: () => void
}

export default function PermissionsManager({ user, onUpdateUser, onClose }: PermissionsManagerProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(user.permissions.map((p) => p.id))
  const [selectedRank, setSelectedRank] = useState<string>(user.rank.id)

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId],
    )
  }

  const handleRankChange = (rankId: string) => {
    setSelectedRank(rankId)
    // Wir können die Berechtigungen nicht mehr automatisch setzen, da wir die Ränge nicht mehr direkt aus den Konstanten haben
    // Stattdessen wird das beim Speichern in der übergeordneten Komponente erledigt
  }

  const handleSave = () => {
    // Finde den ausgewählten Rang
    const rank = user.rank.id === selectedRank ? user.rank : undefined

    if (!rank) {
      alert("Der ausgewählte Rang existiert nicht mehr. Bitte wählen Sie einen anderen Rang.")
      return
    }

    const permissions = PERMISSIONS.filter((p) => selectedPermissions.includes(p.id))

    onUpdateUser({
      ...user,
      rank,
      permissions,
    })
    onClose()
  }

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-slate-800">Berechtigungen verwalten - {user.username}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <Icon path={ICONS.close} className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Rang anzeigen (kann nicht mehr geändert werden im Permissions Manager) */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Aktueller Rang</h3>
            <div className="p-4 border border-slate-200 rounded-lg">
              <div
                className={`inline-block px-2 py-1 text-xs text-white rounded bg-gradient-to-r ${user.rank.color} mb-2`}
              >
                Level {user.rank.level}
              </div>
              <div className="font-semibold">{user.rank.name}</div>
              <p className="text-sm text-slate-500 mt-1">
                Um den Rang zu ändern, nutzen Sie bitte die Rang-Verwaltung.
              </p>
            </div>
          </div>

          {/* Berechtigungen */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Individuelle Berechtigungen</h3>
            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <div key={category} className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-600 mb-3 flex items-center">
                    <Icon path={ICONS.shield} className="w-5 h-5 mr-2" />
                    {categoryNames[category as keyof typeof categoryNames]}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {permissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-start space-x-3 cursor-pointer hover:bg-slate-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.id)}
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
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  )
}
