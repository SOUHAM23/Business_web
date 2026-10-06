async function createPublicAssetsBucket() {
  const supabaseUrl = 'https://xlewftzyvsyhpktgizlz.supabase.co';
  const serviceRoleKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZXdmdHp5dnN5aHBrdGdpemx6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDk0ODQzOCwiZXhwIjoyMTA2NTI0NDM4fQ.1ki8raPrmUpcFCzutxoEHccHnwKo5ylDpO4oWx8zgzY';

  console.log('Creating public_assets storage bucket in Supabase...');

  try {
    const res = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 'public_assets',
        name: 'public_assets',
        public: true,
        file_size_limit: 10485760, // 10MB
        allowed_mime_types: ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'],
      }),
    });

    const data = await res.json();
    if (res.ok || (data && data.message && data.message.includes('already exists'))) {
      console.log('✅ STORAGE BUCKET "public_assets" IS READY AND PUBLIC!');
    } else {
      console.log('Bucket Status:', data);
    }
  } catch (err) {
    console.error('Error creating bucket:', err);
  }
}

createPublicAssetsBucket();
