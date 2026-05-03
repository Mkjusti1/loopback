'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

export async function createOrg(
  name: string
): Promise<{ orgId?: string; error?: string }> {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const slug = slugify(name);

  // Use admin client to bypass RLS for org creation
  const { data: org, error: orgError } = await admin
    .from('organizations')
    .insert({ name, slug })
    .select()
    .single();

  if (orgError) return { error: orgError.message };

  // Use admin client to insert the owner membership
  const { error: memberError } = await admin.from('org_members').insert({
    org_id: org.id,
    user_id: user.id,
    role: 'owner',
  });

  if (memberError) return { error: memberError.message };

  return { orgId: org.id };
}
