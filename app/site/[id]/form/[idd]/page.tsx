'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Users, Camera, Star } from "lucide-react"
import * as React from "react"
import { buttonVariants } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

// 🔽 Fungsi ubah key jadi lowercase
function toLowerCaseKeys(obj: Record<string, any>) {
  const newObj: Record<string, any> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const lowerKey = key.toLowerCase()
      const val = obj[key]
      if (val && typeof val === "object" && !Array.isArray(val)) {
        newObj[lowerKey] = toLowerCaseKeys(val)
      } else {
        newObj[lowerKey] = val
      }
    }
  }
  return newObj
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string; idd: string }>
}) {
  const { id, idd } = React.use(params)
  const [destination, setDestination] = useState<any>(null)
  const [rating, setRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const supabase = createClient()

  // ✅ Fungsi untuk mencatat kunjungan user
  async function recordVisit(userId: string, wisataId: string) {
    try {
      const { data: existingVisit, error: fetchError } = await supabase
        .from("kunjungan")
        .select("*")
        .eq("user_id", userId)
        .eq("wisata_id", wisataId)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Gagal cek kunjungan:", fetchError)
        return
      }

      if (existingVisit) {
        // Jika sudah ada, update jumlah kunjungan
        const { error: updateError } = await supabase
          .from("kunjungan")
          .update({ kunjungan: existingVisit.kunjungan + 1 })
          .eq("id", existingVisit.id)

        if (updateError) console.error("Gagal update kunjungan:", updateError)
        else console.log("✅ Kunjungan diperbarui (+1)")
      } else {
        // Jika belum ada, insert baru
        const { error: insertError } = await supabase
          .from("kunjungan")
          .insert([{ user_id: userId, wisata_id: wisataId, kunjungan: 1 }])

        if (insertError) console.error("Gagal menambah kunjungan:", insertError)
        else console.log("✅ Kunjungan pertama berhasil disimpan")
      }
    } catch (err) {
      console.error("Error mencatat kunjungan:", err)
    }
  }

  // 🧭 Ambil data destinasi + catat kunjungan
  useEffect(() => {
    async function fetchDestination() {
      try {
        const res = await fetch(`/api/already-rating/${idd}`)
        const data = await res.json()
        setDestination(toLowerCaseKeys(data))

        // ✅ Tambahkan logika mencatat kunjungan
        if (id && idd) {
          await recordVisit(id, idd)
        }
      } catch (error) {
        console.error("Error fetching destination:", error)
      } finally {
        setLoading(false)
      }
    }

    if (idd) fetchDestination()
  }, [id, idd])

  // 🔽 Fungsi kirim rating ke API
  async function handleRating(starValue: number) {
    setRating(starValue)
    if (!destination?.id) return
    setSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch("/api/already-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationId: idd,
          userId: id,
          rating: starValue,
        }),
      })

      const result = await res.json()
      if (result.success) {
        setMessage("⭐ Terima kasih! Rating kamu berhasil dikirim.")
      } else {
        setMessage("❌ Gagal mengirim rating. Coba lagi nanti.")
      }
    } catch (err) {
      console.error("Error posting rating:", err)
      setMessage("⚠️ Terjadi kesalahan jaringan.")
    } finally {
      setSubmitting(false)
      setTimeout(() => setMessage(null), 4000)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Memuat data destinasi...
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Data destinasi tidak ditemukan.
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <Card className="w-full border-orange-200 bg-orange-50/50 overflow-hidden shadow-none transition-shadow">
        {/* Gambar Header */}
        <div className="relative h-60 bg-gradient-to-br from-orange-50 to-orange-200">
          {destination.image ? (
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-white/70" />
            </div>
          )}

          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {destination.type}
            </Badge>
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-white text-sm font-medium">
              {destination.average_rating?.toFixed(1)} ({destination.total_rating})
            </span>
          </div>
        </div>

        {/* Header */}
        <CardHeader className="pb-3">
          <div className="space-y-2">
            <h3 className="font-bold text-xl text-balance">{destination.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Dikelola oleh {destination.owner}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-pretty">{destination.address}</span>
            </div>
          </div>
        </CardHeader>

        {/* Konten utama */}
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Keunikan</h4>
            <p className="text-sm text-muted-foreground text-pretty">
              {destination.unique || "-"}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">Fasilitas</h4>
            <div className="flex flex-wrap gap-1">
              {destination.fasility?.split(",").map((fasilitas: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {fasilitas === "N/a" ? "Belum diidentifikasi" : fasilitas.trim()}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium">Akses:</span>
              <p className="text-muted-foreground text-pretty">
                {destination.accesebility || "-"}
              </p>
            </div>
            <div>
              <span className="font-medium">Biaya:</span>
              <div className="flex items-center gap-1 text-green-600 font-medium">
                Rp. {destination.tariff === "N/a" ? "-" : destination.tariff}
              </div>
            </div>
          </div>

          {destination.maps && (
            <div className="text-sm">
              <span className="font-medium">Lokasi di Maps:</span>
              <p>
                <a
                  href={destination.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline break-all"
                >
                  {destination.maps.toLowerCase()}
                </a>
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4" />
            <span className="text-muted-foreground">
              {destination.phone === "0" ? "No Phone" : destination.phone}
            </span>
          </div>

          <div className="border-t border-orange-100 my-3"></div>

          {/* Beri Rating */}
          {/* <div className="mb-4">
            <h4 className="font-medium text-sm mb-2">Beri Rating Anda:</h4>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => {
                const starValue = i + 1
                return (
                  <Star
                    key={i}
                    onClick={() => !submitting && handleRating(starValue)}
                    className={`h-6 w-6 cursor-pointer transition ${
                      starValue <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-300"
                    } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                )
              })}
            </div>

            {message && (
              <p
                className={`mt-2 text-sm ${
                  message.includes("berhasil")
                    ? "text-green-600"
                    : message.includes("kesalahan")
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div> */}

          <div className="pt-4 border-t gap-4 border-orange-100 flex justify-end">
            <Link href={`/site/${id}/form`} className={buttonVariants({variant: 'default', className: 'bg-orange-400 hover:bg-orange-700'})}>Kembali</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
