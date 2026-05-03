'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

interface CreateReviewRequestInput {
  orgId: string;
  cycleId: string;
  email: string;
}

export async function createReviewRequest(
  input: CreateReviewRequestInput
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Verify permission
  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', input.orgId)
    .eq('user_id', user.id)
    .single();

  if (!membership || !['owner', 'admin', 'manager'].includes(membership.role)) {
    return { error: 'You do not have permission to add reviewees.' };
  }

  // Find the user by email
  const { data: profile } = await admin
    .from('profiles')
    .select('id')
    .eq('email', input.email)
    .single();

  if (!profile) {
    return { error: 'No account found with that email address.' };
  }

  // Check they are a member of this org
  const { data: orgMember } = await admin
    .from('org_members')
    .select('id')
    .eq('org_id', input.orgId)
    .eq('user_id', profile.id)
    .single();

  if (!orgMember) {
    return { error: 'That person is not a member of this workspace.' };
  }

  // Check they are not already in this cycle
  const { data: existing } = await admin
    .from('review_requests')
    .select('id')
    .eq('cycle_id', input.cycleId)
    .eq('reviewee_id', profile.id)
    .single();

  if (existing) {
    return { error: 'That person is already added to this cycle.' };
  }

  // Create the review request
  const { error } = await admin.from('review_requests').insert({
    cycle_id: input.cycleId,
    reviewee_id: profile.id,
    status: 'pending',
  });

  if (error) return { error: error.message };

  return {};
}
