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
import { useEffect, useState } from "react";

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
      <Table>
        <TableCaption>list wisata.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Pengelolah</TableHead>
            <TableHead>Jenis Wisata</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Akses</TableHead>
            <TableHead>Fasilitas</TableHead>
            <TableHead>Keunikan</TableHead>
            <TableHead>Biaya</TableHead>
            <TableHead>#</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wisata.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.owner}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>{item.phone}</TableCell>
              <TableCell>{item.accesebility}</TableCell>
              <TableCell>{item.fasility}</TableCell>
              <TableCell>{item.unique}</TableCell>
              <TableCell>{item.tariff}</TableCell>
              <TableCell>#</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
