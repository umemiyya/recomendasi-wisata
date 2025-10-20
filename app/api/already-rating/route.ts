import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

const supabase = createClient();

export function toTitleCaseValues(obj: Record<string, any>) {
  const toTitleCase = (str: string) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) =>
        word.length > 0
          ? word.charAt(0).toUpperCase() + word.slice(1)
          : ""
      )
      .join(" ")

  const newObj: Record<string, any> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key]

      // Lewati key "image" dan "maps"
      if (key === "image" || key === "maps") {
        newObj[key] = val
        continue
      }

      if (typeof val === "string") {
        newObj[key] = toTitleCase(val)
      } else if (Array.isArray(val)) {
        newObj[key] = val.map((item) =>
          typeof item === "string" ? toTitleCase(item) : item
        )
      } else if (typeof val === "object" && val !== null) {
        newObj[key] = toTitleCaseValues(val)
      } else {
        newObj[key] = val
      }
    }
  }
  return newObj
}

export async function GET() {
  // Ambil semua data rating
  const { data: ratingData, error: ratingError } = await supabase
    .from("rating") // tabel rating
    .select("destination_id, rating"); // ambil juga kolom rating

  if (ratingError) {
    return new Response(JSON.stringify({ error: ratingError.message }), { status: 500 });
  }

  if (ratingData && ratingData.length > 0) {
    // Ambil semua id destinasi unik dari tabel rating
    const destinationIds = [...new Set(ratingData.map((r) => r.destination_id))];

    // Ambil data wisata berdasarkan id dari rating
    const { data: wisataData, error: wisataError } = await supabase
      .from("wisata") // tabel wisata
      .select("*")
      .in("id", destinationIds);

    if (wisataError) {
      return new Response(JSON.stringify({ error: wisataError.message }), { status: 500 });
    }

    // Gabungkan data wisata dengan rating
    const combinedData = wisataData.map((wisata) => {
      const ratingsForThis = ratingData.filter((r) => r.destination_id === wisata.id);
      const ratings = ratingsForThis.map((r) => r.rating);
      const total_rating = ratings.length;
      const average_rating =
        total_rating > 0
          ? ratings.reduce((sum, val) => sum + val, 0) / total_rating
          : 0;

      return{
        ...wisata,
        ratings,
        average_rating,
        total_rating,
      };
    });

    return NextResponse.json(toTitleCaseValues(combinedData));
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

    // Generate ID unik antara 100–500
    const uniqueId = Math.floor(Math.random() * (500 - 101 + 1)) + 100;

    // Cek apakah user sudah pernah memberikan rating untuk destinasi ini
    const { data: existing, error: selectError } = await supabase
      .from("rating")
      .select("*")
      .eq("user_id", userId)
      .eq("destination_id", destinationId)
      .maybeSingle();

    if (selectError && selectError.code !== "PGRST116") throw selectError;

    let data;

    if (existing) {
      // 🔁 Update rating jika sudah pernah memberikan
      const { data: updated, error: updateError } = await supabase
        .from("rating")
        .update({ rating })
        .eq("user_id", userId)
        .eq("destination_id", destinationId)
        .select();

      if (updateError) throw updateError;
      data = updated;
    } else {
      // 🆕 Insert baru dengan ID acak
      const { data: inserted, error: insertError } = await supabase
        .from("rating")
        .insert([
          {
            id: uniqueId,
            user_id: userId,
            destination_id: destinationId,
            rating,
          },
        ])
        .select();

      if (insertError) throw insertError;
      data = inserted;
    }

    return NextResponse.json({
      success: true,
      message: existing
        ? "Rating berhasil diperbarui!"
        : "Rating berhasil ditambahkan!",
      data,
    });
  } catch (err: any) {
    console.error("Error updating rating:", err.message);
    return NextResponse.json(
      { error: "Failed to update rating" },
      { status: 500 }
    );
  }
}
