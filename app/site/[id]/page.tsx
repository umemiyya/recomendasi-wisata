'use client'
import { use, useEffect, useState } from 'react';

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { createClient } from '@/lib/supabase/client';

import { redirect } from 'next/navigation';

interface FormData {
  name: string
  age: string
  gender: string
  preferences: string[]
  bio: string
}

const supabase = createClient();

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    gender: "",
    preferences: [],
    bio: "",
  });

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

    if (formData.age === "0") {
      console.log({
        title: "Error",
        description: "Age must be greater than 0",
        variant: "destructive",
      })
      return
    }

    const userUpdate = {
      name: formData.name,
      age: parseInt(formData.age, 10),
      gender: formData.gender,
      bio: formData.bio,
    }
    
    const { error } = await supabase
      .from('users')
      .update(userUpdate)
      .eq('id', id)
      .select()
    
    if (error) {
      console.log({
        title: "Error",
        description: "Age must be greater than 0",
        variant: "destructive",
      })
      return
    } else {
      redirect(`/site/${id}/form`)
    }
  }

  // fetch from api /api/recommendations?userId={id}
  useEffect(() => {
    const fetchData = async () => {
      const { data: users } = await supabase
        .from('users')
        .select("*")
        .eq('id', id);

      if (users && users.length > 0 && users[0].age != 0) {
        redirect(`/site/${id}/form`)
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className='text-sm'>
      <div className='max-w-4xl m-auto'>
          <Card className="w-full border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Lengkapi data diri Anda untuk mendapatkan rekomendasi wisata terbaik untuk anda!</CardDescription>
      </CardHeader>
      <CardContent>
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

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-orange-300">
            Simpan
          </Button>
        </form>
      </CardContent>
    </Card>
        </div>
    </div>
  )
}