"use client"
import { SECURITY_LEVEL_MAP } from "@/lib/constants"
import type { User, Record } from "@/types"

interface DashboardViewProps {
  records: Record[]
  openRecord: (record: Record) => void
  getSecurityLevelClass: (level: string) => string
  currentUser: User
}

export default function DashboardView({ records, openRecord, getSecurityLevelClass, currentUser }: DashboardViewProps) {
  const stats = {
    total: records.length,
    level1: records.filter((r) => r.securityLevel === "Stufe 1").length,
    level2: records.filter((r) => r.securityLevel === "Stufe 2").length,
    level3: records.filter((r) => r.securityLevel === "Stufe 3").length,
    level4: records.filter((r) => r.securityLevel === "Stufe 4").length,
    level5: records.filter((r) => r.securityLevel === "Stufe 5").length,
  }

  const recentRecords = [...records]
    .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
    .slice(0, 5)

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
        <div className="bg-slate-700 text-white p-5 rounded-xl shadow-lg text-center">
          <div className="text-4xl font-bold">{stats.total}</div>
          <div className="mt-1 text-slate-300">Gesamt</div>
        </div>
        <div
          className={`p-5 rounded-xl shadow-lg text-center bg-gradient-to-r ${getSecurityLevelClass("Stufe 1")} text-white`}
        >
          <div className="text-4xl font-bold">{stats.level1}</div>
          <div className="mt-1 font-semibold">Stufe 1</div>
        </div>
        <div
          className={`p-5 rounded-xl shadow-lg text-center bg-gradient-to-r ${getSecurityLevelClass("Stufe 2")} text-white`}
        >
          <div className="text-4xl font-bold">{stats.level2}</div>
          <div className="mt-1 font-semibold">Stufe 2</div>
        </div>
        <div
          className={`p-5 rounded-xl shadow-lg text-center bg-gradient-to-r ${getSecurityLevelClass("Stufe 3")} text-white`}
        >
          <div className="text-4xl font-bold">{stats.level3}</div>
          <div className="mt-1 font-semibold">Stufe 3</div>
        </div>
        <div
          className={`p-5 rounded-xl shadow-lg text-center bg-gradient-to-r ${getSecurityLevelClass("Stufe 4")} text-white`}
        >
          <div className="text-4xl font-bold">{stats.level4}</div>
          <div className="mt-1 font-semibold">Stufe 4</div>
        </div>
        <div
          className={`p-5 rounded-xl shadow-lg text-center bg-gradient-to-r ${getSecurityLevelClass("Stufe 5")} text-white`}
        >
          <div className="text-4xl font-bold">{stats.level5}</div>
          <div className="mt-1 font-semibold">Stufe 5</div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-700 mb-4">Zuletzt bearbeitete Akten</h3>
        <div className="bg-white rounded-lg shadow-md">
          <ul className="divide-y divide-slate-200">
            {recentRecords
              .filter(
                (r) =>
                  currentUser.securityLevel >= SECURITY_LEVEL_MAP[r.securityLevel as keyof typeof SECURITY_LEVEL_MAP],
              )
              .map((record) => (
                <li
                  key={record.id}
                  onClick={() => openRecord(record)}
                  className="p-4 hover:bg-slate-100 cursor-pointer flex justify-between items-center transition-all"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{record.name}</span>
                    <span className="text-sm text-slate-500 block font-mono">
                      DOJ-{String(record.id).padStart(5, "0")}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-bold rounded-full shadow-sm bg-gradient-to-r ${getSecurityLevelClass(
                      record.securityLevel,
                    )} text-white`}
                  >
                    {record.securityLevel}
                  </span>
                </li>
              ))}
            {recentRecords.length === 0 && <p className="text-center text-slate-500 p-8">Keine Akten vorhanden.</p>}
          </ul>
        </div>
      </div>
    </div>
  )
}
