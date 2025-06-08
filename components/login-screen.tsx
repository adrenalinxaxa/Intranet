"use client"

import type React from "react"

import { useState } from "react"
import { Icon, ICONS } from "./icons"

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void
  error: string
}

export default function LoginScreen({ onLogin, error }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(username, password)
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-700 flex justify-center items-center h-screen font-sans p-4">
      <div className="w-full max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl px-8 pt-8 pb-8 border border-white/20"
        >
          <div className="mb-8 text-center text-white">
            <div className="inline-block bg-white/20 p-4 rounded-full mb-4">
              <Icon path={ICONS.folder} className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold">DOJ Intranet</h1>
            <p className="text-slate-300">Bitte melden Sie sich an</p>
          </div>

          <div className="mb-4">
            <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="username">
              Benutzername
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon path={ICONS.user} className="h-5 w-5 text-slate-400" />
              </div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg w-full py-2 px-3 pl-10 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                id="username"
                type="text"
                placeholder="Benutzername"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="password">
              Passwort
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon path={ICONS.lock} className="h-5 w-5 text-slate-400" />
              </div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg w-full py-2 px-3 pl-10 text-white mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                id="password"
                type="password"
                placeholder="******************"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-xs italic mb-4 text-center">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-600 w-full text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
              type="submit"
            >
              Anmelden
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
