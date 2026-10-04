-- ====================================================================
-- AUTOMATED DATABASE SECURITY PERMISSION TESTS
-- FILE: SUPABASE/TESTS/SECURITY_TEST.SQL
-- PROJECT: SANCHAY PATH FINANCIAL SERVICES
-- ====================================================================

-- Begin test transaction
BEGIN;

-- Test 1: Verify Anonymous Access to site_content
SET LOCAL ROLE anon;
DO $$
DECLARE
    rec_count INT;
BEGIN
    SELECT COUNT(*) INTO rec_count FROM public.site_content WHERE is_published = true;
    IF rec_count = 0 THEN
        RAISE EXCEPTION 'TEST FAILED: Anonymous role should be able to read published site_content';
    END IF;
    RAISE NOTICE 'TEST PASS 1: Anonymous read published site_content succeeded (% records found)', rec_count;
END;
$$;

-- Test 2: Verify Anonymous DENIED Read on Customers, Enquiries, Appointments, Admin Users
DO $$
BEGIN
    BEGIN
        PERFORM * FROM public.customers;
        RAISE EXCEPTION 'TEST FAILED: Anonymous role was allowed to read customers!';
    EXCEPTION WHEN insufficient_privilege THEN
        RAISE NOTICE 'TEST PASS 2a: Anonymous read on customers correctly denied.';
    END;

    BEGIN
        PERFORM * FROM public.enquiries;
        RAISE EXCEPTION 'TEST FAILED: Anonymous role was allowed to read enquiries!';
    EXCEPTION WHEN insufficient_privilege THEN
        RAISE NOTICE 'TEST PASS 2b: Anonymous read on enquiries correctly denied.';
    END;

    BEGIN
        PERFORM * FROM public.appointments;
        RAISE EXCEPTION 'TEST FAILED: Anonymous role was allowed to read appointments!';
    EXCEPTION WHEN insufficient_privilege THEN
        RAISE NOTICE 'TEST PASS 2c: Anonymous read on appointments correctly denied.';
    END;

    BEGIN
        PERFORM * FROM public.admin_users;
        RAISE EXCEPTION 'TEST FAILED: Anonymous role was allowed to read admin_users!';
    EXCEPTION WHEN insufficient_privilege THEN
        RAISE NOTICE 'TEST PASS 2d: Anonymous read on admin_users correctly denied.';
    END;

    BEGIN
        PERFORM * FROM public.audit_logs;
        RAISE EXCEPTION 'TEST FAILED: Anonymous role was allowed to read audit_logs!';
    EXCEPTION WHEN insufficient_privilege THEN
        RAISE NOTICE 'TEST PASS 2e: Anonymous read on audit_logs correctly denied.';
    END;
END;
$$;

-- Test 3: Verify Anonymous DENIED Direct Write to Enquiries
DO $$
BEGIN
    BEGIN
        INSERT INTO public.enquiries (service, message) VALUES ('SIP & Mutual Funds', 'Hacked message');
        RAISE EXCEPTION 'TEST FAILED: Anonymous role was allowed to insert into enquiries directly!';
    EXCEPTION WHEN insufficient_privilege THEN
        RAISE NOTICE 'TEST PASS 3: Anonymous direct insert on enquiries correctly denied.';
    END;
END;
$$;

ROLLBACK;
-- End test transaction
