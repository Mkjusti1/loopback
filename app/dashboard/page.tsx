import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SignOutButton from './SignOutButton';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: memberships } = await supabase
    .from('org_members')
    .select('*, organizations(*)')
    .eq('user_id', user.id);

  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between'>
        <h1 className='text-lg font-semibold text-gray-900'>Loopback</h1>
        <div className='flex items-center gap-4'>
          <span className='text-sm text-gray-500'>{user.email}</span>
          <SignOutButton />
        </div>
      </nav>

      <main className='max-w-4xl mx-auto px-6 py-10'>
        <div className='mb-8'>
          <h2 className='text-2xl font-semibold text-gray-900'>
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}
          </h2>
          <p className='text-gray-500 text-sm mt-1'>Here are your workspaces</p>
        </div>

        {memberships && memberships.length > 0 ? (
          <div className='grid gap-4'>
            {memberships.map((m: any) => (
              <a
                key={m.id}
                href={`/dashboard/org/${m.organizations.id}`}
                className='bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between hover:border-gray-300 transition-colors'
              >
                <div>
                  <p className='font-medium text-gray-900'>
                    {m.organizations.name}
                  </p>
                  <p className='text-sm text-gray-500 capitalize'>{m.role}</p>
                </div>
                <span className='text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full'>
                  {m.organizations.slug}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className='bg-white border border-gray-200 rounded-xl p-10 text-center'>
            <p className='text-gray-500 text-sm'>
              You are not part of any workspace yet.
            </p>

            <a
              href='/dashboard/create-org'
              className='mt-4 inline-block bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors'
            >
              Create workspace
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
