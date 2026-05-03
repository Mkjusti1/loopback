'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

interface CreateCycleInput {
  orgId: string;
  title: string;
  dueDate: string | null;
}

export async function createCycle(
  input: CreateCycleInput
): Promise<{ cycleId?: string; error?: string }> {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Verify user has permission in this org
  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', input.orgId)
    .eq('user_id', user.id)
    .single();

  if (!membership || !['owner', 'admin', 'manager'].includes(membership.role)) {
    return { error: 'You do not have permission to create cycles.' };
  }

  const { data: cycle, error: cycleError } = await admin
    .from('review_cycles')
    .insert({
      org_id: input.orgId,
      title: input.title,
      status: 'draft',
      due_date: input.dueDate,
    })
    .select()
    .single();

  if (cycleError) return { error: cycleError.message };

  return { cycleId: cycle.id };
}
