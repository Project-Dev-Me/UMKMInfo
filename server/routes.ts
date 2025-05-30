import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all UMKM businesses with optional filtering
  app.get("/api/umkm", async (req, res) => {
    try {
      const { category, search } = req.query;
      const businesses = await storage.getUmkmBusinesses(
        category as string,
        search as string
      );
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch UMKM businesses" });
    }
  });

  // Get popular UMKM businesses
  app.get("/api/umkm/popular", async (req, res) => {
    try {
      const businesses = await storage.getPopularUmkmBusinesses();
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular UMKM businesses" });
    }
  });

  // Get latest UMKM businesses
  app.get("/api/umkm/latest", async (req, res) => {
    try {
      const businesses = await storage.getLatestUmkmBusinesses();
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest UMKM businesses" });
    }
  });

  // Get specific UMKM business by ID
  app.get("/api/umkm/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid business ID" });
      }
      
      const business = await storage.getUmkmBusinessById(id);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      res.json(business);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business" });
    }
  });

  // Toggle bookmark for a business (simplified without authentication for now)
  app.post("/api/bookmarks/toggle", async (req, res) => {
    try {
      const { userId, businessId } = req.body;
      
      if (!userId || !businessId) {
        return res.status(400).json({ message: "User ID and Business ID are required" });
      }
      
      const isBookmarked = await storage.toggleBookmark(userId, businessId);
      res.json({ bookmarked: isBookmarked });
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle bookmark" });
    }
  });

  // Get user bookmarks
  app.get("/api/bookmarks/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const bookmarks = await storage.getUserBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  // Get reviews for a business
  app.get("/api/reviews/:businessId", async (req, res) => {
    try {
      const businessId = parseInt(req.params.businessId);
      if (isNaN(businessId)) {
        return res.status(400).json({ message: "Invalid business ID" });
      }
      
      // Mock reviews data - in real app this would fetch from database
      const mockReviews = [
        {
          id: 1,
          userName: "Ahmad",
          userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          rating: 5,
          comment: "Produk sangat memuaskan, kualitas bagus, packaging rapi dan pengiriman cepat. Sangat recommended!",
          date: "2024-01-15"
        },
        {
          id: 2,
          userName: "Siti",
          userImage: "https://images.unsplash.com/photo-1494790108755-2616b332c2cb?w=100&h=100&fit=crop&crop=face",
          rating: 4,
          comment: "Batik motif tradisional yang sangat cantik. Kualitas kain bagus dan nyaman dipakai.",
          date: "2024-01-10"
        },
        {
          id: 3,
          userName: "Budi",
          userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          rating: 5,
          comment: "Pelayanan ramah, harga terjangkau dan kualitas produk bagus. Terima kasih!",
          date: "2024-01-08"
        },
        {
          id: 4,
          userName: "Maya",
          userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          rating: 4,
          comment: "Designnya unik dan berkualitas. Sangat puas dengan pembelian ini.",
          date: "2024-01-05"
        }
      ];
      
      res.json(mockReviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Add a new review
  app.post("/api/reviews", async (req, res) => {
    try {
      const { businessId, rating, comment, userName } = req.body;
      
      if (!businessId || !rating || !comment || !userName) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Mock response - in real app this would save to database
      const newReview = {
        id: Date.now(),
        userName,
        rating,
        comment,
        date: new Date().toISOString().split('T')[0]
      };
      
      res.json(newReview);
    } catch (error) {
      res.status(500).json({ message: "Failed to add review" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
