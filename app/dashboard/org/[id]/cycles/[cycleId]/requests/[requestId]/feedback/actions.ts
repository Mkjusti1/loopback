'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

interface SubmitFeedbackInput {
  requestId: string;
  response: string;
  isAnonymous: boolean;
}

export async function submitFeedback(
  input: SubmitFeedbackInput
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Check if already submitted feedback for this request
  const { data: existing } = await admin
    .from('feedback')
    .select('id')
    .eq('request_id', input.requestId)
    .eq('reviewer_id', user.id)
    .single();

  if (existing) {
    return { error: 'You have already submitted feedback for this person.' };
  }

  const { error } = await admin.from('feedback').insert({
    request_id: input.requestId,
    reviewer_id: user.id,
    response: input.response,
    is_anonymous: input.isAnonymous,
  });

  if (error) return { error: error.message };

  // Update request status to in_progress
  await admin
    .from('review_requests')
    .update({ status: 'in_progress' })
    .eq('id', input.requestId);

  return {};
}
