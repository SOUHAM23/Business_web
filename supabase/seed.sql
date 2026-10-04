-- ====================================================================
-- SUPABASE SEED DATA: SEED.SQL
-- PROJECT: SANCHAY PATH FINANCIAL SERVICES
-- ====================================================================

-- 1. INITIAL SITE CONTENT FOR SANCHAY PATH PUBLIC WEBSITE
INSERT INTO public.site_content (content_key, content_value, content_type, is_published, updated_by)
VALUES
    ('company_name', 'Sanchay Path', 'text', true, 'system_seed'),
    ('company_tagline', 'Invest Today, Grow Tomorrow', 'text', true, 'system_seed'),
    ('hero_title', 'Crafting a Smarter Financial Future', 'text', true, 'system_seed'),
    ('hero_subtitle', 'Expert financial planning, mutual fund investments, SIPs, insurance solutions, and wealth management tailored for your goals.', 'text', true, 'system_seed'),
    ('about_text', 'Sanchay Path is a trusted financial consulting firm dedicated to helping individuals and families achieve long-term financial independence. Through disciplined asset allocation, goal-based planning, and personalized investment strategies, we build pathways to lasting wealth.', 'text', true, 'system_seed'),
    ('contact_phone', '+919876543210', 'text', true, 'system_seed'),
    ('contact_email', 'info@sanchaypath.com', 'text', true, 'system_seed'),
    ('office_address', 'Suite 402, Financial Tower, MG Road, Bengaluru, Karnataka - 560001', 'text', true, 'system_seed'),
    ('working_hours', 'Monday - Saturday: 9:30 AM - 6:30 PM', 'text', true, 'system_seed'),
    ('services_list', '[{"id":"sip_mutual_funds","title":"SIP & Mutual Funds","desc":"Goal-based mutual fund portfolios and systematic investment plans engineered for maximum capital growth."},{"id":"insurance_solutions","title":"Insurance Solutions","desc":"Comprehensive term life, health, and family protection plans to safeguard your wealth."},{"id":"loans_credit","title":"Loans & Credit Advisory","desc":"Personalized assistance for home loans, business expansion, and low-interest capital sourcing."},{"id":"retirement_planning","title":"Retirement & Wealth Management","desc":"Strategic retirement fund allocation and wealth preservation models for a stress-free future."}]', 'json', true, 'system_seed')
ON CONFLICT (content_key) DO UPDATE 
SET content_value = EXCLUDED.content_value,
    updated_at = NOW();

-- 2. SEED AN INITIAL ADMIN USER HELPER
-- Note: Replace 'admin@sanchaypath.com' with the initial admin email
INSERT INTO public.admin_users (email, role, active)
VALUES 
    ('admin@sanchaypath.com', 'SUPER_ADMIN', true),
    ('editor@sanchaypath.com', 'EDITOR', true)
ON CONFLICT (email) DO UPDATE
SET role = EXCLUDED.role,
    active = EXCLUDED.active,
    updated_at = NOW();
