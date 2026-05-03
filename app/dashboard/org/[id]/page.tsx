import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();

  if (!org) redirect('/dashboard');

  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', id)
    .eq('user_id', user.id)
    .single();

  if (!membership) redirect('/dashboard');

  const { data: members } = await supabase
    .from('org_members')
    .select('*, profiles(*)')
    .eq('org_id', id);

  const { data: cycles } = await supabase
    .from('review_cycles')
    .select('*')
    .eq('org_id', id)
    .order('created_at', { ascending: false });

  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <a
            href='/dashboard'
            className='text-gray-400 hover:text-gray-600 text-sm'
          >
            ← Workspaces
          </a>
          <span className='text-gray-300'>/</span>
          <h1 className='text-lg font-semibold text-gray-900'>{org.name}</h1>
        </div>
        <span className='text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full capitalize'>
          {membership.role}
        </span>
      </nav>

      <main className='max-w-4xl mx-auto px-6 py-10 space-y-10'>
        <section>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Review cycles
            </h2>
            {['owner', 'admin', 'manager'].includes(membership.role) && (
              <a
                href={`/dashboard/org/${id}/cycles/new`}
                className='bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors'
              >
                New cycle
              </a>
            )}
          </div>

          {cycles && cycles.length > 0 ? (
            <div className='grid gap-3'>
              {cycles.map((cycle: any) => (
                <a
                  key={cycle.id}
                  href={`/dashboard/org/${id}/cycles/${cycle.id}`}
                  className='bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:border-gray-300 transition-colors'
                >
                  <div>
                    <p className='font-medium text-gray-900'>{cycle.title}</p>
                    <p className='text-sm text-gray-500 mt-0.5'>
                      {cycle.due_date ? `Due ${cycle.due_date}` : 'No due date'}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full capitalize font-medium
                    ${
                      cycle.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : ''
                    }
                    ${
                      cycle.status === 'draft'
                        ? 'bg-gray-100 text-gray-600'
                        : ''
                    }
                    ${
                      cycle.status === 'closed' ? 'bg-red-100 text-red-600' : ''
                    }
                  `}
                  >
                    {cycle.status}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className='bg-white border border-gray-200 rounded-xl p-8 text-center'>
              <p className='text-gray-500 text-sm'>No review cycles yet.</p>
            </div>
          )}
        </section>

        <section>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Team members
            </h2>
            {['owner', 'admin'].includes(membership.role) && (
              <a
                href={`/dashboard/org/${id}/invite`}
                className='text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors'
              >
                Invite member
              </a>
            )}
          </div>

          <div className='bg-white border border-gray-200 rounded-xl divide-y divide-gray-100'>
            {members?.map((m: any) => (
              <div
                key={m.id}
                className='px-5 py-4 flex items-center justify-between'
              >
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    {m.profiles?.full_name || m.profiles?.email || 'Unknown'}
                  </p>
                  <p className='text-xs text-gray-500'>{m.profiles?.email}</p>
                </div>
                <span className='text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full capitalize'>
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
