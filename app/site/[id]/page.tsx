'use client'
import { use, useEffect, useState } from 'react';


import { UserProfile } from '@/app/admin/user/[id]/rekomendasi/componets/card-user';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface FormData {
  name: string
  age: string
  gender: string
  preferences: string[]
  bio: string
}

const preferenceOptions = [
  { id: "music", label: "Music" },
  { id: "sports", label: "Sports" },
  { id: "reading", label: "Reading" },
  { id: "travel", label: "Travel" },
  { id: "cooking", label: "Cooking" },
  { id: "gaming", label: "Gaming" },
  { id: "movies", label: "Movies" },
  { id: "art", label: "Art" },
]

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

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

  const handlePreferenceChange = (preferenceId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      preferences: checked ? [...prev.preferences, preferenceId] : prev.preferences.filter((id) => id !== preferenceId),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
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

    // Success message
    console.log({
      title: "Success!",
      description: "Profile information has been saved successfully.",
    })

    console.log("Form submitted:", formData)
  }


  // fetch from api /api/recommendations?userId={id}
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/recommendations?userId=${id}`);
      const data = await response.json();
      setRecommendations(data);
    };
    fetchData();
  }, [id]);

  return (
    <div className='text-sm'>
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
          <div className="space-y-2 hidden">
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
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
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

          {/* Bio Field */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
            />
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
      <div>
       {recommendations.user && (
        <UserProfile user={recommendations.user} rated_destinations={recommendations.rated_destinations} />
       )}
      </div>
      {/* <div className="mt-5">
        <h2 className='font-semibold text-lg py-4'>Rekomendasi Wisata</h2>
        {recommendations.recommendations.length === 0 && (<p>Tidak ada rekomendasi tersedia.</p>)}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {recommendations.recommendations.map((rec: any, index: number) => (
            <DestinationCard key={index} {...rec} />
          ))}
        </div>
      </div> */}
    </div>
  )
}