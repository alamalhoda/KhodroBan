-- ============================================================================
-- KhodroBan Sample Data for PostgreSQL
-- Version: 1.0 (MVP)
-- Description: Sample data for testing and demonstration
-- ============================================================================

BEGIN;

-- Insert sample users
INSERT INTO Users (email, password_hash, first_name, last_name, is_email_verified) VALUES
('user1@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5e', 'علی', 'رضایی', TRUE),
('user2@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5e', 'سارا', 'احمدی', TRUE),
('admin@khodroban.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5e', 'مدیر', 'سیستم', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Insert sample subscriptions
INSERT INTO UserSubscriptions (user_id, plan_id, start_date, end_date, is_active) VALUES
((SELECT user_id FROM Users WHERE email = 'user1@example.com'), 1, '2024-01-01', NULL, TRUE),
((SELECT user_id FROM Users WHERE email = 'user2@example.com'), 2, '2024-01-01', '2024-12-31', TRUE)
ON CONFLICT DO NOTHING; -- Conflict on composite PK or unique constraints if any are added

-- Insert sample vehicles
INSERT INTO Vehicles (user_id, model, year, plate_number, current_km, description) VALUES
((SELECT user_id FROM Users WHERE email = 'user1@example.com'), 'پژو 206', 1398, '11ب 123 ایران 45', 45000, 'خودوی شخصی - رنگ سفید'),
((SELECT user_id FROM Users WHERE email = 'user1@example.com'), 'ساینا', 1400, '12ج 456 تهران 23', 25000, 'خودوی خانوادگی'),
((SELECT user_id FROM Users WHERE email = 'user2@example.com'), 'تیبا 2', 1399, '13د 789 اصفهان 67', 35000, 'خودوی اقتصادی')
ON CONFLICT (user_id, plate_number) DO NOTHING;

-- Reminder settings will be auto-created by trigger

-- Insert sample services
INSERT INTO Services (vehicle_id, service_date, service_date_gregorian, service_km, cost, service_type, description) VALUES
((SELECT vehicle_id FROM Vehicles WHERE plate_number = '11ب 123 ایران 45'), '1403-02-15', '2024-05-04', 40000, 2500000, 'oil_change', 'تعویض روغن و فیلتر'),
((SELECT vehicle_id FROM Vehicles WHERE plate_number = '11ب 123 ایران 45'), '1403-05-20', '2024-08-10', 43000, 1500000, 'general', 'سرویس دوره‌ای'),
((SELECT vehicle_id FROM Vehicles WHERE plate_number = '12ج 456 تهران 23'), '1403-01-10', '2024-03-30', 20000, 2000000, 'oil_change', 'تعویض روغن موتور'),
((SELECT vehicle_id FROM Vehicles WHERE plate_number = '13د 789 اصفهان 67'), '1403-03-25', '2024-06-14', 33000, 1800000, 'oil_change', 'تعویض روغن و فیلتر هوا');

-- Insert sample expenses
INSERT INTO DailyExpenses (vehicle_id, expense_date, expense_date_gregorian, amount, category, km_at_expense, description) VALUES
((SELECT vehicle_id FROM Vehicles WHERE plate_number = '11ب 123 ایران 45'), '1403-06-01', '2024-08-22', 500000, 'fuel', 45200, 'سوخت'),
((SELECT vehicle_id FROM Vehicles WHERE plate_number = '11ب 123 ایران 45'), '1403-06-05', '2024-08-26', 150000, 'carwash', 45500, 'کارواش'),
((SELECT vehicle_id FROM Vehicles WHERE plate_number = '12ج 456 تهران 23'), '1403-06-02', '2024-08-23', 600000, 'fuel', 20200, 'سوخت'),
((SELECT vehicle_id FROM Vehicles WHERE plate_number = '12ج 456 تهران 23'), '1403-06-03', '2024-08-24', 50000, 'parking', 20500, 'پارکینگ'),
((SELECT vehicle_id FROM Vehicles WHERE plate_number = '13د 789 اصفهان 67'), '1403-06-01', '2024-08-22', 550000, 'fuel', 33200, 'سوخت'),
((SELECT vehicle_id FROM Vehicles WHERE plate_number = '13د 789 اصفهان 67'), '1403-06-04', '2024-08-25', 200000, 'toll', 33800, 'عوارض اتوبان');

COMMIT;