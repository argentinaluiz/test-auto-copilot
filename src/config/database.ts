import { PrismaClient } from '@prisma/client';

/**
 * Database interface for dependency injection
 * Following Clean Architecture - depend on abstractions
 */
export interface IDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): Promise<boolean>;
  getClient(): PrismaClient;
}

/**
 * Prisma Database implementation
 * Singleton pattern to ensure single instance
 */
class Database implements IDatabase {
  private static instance: Database;
  private prisma: PrismaClient;
  private connected: boolean = false;

  private constructor() {
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      this.connected = true;
      console.log('✅ Database connected successfully');
    } catch (error) {
      this.connected = false;
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      this.connected = false;
      console.log('✅ Database disconnected successfully');
    } catch (error) {
      console.error('❌ Database disconnection failed:', error);
      throw error;
    }
  }

  public async isConnected(): Promise<boolean> {
    if (!this.connected) {
      return false;
    }
    
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.connected = false;
      return false;
    }
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }
}

// Export singleton instance
export const database = Database.getInstance();

// Export PrismaClient for direct use in repositories
export const prisma = database.getClient();
