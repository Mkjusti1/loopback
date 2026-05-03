'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { submitFeedback } from './actions';

export default function FeedbackPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id as string;
  const cycleId = params.cycleId as string;
  const requestId = params.requestId as string;

  const [response, setResponse] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError('');

    if (!response.trim()) {
      setError('Please write your feedback before submitting.');
      setLoading(false);
      return;
    }

    const result = await submitFeedback({
      requestId,
      response: response.trim(),
      isAnonymous,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(`/dashboard/org/${orgId}/cycles/${cycleId}`);
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-lg p-8'>
        <div className='mb-8'>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Give feedback
          </h1>
          <p className='text-gray-500 text-sm mt-1'>
            Your feedback helps your teammate grow
          </p>
        </div>

        <div className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Your feedback
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={6}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none'
              placeholder='Share what this person does well, where they can improve, and any specific examples you can think of...'
            />
            <p className='text-xs text-gray-400 mt-1'>
              {response.length} characters
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <input
              type='checkbox'
              id='anonymous'
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className='w-4 h-4 rounded border-gray-300'
            />
            <label htmlFor='anonymous' className='text-sm text-gray-700'>
              Submit anonymously
            </label>
          </div>

          {error && <p className='text-sm text-red-500'>{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className='w-full bg-black text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors'
          >
            {loading ? 'Submitting...' : 'Submit feedback'}
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
