-- Guaimbês Manager Database Schema
-- Following Clean Architecture principles with proper relationships

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users Profile (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'field_team', 'financial')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT DEFAULT 'Divinópolis',
  neighborhood TEXT,
  notes TEXT,
  client_type TEXT CHECK (client_type IN ('residential', 'commercial', 'condominium')) DEFAULT 'residential',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CRM MODULE TABLES
-- =====================================================

-- Lead Pipeline Stages
CREATE TABLE pipeline_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  color TEXT DEFAULT '#2D5A27',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default stages
INSERT INTO pipeline_stages (name, "order", color) VALUES
  ('Novo Contato', 1, '#6B7280'),
  ('Visita Agendada', 2, '#3B82F6'),
  ('Orçamento Enviado', 3, '#F59E0B'),
  ('Negociação', 4, '#8B5CF6'),
  ('Fechado/Aprovado', 5, '#10B981');

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  stage_id UUID REFERENCES pipeline_stages(id),
  title TEXT NOT NULL,
  description TEXT,
  estimated_value DECIMAL(10,2),
  source TEXT CHECK (source IN ('website', 'whatsapp', 'referral', 'instagram', 'other')),
  assigned_to UUID REFERENCES profiles(id),
  visit_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Catalog (for quotes)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL, -- 'm²', 'hour', 'unit', etc.
  unit_price DECIMAL(10,2) NOT NULL,
  category TEXT CHECK (category IN ('landscaping', 'maintenance', 'planting', 'irrigation', 'other')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotes
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  quote_number TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('draft', 'sent', 'approved', 'rejected', 'expired')) DEFAULT 'draft',
  subtotal DECIMAL(10,2) DEFAULT 0,
  discount_percent DECIMAL(5,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  valid_until DATE,
  notes TEXT,
  technical_description TEXT,
  created_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quote Items
CREATE TABLE quote_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- OPERATIONAL MODULE TABLES
-- =====================================================

-- Service Orders
CREATE TABLE service_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id),
  quote_id UUID REFERENCES quotes(id),
  title TEXT NOT NULL,
  description TEXT,
  service_type TEXT CHECK (service_type IN ('maintenance', 'implementation', 'emergency')) NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')) DEFAULT 'scheduled',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  estimated_duration INTEGER, -- in minutes
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  address TEXT,
  neighborhood TEXT,
  assigned_team UUID[] DEFAULT '{}',
  checklist_before JSONB DEFAULT '[]',
  checklist_after JSONB DEFAULT '[]',
  photos_before TEXT[] DEFAULT '{}',
  photos_after TEXT[] DEFAULT '{}',
  notes TEXT,
  client_signature TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Order Materials Used
CREATE TABLE service_order_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
  inventory_item_id UUID, -- Will reference inventory table
  quantity_used DECIMAL(10,2) NOT NULL,
  notes TEXT,
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FINANCIAL MODULE TABLES
-- =====================================================

-- Contracts (for recurring services)
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  contract_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL,
  monthly_value DECIMAL(10,2) NOT NULL,
  payment_day INTEGER CHECK (payment_day BETWEEN 1 AND 31),
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT CHECK (status IN ('active', 'suspended', 'cancelled', 'expired')) DEFAULT 'active',
  auto_renew BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status TEXT CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')) DEFAULT 'pending',
  payment_method TEXT CHECK (payment_method IN ('pix', 'bank_transfer', 'credit_card', 'boleto', 'cash')),
  client_id UUID REFERENCES clients(id),
  contract_id UUID REFERENCES contracts(id),
  quote_id UUID REFERENCES quotes(id),
  service_order_id UUID REFERENCES service_orders(id),
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INVENTORY MODULE TABLES
-- =====================================================

-- Inventory Categories
CREATE TABLE inventory_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO inventory_categories (name, description) VALUES
  ('Mudas e Plantas', 'Mudas, flores, arbustos e árvores'),
  ('Insumos', 'Adubos, fertilizantes, terra, substratos'),
  ('Defensivos', 'Herbicidas, fungicidas, inseticidas'),
  ('Materiais', 'Pedras, britas, cascalhos, vasos'),
  ('Ferramentas', 'Ferramentas manuais e equipamentos');

-- Inventory Items
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES inventory_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE,
  unit TEXT NOT NULL, -- 'unit', 'kg', 'liter', 'm³', etc.
  current_quantity DECIMAL(10,2) DEFAULT 0,
  min_quantity DECIMAL(10,2) DEFAULT 0,
  cost_price DECIMAL(10,2),
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Movements
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('entry', 'exit', 'adjustment', 'loss')) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  previous_quantity DECIMAL(10,2) NOT NULL,
  new_quantity DECIMAL(10,2) NOT NULL,
  reason TEXT,
  service_order_id UUID REFERENCES service_orders(id),
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment/Machinery
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  serial_number TEXT,
  brand TEXT,
  model TEXT,
  purchase_date DATE,
  purchase_value DECIMAL(10,2),
  status TEXT CHECK (status IN ('available', 'in_use', 'maintenance', 'retired')) DEFAULT 'available',
  last_maintenance DATE,
  next_maintenance DATE,
  maintenance_interval_days INTEGER DEFAULT 90,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment Assignments (responsibility term)
CREATE TABLE equipment_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES profiles(id),
  assigned_date TIMESTAMPTZ DEFAULT NOW(),
  returned_date TIMESTAMPTZ,
  condition_out TEXT,
  condition_in TEXT,
  notes TEXT,
  service_order_id UUID REFERENCES service_orders(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment Maintenance Log
CREATE TABLE equipment_maintenance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  maintenance_type TEXT CHECK (maintenance_type IN ('preventive', 'corrective', 'oil_change', 'repair')) NOT NULL,
  description TEXT NOT NULL,
  cost DECIMAL(10,2),
  performed_by TEXT,
  performed_at DATE NOT NULL,
  next_maintenance DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key for service_order_materials
ALTER TABLE service_order_materials 
ADD CONSTRAINT fk_inventory_item 
FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_leads_stage ON leads(stage_id);
CREATE INDEX idx_leads_client ON leads(client_id);
CREATE INDEX idx_quotes_lead ON quotes(lead_id);
CREATE INDEX idx_quotes_client ON quotes(client_id);
CREATE INDEX idx_service_orders_client ON service_orders(client_id);
CREATE INDEX idx_service_orders_date ON service_orders(scheduled_date);
CREATE INDEX idx_service_orders_status ON service_orders(status);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_due_date ON transactions(due_date);
CREATE INDEX idx_inventory_items_category ON inventory_items(category_id);
CREATE INDEX idx_inventory_movements_item ON inventory_movements(item_id);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_next_maintenance ON equipment(next_maintenance);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_order_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_maintenance ENABLE ROW LEVEL SECURITY;

-- RLS Policies (authenticated users can access all data for now)
CREATE POLICY "Authenticated users can view profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins can insert profiles" ON profiles FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can manage clients" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can view stages" ON pipeline_stages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage leads" ON leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage services" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage quotes" ON quotes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage quote_items" ON quote_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage service_orders" ON service_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage service_order_materials" ON service_order_materials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage contracts" ON contracts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage transactions" ON transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can view inventory_categories" ON inventory_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage inventory_items" ON inventory_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage inventory_movements" ON inventory_movements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage equipment" ON equipment FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage equipment_assignments" ON equipment_assignments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage equipment_maintenance" ON equipment_maintenance FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_service_orders_updated_at BEFORE UPDATE ON service_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to update inventory quantity
CREATE OR REPLACE FUNCTION update_inventory_quantity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'entry' THEN
    UPDATE inventory_items SET current_quantity = current_quantity + NEW.quantity WHERE id = NEW.item_id;
  ELSIF NEW.type IN ('exit', 'loss') THEN
    UPDATE inventory_items SET current_quantity = current_quantity - NEW.quantity WHERE id = NEW.item_id;
  ELSIF NEW.type = 'adjustment' THEN
    UPDATE inventory_items SET current_quantity = NEW.new_quantity WHERE id = NEW.item_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inventory_on_movement
AFTER INSERT ON inventory_movements
FOR EACH ROW EXECUTE FUNCTION update_inventory_quantity();

-- Function to generate quote number
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.quote_number := 'ORC-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(NEXTVAL('quote_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS quote_number_seq START 1;
CREATE TRIGGER set_quote_number BEFORE INSERT ON quotes FOR EACH ROW WHEN (NEW.quote_number IS NULL) EXECUTE FUNCTION generate_quote_number();

-- Function to generate service order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'OS-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;
CREATE TRIGGER set_order_number BEFORE INSERT ON service_orders FOR EACH ROW WHEN (NEW.order_number IS NULL) EXECUTE FUNCTION generate_order_number();

-- Function to generate contract number
CREATE OR REPLACE FUNCTION generate_contract_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.contract_number := 'CTR-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(NEXTVAL('contract_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS contract_number_seq START 1;
CREATE TRIGGER set_contract_number BEFORE INSERT ON contracts FOR EACH ROW WHEN (NEW.contract_number IS NULL) EXECUTE FUNCTION generate_contract_number();

-- Function to calculate quote totals
CREATE OR REPLACE FUNCTION calculate_quote_total()
RETURNS TRIGGER AS $$
DECLARE
  v_subtotal DECIMAL(10,2);
  v_discount DECIMAL(5,2);
BEGIN
  SELECT COALESCE(SUM(total), 0) INTO v_subtotal FROM quote_items WHERE quote_id = COALESCE(NEW.quote_id, OLD.quote_id);
  SELECT COALESCE(discount_percent, 0) INTO v_discount FROM quotes WHERE id = COALESCE(NEW.quote_id, OLD.quote_id);
  
  UPDATE quotes 
  SET subtotal = v_subtotal,
      total = v_subtotal - (v_subtotal * v_discount / 100)
  WHERE id = COALESCE(NEW.quote_id, OLD.quote_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recalculate_quote_on_item_change
AFTER INSERT OR UPDATE OR DELETE ON quote_items
FOR EACH ROW EXECUTE FUNCTION calculate_quote_total();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 'field_team');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
