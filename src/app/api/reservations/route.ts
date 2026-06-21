import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const reservations = await db.getReservations();
    // Sort by booking date and time descending (newest first)
    const sorted = [...reservations].sort((a, b) => {
      return new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime();
    });
    return NextResponse.json(sorted);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation
    if (!body.customerName || !body.customerEmail || !body.customerPhone || !body.date || !body.time || !body.guests) {
      return NextResponse.json({ error: 'Missing required reservation fields' }, { status: 400 });
    }

    const newReservation = await db.addReservation({
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      date: body.date,
      time: body.time,
      guests: Number(body.guests),
      specialRequests: body.specialRequests || '',
    });

    return NextResponse.json(newReservation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}
