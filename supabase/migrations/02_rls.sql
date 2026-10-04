-- ====================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES: 02_RLS.SQL
-- PROJECT: SANCHAY PATH FINANCIAL SERVICES
-- ====================================================================

-- Enable RLS on all 10 tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incoming_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sheet_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_runs ENABLE ROW LEVEL SECURITY;

-- Helper function to get admin user role from auth.uid()
CREATE OR REPLACE FUNCTION public.get_current_admin_role()
RETURNS VARCHAR AS $$
DECLARE
    user_role VARCHAR;
BEGIN
    SELECT role INTO user_role
    FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND active = true;
    
    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if current user is an active admin
CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE auth_user_id = auth.uid() AND active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- 1. SITE_CONTENT POLICIES
-- ====================================================================
-- Public / Anonymous can view published site content
CREATE POLICY "Public read published site content" ON public.site_content
    FOR SELECT
    USING (is_published = true);

-- Admins / Editors can view all site content (drafts & published)
CREATE POLICY "Admin select site content" ON public.site_content
    FOR SELECT
    USING (public.is_active_admin());

-- Admins / Editors can update site content
CREATE POLICY "Admin update site content" ON public.site_content
    FOR UPDATE
    USING (public.get_current_admin_role() IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR'));

-- Super Admin / Admin can insert site content
CREATE POLICY "Admin insert site content" ON public.site_content
    FOR INSERT
    WITH CHECK (public.get_current_admin_role() IN ('SUPER_ADMIN', 'ADMIN'));

-- ====================================================================
-- 2. CUSTOMERS POLICIES
-- ====================================================================
-- Public anonymous CANNOT access customers table
-- Only authenticated active admin users can view customers
CREATE POLICY "Admin select customers" ON public.customers
    FOR SELECT
    USING (public.is_active_admin());

-- Admins can update customer records
CREATE POLICY "Admin update customers" ON public.customers
    FOR UPDATE
    USING (public.get_current_admin_role() IN ('SUPER_ADMIN', 'ADMIN'));

-- ====================================================================
-- 3. ENQUIRIES POLICIES
-- ====================================================================
-- Public anonymous CANNOT select enquiries
-- Active admin users can view enquiries
CREATE POLICY "Admin select enquiries" ON public.enquiries
    FOR SELECT
    USING (public.is_active_admin());

-- Admins can update enquiry status
CREATE POLICY "Admin update enquiries" ON public.enquiries
    FOR UPDATE
    USING (public.get_current_admin_role() IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR'));

-- ====================================================================
-- 4. APPOINTMENTS POLICIES
-- ====================================================================
-- Public anonymous CANNOT select appointments
-- Active admin users can view appointments
CREATE POLICY "Admin select appointments" ON public.appointments
    FOR SELECT
    USING (public.is_active_admin());

-- Admins can update appointments
CREATE POLICY "Admin update appointments" ON public.appointments
    FOR UPDATE
    USING (public.get_current_admin_role() IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR'));

-- ====================================================================
-- 5. ADMIN_USERS POLICIES
-- ====================================================================
-- Admins can view admin user table
CREATE POLICY "Admin select admin_users" ON public.admin_users
    FOR SELECT
    USING (public.is_active_admin());

-- Super Admin can manage admin users
CREATE POLICY "Super Admin manage admin_users" ON public.admin_users
    FOR ALL
    USING (public.get_current_admin_role() = 'SUPER_ADMIN');

-- ====================================================================
-- 6. AUDIT_LOGS POLICIES
-- ====================================================================
-- Admins can view audit logs
CREATE POLICY "Admin select audit_logs" ON public.audit_logs
    FOR SELECT
    USING (public.is_active_admin());

-- ====================================================================
-- 7. SHEET_EXPORTS & BACKUP_RUNS POLICIES
-- ====================================================================
CREATE POLICY "Admin select sheet_exports" ON public.sheet_exports
    FOR SELECT
    USING (public.is_active_admin());

CREATE POLICY "Admin select backup_runs" ON public.backup_runs
    FOR SELECT
    USING (public.is_active_admin());
