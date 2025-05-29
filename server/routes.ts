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

  const httpServer = createServer(app);
  return httpServer;
}
