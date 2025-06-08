"use client"

import { useState } from "react"
import LoginScreen from "@/components/login-screen"
import DOJNet from "@/components/doj-net"
import type { User, Record, PoliceRank } from "@/types"
import { POLICE_RANKS, DEPARTMENTS, PERMISSIONS } from "@/lib/constants"

export default function App() {
  // Initialisiere die Ränge aus den Konstanten
  const [initialRanks] = useState<PoliceRank[]>(POLICE_RANKS)

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      username: "Moritz",
      password: "123",
      role: "Admin",
      securityLevel: 5,
      rank: POLICE_RANKS.find((r) => r.id === "polizeidirektor") || POLICE_RANKS[0],
      department: DEPARTMENTS.find((d) => d.id === "verwaltung") || DEPARTMENTS[0],
      badgeNumber: "PD-001",
      email: "moritz@doj.gov",
      phone: "+49 123 456789",
      joinDate: "2020-01-01",
      isActive: true,
      permissions: PERMISSIONS,
    },
  ])
  const [records, setRecords] = useState<Record[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loginError, setLoginError] = useState("")

  const handleLogin = (username: string, password: string) => {
    const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password)
    if (user) {
      setCurrentUser(user)
      setLoginError("")
    } else {
      setLoginError("Ungültiger Benutzername oder Passwort.")
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  return (
    <div className="app" data-theme="dark">
      <div className="app-wrapper" style={{ height: "100vh", width: "100%", overflowY: "auto" }}>
        {currentUser ? (
          <DOJNet
            currentUser={currentUser}
            users={users}
            setUsers={setUsers}
            onLogout={handleLogout}
            records={records}
            setRecords={setRecords}
            initialRanks={initialRanks}
          />
        ) : (
          <LoginScreen onLogin={handleLogin} error={loginError} />
        )}
      </div>
    </div>
  )
}
