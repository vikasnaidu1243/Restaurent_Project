import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const body = await request.json();

    if (!body.status) {
      return NextResponse.json({ error: 'Missing status field' }, { status: 400 });
    }

    const updated = await db.updateReservationStatus(decodedId, body.status);
    if (!updated) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update reservation status' }, { status: 500 });
  }
}
