import { Card, CardContent } from "@/components/ui/card"
import { UserPlus, Search, Sparkles, MapPin } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Daftar & Atur Preferensi",
    description: "Buat akun dan ceritakan tentang jenis wisata yang Anda sukai",
    step: "01",
  },
  {
    icon: Search,
    title: "Jelajahi & Beri Rating",
    description: "Telusuri destinasi dan berikan rating pada tempat yang pernah Anda kunjungi",
    step: "02",
  },
  {
    icon: Sparkles,
    title: "Dapatkan Rekomendasi AI",
    description: "Sistem AI kami menganalisis preferensi dan memberikan rekomendasi personal",
    step: "03",
  },
  {
    icon: MapPin,
    title: "Rencanakan Perjalanan",
    description: "Pilih destinasi favorit dan mulai merencanakan petualangan Anda",
    step: "04",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="p-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Bagaimana <span className="text-primary">Cara Kerjanya</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Empat langkah sederhana untuk mendapatkan rekomendasi wisata yang sempurna untuk Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="text-center border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-8 pb-6">
                  <div className="relative mb-6">
                    <div className="w-16 bg-orange-200 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-balance">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed text-pretty">{step.description}</p>
                </CardContent>
              </Card>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30 transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
