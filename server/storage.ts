import { umkmBusinesses, bookmarks, users, type UmkmBusiness, type InsertUmkmBusiness, type User, type InsertUser, type Bookmark, type InsertBookmark } from "@shared/schema";

export interface IStorage {
  // UMKM Business operations
  getUmkmBusinesses(category?: string, searchQuery?: string): Promise<UmkmBusiness[]>;
  getUmkmBusinessById(id: number): Promise<UmkmBusiness | undefined>;
  createUmkmBusiness(business: InsertUmkmBusiness): Promise<UmkmBusiness>;
  getPopularUmkmBusinesses(): Promise<UmkmBusiness[]>;
  getLatestUmkmBusinesses(): Promise<UmkmBusiness[]>;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Bookmark operations
  getUserBookmarks(userId: number): Promise<UmkmBusiness[]>;
  toggleBookmark(userId: number, businessId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private umkmBusinesses: Map<number, UmkmBusiness>;
  private users: Map<number, User>;
  private bookmarks: Map<number, Bookmark>;
  private currentUmkmId: number;
  private currentUserId: number;
  private currentBookmarkId: number;

  constructor() {
    this.umkmBusinesses = new Map();
    this.users = new Map();
    this.bookmarks = new Map();
    this.currentUmkmId = 1;
    this.currentUserId = 1;
    this.currentBookmarkId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleBusinesses: InsertUmkmBusiness[] = [
      {
        name: "Batik Keluarga",
        category: "fashion",
        description: "Batik tradisional dengan kualitas premium",
        rating: 4.7,
        reviewCount: 150,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featuredImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        status: "active",
        isNewlyJoined: false,
        location: "Yogyakarta",
        contact: "081234567890",
        isPopular: true,
      },
      {
        name: "Warung Sari Rasa",
        category: "makanan",
        description: "Masakan Indonesia autentik dengan cita rasa tradisional",
        rating: 4.9,
        reviewCount: 280,
        image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featuredImage: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        status: "active",
        isNewlyJoined: false,
        location: "Jakarta",
        contact: "081234567891",
        isPopular: true,
      },
      {
        name: "Butik Nusantara",
        category: "fashion",
        description: "Fashion modern dengan sentuhan tradisional Indonesia",
        rating: 4.6,
        reviewCount: 95,
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featuredImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        status: "active",
        isNewlyJoined: false,
        location: "Bandung",
        contact: "081234567892",
        isPopular: true,
      },
      {
        name: "Kerajinan Sekar Arum",
        category: "kerajinan",
        description: "Kerajinan tangan berkualitas dengan desain unik",
        rating: 4.9,
        reviewCount: 12,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featuredImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        status: "new",
        isNewlyJoined: true,
        location: "Solo",
        contact: "081234567893",
        isPopular: false,
      },
      {
        name: "Toko Kain Tradisional",
        category: "fashion",
        description: "Kain tradisional Indonesia dengan kualitas terbaik",
        rating: 4.5,
        reviewCount: 34,
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featuredImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        status: "new",
        isNewlyJoined: true,
        location: "Surabaya",
        contact: "081234567894",
        isPopular: false,
      },
      {
        name: "Salon Kecantikan Sari",
        category: "jasa",
        description: "Layanan kecantikan profesional dengan harga terjangkau",
        rating: 4.3,
        reviewCount: 67,
        image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featuredImage: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        status: "new",
        isNewlyJoined: true,
        location: "Medan",
        contact: "081234567895",
        isPopular: false,
      },
      {
        name: "Kedai Kopi Nusantara",
        category: "makanan",
        description: "Kopi specialty Indonesia dengan cita rasa premium",
        rating: 4.6,
        reviewCount: 89,
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featuredImage: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        status: "new",
        isNewlyJoined: true,
        location: "Bali",
        contact: "081234567896",
        isPopular: false,
      },
      {
        name: "Bengkel Kayu Pak Joko",
        category: "kerajinan",
        description: "Furnitur kayu custom dengan kualitas premium",
        rating: 4.8,
        reviewCount: 45,
        image: "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featuredImage: "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        status: "new",
        isNewlyJoined: true,
        location: "Semarang",
        contact: "081234567897",
        isPopular: false,
      },
    ];

    sampleBusinesses.forEach(business => {
      this.createUmkmBusiness(business);
    });
  }

  async getUmkmBusinesses(category?: string, searchQuery?: string): Promise<UmkmBusiness[]> {
    let businesses = Array.from(this.umkmBusinesses.values());
    
    if (category && category !== "semua") {
      businesses = businesses.filter(business => business.category === category);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      businesses = businesses.filter(business => 
        business.name.toLowerCase().includes(query) ||
        business.category.toLowerCase().includes(query) ||
        (business.description && business.description.toLowerCase().includes(query))
      );
    }
    
    return businesses.sort((a, b) => b.rating - a.rating);
  }

  async getUmkmBusinessById(id: number): Promise<UmkmBusiness | undefined> {
    return this.umkmBusinesses.get(id);
  }

  async createUmkmBusiness(insertBusiness: InsertUmkmBusiness): Promise<UmkmBusiness> {
    const id = this.currentUmkmId++;
    const business: UmkmBusiness = { ...insertBusiness, id };
    this.umkmBusinesses.set(id, business);
    return business;
  }

  async getPopularUmkmBusinesses(): Promise<UmkmBusiness[]> {
    return Array.from(this.umkmBusinesses.values())
      .filter(business => business.isPopular)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }

  async getLatestUmkmBusinesses(): Promise<UmkmBusiness[]> {
    return Array.from(this.umkmBusinesses.values())
      .filter(business => business.isNewlyJoined)
      .sort((a, b) => b.id - a.id)
      .slice(0, 10);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserBookmarks(userId: number): Promise<UmkmBusiness[]> {
    const userBookmarks = Array.from(this.bookmarks.values())
      .filter(bookmark => bookmark.userId === userId);
    
    const businesses: UmkmBusiness[] = [];
    for (const bookmark of userBookmarks) {
      const business = this.umkmBusinesses.get(bookmark.businessId!);
      if (business) {
        businesses.push(business);
      }
    }
    
    return businesses;
  }

  async toggleBookmark(userId: number, businessId: number): Promise<boolean> {
    const existingBookmark = Array.from(this.bookmarks.values())
      .find(bookmark => bookmark.userId === userId && bookmark.businessId === businessId);
    
    if (existingBookmark) {
      this.bookmarks.delete(existingBookmark.id);
      return false; // Removed bookmark
    } else {
      const id = this.currentBookmarkId++;
      const bookmark: Bookmark = { id, userId, businessId };
      this.bookmarks.set(id, bookmark);
      return true; // Added bookmark
    }
  }
}

export const storage = new MemStorage();
