'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log('Login attempt:', data.email) // Check if login data passes correctly

  // const { error } = await supabase.auth.signInWithPassword(data)
  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error.message)  // Display login error
    redirect('/error')
  }

  console.log('Login successful:', authData)  // Check if login is successful

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log('Signup attempt:', data.email) // Check if signup data passes correctly

  // const { error } = await supabase.auth.signUp(data)
  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Signup error:', error.message)  // Display signup error
    redirect('/error')
  }

  console.log('Signup successful:', authData)  // Check if signup is successful

  revalidatePath('/', 'layout')
  redirect('/')
}