import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; cycleId: string }> }
) {
  const { id: orgId, cycleId } = await params;
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/login', request.url));

  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single();

  if (!membership || !['owner', 'admin', 'manager'].includes(membership.role)) {
    return NextResponse.redirect(
      new URL(`/dashboard/org/${orgId}`, request.url)
    );
  }

  await admin
    .from('review_cycles')
    .update({ status: 'closed' })
    .eq('id', cycleId);

  return NextResponse.redirect(
    new URL(`/dashboard/org/${orgId}/cycles/${cycleId}`, request.url)
  );
}
