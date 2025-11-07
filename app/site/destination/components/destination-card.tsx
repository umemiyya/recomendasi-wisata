import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
import { MapPin, Phone, Users, Camera } from "lucide-react"

export function DestinationCard({
  name,
  owner,
  type,
  address,
  phone,
  accesebility,
  fasility,
  unique,
  tariff,
  rute,
  image,
}: any) {
  return (
    <Card className="w-full max-w-md border-orange-200 bg-orange-50/50 overflow-hidden shadow-none transition-shadow">
      <div className="relative h-48 bg-gradient-to-br from-orange-50 to-orange-200">
        {image ? (
          <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="w-12 h-12 text-white/70" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {type}
          </Badge>
        </div>
        {/* <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-white text-sm font-medium">{rating}</span>
        </div> */}
      </div>

      {JSON.stringify(rute)}

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-balance">{name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Dikelola oleh {owner}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="text-pretty">{address}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm mb-2">Keunikan</h4>
            <p className="text-sm text-muted-foreground text-pretty">{unique}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">Fasilitas</h4>
            <div className="flex flex-wrap gap-1">
              {fasility.split(",").map((fasilitas:any, index:number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {fasilitas == 'N/a' ? 'Belum diidentifikasi' : fasilitas}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium">Akses:</span>
              <p className="text-muted-foreground text-pretty">{accesebility}</p>
            </div>
            <div>
              <span className="font-medium">Biaya:</span>
              <div className="flex items-center gap-1 text-green-600 font-medium">
                Rp. {tariff == 'N/a' ? '-' : tariff}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4" />
            <span className="text-muted-foreground">{phone == 0 ? "No Phone" : phone}</span>
          </div>
        </div>

        {/* <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="w-full shadow-none bg-orange-100 border-orange-300 flex-1">
            Berikan Rating
          </Button>
        </div> */}
      </CardContent>
    </Card>
  )
}
