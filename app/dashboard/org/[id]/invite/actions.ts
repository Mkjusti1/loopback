'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

interface InviteMemberInput {
  orgId: string;
  email: string;
  role: string;
}

export async function inviteMember(
  input: InviteMemberInput
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const admin = createAdminClient();

  // Verify the inviter is an admin or owner
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', input.orgId)
    .eq('user_id', user.id)
    .single();

  if (!membership || !['owner', 'admin'].includes(membership.role)) {
    return { error: 'You do not have permission to invite members.' };
  }

  // Find the user by email
  const { data: profiles, error: profileError } = await admin
    .from('profiles')
    .select('id')
    .eq('email', input.email)
    .single();

  if (profileError || !profiles) {
    return { error: 'No account found with that email address.' };
  }

  // Check they are not already a member
  const { data: existing } = await admin
    .from('org_members')
    .select('id')
    .eq('org_id', input.orgId)
    .eq('user_id', profiles.id)
    .single();

  if (existing) {
    return { error: 'That person is already a member of this workspace.' };
  }

  // Add them to the org
  const { error: insertError } = await admin.from('org_members').insert({
    org_id: input.orgId,
    user_id: profiles.id,
    role: input.role,
  });

  if (insertError) return { error: insertError.message };

  return {};
}
