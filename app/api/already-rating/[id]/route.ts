import { createClient } from "@/lib/supabase/client"
import { NextResponse } from "next/server"

const supabase = createClient();

// Helper ubah key jadi Title Case
function toTitleCaseValues(obj: Record<string, any>) {
  const toTitleCase = (str: string) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) =>
        word.length > 0
          ? word.charAt(0).toUpperCase() + word.slice(1)
          : ""
      )
      .join(" ")

  const newObj: Record<string, any> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key]

      // Lewati key "image" dan "maps"
      if (key === "image" || key === "maps") {
        newObj[key] = val
        continue
      }

      if (typeof val === "string") {
        newObj[key] = toTitleCase(val)
      } else if (Array.isArray(val)) {
        newObj[key] = val.map((item) =>
          typeof item === "string" ? toTitleCase(item) : item
        )
      } else if (typeof val === "object" && val !== null) {
        newObj[key] = toTitleCaseValues(val)
      } else {
        newObj[key] = val
      }
    }
  }
  return newObj
}


export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ pakai await di sini

  // Ambil detail destinasi
  const { data: wisataData, error: wisataError } = await supabase
    .from("wisata")
    .select("*")
    .eq("id", id)
    .single()

  if (wisataError) {
    return NextResponse.json({ error: wisataError.message }, { status: 500 })
  }

  // Ambil rating untuk destinasi ini
  const { data: ratingData, error: ratingError } = await supabase
    .from("rating")
    .select("rating")
    .eq("destination_id", id)

  if (ratingError) {
    return NextResponse.json({ error: ratingError.message }, { status: 500 })
  }

  const ratings = ratingData?.map((r) => r.rating) || []
  const total_rating = ratings.length
  const average_rating =
    total_rating > 0 ? ratings.reduce((sum, val) => sum + val, 0) / total_rating : 0

  // Ubah semua key ke Title Case
  const data = toTitleCaseValues(wisataData)

  const result = {
    ...data,
    ratings,
    average_rating,
    total_rating,
  }

  return NextResponse.json(result)
}
