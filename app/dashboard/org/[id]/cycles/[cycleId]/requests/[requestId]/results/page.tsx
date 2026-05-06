import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';

export default async function FeedbackResultsPage({
  params,
}: {
  params: Promise<{ id: string; cycleId: string; requestId: string }>;
}) {
  const { id: orgId, cycleId, requestId } = await params;
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Get the review request
  const { data: request } = await admin
    .from('review_requests')
    .select('*, profiles(*)')
    .eq('id', requestId)
    .single();

  if (!request) redirect(`/dashboard/org/${orgId}/cycles/${cycleId}`);

  // Only the reviewee or managers+ can see results
  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single();

  const isReviewee = request.reviewee_id === user.id;
  const isManager = ['owner', 'admin', 'manager'].includes(membership?.role);

  if (!isReviewee && !isManager) redirect(`/dashboard/org/${orgId}`);

  // Get all feedback for this request
  const { data: feedbackList } = await admin
    .from('feedback')
    .select('*, profiles(*)')
    .eq('request_id', requestId);

  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white border-b border-gray-200 px-6 py-4'>
        <a
          href={`/dashboard/org/${orgId}/cycles/${cycleId}`}
          className='text-gray-400 hover:text-gray-600 text-sm'
        >
          ← Back to cycle
        </a>
      </nav>

      <main className='max-w-3xl mx-auto px-6 py-10'>
        <div className='mb-8'>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Feedback for{' '}
            {request.profiles?.full_name || request.profiles?.email}
          </h1>
          <p className='text-gray-500 text-sm mt-1'>
            {feedbackList?.length || 0} response
            {feedbackList?.length !== 1 ? 's' : ''}
          </p>
        </div>

        {feedbackList && feedbackList.length > 0 ? (
          <div className='space-y-4'>
            {feedbackList.map((f: any) => (
              <div
                key={f.id}
                className='bg-white border border-gray-200 rounded-xl p-6'
              >
                <div className='flex items-center justify-between mb-3'>
                  <span className='text-sm font-medium text-gray-700'>
                    {f.is_anonymous
                      ? 'Anonymous'
                      : f.profiles?.full_name || f.profiles?.email || 'Unknown'}
                  </span>
                  <span className='text-xs text-gray-400'>
                    {new Date(f.submitted_at).toLocaleDateString()}
                  </span>
                </div>
                <p className='text-sm text-gray-700 leading-relaxed whitespace-pre-wrap'>
                  {f.response}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className='bg-white border border-gray-200 rounded-xl p-10 text-center'>
            <p className='text-gray-500 text-sm'>No feedback submitted yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
