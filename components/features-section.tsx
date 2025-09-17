import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Users, Star, MapPin, Clock, Shield } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Rekomendasi Cerdas",
    description:
      "Algoritma collaborative filtering yang mempelajari preferensi Anda dan memberikan saran destinasi yang tepat sasaran.",
  },
  {
    icon: Users,
    title: "Berbasis Komunitas",
    description: "Rekomendasi berdasarkan pengalaman dan rating dari ribuan wisatawan dengan minat serupa.",
  },
  {
    icon: Star,
    title: "Rating & Ulasan",
    description: "Baca ulasan autentik dari wisatawan lain dan berikan kontribusi untuk komunitas.",
  },
  {
    icon: MapPin,
    title: "Lokasi Terkurasi",
    description: "Database lengkap destinasi wisata Indonesia dari Sabang sampai Merauke.",
  },
  {
    icon: Clock,
    title: "Update Real-time",
    description: "Informasi terkini tentang kondisi destinasi, cuaca, dan tips perjalanan.",
  },
  {
    icon: Shield,
    title: "Terpercaya & Aman",
    description: "Platform yang aman dengan verifikasi ulasan dan informasi yang akurat.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Mengapa Memilih <span className="text-primary">WisataKu</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Platform rekomendasi wisata terdepan yang menggunakan teknologi AI untuk memberikan pengalaman perjalanan
            yang tak terlupakan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 bg-orange-200 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary " />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
