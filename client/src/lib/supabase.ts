
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vpqjytpuudiqxrzeshuv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWp5dHB1dWRpcXhyemVzaHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NzQwNzksImV4cCI6MjA2NDE1MDA3OX0.qiZVA-gV6gjDPVQ3tt-xQxuWwupLsmNO1NARWLXulb8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for database operations
export const db = {
  // UMKM operations
  async getUmkmBusinesses() {
    const { data, error } = await supabase
      .from('umkm_businesses')
      .select('*')
      .eq('status', 'active')
    
    if (error) throw error
    return data
  },

  async getPopularUmkm() {
    const { data, error } = await supabase
      .from('umkm_businesses')
      .select('*')
      .eq('is_popular', true)
      .eq('status', 'approved')
      .limit(10)
    
    if (error) throw error
    return data
  },

  async getLatestUmkm() {
    const { data, error } = await supabase
      .from('umkm_businesses')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) throw error
    return data
  },

  async getUmkmById(id: string) {
    const { data, error } = await supabase
      .from('umkm_businesses')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createUmkm(umkmData: any) {
    const { data, error } = await supabase
      .from('umkm_businesses')
      .insert([umkmData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateUmkm(id: string, updates: any) {
    const { data, error } = await supabase
      .from('umkm_businesses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // User operations
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async signUp(email: string, password: string, userData: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Reviews operations
  async getReviewsByUmkmId(umkmId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users (
          full_name,
          avatar_url
        )
      `)
      .eq('umkm_id', umkmId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createReview(reviewData: any) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Bookmarks operations
  async getUserBookmarks(userId: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select(`
        *,
        umkm_businesses (*)
      `)
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  },

  async addBookmark(userId: string, umkmId: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ user_id: userId, umkm_id: umkmId }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async removeBookmark(userId: string, umkmId: string) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('umkm_id', umkmId)
    
    if (error) throw error
  }
}

// Storage operations
export const storage = {
  async uploadImage(bucket: string, fileName: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })
    
    if (error) throw error
    return data
  },

  async getImageUrl(bucket: string, fileName: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
    
    return data.publicUrl
  },

  async deleteImage(bucket: string, fileName: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])
    
    if (error) throw error
  }
}
