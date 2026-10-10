import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

async function checkAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isAdmin: false, user: null };
  }

  const token = authHeader.split(' ')[1];
  const supabaseAdmin = createAdminClient();

  if (!supabaseAdmin) {
    // If Supabase not configured yet, fallback for dev/demo if token matches session mock
    if (token === 'demo-admin-session-token') {
      return { isAdmin: true, user: { email: 'admin@menfess.com' } };
    }
    return { isAdmin: false, user: null };
  }

  // Verify token with Supabase Auth
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    return { isAdmin: false, user: null };
  }

  // Check profile role
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile && profile.role === 'admin') {
    return { isAdmin: true, user };
  }

  return { isAdmin: false, user: null };
}

// GET /api/admin/submissions - Get all menfess list (Server-side Authorized)
export async function GET(request: NextRequest) {
  const { isAdmin } = await checkAdminAuth(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAdmin = createAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json({ submissions: [] });
  }

  const { data, error } = await supabaseAdmin
    .from('menfess')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ submissions: data });
}

// PATCH /api/admin/submissions - Update menfess status (Server-side Authorized)
export async function PATCH(request: NextRequest) {
  const { isAdmin } = await checkAdminAuth(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, status } = await request.json();

  if (!id || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    const { error } = await supabaseAdmin
      .from('menfess')
      .update({ status })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    message: status === 'approved' ? 'Menfess berhasil di-approve.' : 'Menfess ditolak.',
  });
}
