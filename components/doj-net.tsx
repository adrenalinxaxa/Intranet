"use client"

import type React from "react"

import { useState } from "react"
import { Icon, ICONS } from "./icons"
import Popup from "./popup"
import ConfirmationModal from "./confirmation-modal"
import { SECURITY_LEVEL_MAP, SECURITY_LEVEL_CLASS_MAP, PERMISSIONS, DEPARTMENTS } from "@/lib/constants"
import type { User, Record, PoliceRank, Department } from "@/types"

import DashboardView from "./dashboard-view"
import RecordsListView from "./records-list-view"
import RecordDetailView from "./record-detail-view"
import UserManagementView from "./user-management-view"

interface DOJNetProps {
  currentUser: User
  users: User[]
  setUsers: (users: User[]) => void
  onLogout: () => void
  records: Record[]
  setRecords: (records: Record[]) => void
  initialRanks: PoliceRank[]
}

export default function DOJNet({
  currentUser,
  users,
  setUsers,
  onLogout,
  records,
  setRecords,
  initialRanks,
}: DOJNetProps) {
  const [view, setView] = useState("dashboard")
  const [popupConfig, setPopupConfig] = useState<{ title: string; message: string } | null>(null)
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const [newRecord, setNewRecord] = useState({
    name: "",
    securityLevel: "Stufe 1",
    birthdate: "",
    address: "",
    phone: "",
  })
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)
  const [editedRecord, setEditedRecord] = useState<Record | null>(null)
  const [ranks, setRanks] = useState<PoliceRank[]>(initialRanks)

  const openRecord = (record: Record) => {
    const userLevel = currentUser.securityLevel
    const recordLevel = SECURITY_LEVEL_MAP[record.securityLevel as keyof typeof SECURITY_LEVEL_MAP]
    if (userLevel >= recordLevel) {
      setSelectedRecord(record)
      setEditedRecord({
        ...record,
        entries: [...record.entries],
        history: [...(record.history || [])],
      })
      setView("recordDetail")
    } else {
      console.log("Access Denied: Insufficient security level.")
    }
  }

  const closeRecord = () => {
    setSelectedRecord(null)
    setEditedRecord(null)
    setView("records")
  }

  const saveRecord = () => {
    if (!editedRecord) return
    const now = new Date().toISOString()
    const finalRecord = {
      ...editedRecord,
      lastModified: now,
      history: [
        ...(editedRecord.history || []),
        { user: currentUser.username, action: "Akte gespeichert", timestamp: now },
      ],
    }
    setRecords(records.map((r) => (r.id === editedRecord.id ? finalRecord : r)))
    closeRecord()
  }

  const handleNewRecordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewRecord((prev) => ({ ...prev, [name]: value }))
  }

  const addRecord = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRecord.name.trim()) return
    const now = new Date().toISOString()
    const recordToAdd: Record = {
      id: Date.now(),
      ...newRecord,
      entries: [],
      history: [
        {
          user: currentUser.username,
          action: "Akte erstellt",
          timestamp: now,
        },
      ],
      createdAt: now,
      lastModified: now,
      status: { id: "open", name: "Offen", color: "bg-red-500", description: "Neue Akte, noch nicht bearbeitet" },
      priority: { id: "normal", name: "Normal", level: 2, color: "bg-blue-500" },
      category: { id: "other", name: "Sonstiges", description: "Andere Delikte", color: "bg-gray-500" },
      tags: [],
    }
    setRecords([...records, recordToAdd])
    setNewRecord({
      name: "",
      securityLevel: "Stufe 1",
      birthdate: "",
      address: "",
      phone: "",
    })
    setShowForm(false)
    openRecord(recordToAdd)
  }

  const requestDeleteRecord = (recordId: number) => {
    setRecordToDelete(recordId)
  }

  const confirmDeleteRecord = () => {
    if (recordToDelete === null) return
    setRecords(records.filter((r) => r.id !== recordToDelete))
    setRecordToDelete(null)
  }

  const addUser = (
    username: string,
    password: string,
    role: "Admin" | "Officer",
    securityLevel: number,
    rank: PoliceRank,
    department: Department,
  ) => {
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) return null

    const newUser: User = {
      id: Date.now(),
      username,
      password,
      role,
      securityLevel,
      rank,
      department,
      badgeNumber: `${rank.id.toUpperCase()}-${String(Date.now()).slice(-3)}`,
      email: `${username.toLowerCase()}@doj.gov`,
      phone: "",
      joinDate: new Date().toISOString(),
      isActive: true,
      permissions: PERMISSIONS.filter((p) => rank.permissions.includes(p.id)),
    }

    setUsers([...users, newUser])
    return newUser
  }

  const handleUserUpdate = (userId: number, key: string, value: any) => {
    setUsers(
      users.map((u) => {
        if (u.id === userId) {
          const updatedUser = { ...u, [key]: value }

          // Wenn der Rang geändert wird, aktualisiere auch die Berechtigungen
          if (key === "rank") {
            updatedUser.permissions = PERMISSIONS.filter((p) => value.permissions.includes(p.id))
          }

          return updatedUser
        }
        return u
      }),
    )
  }

  const requestDeleteUser = (userId: number) => {
    setUserToDelete(userId)
  }

  const confirmDeleteUser = () => {
    if (userToDelete === null || userToDelete === currentUser.id) return
    setUsers(users.filter((u) => u.id !== userToDelete))
    setUserToDelete(null)
  }

  const handleSaveRank = (rank: PoliceRank) => {
    // Prüfen, ob es ein neuer Rang ist oder ein bestehender aktualisiert wird
    const existingRankIndex = ranks.findIndex((r) => r.id === rank.id)

    if (existingRankIndex >= 0) {
      // Bestehenden Rang aktualisieren
      const updatedRanks = [...ranks]
      updatedRanks[existingRankIndex] = rank
      setRanks(updatedRanks)

      // Benutzer mit diesem Rang aktualisieren
      setUsers(
        users.map((user) => {
          if (user.rank.id === rank.id) {
            return {
              ...user,
              rank,
              permissions: PERMISSIONS.filter((p) => rank.permissions.includes(p.id)),
            }
          }
          return user
        }),
      )
    } else {
      // Neuen Rang hinzufügen
      setRanks([...ranks, rank])
    }

    setPopupConfig({
      title: existingRankIndex >= 0 ? "Rang aktualisiert" : "Neuer Rang erstellt",
      message: `Der Rang "${rank.name}" wurde erfolgreich ${existingRankIndex >= 0 ? "aktualisiert" : "erstellt"}.`,
    })
  }

  const handleDeleteRank = (rankId: string) => {
    // Prüfen, ob der Rang von Benutzern verwendet wird
    const usersWithRank = users.filter((user) => user.rank.id === rankId)

    if (usersWithRank.length > 0) {
      setPopupConfig({
        title: "Rang kann nicht gelöscht werden",
        message: `Der Rang wird von ${usersWithRank.length} Benutzer(n) verwendet. Bitte weisen Sie diesen Benutzern zuerst einen anderen Rang zu.`,
      })
      return
    }

    setRanks(ranks.filter((rank) => rank.id !== rankId))
    setPopupConfig({
      title: "Rang gelöscht",
      message: "Der Rang wurde erfolgreich gelöscht.",
    })
  }

  const filteredRecords = records.filter((record) => record.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const getSecurityLevelClass = (level: string) =>
    SECURITY_LEVEL_CLASS_MAP[level as keyof typeof SECURITY_LEVEL_CLASS_MAP] || "bg-gray-200 text-gray-800"

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const hasPermission = (permissionId: string) => {
    return currentUser.permissions.some((p) => p.id === permissionId)
  }

  const renderView = () => {
    if (view === "recordDetail" && selectedRecord && editedRecord) {
      return (
        <RecordDetailView
          editedRecord={editedRecord}
          setEditedRecord={setEditedRecord}
          closeRecord={closeRecord}
          saveRecord={saveRecord}
          currentUser={currentUser}
          formatDate={formatDate}
          getSecurityLevelClass={getSecurityLevelClass}
        />
      )
    }

    switch (view) {
      case "dashboard":
        return (
          <DashboardView
            records={records}
            openRecord={openRecord}
            getSecurityLevelClass={getSecurityLevelClass}
            currentUser={currentUser}
          />
        )
      case "records":
        return (
          <RecordsListView
            currentUser={currentUser}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showForm={showForm}
            setShowForm={setShowForm}
            addRecord={addRecord}
            newRecord={newRecord}
            handleNewRecordChange={handleNewRecordChange}
            filteredRecords={filteredRecords}
            openRecord={openRecord}
            getSecurityLevelClass={getSecurityLevelClass}
            requestDeleteRecord={requestDeleteRecord}
          />
        )
      case "users":
        return (
          <UserManagementView
            currentUser={currentUser}
            users={users}
            ranks={ranks}
            departments={DEPARTMENTS}
            addUser={addUser}
            requestDeleteUser={requestDeleteUser}
            setPopupConfig={setPopupConfig}
            handleUserUpdate={handleUserUpdate}
            onSaveRank={handleSaveRank}
            onDeleteRank={handleDeleteRank}
          />
        )
      default:
        return (
          <DashboardView
            records={records}
            openRecord={openRecord}
            getSecurityLevelClass={getSecurityLevelClass}
            currentUser={currentUser}
          />
        )
    }
  }

  return (
    <div className="p-0 md:p-4 lg:p-8 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen font-sans">
      {popupConfig && (
        <Popup title={popupConfig.title} message={popupConfig.message} onClose={() => setPopupConfig(null)} />
      )}

      {recordToDelete !== null && (
        <ConfirmationModal
          title="Akte löschen?"
          message={`Möchten Sie die Akte DOJ-${String(recordToDelete).padStart(5, "0")} wirklich endgültig löschen?`}
          onConfirm={confirmDeleteRecord}
          onCancel={() => setRecordToDelete(null)}
        />
      )}

      {userToDelete !== null && (
        <ConfirmationModal
          title="Benutzer löschen?"
          message="Möchten Sie den Benutzer wirklich endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden."
          onConfirm={confirmDeleteUser}
          onCancel={() => setUserToDelete(null)}
        />
      )}

      <div className="max-w-7xl mx-auto bg-slate-100 rounded-xl shadow-2xl shadow-black/20 min-h-[90vh] flex flex-col">
        <header className="bg-white text-slate-800 p-4 rounded-t-xl flex justify-between items-center border-b border-slate-200/80">
          <div className="flex items-center space-x-4">
            <div className="bg-slate-800 text-white p-2 rounded-lg">
              <Icon path={ICONS.folder} className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Department of Justice</h1>
              <p className="text-sm text-slate-500">Intranet</p>
            </div>
          </div>

          <nav className="flex items-center space-x-1 md:space-x-2">
            <button
              onClick={() => setView("dashboard")}
              className={`px-2 md:px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
                view === "dashboard" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Icon path={ICONS.dashboard} className="w-5 h-5" />
              <span className="hidden md:inline">Dashboard</span>
            </button>

            <button
              onClick={() => setView("records")}
              className={`px-2 md:px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
                view === "records" || view === "recordDetail"
                  ? "bg-slate-800 text-white"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Icon path={ICONS.folder} className="w-5 h-5" />
              <span className="hidden md:inline">Akten</span>
            </button>

            {hasPermission("users.view") && (
              <button
                onClick={() => setView("users")}
                className={`px-2 md:px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
                  view === "users" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon path={ICONS.users} className="w-5 h-5" />
                <span className="hidden md:inline">Benutzer</span>
              </button>
            )}

            <div className="border-l border-slate-200 h-8 mx-2"></div>

            <div className="text-right hidden sm:block">
              <div className="font-semibold text-slate-800">{currentUser.username}</div>
              <div className="text-xs text-slate-500">
                <span
                  className={`inline-block px-1 py-0.5 text-white rounded bg-gradient-to-r ${currentUser.rank.color} mr-1`}
                >
                  {currentUser.rank.name}
                </span>
                Stufe {currentUser.securityLevel}
              </div>
            </div>

            <button
              onClick={onLogout}
              className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all ml-2"
            >
              <Icon path={ICONS.logout} className="w-5 h-5" />
            </button>
          </nav>
        </header>

        <main className="flex-grow bg-slate-50/50 rounded-b-xl">{renderView()}</main>
      </div>
    </div>
  )
}
