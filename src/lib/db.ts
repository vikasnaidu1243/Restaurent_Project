import fs from 'fs/promises';
import path from 'path';

// Define schemas
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizers' | 'mains' | 'desserts' | 'drinks' | 'specials';
  image: string;
  tags: string[];
  available: boolean;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string; // #ORD-XXXX
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address?: string;
  type: 'pickup' | 'delivery';
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
}

export interface Reservation {
  id: string; // #RES-XXXX
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const RESERVATIONS_FILE = path.join(DATA_DIR, 'reservations.json');

// Ensure directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Ignore if already exists
  }
}

// Generic file reader
async function readJsonFile<T>(filePath: string, defaultVal: T): Promise<T> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (err) {
    // If file doesn't exist, return default value
    await fs.writeFile(filePath, JSON.stringify(defaultVal, null, 2), 'utf-8');
    return defaultVal;
  }
}

// Generic file writer
async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Database helper functions
export const db = {
  // MENU OPERATIONS
  async getMenu(): Promise<MenuItem[]> {
    return readJsonFile<MenuItem[]>(MENU_FILE, []);
  },

  async saveMenu(menu: MenuItem[]): Promise<void> {
    await writeJsonFile(MENU_FILE, menu);
  },

  async addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const menu = await this.getMenu();
    const newItem: MenuItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
    };
    menu.push(newItem);
    await this.saveMenu(menu);
    return newItem;
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
    const menu = await this.getMenu();
    const index = menu.findIndex((item) => item.id === id);
    if (index === -1) return null;
    menu[index] = { ...menu[index], ...updates };
    await this.saveMenu(menu);
    return menu[index];
  },

  async deleteMenuItem(id: string): Promise<boolean> {
    const menu = await this.getMenu();
    const initialLen = menu.length;
    const filtered = menu.filter((item) => item.id !== id);
    if (filtered.length === initialLen) return false;
    await this.saveMenu(filtered);
    return true;
  },

  // ORDERS OPERATIONS
  async getOrders(): Promise<Order[]> {
    return readJsonFile<Order[]>(ORDERS_FILE, []);
  },

  async saveOrders(orders: Order[]): Promise<void> {
    await writeJsonFile(ORDERS_FILE, orders);
  },

  async getOrderById(id: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find((o) => o.id === id) || null;
  },

  async addOrder(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> {
    const orders = await this.getOrders();
    const shortId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: shortId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    await this.saveOrders(orders);
    return newOrder;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    const orders = await this.getOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return null;
    orders[index].status = status;
    await this.saveOrders(orders);
    return orders[index];
  },

  // RESERVATIONS OPERATIONS
  async getReservations(): Promise<Reservation[]> {
    return readJsonFile<Reservation[]>(RESERVATIONS_FILE, []);
  },

  async saveReservations(reservations: Reservation[]): Promise<void> {
    await writeJsonFile(RESERVATIONS_FILE, reservations);
  },

  async addReservation(resData: Omit<Reservation, 'id' | 'status' | 'createdAt'>): Promise<Reservation> {
    const reservations = await this.getReservations();
    const shortId = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation: Reservation = {
      ...resData,
      id: shortId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    reservations.push(newReservation);
    await this.saveReservations(reservations);
    return newReservation;
  },

  async updateReservationStatus(id: string, status: Reservation['status']): Promise<Reservation | null> {
    const reservations = await this.getReservations();
    const index = reservations.findIndex((r) => r.id === id);
    if (index === -1) return null;
    reservations[index].status = status;
    await this.saveReservations(reservations);
    return reservations[index];
  },
};
