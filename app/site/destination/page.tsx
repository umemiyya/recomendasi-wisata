'use client';

import { createClient } from "@/lib/supabase/client";
import { formatter } from "@/lib/utils";
import { useEffect, useState } from "react";
import { DestinationCard } from "./components/destination-card";

export default function Wisata() {

  const [wisata, setWisata] = useState<any[]>([]);

  // fetch user data from supabase
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("wisata").select("*");
      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        const newData = formatter(data as any[]);
        setWisata(newData);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <div>
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wisata.map((destination, index) => (
              <DestinationCard key={index} {...destination} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
