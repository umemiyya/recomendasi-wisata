
import { MapPin } from "lucide-react"
import { AuthButton } from "./auth-button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 px-10 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">WisataKu</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="#home" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Beranda
          </a>
          <a href="#features" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Cara Kerja
          </a>
          <a href="#footer" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Kontak
          </a>
        </nav>

        <AuthButton />
      </div>
    </header>
  )
}
