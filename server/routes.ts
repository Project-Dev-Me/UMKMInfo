import { type Express } from "express";
import { supabase, supabaseAdmin } from "./supabase";
import { createServer } from "http";

export function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Get popular UMKM
  app.get("/api/umkm/popular", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('umkm_businesses')
        .select('*')
        .eq('is_popular', true)
        .eq('status', 'approved')
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
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching latest UMKM:', error);
      res.status(500).json({ error: 'Failed to fetch latest UMKM' });
    }
  });

  // Get all UMKM
  app.get("/api/umkm", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('umkm_businesses')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching UMKM:', error);
      res.status(500).json({ error: 'Failed to fetch UMKM' });
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
  app.post("/api/umkm", async (req, res) => {
    try {
      const umkmData = req.body;

      // Get user from auth header if available
      const authHeader = req.headers.authorization;
      let userId = null;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
          userId = user.id;
        }
      }

      const { data, error } = await supabase
        .from('umkm_businesses')
        .insert([{
          ...umkmData,
          owner_id: userId,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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
  app.put("/api/umkm/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const { data, error } = await supabase
        .from('umkm_businesses')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
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
  app.delete("/api/umkm/:id", async (req, res) => {
    try {
      const { id } = req.params;

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

  app.post("/api/umkm/:id/reviews", async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;

      // Get user from auth header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const token = authHeader.substring(7);
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json({ error: 'Invalid authentication' });
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          umkm_id: id,
          user_id: user.id,
          rating,
          comment,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: 'Failed to create review' });
    }
  });

  // Bookmarks routes
  app.get("/api/bookmarks", async (req, res) => {
    try {
      // Get user from auth header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const token = authHeader.substring(7);
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json({ error: 'Invalid authentication' });
      }

      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          *,
          umkm_businesses (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
  });

  app.post("/api/bookmarks", async (req, res) => {
    try {
      const { umkm_id } = req.body;

      // Get user from auth header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const token = authHeader.substring(7);
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json({ error: 'Invalid authentication' });
      }

      const { data, error } = await supabase
        .from('bookmarks')
        .insert([{
          user_id: user.id,
          umkm_id,
          created_at: new Date().toISOString()
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

  app.delete("/api/bookmarks/:umkmId", async (req, res) => {
    try {
      const { umkmId } = req.params;

      // Get user from auth header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const token = authHeader.substring(7);
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json({ error: 'Invalid authentication' });
      }

      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('umkm_id', umkmId);

      if (error) throw error;
      res.json({ message: 'Bookmark removed successfully' });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      res.status(500).json({ error: 'Failed to remove bookmark' });
    }
  });

  return httpServer;
}