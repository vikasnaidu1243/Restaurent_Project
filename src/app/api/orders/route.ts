import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const orders = await db.getOrders();
    // Sort newest first
    const sorted = [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json(sorted);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic Validation
    if (!body.customerName || !body.customerEmail || !body.customerPhone || !body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Missing required customer or items details' }, { status: 400 });
    }

    const newOrder = await db.addOrder({
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      address: body.address || '',
      type: body.type || 'pickup',
      items: body.items,
      totalAmount: Number(body.totalAmount),
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
