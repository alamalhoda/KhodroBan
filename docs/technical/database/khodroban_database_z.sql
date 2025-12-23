-- ============================================================================
-- KhodroBan Database Schema for PostgreSQL (Corrected Version)
-- Version: 1.0 (MVP)
-- Generated: 2024-12-14
-- Description: Complete database schema for vehicle management application
-- ============================================================================

-- Begin transaction for atomic execution
BEGIN;

-- ============================================================================
-- Table: Users
-- Description: Store user information including authentication and basic profile
-- ============================================================================
CREATE TABLE IF NOT EXISTS Users (
    user_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE NULL
);

-- Create indexes for Users table
CREATE INDEX IF NOT EXISTS idx_users_created_at ON Users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON Users(is_active);

-- ============================================================================
-- Table: SubscriptionPlans
-- Description: Store subscription plan information (Free and Pro)
-- ============================================================================
CREATE TABLE IF NOT EXISTS SubscriptionPlans (
    plan_id SERIAL PRIMARY KEY,
    plan_code VARCHAR(20) NOT NULL UNIQUE,
    plan_name VARCHAR(100) NOT NULL,
    max_vehicles INTEGER NULL, -- NULL means unlimited
    allow_csv_export BOOLEAN NOT NULL,
    allow_pdf_export BOOLEAN NOT NULL,
    allow_sms_reminder BOOLEAN NOT NULL,
    monthly_price BIGINT NULL, -- NULL means free
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for SubscriptionPlans table
CREATE INDEX IF NOT EXISTS idx_subscription_plans_plan_code ON SubscriptionPlans(plan_code);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_is_active ON SubscriptionPlans(is_active);

-- ============================================================================
-- Table: Vehicles
-- Description: Store vehicle information registered by users
-- ============================================================================
CREATE TABLE IF NOT EXISTS Vehicles (
    vehicle_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL CHECK (year BETWEEN 1300 AND 1500),
    plate_number VARCHAR(20) NOT NULL,
    current_km BIGINT NOT NULL DEFAULT 0 CHECK (current_km >= 0),
    description TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Foreign key constraint
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    
    -- Unique constraint for plate number per user
    UNIQUE(user_id, plate_number)
);

-- Create indexes for Vehicles table
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON Vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_current_km ON Vehicles(current_km);

-- ============================================================================
-- Table: Services
-- Description: Store service history and oil change records
-- ============================================================================
CREATE TABLE IF NOT EXISTS Services (
    service_id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    service_date DATE NOT NULL,
    service_date_gregorian DATE NOT NULL,
    service_km BIGINT NOT NULL CHECK (service_km >= 0),
    cost BIGINT NOT NULL DEFAULT 0 CHECK (cost >= 0),
    service_type VARCHAR(50) NOT NULL DEFAULT 'oil_change',
    description TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Foreign key constraint
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE
);

-- Create indexes for Services table
CREATE INDEX IF NOT EXISTS idx_services_vehicle_id ON Services(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_services_service_date_gregorian ON Services(service_date_gregorian);
CREATE INDEX IF NOT EXISTS idx_services_service_km ON Services(service_km);
CREATE INDEX IF NOT EXISTS idx_services_vehicle_date ON Services(vehicle_id, service_date_gregorian DESC);

-- ============================================================================
-- Table: DailyExpenses
-- Description: Store daily vehicle expenses (fuel, carwash, parking, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS DailyExpenses (
    expense_id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    expense_date DATE NOT NULL,
    expense_date_gregorian DATE NOT NULL,
    amount BIGINT NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL CHECK (category IN ('fuel', 'carwash', 'parking', 'toll', 'repair', 'other')),
    km_at_expense BIGINT NULL CHECK (km_at_expense >= 0),
    description TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Foreign key constraint
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE
);

-- Create indexes for DailyExpenses table
CREATE INDEX IF NOT EXISTS idx_expenses_vehicle_id ON DailyExpenses(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date_gregorian ON DailyExpenses(expense_date_gregorian);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON DailyExpenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_vehicle_date ON DailyExpenses(vehicle_id, expense_date_gregorian DESC);

-- ============================================================================
-- Table: ReminderSettings
-- Description: Store reminder settings for each vehicle
-- ============================================================================
CREATE TABLE IF NOT EXISTS ReminderSettings (
    reminder_setting_id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL UNIQUE,
    interval_km INTEGER NOT NULL DEFAULT 5000 CHECK (interval_km > 0),
    interval_days INTEGER NOT NULL DEFAULT 90 CHECK (interval_days > 0),
    warning_days_before INTEGER NOT NULL DEFAULT 7 CHECK (warning_days_before >= 0),
    warning_km_before INTEGER NOT NULL DEFAULT 500 CHECK (warning_km_before >= 0),
    enable_email_reminder BOOLEAN NOT NULL DEFAULT TRUE,
    enable_sms_reminder BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Foreign key constraint
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE
);

-- Create indexes for ReminderSettings table
CREATE INDEX IF NOT EXISTS idx_reminder_settings_vehicle_id ON ReminderSettings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reminder_settings_email ON ReminderSettings(enable_email_reminder);

-- ============================================================================
-- Table: UserSubscriptions
-- Description: Store user subscriptions and start/end dates
-- ============================================================================
CREATE TABLE IF NOT EXISTS UserSubscriptions (
    subscription_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_id INTEGER NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    auto_renew BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Foreign key constraints
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES SubscriptionPlans(plan_id) ON DELETE RESTRICT
);

-- Create indexes for UserSubscriptions table
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON UserSubscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_id ON UserSubscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_is_active ON UserSubscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_active_end ON UserSubscriptions(user_id, is_active, end_date);

-- ============================================================================
-- Table: ReminderLogs
-- Description: Store logs of sent reminders
-- ============================================================================
CREATE TABLE IF NOT EXISTS ReminderLogs (
    reminder_log_id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    reminder_type VARCHAR(20) NOT NULL CHECK (reminder_type IN ('in_app', 'email', 'sms')),
    reminder_status VARCHAR(20) NOT NULL CHECK (reminder_status IN ('pending', 'sent', 'failed')),
    due_date DATE NOT NULL,
    due_km BIGINT NOT NULL CHECK (due_km >= 0),
    sent_at TIMESTAMP WITH TIME ZONE NULL,
    error_message TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Foreign key constraint
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE
);

-- Create indexes for ReminderLogs table
CREATE INDEX IF NOT EXISTS idx_reminder_logs_vehicle_id ON ReminderLogs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_status ON ReminderLogs(reminder_status);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_sent_at ON ReminderLogs(sent_at);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_vehicle_type ON ReminderLogs(vehicle_id, reminder_type, sent_at DESC);

-- ============================================================================
-- Views for reporting and dashboard
-- ============================================================================

-- View: Vehicle Summary
CREATE OR REPLACE VIEW vw_VehicleSummary AS
SELECT 
    v.vehicle_id,
    v.user_id,
    v.model,
    v.year,
    v.plate_number,
    v.current_km,
    v.description,
    -- Last service information
    (SELECT s.service_date_gregorian 
     FROM Services s 
     WHERE s.vehicle_id = v.vehicle_id 
     ORDER BY s.service_date_gregorian DESC 
     LIMIT 1) AS last_service_date,
    (SELECT s.service_km 
     FROM Services s 
     WHERE s.vehicle_id = v.vehicle_id 
     ORDER BY s.service_date_gregorian DESC 
     LIMIT 1) AS last_service_km,
    -- Service count
    (SELECT COUNT(*) FROM Services s WHERE s.vehicle_id = v.vehicle_id) AS service_count,
    -- Total expenses
    (SELECT COALESCE(SUM(e.amount), 0) 
     FROM DailyExpenses e 
     WHERE e.vehicle_id = v.vehicle_id) AS total_expenses,
    v.created_at,
    v.updated_at
FROM Vehicles v;

-- View: User Dashboard (FIXED)
CREATE OR REPLACE VIEW vw_UserDashboard AS
SELECT 
    u.user_id,
    u.email,
    u.first_name,
    u.last_name,
    v.vehicle_id,
    v.model,
    v.plate_number,
    v.current_km,
    -- Reminder status
    CASE 
        WHEN v.current_km >= (rs.interval_km - rs.warning_km_before) THEN 'OVERDUE'
        WHEN v.current_km >= (rs.interval_km - rs.warning_km_before * 2) THEN 'WARNING'
        ELSE 'OK'
    END AS km_status,
    -- Days since last service (FIXED - removed EXTRACT function)
    (CURRENT_DATE - COALESCE(
        (SELECT MAX(s.service_date_gregorian) 
         FROM Services s 
         WHERE s.vehicle_id = v.vehicle_id),
        v.created_at::date
    )) AS days_since_last_service,
    -- Reminder settings
    rs.interval_km,
    rs.interval_days,
    rs.warning_days_before,
    rs.warning_km_before
FROM Users u
JOIN Vehicles v ON u.user_id = v.user_id
LEFT JOIN ReminderSettings rs ON v.vehicle_id = rs.vehicle_id;

-- View: Service History
CREATE OR REPLACE VIEW vw_ServiceHistory AS
SELECT 
    s.service_id,
    s.vehicle_id,
    v.model AS vehicle_model,
    v.plate_number AS vehicle_plate,
    s.service_date,
    s.service_date_gregorian,
    s.service_km,
    s.cost,
    s.service_type,
    s.description,
    s.created_at
FROM Services s
JOIN Vehicles v ON s.vehicle_id = v.vehicle_id
ORDER BY s.service_date_gregorian DESC;

-- View: Expense Report
CREATE OR REPLACE VIEW vw_ExpenseReport AS
SELECT 
    e.expense_id,
    e.vehicle_id,
    v.model AS vehicle_model,
    v.plate_number AS vehicle_plate,
    e.expense_date,
    e.expense_date_gregorian,
    e.amount,
    e.category,
    e.km_at_expense,
    e.description,
    e.created_at
FROM DailyExpenses e
JOIN Vehicles v ON e.vehicle_id = v.vehicle_id
ORDER BY e.expense_date_gregorian DESC;

-- View: Reminder Status
CREATE OR REPLACE VIEW vw_ReminderStatus AS
SELECT 
    v.vehicle_id,
    v.model,
    v.plate_number,
    v.current_km,
    rs.interval_km,
    rs.interval_days,
    rs.warning_days_before,
    rs.warning_km_before,
    -- Calculate next service due by KM
    (SELECT COALESCE(MAX(s.service_km), 0) + rs.interval_km 
     FROM Services s 
     WHERE s.vehicle_id = v.vehicle_id) AS next_service_km,
    -- Calculate next service due by date
    COALESCE(
        (SELECT MAX(s.service_date_gregorian) 
         FROM Services s 
         WHERE s.vehicle_id = v.vehicle_id),
        v.created_at::date
    ) + (rs.interval_days || ' days')::INTERVAL AS next_service_date,
    -- Last reminder sent
    (SELECT rl.sent_at 
     FROM ReminderLogs rl 
     WHERE rl.vehicle_id = v.vehicle_id 
     ORDER BY rl.sent_at DESC 
     LIMIT 1) AS last_reminder_sent
FROM Vehicles v
LEFT JOIN ReminderSettings rs ON v.vehicle_id = rs.vehicle_id;

-- ============================================================================
-- Functions and Triggers
-- ============================================================================

-- Function: Update updated_at column
-- This generic function can be used by any table with an 'updated_at' column.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
 $$ language 'plpgsql';

-- Triggers for updated_at timestamp
DROP TRIGGER IF EXISTS tr_users_updated_at ON Users;
CREATE TRIGGER tr_users_updated_at
    BEFORE UPDATE ON Users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_vehicles_updated_at ON Vehicles;
CREATE TRIGGER tr_vehicles_updated_at
    BEFORE UPDATE ON Vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_services_updated_at ON Services;
CREATE TRIGGER tr_services_updated_at
    BEFORE UPDATE ON Services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_daily_expenses_updated_at ON DailyExpenses;
CREATE TRIGGER tr_daily_expenses_updated_at
    BEFORE UPDATE ON DailyExpenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_reminder_settings_updated_at ON ReminderSettings;
CREATE TRIGGER tr_reminder_settings_updated_at
    BEFORE UPDATE ON ReminderSettings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_subscription_plans_updated_at ON SubscriptionPlans;
CREATE TRIGGER tr_subscription_plans_updated_at
    BEFORE UPDATE ON SubscriptionPlans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_user_subscriptions_updated_at ON UserSubscriptions;
CREATE TRIGGER tr_user_subscriptions_updated_at
    BEFORE UPDATE ON UserSubscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function: Auto-create ReminderSettings when a new vehicle is created
CREATE OR REPLACE FUNCTION create_reminder_settings_for_vehicle()
RETURNS TRIGGER AS $$ BEGIN
    INSERT INTO ReminderSettings (vehicle_id) VALUES (NEW.vehicle_id)
    ON CONFLICT (vehicle_id) DO NOTHING; -- Prevent error if already exists
    RETURN NEW;
END;
 $$ language 'plpgsql';

-- Trigger: Auto-create ReminderSettings
DROP TRIGGER IF EXISTS tr_vehicle_create_reminder_settings ON Vehicles;
CREATE TRIGGER tr_vehicle_create_reminder_settings
    AFTER INSERT ON Vehicles
    FOR EACH ROW
    EXECUTE FUNCTION create_reminder_settings_for_vehicle();

-- Function: Update current_km when a new service with higher KM is recorded
CREATE OR REPLACE FUNCTION update_vehicle_km_on_service()
RETURNS TRIGGER AS $$ BEGIN
    UPDATE Vehicles 
    SET current_km = NEW.service_km 
    WHERE vehicle_id = NEW.vehicle_id 
    AND NEW.service_km > (SELECT current_km FROM Vehicles WHERE vehicle_id = NEW.vehicle_id);
    RETURN NEW;
END;
 $$ language 'plpgsql';

-- Trigger: Update current_km on service insert
DROP TRIGGER IF EXISTS tr_service_update_vehicle_km ON Services;
CREATE TRIGGER tr_service_update_vehicle_km
    AFTER INSERT ON Services
    FOR EACH ROW
    EXECUTE FUNCTION update_vehicle_km_on_service();

-- ============================================================================
-- Initial Data
-- ============================================================================

-- Insert default subscription plans
-- Using ON CONFLICT for idempotency
INSERT INTO SubscriptionPlans (
    plan_code, plan_name, max_vehicles, allow_csv_export, 
    allow_pdf_export, allow_sms_reminder, monthly_price
) VALUES 
('free', 'رایگان', 3, TRUE, FALSE, FALSE, NULL),
('pro', 'حرفه‌ای', NULL, TRUE, TRUE, TRUE, 99000)
ON CONFLICT (plan_code) DO NOTHING;

-- ============================================================================
-- Commit transaction
-- ============================================================================
COMMIT;

-- ============================================================================
-- Database creation complete
-- ============================================================================