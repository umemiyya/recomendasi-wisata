'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,

  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client";
import { formatter } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Users() {

  const [user, setUser] = useState<any[]>([]);

  // fetch user data from supabase
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        const newData = formatter(data as any[]);
        setUser(newData);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <Table>
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
      </Table>
    </div>
  )
}
