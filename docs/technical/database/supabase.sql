-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.dailyexpenses (
  expense_id bigint NOT NULL DEFAULT nextval('dailyexpenses_expense_id_seq'::regclass),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  vehicle_id bigint NOT NULL,
  amount bigint NOT NULL CHECK (amount > 0),
  description text,
  category character varying NOT NULL CHECK (category::text = ANY (ARRAY['fuel'::character varying, 'carwash'::character varying, 'parking'::character varying, 'toll'::character varying, 'repair'::character varying, 'other'::character varying]::text[])),
  expense_date_gregorian date NOT NULL,
  expense_date date NOT NULL,
  km_at_expense bigint CHECK (km_at_expense >= 0),
  CONSTRAINT dailyexpenses_pkey PRIMARY KEY (expense_id),
  CONSTRAINT dailyexpenses_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(vehicle_id)
);
CREATE TABLE public.reminderlogs (
  reminder_log_id bigint NOT NULL DEFAULT nextval('reminderlogs_reminder_log_id_seq'::regclass),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  sent_at timestamp with time zone,
  reminder_type character varying NOT NULL CHECK (reminder_type::text = ANY (ARRAY['in_app'::character varying, 'email'::character varying, 'sms'::character varying]::text[])),
  reminder_status character varying NOT NULL CHECK (reminder_status::text = ANY (ARRAY['pending'::character varying, 'sent'::character varying, 'failed'::character varying]::text[])),
  due_km bigint NOT NULL CHECK (due_km >= 0),
  error_message text,
  due_date date NOT NULL,
  vehicle_id bigint NOT NULL,
  CONSTRAINT reminderlogs_pkey PRIMARY KEY (reminder_log_id),
  CONSTRAINT reminderlogs_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(vehicle_id)
);
CREATE TABLE public.remindersettings (
  reminder_setting_id bigint NOT NULL DEFAULT nextval('remindersettings_reminder_setting_id_seq'::regclass),
  interval_km integer NOT NULL DEFAULT 5000 CHECK (interval_km > 0),
  interval_days integer NOT NULL DEFAULT 90 CHECK (interval_days > 0),
  warning_days_before integer NOT NULL DEFAULT 7 CHECK (warning_days_before >= 0),
  warning_km_before integer NOT NULL DEFAULT 500 CHECK (warning_km_before >= 0),
  enable_email_reminder boolean NOT NULL DEFAULT true,
  enable_sms_reminder boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  vehicle_id bigint NOT NULL UNIQUE,
  CONSTRAINT remindersettings_pkey PRIMARY KEY (reminder_setting_id),
  CONSTRAINT remindersettings_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(vehicle_id)
);
CREATE TABLE public.services (
  service_id bigint NOT NULL DEFAULT nextval('services_service_id_seq'::regclass),
  cost bigint NOT NULL DEFAULT 0 CHECK (cost >= 0),
  service_type character varying NOT NULL DEFAULT 'oil_change'::character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  vehicle_id bigint NOT NULL,
  service_km bigint NOT NULL CHECK (service_km >= 0),
  description text,
  service_date date NOT NULL,
  service_date_gregorian date NOT NULL,
  CONSTRAINT services_pkey PRIMARY KEY (service_id),
  CONSTRAINT services_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(vehicle_id)
);
CREATE TABLE public.subscriptionplans (
  plan_id integer NOT NULL DEFAULT nextval('subscriptionplans_plan_id_seq'::regclass),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  plan_code character varying NOT NULL UNIQUE,
  allow_csv_export boolean NOT NULL,
  allow_pdf_export boolean NOT NULL,
  monthly_price bigint,
  allow_sms_reminder boolean NOT NULL,
  plan_name character varying NOT NULL,
  max_vehicles integer,
  CONSTRAINT subscriptionplans_pkey PRIMARY KEY (plan_id)
);
CREATE TABLE public.users (
  user_id bigint NOT NULL DEFAULT nextval('users_user_id_seq'::regclass),
  is_active boolean NOT NULL DEFAULT true,
  is_email_verified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  last_name character varying,
  last_login timestamp with time zone,
  email character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  first_name character varying,
  CONSTRAINT users_pkey PRIMARY KEY (user_id)
);
CREATE TABLE public.usersubscriptions (
  subscription_id bigint NOT NULL DEFAULT nextval('usersubscriptions_subscription_id_seq'::regclass),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  is_active boolean NOT NULL DEFAULT true,
  auto_renew boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id bigint NOT NULL,
  end_date date,
  plan_id integer NOT NULL,
  CONSTRAINT usersubscriptions_pkey PRIMARY KEY (subscription_id),
  CONSTRAINT usersubscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT usersubscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscriptionplans(plan_id)
);
CREATE TABLE public.vehicles (
  vehicle_id bigint NOT NULL DEFAULT nextval('vehicles_vehicle_id_seq'::regclass),
  current_km bigint NOT NULL DEFAULT 0 CHECK (current_km >= 0),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  year integer NOT NULL CHECK (year >= 1300 AND year <= 1500),
  description text,
  model character varying NOT NULL,
  user_id bigint NOT NULL,
  plate_number character varying NOT NULL,
  CONSTRAINT vehicles_pkey PRIMARY KEY (vehicle_id),
  CONSTRAINT vehicles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);