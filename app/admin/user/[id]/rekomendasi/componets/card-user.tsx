import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"



export function UserProfile({ user, rated_destinations }: {user: any, rated_destinations: any}) {

  return (
    <Card className="w-full shadow-none overflow-hidden border-orange-300">
      <CardHeader className="relative pb-2">
        {/* Avatar positioned over cover */}
        <div className={`flex items-start gap-4 ${user.coverImage ? "-mt-12" : ""}`}>
          <Avatar className={`h-14 w-14 border-4 border-background ${user.coverImage ? "relative z-10" : ""}`}>
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-xl bg-orange-50">
              {user.name
                .split(" ")
                .map((n:any) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 pt-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl pt-1 font-semibold">
                    {user.name}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm capitalize">{user.gender == 'L' ? 'Laki-laki' : 'Perempuan'}, {user.age}</p>
        {user.bio && <p className="text-pretty text-sm">{user.bio}</p>}


        <div className="space-y-3">
          <h4 className="font-semibold">Preferences</h4>
          <div className="flex flex-wrap text-sm gap-2">
            {user.preferences.split(',').map((preference:any, index:any) => (
              <Badge key={index} className="font-semibold bg-orange-100" variant="secondary">
                {preference}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="space-y-3 mb-2">
            <h2 className="font-semibold">Ratings</h2>
          </div>
          {rated_destinations.length === 0 ? (
            <p className="text-sm text-muted-foreground">User belum memberi rating</p>
          ) : (
            rated_destinations.map((destination:any) => (
              <div key={destination.id || destination.name} className="border-t border-orange-100 flex py-2 flex-col items-start gap-2">
                <p className="text-sm">{destination.name}</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(destination.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{destination.location}</p>

                {/* <span className="text-sm font-semibold">{user.rating.toFixed(1)}</span> */}
              </div>
            ))
          )}
        </div>

      </CardContent>
    </Card>
  )
}
