import type { PoliceRank, Department, Permission, RecordStatus, Priority, RecordCategory } from "@/types"

export const SECURITY_LEVEL_MAP = {
  "Stufe 1": 1,
  "Stufe 2": 2,
  "Stufe 3": 3,
  "Stufe 4": 4,
  "Stufe 5": 5,
}

export const SECURITY_LEVEL_CLASS_MAP = {
  "Stufe 1": "from-green-400 to-green-500",
  "Stufe 2": "from-yellow-400 to-yellow-500",
  "Stufe 3": "from-orange-400 to-orange-500",
  "Stufe 4": "from-red-400 to-red-500",
  "Stufe 5": "from-purple-500 to-purple-600",
}

export const PERMISSIONS: Permission[] = [
  // Records permissions
  { id: "records.view", name: "Akten anzeigen", description: "Kann Akten einsehen", category: "records" },
  { id: "records.create", name: "Akten erstellen", description: "Kann neue Akten anlegen", category: "records" },
  { id: "records.edit", name: "Akten bearbeiten", description: "Kann Akten bearbeiten", category: "records" },
  { id: "records.delete", name: "Akten löschen", description: "Kann Akten löschen", category: "records" },
  {
    id: "records.assign",
    name: "Akten zuweisen",
    description: "Kann Akten anderen Beamten zuweisen",
    category: "records",
  },
  {
    id: "records.export",
    name: "Akten exportieren",
    description: "Kann Akten als PDF exportieren",
    category: "records",
  },

  // Users permissions
  { id: "users.view", name: "Benutzer anzeigen", description: "Kann Benutzerliste einsehen", category: "users" },
  { id: "users.create", name: "Benutzer erstellen", description: "Kann neue Benutzer anlegen", category: "users" },
  { id: "users.edit", name: "Benutzer bearbeiten", description: "Kann Benutzer bearbeiten", category: "users" },
  { id: "users.delete", name: "Benutzer löschen", description: "Kann Benutzer löschen", category: "users" },
  {
    id: "users.permissions",
    name: "Berechtigungen verwalten",
    description: "Kann Benutzerberechtigungen ändern",
    category: "users",
  },

  // System permissions
  { id: "system.audit", name: "Audit-Log einsehen", description: "Kann Systemprotokolle einsehen", category: "system" },
  { id: "system.backup", name: "Backup erstellen", description: "Kann Systembackups erstellen", category: "system" },
  {
    id: "system.settings",
    name: "Systemeinstellungen",
    description: "Kann Systemeinstellungen ändern",
    category: "system",
  },

  // Reports permissions
  { id: "reports.view", name: "Berichte anzeigen", description: "Kann Berichte einsehen", category: "reports" },
  { id: "reports.create", name: "Berichte erstellen", description: "Kann Berichte erstellen", category: "reports" },
  { id: "reports.export", name: "Berichte exportieren", description: "Kann Berichte exportieren", category: "reports" },
]

export const POLICE_RANKS: PoliceRank[] = [
  {
    id: "polizeimeister",
    name: "Polizeimeister",
    level: 1,
    color: "from-blue-400 to-blue-500",
    permissions: ["records.view", "records.create", "records.edit"],
  },
  {
    id: "polizeihauptmeister",
    name: "Polizeihauptmeister",
    level: 2,
    color: "from-blue-500 to-blue-600",
    permissions: ["records.view", "records.create", "records.edit", "records.assign"],
  },
  {
    id: "polizeikommissar",
    name: "Polizeikommissar",
    level: 3,
    color: "from-indigo-500 to-indigo-600",
    permissions: ["records.view", "records.create", "records.edit", "records.assign", "records.export", "users.view"],
  },
  {
    id: "polizeihauptkommissar",
    name: "Polizeihauptkommissar",
    level: 4,
    color: "from-purple-500 to-purple-600",
    permissions: [
      "records.view",
      "records.create",
      "records.edit",
      "records.delete",
      "records.assign",
      "records.export",
      "users.view",
      "users.edit",
      "reports.view",
    ],
  },
  {
    id: "polizeioberkommissar",
    name: "Polizeioberkommissar",
    level: 5,
    color: "from-purple-600 to-purple-700",
    permissions: [
      "records.view",
      "records.create",
      "records.edit",
      "records.delete",
      "records.assign",
      "records.export",
      "users.view",
      "users.create",
      "users.edit",
      "users.delete",
      "reports.view",
      "reports.create",
      "system.audit",
    ],
  },
  {
    id: "polizeidirektor",
    name: "Polizeidirektor",
    level: 6,
    color: "from-red-500 to-red-600",
    permissions: PERMISSIONS.map((p) => p.id), // All permissions
  },
]

export const DEPARTMENTS: Department[] = [
  { id: "kripo", name: "Kriminalpolizei", description: "Ermittlungen bei Straftaten", head: "KHK Müller" },
  { id: "schupo", name: "Schutzpolizei", description: "Allgemeine Polizeiarbeit", head: "PHK Schmidt" },
  { id: "verkehr", name: "Verkehrspolizei", description: "Verkehrsüberwachung und -unfälle", head: "PK Weber" },
  { id: "cybercrime", name: "Cybercrime", description: "Internetkriminalität", head: "EPHK Fischer" },
  { id: "sek", name: "Spezialeinsatzkommando", description: "Spezielle Einsätze", head: "PD Wagner" },
  { id: "verwaltung", name: "Verwaltung", description: "Administrative Aufgaben", head: "PD Klein" },
]

export const RECORD_STATUSES: RecordStatus[] = [
  { id: "open", name: "Offen", color: "bg-red-500", description: "Neue Akte, noch nicht bearbeitet" },
  { id: "in_progress", name: "In Bearbeitung", color: "bg-yellow-500", description: "Akte wird bearbeitet" },
  { id: "pending", name: "Wartend", color: "bg-blue-500", description: "Wartet auf weitere Informationen" },
  { id: "closed", name: "Abgeschlossen", color: "bg-green-500", description: "Akte ist abgeschlossen" },
  { id: "archived", name: "Archiviert", color: "bg-gray-500", description: "Akte ist archiviert" },
]

export const PRIORITIES: Priority[] = [
  { id: "low", name: "Niedrig", level: 1, color: "bg-green-500" },
  { id: "normal", name: "Normal", level: 2, color: "bg-blue-500" },
  { id: "high", name: "Hoch", level: 3, color: "bg-orange-500" },
  { id: "critical", name: "Kritisch", level: 4, color: "bg-red-500" },
]

export const RECORD_CATEGORIES: RecordCategory[] = [
  { id: "theft", name: "Diebstahl", description: "Diebstahl und Einbruch", color: "bg-orange-500" },
  { id: "fraud", name: "Betrug", description: "Betrug und Täuschung", color: "bg-purple-500" },
  { id: "violence", name: "Gewalt", description: "Körperverletzung und Gewalt", color: "bg-red-500" },
  { id: "drugs", name: "Drogen", description: "Drogendelikte", color: "bg-yellow-500" },
  { id: "traffic", name: "Verkehr", description: "Verkehrsdelikte", color: "bg-blue-500" },
  { id: "cybercrime", name: "Cyberkriminalität", description: "Internetkriminalität", color: "bg-indigo-500" },
  { id: "other", name: "Sonstiges", description: "Andere Delikte", color: "bg-gray-500" },
]
