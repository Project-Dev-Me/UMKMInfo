
import { type Express } from "express";
import { supabase, supabaseAdmin } from "./supabase";
import { createServer } from "http";

export function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Middleware untuk verifikasi auth
  const verifyAuth = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({ error: 'Invalid authentication' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth verification error:', error);
      res.status(401).json({ error: 'Authentication failed' });
    }
  };

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  // Get popular UMKM
  app.get("/api/umkm/popular", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('umkm_businesses')
        .select('*')
        .eq('is_popular', true)
        .in('status', ['approved', 'active'])
        .order('rating', { ascending: false })
        .limit(10);

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching popular UMKM:', error);
      res.status(500).json({ error: 'Failed to fetch popular UMKM' });
    }
  });

  // Get latest UMKM
  app.get("/api/umkm/latest", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('umkm_businesses')
        .select('*')
        .in('status', ['approved', 'active'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching latest UMKM:', error);
      res.status(500).json({ error: 'Failed to fetch latest UMKM' });
    }
  });

  // Get all UMKM with filters
  app.get("/api/umkm", async (req, res) => {
    try {
      const { category, search, limit = 50 } = req.query;
      
      let query = supabase
        .from('umkm_businesses')
        .select('*')
        .in('status', ['approved', 'active'])
        .order('created_at', { ascending: false })
        .limit(Number(limit));

      if (category) {
        query = query.eq('category', category);
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching UMKM:', error);
      res.status(500).json({ error: 'Failed to fetch UMKM' });
    }
  });

  // Get user's UMKM businesses
  app.get("/api/umkm/my", verifyAuth, async (req: any, res) => {
    try {
      const { data, error } = await supabase
        .from('umkm_businesses')
        .select('*')
        .eq('owner_id', req.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching user UMKM:', error);
      res.status(500).json({ error: 'Failed to fetch user UMKM' });
    }
  });

  // Get UMKM by ID
  app.get("/api/umkm/:id", async (req, res) => {
    try {
      const { id } = req.params;
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
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'UMKM not found' });
        }
        throw error;
      }

      res.json(data);
    } catch (error) {
      console.error('Error fetching UMKM detail:', error);
      res.status(500).json({ error: 'Failed to fetch UMKM detail' });
    }
  });

  // Create new UMKM
  app.post("/api/umkm", verifyAuth, async (req: any, res) => {
    try {
      const umkmData = req.body;

      const { data, error } = await supabase
        .from('umkm_businesses')
        .insert([{
          ...umkmData,
          owner_id: req.user.id,
          status: 'pending',
          is_popular: false,
          is_newly_joined: true,
          rating: 0,
          review_count: 0
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Error creating UMKM:', error);
      res.status(500).json({ error: 'Failed to create UMKM' });
    }
  });

  // Update UMKM
  app.put("/api/umkm/:id", verifyAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Verify ownership
      const { data: existing, error: checkError } = await supabase
        .from('umkm_businesses')
        .select('owner_id')
        .eq('id', id)
        .single();

      if (checkError) throw checkError;
      
      if (existing.owner_id !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized to update this UMKM' });
      }

      const { data, error } = await supabase
        .from('umkm_businesses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error updating UMKM:', error);
      res.status(500).json({ error: 'Failed to update UMKM' });
    }
  });

  // Delete UMKM
  app.delete("/api/umkm/:id", verifyAuth, async (req: any, res) => {
    try {
      const { id } = req.params;

      // Verify ownership
      const { data: existing, error: checkError } = await supabase
        .from('umkm_businesses')
        .select('owner_id')
        .eq('id', id)
        .single();

      if (checkError) throw checkError;
      
      if (existing.owner_id !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized to delete this UMKM' });
      }

      const { error } = await supabase
        .from('umkm_businesses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ message: 'UMKM deleted successfully' });
    } catch (error) {
      console.error('Error deleting UMKM:', error);
      res.status(500).json({ error: 'Failed to delete UMKM' });
    }
  });

  // User authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, full_name, phone } = req.body;

      if (!email || !password || !full_name) {
        return res.status(400).json({ error: 'Email, password, and full name are required' });
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            phone
          }
        }
      });

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Error logging out:', error);
      res.status(500).json({ error: 'Failed to log out' });
    }
  });

  // User profile routes
  app.get("/api/profile", verifyAuth, async (req: any, res) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      res.json(data || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  app.put("/api/profile", verifyAuth, async (req: any, res) => {
    try {
      const updates = req.body;
      
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', req.user.id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // Change password
  app.post("/api/auth/change-password", verifyAuth, async (req: any, res) => {
    try {
      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const { error } = await supabaseAdmin.auth.admin.updateUserById(
        req.user.id,
        { password: newPassword }
      );

      if (error) throw error;
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  });

  // Reviews routes
  app.get("/api/umkm/:id/reviews", async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users (
            full_name,
            avatar_url
          )
        `)
        .eq('umkm_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

  app.post("/api/umkm/:id/reviews", verifyAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          umkm_id: id,
          user_id: req.user.id,
          rating: Number(rating),
          comment,
          helpful_count: 0
        }])
        .select(`
          *,
          users (
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Update UMKM rating
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('umkm_id', id);

      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        
        await supabase
          .from('umkm_businesses')
          .update({
            rating: Math.round(avgRating * 10) / 10,
            review_count: reviews.length
          })
          .eq('id', id);
      }

      res.status(201).json(data);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: 'Failed to create review' });
    }
  });

  // Bookmarks routes
  app.get("/api/bookmarks", verifyAuth, async (req: any, res) => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          *,
          umkm_businesses (*)
        `)
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
  });

  app.post("/api/bookmarks", verifyAuth, async (req: any, res) => {
    try {
      const { umkm_id } = req.body;

      if (!umkm_id) {
        return res.status(400).json({ error: 'UMKM ID is required' });
      }

      const { data, error } = await supabase
        .from('bookmarks')
        .insert([{
          user_id: req.user.id,
          umkm_id
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Error creating bookmark:', error);
      res.status(500).json({ error: 'Failed to create bookmark' });
    }
  });

  app.delete("/api/bookmarks/:umkmId", verifyAuth, async (req: any, res) => {
    try {
      const { umkmId } = req.params;

      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', req.user.id)
        .eq('umkm_id', umkmId);

      if (error) throw error;
      res.json({ message: 'Bookmark removed successfully' });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      res.status(500).json({ error: 'Failed to remove bookmark' });
    }
  });

  // Check if UMKM is bookmarked
  app.get("/api/bookmarks/check/:umkmId", verifyAuth, async (req: any, res) => {
    try {
      const { umkmId } = req.params;

      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', req.user.id)
        .eq('umkm_id', umkmId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      res.json({ isBookmarked: !!data });
    } catch (error) {
      console.error('Error checking bookmark:', error);
      res.status(500).json({ error: 'Failed to check bookmark' });
    }
  });

  // File upload routes
  app.post("/api/upload/:bucket", verifyAuth, async (req: any, res) => {
    try {
      const { bucket } = req.params;
      const file = req.files?.file;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileName = `${req.user.id}/${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file.data, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      res.json({ 
        path: data.path,
        url: urlData.publicUrl 
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });

  return httpServer;
}
