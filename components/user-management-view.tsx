"use client"

import type React from "react"
import { useState } from "react"
import { Icon, ICONS } from "./icons"
import type { User } from "@/types"
import PermissionsManager from "./permissions-manager"
import RankManager from "./rank-manager"
import type { PoliceRank, Department } from "@/types"

interface UserManagementViewProps {
  currentUser: User
  users: User[]
  ranks: PoliceRank[]
  departments: Department[]
  addUser: (
    username: string,
    password: string,
    role: "Admin" | "Officer",
    securityLevel: number,
    rank: PoliceRank,
    department: Department,
  ) => User | null
  requestDeleteUser: (userId: number) => void
  setPopupConfig: (config: { title: string; message: string } | null) => void
  handleUserUpdate: (userId: number, key: string, value: any) => void
  onSaveRank: (rank: PoliceRank) => void
  onDeleteRank: (rankId: string) => void
}

export default function UserManagementView({
  currentUser,
  users,
  ranks,
  departments,
  addUser,
  requestDeleteUser,
  setPopupConfig,
  handleUserUpdate,
  onSaveRank,
  onDeleteRank,
}: UserManagementViewProps) {
  const [newUsername, setNewUsername] = useState("")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedRank, setSelectedRank] = useState<string>(ranks[0]?.id || "")
  const [selectedDepartment, setSelectedDepartment] = useState<string>(departments[0]?.id || "")
  const [showRankManager, setShowRankManager] = useState(false)

  const generatePassword = () => Math.random().toString(36).slice(-8)

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUsername.trim()) return
    const password = generatePassword()
    const rank = ranks.find((r) => r.id === selectedRank) || ranks[0]
    const department = departments.find((d) => d.id === selectedDepartment) || departments[0]
    const newUser = addUser(newUsername, password, "Officer", 1, rank, department)
    if (newUser) {
      setPopupConfig({
        title: "Neuer Benutzer erstellt",
        message: `Benutzername: ${newUser.username}\nPasswort: ${newUser.password}\nRang: ${newUser.rank.name}\nAbteilung: ${newUser.department.name}`,
      })
      setNewUsername("")
    } else {
      alert("Benutzername existiert bereits!")
    }
  }

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Benutzerverwaltung</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Neuen Benutzer anlegen */}
        <div>
          <h3 className="text-xl font-bold text-slate-700 mb-4">Neuen Benutzer anlegen</h3>
          <form onSubmit={handleAddUser} className="bg-slate-50/70 p-6 rounded-lg border border-slate-200 space-y-4">
            <div>
              <label className="block font-semibold text-slate-600 mb-2">Benutzername</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-2">Rang</label>
              <select
                value={selectedRank}
                onChange={(e) => setSelectedRank(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              >
                {ranks.map((rank) => (
                  <option key={rank.id} value={rank.id}>
                    {rank.name} (Level {rank.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-2">Abteilung</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Icon path={ICONS.plus} className="w-5 h-5" />
              <span>Benutzer erstellen</span>
            </button>
          </form>
        </div>

        {/* Ränge und Abteilungen Übersicht */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-700">Ränge & Abteilungen</h3>
            <button
              onClick={() => setShowRankManager(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Icon path={ICONS.rank} className="w-5 h-5" />
              <span>Ränge verwalten</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h4 className="font-semibold text-slate-600 mb-3">Verfügbare Ränge</h4>
            <div className="space-y-2">
              {ranks
                .sort((a, b) => a.level - b.level)
                .map((rank) => (
                  <div key={rank.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div>
                      <span className="font-medium">{rank.name}</span>
                      <span className="text-sm text-slate-500 ml-2">Level {rank.level}</span>
                    </div>
                    <div className={`px-2 py-1 text-xs text-white rounded bg-gradient-to-r ${rank.color}`}>
                      {rank.permissions.length} Berechtigungen
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="font-semibold text-slate-600 mb-3">Abteilungen</h4>
            <div className="space-y-2">
              {departments.map((dept) => (
                <div key={dept.id} className="p-2 bg-slate-50 rounded">
                  <div className="font-medium">{dept.name}</div>
                  <div className="text-sm text-slate-500">{dept.description}</div>
                  <div className="text-xs text-slate-400">Leitung: {dept.head}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Existierende Benutzer */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-700 mb-4">Existierende Benutzer</h3>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Benutzer</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Rang</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Abteilung</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Sicherheitsstufe</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-semibold text-slate-800">{user.username}</div>
                        <div className="text-sm text-slate-500">{user.email || "Keine E-Mail"}</div>
                        <div className="text-xs text-slate-400">#{user.badgeNumber || "Keine Nummer"}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div
                        className={`inline-block px-2 py-1 text-xs text-white rounded bg-gradient-to-r ${user.rank.color}`}
                      >
                        {user.rank.name}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium">{user.department.name}</div>
                      <div className="text-xs text-slate-500">{user.department.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={user.securityLevel}
                        onChange={(e) =>
                          handleUserUpdate(user.id, "securityLevel", Number.parseInt(e.target.value, 10))
                        }
                        disabled={currentUser.role !== "Admin"}
                        className="p-1 border border-slate-300 rounded bg-white disabled:bg-slate-100 disabled:cursor-not-allowed text-sm"
                      >
                        <option value={1}>Stufe 1</option>
                        <option value={2}>Stufe 2</option>
                        <option value={3}>Stufe 3</option>
                        <option value={4}>Stufe 4</option>
                        <option value={5}>Stufe 5</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded ${user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {user.isActive ? "Aktiv" : "Inaktiv"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        {currentUser.permissions.some((p) => p.id === "users.permissions") && (
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100 transition-all"
                            title="Berechtigungen bearbeiten"
                          >
                            <Icon path={ICONS.shield} className="w-4 h-4" />
                          </button>
                        )}
                        {currentUser.permissions.some((p) => p.id === "users.edit") && (
                          <button
                            onClick={() => {
                              /* TODO: User edit modal */
                            }}
                            className="text-slate-600 hover:text-slate-800 p-1 rounded hover:bg-slate-100 transition-all"
                            title="Benutzer bearbeiten"
                          >
                            <Icon path={ICONS.edit} className="w-4 h-4" />
                          </button>
                        )}
                        {currentUser.id !== user.id && currentUser.permissions.some((p) => p.id === "users.delete") && (
                          <button
                            onClick={() => requestDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-all"
                            title="Benutzer löschen"
                          >
                            <Icon path={ICONS.trash} className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Permissions Manager Modal */}
      {editingUser && (
        <PermissionsManager
          user={editingUser}
          onUpdateUser={(updatedUser) => {
            handleUserUpdate(updatedUser.id, "rank", updatedUser.rank)
            handleUserUpdate(updatedUser.id, "permissions", updatedUser.permissions)
            setEditingUser(null)
          }}
          onClose={() => setEditingUser(null)}
        />
      )}

      {/* Rank Manager Modal */}
      {showRankManager && (
        <RankManager
          ranks={ranks}
          onSaveRank={onSaveRank}
          onDeleteRank={onDeleteRank}
          onClose={() => setShowRankManager(false)}
        />
      )}
    </div>
  )
}
