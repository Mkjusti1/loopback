import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function CyclePage({
  params,
}: {
  params: Promise<{ id: string; cycleId: string }>;
}) {
  const { id: orgId, cycleId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single();

  if (!membership) redirect('/dashboard');

  const { data: cycle } = await supabase
    .from('review_cycles')
    .select('*')
    .eq('id', cycleId)
    .single();

  if (!cycle) redirect(`/dashboard/org/${orgId}`);

  const { data: requests } = await supabase
    .from('review_requests')
    .select('*, profiles(*)')
    .eq('cycle_id', cycleId);

  const { data: members } = await supabase
    .from('org_members')
    .select('*, profiles(*)')
    .eq('org_id', orgId);

  const canManage = ['owner', 'admin', 'manager'].includes(membership.role);

  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <a
            href={`/dashboard/org/${orgId}`}
            className='text-gray-400 hover:text-gray-600 text-sm'
          >
            ← {cycle.title}
          </a>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full capitalize font-medium
          ${cycle.status === 'active' ? 'bg-green-100 text-green-700' : ''}
          ${cycle.status === 'draft' ? 'bg-gray-100 text-gray-600' : ''}
          ${cycle.status === 'closed' ? 'bg-red-100 text-red-600' : ''}
        `}
        >
          {cycle.status}
        </span>
      </nav>

      <main className='max-w-4xl mx-auto px-6 py-10 space-y-10'>
        {/* Cycle status management */}
        {canManage && (
          <section className='bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between'>
            <div>
              <p className='font-medium text-gray-900'>Cycle status</p>
              <p className='text-sm text-gray-500 mt-0.5'>
                Activate the cycle to allow feedback submission
              </p>
            </div>
            <div className='flex gap-2'>
              {cycle.status === 'draft' && (
                <a
                  href={`/dashboard/org/${orgId}/cycles/${cycleId}/activate`}
                  className='bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors'
                >
                  Activate
                </a>
              )}
              {cycle.status === 'active' && (
                <a
                  href={`/dashboard/org/${orgId}/cycles/${cycleId}/close`}
                  className='bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition-colors'
                >
                  Close cycle
                </a>
              )}
            </div>
          </section>
        )}

        {/* Review requests */}
        <section>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Who is being reviewed
            </h2>
            {canManage && (
              <a
                href={`/dashboard/org/${orgId}/cycles/${cycleId}/requests/new`}
                className='bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors'
              >
                Add reviewee
              </a>
            )}
          </div>

          {requests && requests.length > 0 ? (
            <div className='bg-white border border-gray-200 rounded-xl divide-y divide-gray-100'>
              {requests.map((r: any) => (
                <div
                  key={r.id}
                  className='px-5 py-4 flex items-center justify-between'
                >
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      {r.profiles?.full_name || r.profiles?.email || 'Unknown'}
                    </p>
                    <p className='text-xs text-gray-500'>{r.profiles?.email}</p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span
                      className={`text-xs px-3 py-1 rounded-full capitalize font-medium
                      ${
                        r.status === 'complete'
                          ? 'bg-green-100 text-green-700'
                          : ''
                      }
                      ${
                        r.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700'
                          : ''
                      }
                      ${
                        r.status === 'pending'
                          ? 'bg-gray-100 text-gray-600'
                          : ''
                      }
                    `}
                    >
                      {r.status}
                    </span>
                    {cycle.status === 'active' && (
                      <a
                        href={`/dashboard/org/${orgId}/cycles/${cycleId}/requests/${r.id}/feedback`}
                        className='text-xs text-black underline hover:no-underline'
                      >
                        Give feedback
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='bg-white border border-gray-200 rounded-xl p-8 text-center'>
              <p className='text-gray-500 text-sm'>
                No one has been added for review yet.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
