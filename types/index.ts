export interface User {
  id: number
  username: string
  password: string
  role: "Admin" | "Officer"
  securityLevel: number
  rank: PoliceRank
  department: Department
  badgeNumber: string
  email: string
  phone: string
  joinDate: string
  isActive: boolean
  permissions: Permission[]
}

export interface PoliceRank {
  id: string
  name: string
  level: number
  color: string
  permissions: Permission[]
}

export interface Department {
  id: string
  name: string
  description: string
  head: string
}

export interface Permission {
  id: string
  name: string
  description: string
  category: "records" | "users" | "system" | "reports"
}

export interface RecordEntry {
  id: number
  author: string
  timestamp: string
  text: string
  title: string
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  uploadedBy: string
  uploadedAt: string
  url: string
}

export interface HistoryEntry {
  user: string
  action: string
  timestamp: string
  details?: string
  ipAddress?: string
}

export interface Record {
  id: number
  name: string
  securityLevel: string
  birthdate: string
  address: string
  phone: string
  entries: RecordEntry[]
  history: HistoryEntry[]
  createdAt: string
  lastModified: string
  status: RecordStatus
  priority: Priority
  category: RecordCategory
  assignedTo?: string
  deadline?: string
  tags: string[]
}

export interface RecordStatus {
  id: string
  name: string
  color: string
  description: string
}

export interface Priority {
  id: string
  name: string
  level: number
  color: string
}

export interface RecordCategory {
  id: string
  name: string
  description: string
  color: string
}

export interface Notification {
  id: string
  userId: number
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  read: boolean
  createdAt: string
  actionUrl?: string
}

export interface AuditLog {
  id: string
  userId: number
  username: string
  action: string
  resource: string
  resourceId?: string
  details: string
  timestamp: string
  ipAddress: string
  userAgent: string
}

export type SecurityLevel = "Stufe 1" | "Stufe 2" | "Stufe 3" | "Stufe 4" | "Stufe 5"
