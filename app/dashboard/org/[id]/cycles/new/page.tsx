'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createCycle } from './actions';

export default function NewCyclePage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id as string;

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    setError('');

    if (!title.trim()) {
      setError('Please enter a cycle title.');
      setLoading(false);
      return;
    }

    const result = await createCycle({
      orgId,
      title: title.trim(),
      dueDate: dueDate || null,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(`/dashboard/org/${orgId}`);
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8'>
        <div className='mb-8'>
          <h1 className='text-2xl font-semibold text-gray-900'>
            New review cycle
          </h1>
          <p className='text-gray-500 text-sm mt-1'>
            A cycle is a single round of performance reviews
          </p>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Cycle title
            </label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black'
              placeholder='Q1 2026 Performance Review'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Due date{' '}
              <span className='text-gray-400 font-normal'>(optional)</span>
            </label>
            <input
              type='date'
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black'
            />
          </div>

          {error && <p className='text-sm text-red-500'>{error}</p>}

          <button
            onClick={handleCreate}
            disabled={loading}
            className='w-full bg-black text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors'
          >
            {loading ? 'Creating...' : 'Create cycle'}
          </button>

          <button
            onClick={() => router.push(`/dashboard/org/${orgId}`)}
            className='w-full text-gray-500 text-sm hover:text-gray-700 transition-colors'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
