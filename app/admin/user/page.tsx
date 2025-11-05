'use client';

import { formatter } from "@/lib/utils";
import { useEffect, useState } from "react";
import { DetailedProfileCard } from "./components/user-card";
import { createClient } from "@/lib/supabase/client";

export default function Users() {
  const [data, setData] = useState<any[]>([]);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/users`);
      const data = await response.json();
      if (response.ok) {
        const newData = formatter(data as any[]);
        setData(newData);
      }
    };
    fetchData();
  }, []);

  // 🗑️ Handle Delete User
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Apakah kamu yakin ingin menghapus user ini?");
    if (!confirmDelete) return;

    const supabase = createClient();
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) {
      alert("Gagal menghapus user!");
    } else {
      alert("User berhasil dihapus!");
      setData((prev) => prev.filter((item) => item.user.id !== id));
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-8">
        {data.map((dat) => (
          <DetailedProfileCard
            key={dat.user.id}
            user={dat.user}
            rated_destinations={dat.rated_destinations}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
