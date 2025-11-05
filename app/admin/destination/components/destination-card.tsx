import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Camera, Trash2, Pencil } from "lucide-react"

export function DestinationCard({
  id,
  name,
  owner,
  type,
  address,
  // phone,
  // accesebility,
  // fasility,
  // unique,
  // tariff,
  image,
  onDelete,
  onEdit, // 👈 Tambahkan handler edit
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
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {type}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h3 className="font-bold text-lg">{name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Dikelola oleh {owner}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{address}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            className="shadow-none flex items-center gap-1"
            onClick={() => onEdit(id)}
          >
            <Pencil className="w-4 h-4" /> Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="shadow-none flex items-center gap-1"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="w-4 h-4" /> Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
