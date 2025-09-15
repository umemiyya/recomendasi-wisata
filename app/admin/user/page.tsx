'use client';

import { formatter } from "@/lib/utils";
import { useEffect, useState } from "react";
import { DetailedProfileCard } from "./components/user-card";

export default function Users() {

  const [data, setData] = useState<any[]>([]);

  // fetch user data from supabase
  useEffect(() => {
    const fetchData = async () => {
      // const supabase = createClient();
      // const { data, error } = await supabase.from("users").select("*");
      const response = await fetch(`/api/users`);
      const data = await response.json();
      if (response.ok) {
        const newData = formatter(data as any[]);
        setData(newData);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-8">
        {data.map((dat) => (
          <DetailedProfileCard key={dat.user.id} user={dat.user} rated_destinations={dat.rated_destinations} />
        ))}
      </div>
      {/* <Table>
        <TableCaption>list user.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Umur</TableHead>
            <TableHead>Jenis Kelamin</TableHead>
            <TableHead>Preferensi</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Rekomendasi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {user.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.age}</TableCell>
              <TableCell>{item.gender == 'L' ? 'Laki-laki' : 'Perempuan'}</TableCell>
              <TableCell>{item.preferences}</TableCell>
              <TableCell><Link href={`/admin/user/${item.id}/rating`} className="underline italic">Lihat Rating</Link></TableCell>
              <TableCell><Link href={`/admin/user/${item.id}/rekomendasi`} className="underline italic">Lihat Rekomendasi</Link></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </div>
  )
}
