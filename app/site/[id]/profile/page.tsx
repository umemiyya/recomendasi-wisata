'use client'
import { use, useEffect, useState } from 'react';


import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Star } from 'lucide-react';
import Link from 'next/link';

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from '@/lib/supabase/client';

import { redirect } from 'next/navigation';

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

const supabase = createClient();

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


const handleRatingChange = (destinationId: string, rating: number) => {
  setRatings((prevRatings: any[]) =>
    prevRatings.map((destination) =>
      destination.destinationId === destinationId
        ? { ...destination, rating } // hanya update yang cocok
        : destination
    )
  )
}


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
    e.preventDefault()

    // Basic validation
    if (!formData.name || !formData.age || !formData.gender) {
      console.log({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const userUpdate = {
      name: formData.name,
      age: parseInt(formData.age, 10),
      gender: formData.gender,
      preferences: formData.preferences.join(','), // convert array to comma-separated string
      bio: formData.bio,
    }
    
    const { error } = await supabase
      .from('users')
      .update(userUpdate)
      .eq('id', id)
      .select()
    
    const dataRate = ratings.map((r: any) => {
      // return rates yang diisi saja
      if(r.rating > 0) {
        return {
          id: Math.floor(Math.random() * (1000 - 7 + 1)) + 7,
          destination_id: r.destinationId,
          rating: r.rating,
          user_id: parseInt(id, 10),
        }
      }
    }).filter(Boolean)

    if (!error) {
      // Kirim data rating ke API
      // 
      await supabase
        .from('rating')
        .insert(dataRate)
        .select()// menghindari duplikat
    }

    redirect(`/site/${id}`)

    // Success message
    console.log({
      title: "Success!",
      description: "Profile information has been saved successfully.",
    })

    console.log("Form submitted:", formData)
    console.log("Form rating:", dataRate)
  }


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
      })));
      setAllRatings(dataRatings.map((d:any) => ({
        destinationId: d.id,  // samakan field
        rating: d.rating,
        name: d.name,
        location: d.location,
        type: d.type.split(',').map((t:string) => t.trim()),
        tariff: d.tariff,
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
      <p>{JSON.stringify(ratings)}</p>
      {
        recommendations.message && (
        <div className='max-w-4xl m-auto'>
          <Card className="w-full border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Lengkapi data diri Anda untuk mendapatkan rekomendasi wisata terbaik untuk anda!</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className='mb-10 m-auto border-orange-300 bg-orange-50/50 flex flex-col items-start gap-2'>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{recommendations.message}</AlertTitle>
          <AlertDescription>
            <Link href="/site/destination" className='underline'>Lihat Destinasi</Link>
          </AlertDescription>
        </Alert>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          {/* Age Field */}
          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              min="1"
              max="120"
              value={formData.age}
              onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
              required
            />
          </div>

          {/* Gender Field */}
          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Laki laki</SelectItem>
                <SelectItem value="P">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bio Field */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio*</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
            />
          </div>

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
            <div className='grid grid-cols-2 gap-4 max-h-60 overflow-y-auto mt-2'>
              {ratings.map((destination:any) => (
                <div key={destination.destinationId} className="border-t border-orange-100 flex py-2 flex-col items-start gap-2">
                  <p className="text-sm">{destination.name}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => {
                      const starValue = i + 1
                      return (
                        <Star
                          key={i}
                          className={`h-4 w-4 cursor-pointer ${
                            starValue <= destination.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                          onClick={() =>
                            handleRatingChange(destination.destinationId, starValue)
                          }
                        />
                      )
                    })}
                  </div>

                  <p className="text-sm text-muted-foreground">{destination.location}</p>
                  {/* <span className="text-sm font-semibold">{user.rating.toFixed(1)}</span> */}
                </div>
              ))}
            </div>
          )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-orange-300">
            Berikan Rekomendasi
          </Button>
        </form>
      </CardContent>
    </Card>
        </div>
      )}
    </div>
  )
}