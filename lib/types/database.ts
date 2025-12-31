// Database Types - Following Clean Architecture
export type UserRole = "admin" | "manager" | "field_team" | "financial"
export type ClientType = "residential" | "commercial" | "condominium"
export type LeadSource = "website" | "whatsapp" | "referral" | "instagram" | "other"
export type QuoteStatus = "draft" | "sent" | "approved" | "rejected" | "expired"
export type ServiceOrderStatus = "scheduled" | "in_progress" | "completed" | "cancelled"
export type ServiceOrderType = "maintenance" | "implementation" | "emergency"
export type Priority = "low" | "medium" | "high" | "urgent"
export type ContractStatus = "active" | "suspended" | "cancelled" | "expired"
export type TransactionType = "income" | "expense"
export type TransactionStatus = "pending" | "paid" | "overdue" | "cancelled"
export type PaymentMethod = "pix" | "bank_transfer" | "credit_card" | "boleto" | "cash"
export type InventoryMovementType = "entry" | "exit" | "adjustment" | "loss"
export type EquipmentStatus = "available" | "in_use" | "maintenance" | "retired"
export type MaintenanceType = "preventive" | "corrective" | "oil_change" | "repair"
export type ServiceCategory = "landscaping" | "maintenance" | "planting" | "irrigation" | "other"

export interface Profile {
  id: string
  full_name: string
  role: UserRole
  phone?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  name: string
  email?: string
  phone: string
  address?: string
  city: string
  neighborhood?: string
  notes?: string
  client_type: ClientType
  created_at: string
  updated_at: string
}

export interface PipelineStage {
  id: string
  name: string
  order: number
  color: string
  created_at: string
}

export interface Lead {
  id: string
  client_id?: string
  stage_id: string
  title: string
  description?: string
  estimated_value?: number
  source?: LeadSource
  assigned_to?: string
  visit_date?: string
  created_at: string
  updated_at: string
  client?: Client
  stage?: PipelineStage
  assigned_user?: Profile
}

export interface Service {
  id: string
  name: string
  description?: string
  unit: string
  unit_price: number
  category: ServiceCategory
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Quote {
  id: string
  lead_id?: string
  client_id?: string
  quote_number: string
  status: QuoteStatus
  subtotal: number
  discount_percent: number
  total: number
  valid_until?: string
  notes?: string
  technical_description?: string
  created_by?: string
  approved_at?: string
  created_at: string
  updated_at: string
  client?: Client
  lead?: Lead
  items?: QuoteItem[]
}

export interface QuoteItem {
  id: string
  quote_id: string
  service_id?: string
  description: string
  quantity: number
  unit_price: number
  total: number
  created_at: string
  service?: Service
}

export interface ServiceOrder {
  id: string
  order_number: string
  client_id?: string
  quote_id?: string
  title: string
  description?: string
  service_type: ServiceOrderType
  status: ServiceOrderStatus
  priority: Priority
  scheduled_date: string
  scheduled_time?: string
  estimated_duration?: number
  actual_start?: string
  actual_end?: string
  address?: string
  neighborhood?: string
  assigned_team: string[]
  checklist_before: ChecklistItem[]
  checklist_after: ChecklistItem[]
  photos_before: string[]
  photos_after: string[]
  notes?: string
  client_signature?: string
  created_by?: string
  created_at: string
  updated_at: string
  client?: Client
  quote?: Quote
  materials?: ServiceOrderMaterial[]
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface ServiceOrderMaterial {
  id: string
  service_order_id: string
  inventory_item_id?: string
  quantity_used: number
  notes?: string
  recorded_by?: string
  created_at: string
  inventory_item?: InventoryItem
}

export interface Contract {
  id: string
  client_id?: string
  contract_number: string
  title: string
  description?: string
  service_type: string
  monthly_value: number
  payment_day: number
  start_date: string
  end_date?: string
  status: ContractStatus
  auto_renew: boolean
  created_by?: string
  created_at: string
  updated_at: string
  client?: Client
}

export interface Transaction {
  id: string
  type: TransactionType
  category: string
  description: string
  amount: number
  due_date: string
  payment_date?: string
  status: TransactionStatus
  payment_method?: PaymentMethod
  client_id?: string
  contract_id?: string
  quote_id?: string
  service_order_id?: string
  notes?: string
  created_by?: string
  created_at: string
  updated_at: string
  client?: Client
}

export interface InventoryCategory {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface InventoryItem {
  id: string
  category_id?: string
  name: string
  description?: string
  sku?: string
  unit: string
  current_quantity: number
  min_quantity: number
  cost_price?: number
  location?: string
  is_active: boolean
  created_at: string
  updated_at: string
  category?: InventoryCategory
}

export interface InventoryMovement {
  id: string
  item_id: string
  type: InventoryMovementType
  quantity: number
  previous_quantity: number
  new_quantity: number
  reason?: string
  service_order_id?: string
  recorded_by?: string
  created_at: string
  item?: InventoryItem
}

export interface Equipment {
  id: string
  name: string
  description?: string
  serial_number?: string
  brand?: string
  model?: string
  purchase_date?: string
  purchase_value?: number
  status: EquipmentStatus
  last_maintenance?: string
  next_maintenance?: string
  maintenance_interval_days: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface EquipmentAssignment {
  id: string
  equipment_id: string
  assigned_to: string
  assigned_date: string
  returned_date?: string
  condition_out?: string
  condition_in?: string
  notes?: string
  service_order_id?: string
  created_at: string
  equipment?: Equipment
  user?: Profile
}

export interface EquipmentMaintenance {
  id: string
  equipment_id: string
  maintenance_type: MaintenanceType
  description: string
  cost?: number
  performed_by?: string
  performed_at: string
  next_maintenance?: string
  notes?: string
  created_at: string
  equipment?: Equipment
}
