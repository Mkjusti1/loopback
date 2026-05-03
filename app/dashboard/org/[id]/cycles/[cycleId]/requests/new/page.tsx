'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createReviewRequest } from './actions';

export default function NewReviewRequestPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id as string;
  const cycleId = params.cycleId as string;

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    setLoading(true);
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter an email address.');
      setLoading(false);
      return;
    }

    const result = await createReviewRequest({
      orgId,
      cycleId,
      email: email.trim(),
    });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(`${email} has been added for review.`);
      setEmail('');
    }

    setLoading(false);
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8'>
        <div className='mb-8'>
          <h1 className='text-2xl font-semibold text-gray-900'>Add reviewee</h1>
          <p className='text-gray-500 text-sm mt-1'>
            Add a team member to be reviewed in this cycle
          </p>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email address
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black'
              placeholder='teammate@company.com'
            />
          </div>

          {error && <p className='text-sm text-red-500'>{error}</p>}
          {success && <p className='text-sm text-green-600'>{success}</p>}

          <button
            onClick={handleAdd}
            disabled={loading}
            className='w-full bg-black text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors'
          >
            {loading ? 'Adding...' : 'Add reviewee'}
          </button>

          <button
            onClick={() =>
              router.push(`/dashboard/org/${orgId}/cycles/${cycleId}`)
            }
            className='w-full text-gray-500 text-sm hover:text-gray-700 transition-colors'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
