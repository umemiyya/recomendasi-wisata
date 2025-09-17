import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 px-20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">WisataKu</span>
            </div>
            <p className="text-background/80 mb-6 max-w-md leading-relaxed">
              Platform rekomendasi wisata terdepan di Indonesia yang menggunakan teknologi AI dan collaborative
              filtering untuk memberikan pengalaman perjalanan yang tak terlupakan.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-background/60 hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 text-background/60 hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 text-background/60 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-background/80 hover:text-primary transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#destinations" className="text-background/80 hover:text-primary transition-colors">
                  Destinasi
                </a>
              </li>
              <li>
                <a href="#attractions" className="text-background/80 hover:text-primary transition-colors">
                  Atraksi
                </a>
              </li>
              <li>
                <a href="#about" className="text-background/80 hover:text-primary transition-colors">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#contact" className="text-background/80 hover:text-primary transition-colors">
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-3" />
                <span className="text-background/80">info@wisataku.id</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-3" />
                <span className="text-background/80">+62 21 1234 5678</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <span className="text-background/80">Jakarta, Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 text-center">
          <p className="text-background/60">
            © 2024 WisataKu. Semua hak dilindungi. Dibuat dengan ❤️ untuk wisatawan Indonesia.
          </p>
        </div>
      </div>
    </footer>
  )
}
