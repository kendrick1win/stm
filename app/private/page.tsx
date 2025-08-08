// Create a private page that users can only access if they're logged in.
// The page displays their email.

import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return <p>Hello {data.user.email}</p>
}