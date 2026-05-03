'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrg } from './actions';

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

export default function CreateOrgPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    setError('');

    if (!name.trim()) {
      setError('Please enter a workspace name.');
      setLoading(false);
      return;
    }

    const result = await createOrg(name.trim());

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(`/dashboard/org/${result.orgId}`);
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8'>
        <div className='mb-8'>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Create a workspace
          </h1>
          <p className='text-gray-500 text-sm mt-1'>
            This will be your team's home in Loopback
          </p>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Workspace name
            </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black'
              placeholder='Acme Corp'
            />
            {name && (
              <p className='text-xs text-gray-400 mt-1'>
                Slug: <span className='font-mono'>{slugify(name)}</span>
              </p>
            )}
          </div>

          {error && <p className='text-sm text-red-500'>{error}</p>}

          <button
            onClick={handleCreate}
            disabled={loading}
            className='w-full bg-black text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors'
          >
            {loading ? 'Creating...' : 'Create workspace'}
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className='w-full text-gray-500 text-sm hover:text-gray-700 transition-colors'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
