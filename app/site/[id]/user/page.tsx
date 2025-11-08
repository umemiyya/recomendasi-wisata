'use client';

import { use, useEffect, useState } from "react";
import { formatter } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants, Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, MapPin } from "lucide-react";
import Link from "next/link";
import { DestinationCard } from "./components/card-rekomendation";
// import { DestinationCard } from "@/app/admin/destination/components/destination-card";

export default function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const supabase = createClient();

  const [data, setData] = useState<any[]>([]);
  const [visited, setVisited] = useState<any[]>([]);
  const [rating, setRating] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 🆕 Tambahan state rekomendasi
  const [recommendations, setRecommendations] = useState<any>({
    user: null,
    recommendations: [],
  });

  // 🔄 Ambil data rekomendasi wisata
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`/api/recommendations?userId=${id}`);
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error("Gagal memuat rekomendasi:", error);
      }
    };

    if (id) fetchRecommendations();
  }, [id]);

  // 🔄 Ambil data user
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/users`);
      const data = await response.json();

      if (response.ok) {
        const newData = formatter(data as any[]);
        const filteredUser = newData.filter((item) => item.user.id === parseInt(id));
        setData(filteredUser);
      } else {
        console.error("Gagal mengambil data user:", data);
      }
    };

    fetchData();
  }, [id]);

  // 🔄 Ambil daftar wisata yang dikunjungi
  useEffect(() => {
    const fetchVisited = async () => {
      try {
        const { data: kunjunganRows, error: kunjunganError } = await supabase
          .from("kunjungan")
          .select("id, user_id, wisata_id, kunjungan")
          .eq("user_id", parseInt(id));

        if (kunjunganError) {
          console.error("Gagal memuat data kunjungan:", kunjunganError);
          setVisited([]);
          return;
        }

        if (!kunjunganRows || kunjunganRows.length === 0) {
          setVisited([]);
          return;
        }

        const wisataIds = kunjunganRows.map((k: any) => k.wisata_id).filter(Boolean);

        const { data: wisataRows, error: wisataError } = await supabase
          .from("wisata")
          .select("*")
          .in("id", wisataIds);

        if (wisataError) {
          console.error("Gagal memuat data wisata:", wisataError);
          setVisited([]);
          return;
        }

        const visitedCombined = kunjunganRows.map((k: any) => {
          const matched = (wisataRows || []).find(
            (w: any) => Number(w.id) === Number(k.wisata_id)
          );
          return {
            kunjungan_id: k.id,
            wisata_id: k.wisata_id,
            kunjungan: k.kunjungan,
            wisata: matched || null,
          };
        });

        setVisited(visitedCombined);
      } catch (err) {
        console.error("Error saat memuat kunjungan + wisata:", err);
        setVisited([]);
      }
    };

    if (id) fetchVisited();
  }, [id, supabase]);

  // ⭐ Handle Rating
  async function handleRating(destinationId: string, starValue: number) {
    setRating((prev) => ({ ...prev, [destinationId]: starValue }));
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/already-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationId,
          userId: id,
          rating: starValue,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setMessage("⭐ Rating berhasil dikirim!");
      } else {
        setMessage("❌ Gagal mengirim rating.");
      }
    } catch (err) {
      console.error("Error posting rating:", err);
      setMessage("⚠️ Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }

  // 🗑️ Hapus user
  const handleDelete = async (userId: string) => {
    const confirmDelete = confirm("Apakah kamu yakin ingin menghapus user ini?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("users").delete().eq("id", userId);
    if (error) {
      alert("Gagal menghapus user!");
    } else {
      alert("User berhasil dihapus!");
      setData((prev) => prev.filter((item) => item.user.id !== userId));
    }
  };

  if (data.length === 0) {
    return (
      <p className="text-center text-muted-foreground mt-6">
        Memuat data user...
      </p>
    );
  }

  const userData = data[0];
  const user = userData.user;
  const rated_destinations = userData.rated_destinations || [];

  return (
    <Card className="w-full border-orange-200 bg-orange-50/50 shadow-none overflow-hidden">
      <CardHeader className="relative pb-2">
        <div className={`flex items-start gap-4 ${user.coverImage ? "-mt-12" : ""}`}>
          <Avatar
            className={`h-14 w-14 border-4 border-background ${user.coverImage ? "relative z-10" : ""}`}
          >
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-xl bg-orange-50">
              {user.name?.split(" ").map((n: string) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 pt-2">
            <div className="flex items-start justify-between">
              <h2 className="text-md pt-1 font-semibold">{user.name}</h2>
              <Link
                href={`/site/${user.id}/form`}
                className={`${buttonVariants({ size: "sm", variant: "outline" })} shadow-none`}
              >
                Form Rekomendasi
              </Link>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-muted-foreground text-sm capitalize">
          {user.gender === "L" ? "Laki-laki" : "Perempuan"}, {user.age}
        </p>

        {user.bio && <p className="text-pretty text-sm">{user.bio}</p>}

        {/* Preferensi */}
        <div className="space-y-3">
          <h4 className="font-semibold">Preferensi</h4>
          <div className="flex flex-wrap text-sm gap-2">
            {user.preferences?.split(",").map((pref: string, index: number) => (
              <Badge key={index} className="font-semibold bg-orange-100" variant="secondary">
                {pref}
              </Badge>
            ))}
          </div>
        </div>

        {/* Rating Wisata */}
        <div>
          <h2 className="font-semibold mb-2">Rating Wisata</h2>
          {rated_destinations.length === 0 ? (
            <p className="text-sm text-muted-foreground">User belum memberi rating</p>
          ) : (
            rated_destinations.map((destination: any) => (
              <div
                key={destination.id || destination.name}
                className="border-t border-orange-100 flex py-2 flex-col items-start gap-2"
              >
                <p className="text-sm">{destination.name}</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(destination.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {destination.location}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Wisata yang Telah Dikunjungi */}
        <div>
          <h2 className="font-semibold mb-2">Wisata yang Telah Dikunjungi</h2>
          {visited.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada data kunjungan.</p>
          ) : (
            visited.map((item, index) => (
              <div key={index} className="border-t border-orange-100 py-3 flex flex-col gap-2">
                <p className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-orange-500" />
                  {item.wisata?.name || "Nama wisata tidak tersedia"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.wisata?.location || "Lokasi tidak diketahui"}
                </p>
                <p className="text-xs text-orange-600 font-semibold">
                  Jumlah kunjungan: {item.kunjungan}
                </p>
                {/* ⭐ Rating wisata */}
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => {
                    const starValue = i + 1;
                    return (
                      <Star
                        key={i}
                        onClick={() =>
                          !submitting && handleRating(item.wisata_id, starValue)
                        }
                        className={`h-5 w-5 cursor-pointer transition ${
                          starValue <= (rating[item.wisata_id] || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            ))
          )}
          {message && <p className="mt-2 text-sm text-orange-600">{message}</p>}
        </div>

        {/* 🟢 Rekomendasi Wisata */}
        <div className="pt-4 border-t border-orange-100">
          <h2 className="font-semibold text-lg mb-3">Rekomendasi Wisata</h2>
          {recommendations.recommendations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Tidak ada rekomendasi tersedia.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {recommendations.recommendations.map((rec: any, index: number) => (
                <DestinationCard key={index} {...rec} />
              ))}
            </div>
          )}
        </div>

        {/* Hapus User */}
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDelete(user.id)}
          className="flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> Hapus User
        </Button>
      </CardContent>
    </Card>
  );
}
