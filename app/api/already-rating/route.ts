import { createClient } from "@/lib/supabase/client";
import { formatter } from "@/lib/utils";
import { NextResponse } from "next/server";

const supabase = createClient();

export async function GET() {
  const { data : uniqe, error } = await supabase
    .from('rating')   // ganti dengan nama tabel kamu
    .select('destination_id')

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if(uniqe) {
    const { data, error} = await supabase
      .from('wisata') // ganti dengan nama tabel kamu
      .select('*')
      .in('id', uniqe.map((item) => item.destination_id)); // ambil destinasi berdasarkan destination_id dari tabel rating
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return NextResponse.json(formatter(data));
  }
  return NextResponse.json([]);
}

export async function POST(req: Request) {
  try {
    const { destinationId, rating, userId } = await req.json();

    if (!destinationId || rating === undefined || !userId) {
      return NextResponse.json(
        { error: "destinationId, rating, and userId are required" },
        { status: 400 }
      );
    }

    // Update kalau sudah ada, kalau belum insert baru
    const { data, error } = await supabase
      .from("rating")
      .upsert(
        {
          user_id: userId,
          destination_id: destinationId,
          rating: rating,
        },
        { onConflict: "user_id, destination_id" } // supaya tidak duplikat
      )
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Error updating rating:", err.message);
    return NextResponse.json(
      { error: "Failed to update rating" },
      { status: 500 }
    );
  }
}