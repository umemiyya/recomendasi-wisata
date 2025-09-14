import { createClient } from "@/lib/supabase/client";
import { formatter } from "@/lib/utils";
import { NextRequest } from "next/server";

const supabase = createClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  // userId is "1" for /api/rating?userId=1

  // fetch user from supabase
  const { data: users, error } = await supabase.from("users").select("*");
  if (error) {
    return new Response(JSON.stringify({ error: "Error fetching user data" }), { status: 500 });
  }

  // fetch ratings from supabase
  const { data: ratingsData, error: ratingsError } = await supabase.from("rating").select("*");
  if (ratingsError) {
    return new Response(JSON.stringify({ error: "Error fetching ratings data" }), { status: 500 });
  }

  // fetch destinations from supabase
  const { data: destinationsData, error: destinationsError } = await supabase.from("wisata").select("*");
  if (destinationsError) {
    return new Response(JSON.stringify({ error: "Error fetching destinations data" }), { status: 500 });
  }

  // return list destinations rated by userId
  if (!userId) {
    return new Response(JSON.stringify({ error: "Masukkan userId" }), { status: 400 });
  }
  const user = users.find((u) => u.id === parseInt(userId));
  if (!user) {
    return new Response(JSON.stringify({ error: "User tidak ditemukan" }), { status: 404 });
  }

  // filter ratings by userId
  const userRatings = ratingsData.filter((r) => r.user_id === parseInt(userId));

  // gabungkan rating dengan data destinasi
  const ratedDestinations = userRatings.map((r) => {
    const destination = destinationsData.find((d) => d.id === r.destination_id);
    return {
      destination_id: r.destination_id,
      destination_name: destination ? destination.nama : "Unknown",
      rating: r.rating,
      ...destination,
    };
  });

  if (ratedDestinations.length === 0) {
    return new Response(JSON.stringify({ message: "User belum memberi rating" }), { status: 200 });
  }

  return new Response(
    JSON.stringify({
      user,
      rated_destinations: formatter(ratedDestinations),
    }),
    { status: 200 }
  );
}
