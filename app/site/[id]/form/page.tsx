'use client'
import { use, useEffect, useState } from 'react';
import { Phone, Star } from 'lucide-react';
import type React from "react"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';

interface FormData {
  name: string
  age: string
  gender: string
  preferences: string[]
  bio: string
}

const preferenceOptions = [
  {
    id: "budaya", label: "Budaya", subCategories: [
      { id: "religi", label: "Religi" },
      { id: "museum", label: "Museum" },
    ]
  },
  {
    id: "alam", label: "Alam", subCategories: [
      { id: "pantai", label: "Pantai" },
      { id: "gunung", label: "Gunung" },
      { id: "hutan", label: "Hutan" },
      { id: "air terjun", label: "Air Terjun" },
      { id: "goa", label: "Goa" },
      { id: "permandian", label: "Permandian" },
    ]
  },
]

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [ratings, setRatings] = useState<any[]>([]);
  const [allRatings, setAllRatings] = useState<any[]>([]);
  const [, setRecommendations] = useState<any>({ user: null, recommendations: [] });
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    gender: "",
    preferences: [],
    bio: "",
  })
  const [preferences, setPreferences] = useState<string[]>([])
  const [, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false); // ⬅️ NEW toggle view

  const handlePreferenceChange = (preferenceId: string, checked: boolean) => {
    setPreferences((prev) => {
      if (checked) return [...prev, preferenceId]
      else return prev.filter((id) => id !== preferenceId)
    })
    setFormData((prev) => ({
      ...prev,
      preferences: checked
        ? [...prev.preferences, preferenceId]
        : prev.preferences.filter((id) => id !== preferenceId),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulasi ambil rekomendasi (bisa disesuaikan API)
    const res = await fetch(`/api/recommendations?userId=${id}`);
    const data = await res.json();

    setResults(data.recommendations || []);
    setLoading(false);
    setShowResults(true); // ⬅️ tampilkan hasil
  };

  const handleBack = () => {
    setShowResults(false); // ⬅️ kembali ke form
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/recommendations?userId=${id}`);
      const data = await response.json();
      setRecommendations(data);

      const responseRatings = await fetch(`/api/already-rating`);
      const dataRatings = await responseRatings.json();
      const formatted = dataRatings.map((d: any) => ({
        ...d,
        destinationId: d.id,
        rating: d.rating,
        name: d.name,
        location: d.location,
        type: d.type.split(',').map((t: string) => t.trim()),
        tariff: d.tariff,
        ratings: d.ratings,
        average_rating: d.average_rating,
        total_rating: d.total_rating,
      }));
      setRatings(formatted);
      setAllRatings(formatted);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    let filtered = allRatings;
    if (preferences.length > 0) {
      filtered = filtered.filter((r: any) =>
        r.type.some((t: string) => preferences.includes(t.toLowerCase()))
      );
    }
    setRatings(filtered);
  }, [preferences, allRatings]);

  return (
    <div className="text-sm">
      <div className="max-w-4xl m-auto">
        <Card className="w-full border-orange-200 bg-orange-50/50">
          <CardHeader className="border-b border-orange-100">
            <CardTitle>Form Rekomendasi</CardTitle>
            <CardDescription className='flex justify-between items-start'>
              <div>
              Lengkapi informasi preferensi untuk menampilkan hasil rekomendasi!
              </div>
              <div>
                <Link className={buttonVariants({variant: 'default', className: 'bg-orange-400 hover:bg-orange-700'})} href={`/site/${id}/user`}>
                Menu User
                </Link>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>

            {/* ========== FORM SECTION ========== */}
            {!showResults && (
              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div className="space-y-3">
                  <Label>Preferences</Label>
                  {preferenceOptions.map((category) => (
                    <div
                      key={category.id}
                      className="border border-orange-100 rounded-xl p-3 bg-white/60"
                    >
                      <h4 className="font-semibold text-orange-700 mb-2">
                        {category.label}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 pl-2">
                        {category.subCategories.map((sub) => (
                          <div key={sub.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={sub.id}
                              checked={formData.preferences.includes(sub.id)}
                              onCheckedChange={(checked) =>
                                handlePreferenceChange(sub.id, checked as boolean)
                              }
                            />
                            <Label
                              htmlFor={sub.id}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {sub.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={loading}
                >
                  {loading ? "Memproses..." : "Proses"}
                </Button>
              </form>
            )}

            {/* ========== RESULT SECTION ========== */}
            {showResults && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">✨ Rekomendasi Wisata</h3>
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="border-orange-300 text-orange-700"
                  >
                    ← Kembali
                  </Button>
                </div>

                {loading ? (
                  <p className="text-center text-muted-foreground">Sedang memuat...</p>
                ) : ratings.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    Tidak ada hasil yang sesuai preferensi.
                  </p>
                ) : (
                  <div className="max-w-5xl mx-auto mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {ratings
                      .sort((a: any, b: any) => b.average_rating - a.average_rating)
                      .map((destination: any) => (
                        <Link
                          key={destination.destinationId}
                          href={`/site/${id}/form/${destination.destinationId}`}
                        >
                          <Card className="w-full border border-orange-100 bg-white shadow-sm hover:shadow-md transition">
                            {destination.image && (
                              <img
                                src={destination.image}
                                alt={destination.name}
                                className="w-full h-48 object-cover rounded-t-md"
                              />
                            )}
                            <CardHeader className="pb-2">
                              <h2 className="text-lg font-semibold text-gray-800">
                                {destination.name}
                              </h2>
                              <p className="text-sm text-gray-500">
                                {destination.address}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-gray-700">
                                  {destination.average_rating?.toFixed(1)} (
                                  {destination.total_rating})
                                </span>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-gray-700">
                              <div className="flex flex-wrap gap-2 text-xs">
                                <Badge
                                  variant="outline"
                                  className="text-orange-600 border-orange-200"
                                >
                                  {destination.type || "Tidak diketahui"}
                                </Badge>
                                <span className="font-medium text-green-600">
                                  Rp{" "}
                                  {destination.tariff === "N/a"
                                    ? "-"
                                    : destination.tariff}
                                </span>
                              </div>
                              {destination.fasility && (
                                <div>
                                  <span className="font-medium text-gray-800">
                                    Fasilitas:
                                  </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {destination.fasility
                                      .split(",")
                                      .map((f: string, i: number) => (
                                        <span
                                          key={i}
                                          className="bg-orange-50 border border-orange-100 rounded-full px-2 py-0.5 text-xs"
                                        >
                                          {f === "N/a"
                                            ? "Belum diidentifikasi"
                                            : f.trim()}
                                        </span>
                                      ))}
                                  </div>
                                </div>
                              )}

                              {/* ubah ini dalam bentuk ui  ex. "21 Mnt�(18,8 Km)"*/}
                              {destination.rute && (
                                <div className="items-center gap-2 text-sm text-gray-700 mt-1">
                                  <div>                                  
                                  <span className='text-orange-500'>{destination.rute.split('�')[1].split('Km')[0]} Km) Dari pusat kota Barru</span>   
                                  </div>
                                  <div>
                                  <span className='text-orange-500'>Waktu tempuh {destination.rute.split('�')[0].split('Mnt')[0]} menit</span>
                                  </div>
                                </div>
                              )}

                              {destination.unique && (
                                <p>
                                  <span className="font-medium text-gray-800">
                                    Keunikan:
                                  </span>{" "}
                                  {destination.unique}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span>
                                  {destination.phone === "0"
                                    ? "No Phone"
                                    : destination.phone}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  )
} 