-- khodroban_db_postgresql_fixed.sql
-- Fully corrected and improved PostgreSQL script based on detailed review
-- Idempotent where possible, safe for repeated execution
-- Target: PostgreSQL 13+

-- 1. Create database idempotently
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'khodroban_db_grok') THEN
        CREATE DATABASE khodroban_db;
    END IF;
END
$$;

-- Connect to the database in psql with: \c khodroban_db

-- 2. Create tables (IF NOT EXISTS already handled)

CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users (is_active);

CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    plate_number VARCHAR(20) NOT NULL,
    current_km INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles (user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_current_km ON vehicles (current_km);
CREATE UNIQUE INDEX IF NOT EXISTS uq_vehicles_user_plate ON vehicles (user_id, plate_number);

CREATE TABLE IF NOT EXISTS services (
    service_id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    service_date DATE NOT NULL,                    -- شمسی برای نمایش
    service_date_gregorian DATE NOT NULL,          -- میلادی برای محاسبات
    service_km INTEGER NOT NULL,
    cost BIGINT NOT NULL DEFAULT 0,
    service_type VARCHAR(50) NOT NULL DEFAULT 'oil_change',
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_services_vehicle_id ON services (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_services_date_gregorian ON services (service_date_gregorian);
CREATE INDEX IF NOT EXISTS idx_services_km ON services (service_km);
CREATE INDEX IF NOT EXISTS idx_services_vehicle_date_desc ON services (vehicle_id, service_date_gregorian DESC);

CREATE TABLE IF NOT EXISTS dailyexpenses (
    expense_id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    expense_date DATE NOT NULL,
    expense_date_gregorian DATE NOT NULL,
    amount BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL,
    km_at_expense INTEGER,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dailyexpenses_vehicle_id ON dailyexpenses (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_dailyexpenses_date_gregorian ON dailyexpenses (expense_date_gregorian);
CREATE INDEX IF NOT EXISTS idx_dailyexpenses_category ON dailyexpenses (category);
CREATE INDEX IF NOT EXISTS idx_dailyexpenses_vehicle_date_desc ON dailyexpenses (vehicle_id, expense_date_gregorian DESC);

CREATE TABLE IF NOT EXISTS remindersettings (
    reminder_setting_id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL UNIQUE REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    interval_km INTEGER NOT NULL DEFAULT 5000,
    interval_days INTEGER NOT NULL DEFAULT 90,
    warning_days_before INTEGER NOT NULL DEFAULT 7,
    warning_km_before INTEGER NOT NULL DEFAULT 500,
    enable_email_reminder BOOLEAN NOT NULL DEFAULT TRUE,
    enable_sms_reminder BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_remindersettings_email ON remindersettings (enable_email_reminder);

CREATE TABLE IF NOT EXISTS subscriptionplans (
    plan_id BIGSERIAL PRIMARY KEY,
    plan_code VARCHAR(20) NOT NULL UNIQUE,
    plan_name VARCHAR(100) NOT NULL,
    max_vehicles INTEGER,  -- NULL = unlimited
    allow_csv_export BOOLEAN NOT NULL,
    allow_pdf_export BOOLEAN NOT NULL,
    allow_sms_reminder BOOLEAN NOT NULL,
    monthly_price BIGINT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscriptionplans_active ON subscriptionplans (is_active);

CREATE TABLE IF NOT EXISTS usersubscriptions (
    subscription_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    plan_id BIGINT NOT NULL REFERENCES subscriptionplans(plan_id) ON DELETE RESTRICT,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    auto_renew BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usersubscriptions_user ON usersubscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_usersubscriptions_plan ON usersubscriptions (plan_id);
CREATE INDEX IF NOT EXISTS idx_usersubscriptions_active ON usersubscriptions (is_active);
CREATE INDEX IF NOT EXISTS idx_usersubscriptions_user_active_end ON usersubscriptions (user_id, is_active, end_date);

-- اضافه کردن updated_at به reminderlogs (برای سازگاری با trigger)
CREATE TABLE IF NOT EXISTS reminderlogs (
    reminder_log_id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    reminder_type VARCHAR(20) NOT NULL,
    reminder_status VARCHAR(20) NOT NULL,
    due_date DATE NOT NULL,
    due_km INTEGER NOT NULL,
    sent_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reminderlogs_vehicle ON reminderlogs (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reminderlogs_status ON reminderlogs (reminder_status);
CREATE INDEX IF NOT EXISTS idx_reminderlogs_sent_at ON reminderlogs (sent_at);
CREATE INDEX IF NOT EXISTS idx_reminderlogs_vehicle_type_sent ON reminderlogs (vehicle_id, reminder_type, sent_at DESC);

-- 3. Add CHECK constraints idempotently
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_vehicles_current_km') THEN
        ALTER TABLE vehicles ADD CONSTRAINT chk_vehicles_current_km CHECK (current_km >= 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_vehicles_year') THEN
        ALTER TABLE vehicles ADD CONSTRAINT chk_vehicles_year CHECK (year BETWEEN 1300 AND 1500);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_services_km') THEN
        ALTER TABLE services ADD CONSTRAINT chk_services_km CHECK (service_km >= 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_services_cost') THEN
        ALTER TABLE services ADD CONSTRAINT chk_services_cost CHECK (cost >= 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_dailyexpenses_amount') THEN
        ALTER TABLE dailyexpenses ADD CONSTRAINT chk_dailyexpenses_amount CHECK (amount > 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_dailyexpenses_category') THEN
        ALTER TABLE dailyexpenses ADD CONSTRAINT chk_dailyexpenses_category 
        CHECK (category IN ('fuel', 'carwash', 'parking', 'toll', 'repair', 'other'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_dailyexpenses_km') THEN
        ALTER TABLE dailyexpenses ADD CONSTRAINT chk_dailyexpenses_km CHECK (km_at_expense IS NULL OR km_at_expense >= 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_remindersettings_interval_km') THEN
        ALTER TABLE remindersettings ADD CONSTRAINT chk_remindersettings_interval_km CHECK (interval_km > 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_remindersettings_interval_days') THEN
        ALTER TABLE remindersettings ADD CONSTRAINT chk_remindersettings_interval_days CHECK (interval_days > 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_remindersettings_warning_days') THEN
        ALTER TABLE remindersettings ADD CONSTRAINT chk_remindersettings_warning_days CHECK (warning_days_before >= 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_remindersettings_warning_km') THEN
        ALTER TABLE remindersettings ADD CONSTRAINT chk_remindersettings_warning_km CHECK (warning_km_before >= 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_reminderlogs_type') THEN
        ALTER TABLE reminderlogs ADD CONSTRAINT chk_reminderlogs_type 
        CHECK (reminder_type IN ('in_app', 'email', 'sms'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_reminderlogs_status') THEN
        ALTER TABLE reminderlogs ADD CONSTRAINT chk_reminderlogs_status 
        CHECK (reminder_status IN ('pending', 'sent', 'failed'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_reminderlogs_due_km') THEN
        ALTER TABLE reminderlogs ADD CONSTRAINT chk_reminderlogs_due_km CHECK (due_km >= 0);
    END IF;
END
$$;

-- 4. Trigger for updated_at
CREATE OR REPLACE FUNCTION fn_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables that have updated_at
DO $$
BEGIN
    CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TRIGGER trg_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TRIGGER trg_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TRIGGER trg_dailyexpenses_updated_at BEFORE UPDATE ON dailyexpenses FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TRIGGER trg_remindersettings_updated_at BEFORE UPDATE ON remindersettings FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TRIGGER trg_subscriptionplans_updated_at BEFORE UPDATE ON subscriptionplans FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TRIGGER trg_usersubscriptions_updated_at BEFORE UPDATE ON usersubscriptions FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TRIGGER trg_reminderlogs_updated_at BEFORE UPDATE ON reminderlogs FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 5. Trigger: Auto-create ReminderSettings when vehicle is created
CREATE OR REPLACE FUNCTION fn_create_default_remindersettings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO remindersettings (vehicle_id)
    VALUES (NEW.vehicle_id)
    ON CONFLICT (vehicle_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    CREATE TRIGGER trg_vehicle_after_insert
        AFTER INSERT ON vehicles
        FOR EACH ROW
        EXECUTE FUNCTION fn_create_default_remindersettings();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 6. Fixed and robust next service calculation function
CREATE OR REPLACE FUNCTION sp_calculatenextservicedue(p_vehicle_id BIGINT)
RETURNS TABLE (due_date DATE, due_km INTEGER, status VARCHAR(10))
LANGUAGE plpgsql
AS $$
DECLARE
    last_service_date DATE;
    last_service_km INTEGER := 0;
    v_created_date DATE;
    interval_km_val INTEGER := 5000;
    interval_days_val INTEGER := 90;
    warning_days_val INTEGER := 7;
    warning_km_val INTEGER := 500;
    current_km_val INTEGER := 0;
BEGIN
    -- آخرین سرویس
    SELECT service_date_gregorian, service_km
    INTO last_service_date, last_service_km
    FROM services
    WHERE vehicle_id = p_vehicle_id
    ORDER BY service_date_gregorian DESC
    LIMIT 1;

    -- اگر سرویس وجود نداشت، از تاریخ ساخت خودرو استفاده کن
    IF last_service_date IS NULL THEN
        SELECT DATE(created_at) INTO v_created_date FROM vehicles WHERE vehicle_id = p_vehicle_id;
        last_service_date := v_created_date;
        last_service_km := 0;
    END IF;

    -- تنظیمات یادآوری
    SELECT interval_km, interval_days, warning_days_before, warning_km_before
    INTO interval_km_val, interval_days_val, warning_days_val, warning_km_val
    FROM remindersettings
    WHERE vehicle_id = p_vehicle_id;

    -- اگر تنظیمات وجود نداشت، پیش‌فرض
    IF interval_km_val IS NULL THEN
        interval_km_val := 5000;
        interval_days_val := 90;
        warning_days_val := 7;
        warning_km_val := 500;
    END IF;

    -- کیلومتر فعلی
    SELECT current_km INTO current_km_val FROM vehicles WHERE vehicle_id = p_vehicle_id;

    -- محاسبه موعد
    due_date := last_service_date + interval_days_val;
    due_km := last_service_km + interval_km_val;

    -- وضعیت
    IF CURRENT_DATE >= due_date OR current_km_val >= due_km THEN
        status := 'گذشته';
    ELSIF CURRENT_DATE >= (due_date - warning_days_val) OR current_km_val >= (due_km - warning_km_val) THEN
        status := 'نزدیک';
    ELSE
        status := 'OK';
    END IF;

    RETURN NEXT;
END;
$$;

-- 7. Procedures
CREATE OR REPLACE PROCEDURE sp_getuservehicles(p_user_id BIGINT)
LANGUAGE SQL
AS $$
    SELECT * FROM vehicles WHERE user_id = p_user_id ORDER BY created_at DESC;
$$;

CREATE OR REPLACE PROCEDURE sp_getvehicleservices(p_vehicle_id BIGINT)
LANGUAGE SQL
AS $$
    SELECT * FROM services WHERE vehicle_id = p_vehicle_id ORDER BY service_date_gregorian DESC;
$$;

-- 8. Improved Views
CREATE OR REPLACE VIEW vw_vehiclesummary AS
SELECT 
    v.vehicle_id,
    v.user_id,
    v.model,
    v.year,
    v.plate_number,
    v.current_km,
    v.created_at,
    v.updated_at,
    last_s.service_date_gregorian AS last_service_date,
    last_s.service_km AS last_service_km,
    COALESCE(svc_count.cnt, 0) AS service_count,
    COALESCE(exp_sum.total_expenses, 0) AS total_expenses,
    COALESCE(svc_sum.total_service_costs, 0) AS total_service_costs
FROM vehicles v
LEFT JOIN LATERAL (
    SELECT service_date_gregorian, service_km
    FROM services s
    WHERE s.vehicle_id = v.vehicle_id
    ORDER BY service_date_gregorian DESC
    LIMIT 1
) last_s ON true
LEFT JOIN LATERAL (
    SELECT COUNT(*) AS cnt FROM services s WHERE s.vehicle_id = v.vehicle_id
) svc_count ON true
LEFT JOIN LATERAL (
    SELECT SUM(amount) AS total_expenses FROM dailyexpenses d WHERE d.vehicle_id = v.vehicle_id
) exp_sum ON true
LEFT JOIN LATERAL (
    SELECT SUM(cost) AS total_service_costs FROM services s WHERE s.vehicle_id = v.vehicle_id
) svc_sum ON true;

CREATE OR REPLACE VIEW vw_userdashboard AS
SELECT 
    u.user_id,
    u.email,
    v.vehicle_id,
    v.model,
    v.plate_number,
    v.current_km,
    calc.due_date,
    calc.due_km,
    calc.status AS reminder_status
FROM users u
JOIN vehicles v ON v.user_id = u.user_id
LEFT JOIN LATERAL sp_calculatenextservicedue(v.vehicle_id) calc ON true;

CREATE OR REPLACE VIEW vw_reminderstatus AS
SELECT 
    v.vehicle_id,
    v.model,
    v.plate_number,
    v.current_km,
    COALESCE(r.interval_km, 5000) AS interval_km,
    COALESCE(r.interval_days, 90) AS interval_days,
    COALESCE(r.warning_days_before, 7) AS warning_days_before,
    COALESCE(r.warning_km_before, 500) AS warning_km_before,
    calc.due_date,
    calc.due_km,
    calc.status
FROM vehicles v
LEFT JOIN remindersettings r ON r.vehicle_id = v.vehicle_id
LEFT JOIN LATERAL sp_calculatenextservicedue(v.vehicle_id) calc ON true;

-- 9. Initial data - Subscription Plans
INSERT INTO subscriptionplans (
    plan_code, plan_name, max_vehicles, allow_csv_export, 
    allow_pdf_export, allow_sms_reminder, monthly_price
) VALUES 
    ('free', 'رایگان', 2, TRUE, FALSE, FALSE, NULL),
    ('pro', 'حرفه‌ای', NULL, TRUE, TRUE, TRUE, 99000)
ON CONFLICT (plan_code) DO NOTHING;

-- End of script