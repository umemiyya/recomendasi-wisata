'use client'
import { use, useEffect, useState } from 'react';

import { Star } from 'lucide-react';

import type React from "react"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Checkbox } from "@/components/ui/checkbox"
import Link from 'next/link';



interface FormData {
  name: string
  age: string
  gender: string
  preferences: string[]
  bio: string
}

const preferenceOptions = [
  { id: "kuliner", label: "Kuliner" },
  { id: "budaya", label: "Budaya" },
  { id: "pantai", label: "Pantai" },
  { id: "religi", label: "Religi" },
  { id: "alam", label: "Alam" },
  { id: "museum", label: "Museum" },
  { id: "gunung", label: "Gunung" },
  { id: "air terjun", label: "Air Terjun" },
]


export default function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [ratings, setRatings] = useState<any>([{
    destinationId: '',
    rating: 0,
    name: '',
    location: '',
    type: [],
    tariff: '',
  }]);

  const [allRatings, setAllRatings] = useState<any>([{
    destinationId: '',
    rating: 0,
    name: '',
    location: '',
    type: [],
    tariff: '',
    ratings: [],
    average_rating: 0,
    total_rating: 0,
  }]);

  const [recommendations, setRecommendations] = useState<any>({
    user: null,
    recommendations: [],
  });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    gender: "",
    preferences: [],
    bio: "",
  })

  const [preferences, setPreferences] = useState<string[]>([])

  const [selectedTariff, setSelectedTariff] = useState<string>(""); // 🟧 filter by tariff

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);



// const handleRatingChange = (destinationId: string, rating: number) => {
//   setRatings((prevRatings: any[]) =>
//     prevRatings.map((destination) =>
//       destination.destinationId === destinationId
//         ? { ...destination, rating } // hanya update yang cocok
//         : destination
//     )
//   )
// }


  const handlePreferenceChange = (preferenceId: string, checked: boolean) => {
    setPreferences((prev) => {
      if (checked) {
        return [...prev, preferenceId]
      } else {
        return prev.filter((id) => id !== preferenceId)
      }
    })
    setFormData((prev) => ({
      ...prev,
      preferences: checked ? [...prev.preferences, preferenceId] : prev.preferences.filter((id) => id !== preferenceId),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  // Ambil hanya rating yang diisi
  const dataRate = ratings
    .filter((r: any) => r.rating > 0)
    .map((r: any) => ({
      id: Math.floor(Math.random() * (1000 - 7 + 1)) + 7,
      destination_id: r.destinationId,
      rating: r.rating,
      user_id: parseInt(id, 10),
    }));

  if (dataRate.length === 0) {
    console.log("Belum ada rating yang diberikan.");
    setLoading(false);
    return;
  }

  console.log(recommendations)

  // 🚀 Ambil rekomendasi baru setelah rating dikirim
  const res = await fetch(`/api/recommendations?userId=${id}`);
  const data = await res.json();

  setResults(data.recommendations || []);
  setLoading(false);
};



  // fetch from api /api/recommendations?userId={id}
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/recommendations?userId=${id}`);
      const data = await response.json();
      setRecommendations(data);
      // kalau tidak ad user redirect ke halaman profile

      const responseRatings = await fetch(`/api/already-rating`);
      const dataRatings = await responseRatings.json();
      setRatings(dataRatings.map((d:any) => ({
        destinationId: d.id,  // samakan field
        rating: d.rating,
        name: d.name,
        location: d.location,
        type: d.type.split(',').map((t:string) => t.trim()),
        tariff: d.tariff,
        ratings: d.ratings,
        average_rating: d.average_rating,
        total_rating: d.total_rating,
      })));
      setAllRatings(dataRatings.map((d:any) => ({
        destinationId: d.id,  // samakan field
        rating: d.rating,
        name: d.name,
        location: d.location,
        type: d.type.split(',').map((t:string) => t.trim()),
        tariff: d.tariff,
        ratings: d.ratings,
        average_rating: d.average_rating,
        total_rating: d.total_rating,
      })));
    };
    fetchData();
  }, [id]);

useEffect(() => {
  let filtered = allRatings;

  // 🟧 Filter berdasarkan preferences (type)
  if (preferences.length > 0) {
    filtered = filtered.filter((r: any) =>
      r.type.some((t: string) => preferences.includes(t.toLowerCase()))
    );
  }

  // 🟧 Filter berdasarkan tarif
  if (selectedTariff) {
    const max = parseInt(selectedTariff, 10);
    let min = 0;

    if (max === 50000) min = 0;
    else if (max === 100000) min = 50000;
    else if (max === 500000) min = 100000;
    else if (max === 10000000) min = 500000;

    filtered = filtered.filter((r: any) => {
      const tariffNum = parseInt(r.tariff, 10);
      return tariffNum >= min && tariffNum <= max;
    });
  }

  setRatings(filtered);
}, [preferences, selectedTariff, allRatings]);

  return (
    <div className='text-sm'>
    <div className='max-w-4xl m-auto'>
    <Card className="w-full border-orange-200 bg-orange-50/50">
      <CardHeader className='border-b border-orange-100'>
        <CardTitle>Form Rekomendasi</CardTitle>
        <CardDescription>
          Lengkapi informasi preferensi dan berikan rating untuk menampilkan hasil rekomendasi!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Preferences Field */}
          <div className="space-y-3">
            <Label>Preferences</Label>
            <div className="grid grid-cols-2 gap-3">
              {preferenceOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={formData.preferences.includes(option.id)}
                    onCheckedChange={(checked) => handlePreferenceChange(option.id, checked as boolean)}
                  />
                  <Label htmlFor={option.id} className="text-sm font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Tariff*</Label>
            <Select value={selectedTariff} onValueChange={(value) => setSelectedTariff(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih tarif" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50000"> {"0 - 50.000"} </SelectItem>
                <SelectItem value="100000"> {"50.000 - 100.000"} </SelectItem>
                <SelectItem value="500000"> {"100.000 - 500.000"} </SelectItem>
                <SelectItem value="10000000"> {"> 500.000"} </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
          <Label>Ratings*</Label>
          {ratings.length === 0 ? (
            <p className="text-sm text-muted-foreground">User belum memberi rating</p>
          ) : (
            // <div className='grid grid-cols-2 gap-4 max-h-60 overflow-y-auto mt-2'>
            //   {ratings.map((destination:any) => (
            //     <div key={destination.destinationId} className="border-t border-orange-100 flex py-2 flex-col items-start gap-2">
            //       <p className="text-sm">{destination.name}</p>
            //       <div className="flex items-center gap-1">
            //         {[...Array(5)].map((_, i) => {
            //           const starValue = i + 1
            //           return (
            //             <Star
            //               key={i}
            //               className={`h-4 w-4 cursor-pointer ${
            //                 starValue <= destination.rating
            //                   ? "fill-yellow-400 text-yellow-400"
            //                   : "text-gray-300"
            //               }`}
            //               onClick={() =>
            //                 handleRatingChange(destination.destinationId, starValue)
            //               }
            //             />
            //           )
            //         })}
            //       </div>

            //       <p className="text-sm text-muted-foreground">{destination.location}</p>
            //       {/* <span className="text-sm font-semibold">{user.rating.toFixed(1)}</span> */}
            //     </div>
            //   ))}
            // </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto mt-2">
              {ratings
                .sort((a: any, b: any) => b.average_rating - a.average_rating) // urutkan dari tertinggi ke terendah
                .map((destination: any) => (
                  <Link href={`/site/${id}/form/${destination.destinationId}`} key={destination.destinationId} className="no-underline">
                    <div
                      key={destination.destinationId}
                      className="border border-orange-100 bg-white rounded-2xl p-4 transition-all flex flex-col gap-3"
                    >
                      {/* Header */}
                      <div className="flex flex-col">
                        <h3 className="text-base font-semibold text-gray-800">
                          {destination.name || "Nama tidak tersedia"}
                        </h3>
                        <p className="text-sm text-gray-500">{destination.location || "-"}</p>
                      </div>

                      {/* Jenis wisata */}
                      {destination.type?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {destination.type.map((t: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full border border-orange-100"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Tarif */}
                      {destination.tariff && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="font-medium">Tarif:</span>
                          <span className="text-orange-600 font-semibold">{destination.tariff}</span>
                        </div>
                      )}

                      {/* Rating */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => {
                            const starValue = i + 1;
                            return (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  starValue <= Math.round(destination.average_rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            );
                          })}
                        </div>

                        <span className="text-xs text-gray-600">
                          {destination.average_rating?.toFixed(1)} dari{" "}
                          {destination.total_rating} rating
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>


          )}
          </div>

          {/* Submit Button */}
          {/* <Button type="submit" className="w-full bg-orange-300">
            Berikan Rekomendasi
          </Button> */}
        </form>
        {loading && (
  <p className="text-center text-sm text-muted-foreground mt-4">
    Sedang memuat rekomendasi...
  </p>
)}

{results.length > 0 && (
  <div className="mt-8 border-t pt-6">
    <h3 className="text-lg font-semibold mb-4">✨ Rekomendasi Wisata Untukmu</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((r: any, index: number) => (
        <Card key={index} className="border-orange-100 bg-white">
          <CardHeader>
            <CardTitle className="text-base">{r.name}</CardTitle>
            <CardDescription>{r.location}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Tarif: {r.tariff}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {r.type?.split(',').map((t: string, i: number) => (
                <span
                  key={i}
                  className="text-xs bg-orange-100 px-2 py-1 rounded-full text-orange-700"
                >
                  {t.trim()}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)}

    </CardContent>
    </Card>
    </div>
    </div>
  )
}