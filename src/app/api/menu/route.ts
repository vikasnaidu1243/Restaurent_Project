import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { seedIfNeeded } from '@/lib/seed';

export async function GET() {
  try {
    await seedIfNeeded();
    const menu = await db.getMenu();
    return NextResponse.json(menu);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simple validation
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newItem = await db.addMenuItem({
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      category: body.category,
      image: body.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      tags: body.tags || [],
      available: body.available !== undefined ? body.available : true,
    });
    
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add menu item' }, { status: 500 });
  }
}
