// ======================
// Algoritma CF
// ======================

// Hitung cosine similarity antar destinasi
function cosineSimilarity(itemA:any, itemB:any, ratings:any[]) {
  const usersA = ratings.filter(r => r.destination_id === itemA);
  const usersB = ratings.filter(r => r.destination_id === itemB);

  const commonUsers = usersA
    .map(r => r.user_id)
    .filter(u => usersB.some(r => r.user_id === u));

  if (commonUsers.length === 0) return 0;

  let dot = 0, normA = 0, normB = 0;
  commonUsers.forEach(user => {
    const ratingAObj = usersA.find(r => r.user_id === user);
    const ratingBObj = usersB.find(r => r.user_id === user);
    if (ratingAObj && ratingBObj) {
      const ratingA = ratingAObj.rating;
      const ratingB = ratingBObj.rating;
      dot += ratingA * ratingB;
      normA += ratingA ** 2;
      normB += ratingB ** 2;
    }
  });

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Rekomendasi untuk user tertentu
function recommendForUser(userId:any, ratings:any[], destinations:any[]) {
  const userRatings = ratings.filter(r => r.user_id === parseInt(userId));
  const allItems = [...new Set(ratings.map(r => r.destination_id))];
  const notRated = allItems.filter(
    item => !userRatings.some(r => r.destination_id === item)
  );

  const recommendations = notRated.map(item => {
    let numerator = 0;
    let denominator = 0;
    userRatings.forEach(r => {
      const sim = cosineSimilarity(item, r.destination_id, ratings);
      numerator += sim * r.rating;
      denominator += Math.abs(sim);
    });
    const score = denominator === 0 ? 0 : numerator / denominator;
  
    return {
      item: destinations.find(d => d.id === item)?.name || "Unknown",
      name: destinations.find(d => d.id === item)?.name || "Unknown",
      location: destinations.find(d => d.id === item)?.address || null,
      owner: destinations.find(d => d.id === item)?.owner || null,
      type: destinations.find(d => d.id === item)?.type || null,
      address: destinations.find(d => d.id === item)?.address || null,
      phone: destinations.find(d => d.id === item)?.phone || null,
      accesebility: destinations.find(d => d.id === item)?.accesebility || null,
      fasility: destinations.find(d => d.id === item)?.fasility || null,
      unique: destinations.find(d => d.id === item)?.unique || null,
      tariff: destinations.find(d => d.id === item)?.tariff || null,
      image: destinations.find(d => d.id === item)?.image || null,
      score: score.toFixed(2)
    };
  });

  return recommendations.sort((a:any, b:any) => b.score - a.score);
}

import { createClient } from '@/lib/supabase/client';
import { formatter } from '@/lib/utils';
// ======================
// API Handler
// ======================
import { type NextRequest } from 'next/server'

const supabase = createClient();
 
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  // userId is "1" for /api/recommendations?userId=1

  // fetch user from supabase
  const { data: users, error } = await supabase.from('users').select('*');
  if (error) {
    return new Response(JSON.stringify({ error: "Error fetching user data" }), { status: 500 });
  }

  // fetch ratings from supabase
  const { data: ratingsData, error: ratingsError } = await supabase.from('rating').select('*');
  if (ratingsError) {
    return new Response(JSON.stringify({ error: "Error fetching ratings data" }), { status: 500 });
  }

  // fetch destinations from supabase
  const { data: destinationsData, error: destinationsError } = await supabase.from('wisata').select('*');
  if (destinationsError) {
    return new Response(JSON.stringify({ error: "Error fetching destinations data" }), { status: 500 });
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "Masukkan userId" }), { status: 400 });
  }

  const user = users.find(u => u.id === parseInt(userId));
  if (!user) {
    return new Response(JSON.stringify({ error: "User tidak ditemukan" }), { status: 404 });
  }

  const rated_destinations = ratingsData.filter(r => r.user_id === parseInt(userId));
  if (rated_destinations.length === 0) {
    return new Response(JSON.stringify({ message: "User belum memberi rating" }), { status: 200 });
  }

  // find the rated destination details
  const result_rated = rated_destinations.map(r => {
    const destination = destinationsData.find(d => d.id === r.destination_id);
    return {
      id: r.destination_id,
      name: destination?.name ?? "Unknown",
      rating: r.rating,
      location: destination?.address ?? null,
    };
  }); 

  // detail destination + rekomendasi berdasarkan userId


  const result = recommendForUser(userId, ratingsData || [], destinationsData || []);
  return new Response(JSON.stringify({
    user: formatter([user])[0],
    recommendations: formatter(result),
    rated_destinations: formatter(result_rated),
  }));
}
