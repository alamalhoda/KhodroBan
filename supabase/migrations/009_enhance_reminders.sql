-- Migration: Enhance Reminders Table
-- Date: 1404/10/30
-- Description: Add missing fields to reminders table for enhanced reminder functionality

-- ============================================
-- Add missing columns to reminders table
-- ============================================

-- Add warning_km_before for kilometer-based warnings
ALTER TABLE public.reminders 
ADD COLUMN IF NOT EXISTS warning_km_before INTEGER DEFAULT 500 CHECK (warning_km_before >= 0);

-- Add type field for reminder type (oil_change, payment, etc.)
ALTER TABLE public.reminders 
ADD COLUMN IF NOT EXISTS type VARCHAR(50);

-- Add index for type field (for filtering)
CREATE INDEX IF NOT EXISTS idx_reminders_type ON public.reminders(type);

-- Add index for source field (for filtering auto vs manual)
CREATE INDEX IF NOT EXISTS idx_reminders_source ON public.reminders(source);

-- ============================================
-- Update trigger function to use warning_km_before
-- ============================================

CREATE OR REPLACE FUNCTION update_reminder_status_and_message()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_current_km INTEGER;
  v_days_remaining INTEGER;
  v_km_remaining INTEGER;
  v_status TEXT := 'ok';
  v_message TEXT;
  v_warning_km_before INTEGER;
BEGIN
  -- Get current km from vehicle if vehicle_id exists
  IF NEW.vehicle_id IS NOT NULL THEN
    SELECT current_km INTO v_current_km 
    FROM public.vehicles 
    WHERE vehicle_id = NEW.vehicle_id;
    
    -- If vehicle not found, set to NULL
    IF NOT FOUND THEN
      v_current_km := NULL;
    END IF;
  ELSE
    v_current_km := NULL;
  END IF;

  -- Get warning_km_before (use default 500 if not set)
  v_warning_km_before := COALESCE(NEW.warning_km_before, 500);

  -- Calculate status based on date
  IF NEW.due_date IS NOT NULL THEN
    v_days_remaining := EXTRACT(EPOCH FROM (NEW.due_date - NOW())) / (60 * 60 * 24);
    
    IF v_days_remaining <= 0 THEN
      v_status := 'overdue';
    ELSIF v_days_remaining <= COALESCE(NEW.warning_days_before, 7) THEN
      v_status := 'near';
    END IF;
  END IF;

  -- Calculate status based on km (only if not already overdue by date)
  IF NEW.due_km IS NOT NULL AND v_current_km IS NOT NULL THEN
    v_km_remaining := NEW.due_km - v_current_km;
    
    IF v_km_remaining <= 0 THEN
      v_status := 'overdue';
    ELSIF v_km_remaining <= v_warning_km_before THEN
      -- Only set to near if status is still ok
      IF v_status = 'ok' THEN
        v_status := 'near';
      END IF;
    END IF;
  END IF;

  -- Generate message
  IF v_status = 'overdue' THEN
    IF NEW.due_date IS NOT NULL THEN
      v_message := NEW.title || ' - موعد گذشته است!';
    ELSIF NEW.due_km IS NOT NULL THEN
      v_message := NEW.title || ' - کیلومتر گذشته است!';
    ELSE
      v_message := NEW.title || ' - موعد گذشته است!';
    END IF;
  ELSIF v_status = 'near' THEN
    IF NEW.due_date IS NOT NULL THEN
      v_message := NEW.title || ' - ' || CEIL(v_days_remaining) || ' روز دیگر';
    ELSIF NEW.due_km IS NOT NULL AND v_current_km IS NOT NULL THEN
      v_message := NEW.title || ' - ' || v_km_remaining || ' کیلومتر دیگر';
    ELSE
      v_message := NEW.title || ' - نزدیک به سررسید';
    END IF;
  ELSE
    v_message := NEW.title;
  END IF;

  NEW.status := v_status;
  NEW.message := v_message;

  RETURN NEW;
END;
$$;

-- ============================================
-- Comments
-- ============================================

COMMENT ON COLUMN public.reminders.warning_km_before IS 'تعداد کیلومتر قبل از موعد که باید هشدار نمایش داده شود (پیش‌فرض: 500)';
COMMENT ON COLUMN public.reminders.type IS 'نوع یادآور (مثلاً: oil_change, payment, insurance, etc.)';

