
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vpqjytpuudiqxrzeshuv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWp5dHB1dWRpcXhyemVzaHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NzQwNzksImV4cCI6MjA2NDE1MDA3OX0.qiZVA-gV6gjDPVQ3tt-xQxuWwupLsmNO1NARWLXulb8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  avatar_url?: string
  address?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  created_at: string
  updated_at: string
}

export interface UmkmBusiness {
  id: string
  owner_id?: string
  name: string
  description?: string
  category_id?: string
  category?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  image_url?: string
  business_hours?: string
  price_range?: string
  latitude?: number
  longitude?: number
  rating: number
  review_count: number
  status: 'pending' | 'approved' | 'rejected' | 'active'
  is_popular: boolean
  is_newly_joined: boolean
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  umkm_id: string
  user_id: string
  rating: number
  comment?: string
  helpful_count: number
  created_at: string
  updated_at: string
  users?: {
    full_name: string
    avatar_url?: string
  }
}

export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  created_at: string
}

// Helper functions for database operations
export const db = {
  // Categories operations
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  // UMKM operations
  async getUmkmBusinesses() {
    try {
      const { data, error } = await supabase
        .from('umkm_businesses')
        .select('*')
        .in('status', ['approved', 'active'])
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching UMKM businesses:', error)
      throw error
    }
  },

  async getPopularUmkm() {
    try {
      const { data, error } = await supabase
        .from('umkm_businesses')
        .select('*')
        .eq('is_popular', true)
        .in('status', ['approved', 'active'])
        .order('rating', { ascending: false })
        .limit(10)
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching popular UMKM:', error)
      throw error
    }
  },

  async getLatestUmkm() {
    try {
      const { data, error } = await supabase
        .from('umkm_businesses')
        .select('*')
        .in('status', ['approved', 'active'])
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching latest UMKM:', error)
      throw error
    }
  },

  async getUmkmById(id: string) {
    try {
      const { data, error } = await supabase
        .from('umkm_businesses')
        .select(`
          *,
          reviews (
            id,
            rating,
            comment,
            helpful_count,
            created_at,
            users (
              full_name,
              avatar_url
            )
          )
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching UMKM by ID:', error)
      throw error
    }
  },

  async getUserUmkm(userId: string) {
    try {
      const { data, error } = await supabase
        .from('umkm_businesses')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user UMKM:', error)
      throw error
    }
  },

  async createUmkm(umkmData: Partial<UmkmBusiness>) {
    try {
      const { data, error } = await supabase
        .from('umkm_businesses')
        .insert([{
          ...umkmData,
          status: 'pending',
          is_popular: false,
          is_newly_joined: true,
          rating: 0,
          review_count: 0
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating UMKM:', error)
      throw error
    }
  },

  async updateUmkm(id: string, updates: Partial<UmkmBusiness>) {
    try {
      const { data, error } = await supabase
        .from('umkm_businesses')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating UMKM:', error)
      throw error
    }
  },

  async deleteUmkm(id: string) {
    try {
      const { error } = await supabase
        .from('umkm_businesses')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      console.error('Error deleting UMKM:', error)
      throw error
    }
  },

  // User operations
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profileError && profileError.code !== 'PGRST116') throw profileError
        return { user, profile }
      }
      
      return { user: null, profile: null }
    } catch (error) {
      console.error('Error getting current user:', error)
      throw error
    }
  },

  async updateUserProfile(userId: string, updates: Partial<User>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  },

  async signUp(email: string, password: string, userData: any) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            phone: userData.phone
          }
        }
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  },

  async changePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
    } catch (error) {
      console.error('Error changing password:', error)
      throw error
    }
  },

  // Reviews operations
  async getReviewsByUmkmId(umkmId: string) {
    try {
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
      return data || []
    } catch (error) {
      console.error('Error fetching reviews:', error)
      throw error
    }
  },

  async createReview(reviewData: Partial<Review>) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select(`
          *,
          users (
            full_name,
            avatar_url
          )
        `)
        .single()
      
      if (error) throw error
      
      // Update UMKM rating
      await this.updateUmkmRating(reviewData.umkm_id!)
      
      return data
    } catch (error) {
      console.error('Error creating review:', error)
      throw error
    }
  },

  async updateUmkmRating(umkmId: string) {
    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('umkm_id', umkmId)
      
      if (error) throw error
      
      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        
        await supabase
          .from('umkm_businesses')
          .update({
            rating: Math.round(avgRating * 10) / 10,
            review_count: reviews.length
          })
          .eq('id', umkmId)
      }
    } catch (error) {
      console.error('Error updating UMKM rating:', error)
    }
  },

  // Bookmarks operations
  async getUserBookmarks(userId: string) {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          *,
          umkm_businesses (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      throw error
    }
  },

  async addBookmark(userId: string, umkmId: string) {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert([{ user_id: userId, umkm_id: umkmId }])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding bookmark:', error)
      throw error
    }
  },

  async removeBookmark(userId: string, umkmId: string) {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', userId)
        .eq('umkm_id', umkmId)
      
      if (error) throw error
    } catch (error) {
      console.error('Error removing bookmark:', error)
      throw error
    }
  },

  async checkBookmark(userId: string, umkmId: string) {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', userId)
        .eq('umkm_id', umkmId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return !!data
    } catch (error) {
      console.error('Error checking bookmark:', error)
      return false
    }
  }
}

// Storage operations
export const storage = {
  async uploadImage(bucket: string, fileName: string, file: File) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  },

  async getImageUrl(bucket: string, fileName: string) {
    try {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)
      
      return data.publicUrl
    } catch (error) {
      console.error('Error getting image URL:', error)
      throw error
    }
  },

  async deleteImage(bucket: string, fileName: string) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName])
      
      if (error) throw error
    } catch (error) {
      console.error('Error deleting image:', error)
      throw error
    }
  }
}

// Auth state listener
export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })
}
