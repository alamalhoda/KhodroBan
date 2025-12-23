/**
 * TypeScript Types برای Supabase Database
 * 
 * این فایل types را از Supabase Database Schema تولید می‌کند.
 * 
 * برای تولید خودکار types:
 * 1. نصب Supabase CLI: npm install -g supabase
 * 2. لینک کردن پروژه: supabase link --project-ref YOUR_PROJECT_REF
 * 3. تولید types: supabase gen types typescript --linked > src/lib/types/supabase.ts
 * 
 * یا از طریق Dashboard:
 * Settings → API → Generate TypeScript types
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          is_active: boolean;
          is_email_verified: boolean;
          created_at: string;
          updated_at: string;
          last_login: string | null;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          is_active?: boolean;
          is_email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          is_active?: boolean;
          is_email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
        };
      };
      subscription_plans: {
        Row: {
          plan_id: number;
          plan_code: string;
          plan_name: string;
          max_vehicles: number | null;
          allow_csv_export: boolean;
          allow_pdf_export: boolean;
          allow_sms_reminder: boolean;
          monthly_price: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          plan_id?: number;
          plan_code: string;
          plan_name: string;
          max_vehicles?: number | null;
          allow_csv_export?: boolean;
          allow_pdf_export?: boolean;
          allow_sms_reminder?: boolean;
          monthly_price?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          plan_id?: number;
          plan_code?: string;
          plan_name?: string;
          max_vehicles?: number | null;
          allow_csv_export?: boolean;
          allow_pdf_export?: boolean;
          allow_sms_reminder?: boolean;
          monthly_price?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_subscriptions: {
        Row: {
          subscription_id: number;
          user_id: string;
          plan_id: number;
          start_date: string;
          end_date: string | null;
          is_active: boolean;
          auto_renew: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          subscription_id?: number;
          user_id: string;
          plan_id: number;
          start_date?: string;
          end_date?: string | null;
          is_active?: boolean;
          auto_renew?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          subscription_id?: number;
          user_id?: string;
          plan_id?: number;
          start_date?: string;
          end_date?: string | null;
          is_active?: boolean;
          auto_renew?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      vehicles: {
        Row: {
          vehicle_id: number;
          user_id: string;
          model: string;
          year: number;
          plate_number: string;
          current_km: number;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          vehicle_id?: number;
          user_id: string;
          model: string;
          year: number;
          plate_number: string;
          current_km?: number;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          vehicle_id?: number;
          user_id?: string;
          model?: string;
          year?: number;
          plate_number?: string;
          current_km?: number;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          service_id: number;
          vehicle_id: number;
          service_date: string;
          service_date_gregorian: string;
          service_km: number;
          cost: number;
          service_type: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          service_id?: number;
          vehicle_id: number;
          service_date: string;
          service_date_gregorian: string;
          service_km: number;
          cost?: number;
          service_type?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          service_id?: number;
          vehicle_id?: number;
          service_date?: string;
          service_date_gregorian?: string;
          service_km?: number;
          cost?: number;
          service_type?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      daily_expenses: {
        Row: {
          expense_id: number;
          vehicle_id: number;
          expense_date: string;
          expense_date_gregorian: string;
          amount: number;
          category: string;
          km_at_expense: number | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          expense_id?: number;
          vehicle_id: number;
          expense_date: string;
          expense_date_gregorian: string;
          amount: number;
          category: string;
          km_at_expense?: number | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          expense_id?: number;
          vehicle_id?: number;
          expense_date?: string;
          expense_date_gregorian?: string;
          amount?: number;
          category?: string;
          km_at_expense?: number | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reminder_settings: {
        Row: {
          reminder_setting_id: number;
          vehicle_id: number;
          interval_km: number;
          interval_days: number;
          warning_days_before: number;
          warning_km_before: number;
          enable_email_reminder: boolean;
          enable_sms_reminder: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          reminder_setting_id?: number;
          vehicle_id: number;
          interval_km?: number;
          interval_days?: number;
          warning_days_before?: number;
          warning_km_before?: number;
          enable_email_reminder?: boolean;
          enable_sms_reminder?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          reminder_setting_id?: number;
          vehicle_id?: number;
          interval_km?: number;
          interval_days?: number;
          warning_days_before?: number;
          warning_km_before?: number;
          enable_email_reminder?: boolean;
          enable_sms_reminder?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      reminder_logs: {
        Row: {
          reminder_log_id: number;
          vehicle_id: number;
          reminder_type: string;
          reminder_status: string;
          due_date: string;
          due_km: number;
          sent_at: string | null;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          reminder_log_id?: number;
          vehicle_id: number;
          reminder_type: string;
          reminder_status: string;
          due_date: string;
          due_km: number;
          sent_at?: string | null;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          reminder_log_id?: number;
          vehicle_id?: number;
          reminder_type?: string;
          reminder_status?: string;
          due_date?: string;
          due_km?: number;
          sent_at?: string | null;
          error_message?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

