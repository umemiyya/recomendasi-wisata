import { createClient } from "@/lib/supabase/client";
import { formatter } from "@/lib/utils";


const supabase = createClient();

export async function GET() {
  // fetch semua user
  const { data: users, error: userError } = await supabase.from("users").select("*");
  if (userError) {
    return new Response(JSON.stringify({ error: "Error fetching user data" }), { status: 500 });
  }

  // fetch semua rating
  const { data: ratingsData, error: ratingsError } = await supabase.from("rating").select("*");
  if (ratingsError) {
    return new Response(JSON.stringify({ error: "Error fetching ratings data" }), { status: 500 });
  }

  // fetch semua destinasi
  const { data: destinationsData, error: destinationsError } = await supabase.from("wisata").select("*");
  if (destinationsError) {
    return new Response(JSON.stringify({ error: "Error fetching destinations data" }), { status: 500 });
  }

  // gabungkan user + rating + destinasi
  const result = users.map((user) => {
    const userRatings = ratingsData.filter((r) => r.user_id === user.id);

    const ratedDestinations = userRatings.map((r) => {
      const destination = destinationsData.find((d) => d.id === r.destination_id);
      return {
        id: destination?.id ?? r.destination_id,
        name: destination?.name ?? "Unknown",
        location: destination?.address ?? null,
        rating: r.rating,
      };
    });

    return {
      user: formatter([user])[0],
      rated_destinations: formatter(ratedDestinations),
    };
  });

  return new Response(JSON.stringify(result), { status: 200 });
}
