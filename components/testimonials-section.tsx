import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sari Dewi",
    location: "Jakarta",
    rating: 5,
    text: "WisataKu membantu saya menemukan hidden gems di Yogyakarta yang tidak pernah saya tahu sebelumnya. Rekomendasinya sangat akurat!",
    avatar: "/indonesian-woman-smiling.jpg",
  },
  {
    name: "Budi Santoso",
    location: "Surabaya",
    rating: 5,
    text: "Sebagai travel blogger, saya terkesan dengan akurasi rekomendasi AI-nya. Benar-benar memahami preferensi saya.",
    avatar: "/indonesian-man-with-camera.jpg",
  },
  {
    name: "Maya Putri",
    location: "Bandung",
    rating: 5,
    text: "Aplikasi yang sempurna untuk merencanakan liburan keluarga. Anak-anak suka dengan destinasi yang direkomendasikan!",
    avatar: "/indonesian-mother-with-family.jpg",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="p-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Apa Kata <span className="text-primary">Pengguna Kami</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Ribuan wisatawan telah merasakan pengalaman luar biasa dengan rekomendasi dari WisataKu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8  text-primary/30 mr-2" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed text-pretty">{testimonial.text}</p>

                <div className="flex items-center">
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
