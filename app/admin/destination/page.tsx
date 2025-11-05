'use client';

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatter } from "@/lib/utils";
import { DestinationCard } from "./components/destination-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Wisata() {
  const [wisata, setWisata] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    type: "",
    address: "",
    phone: "",
    accesebility: "",
    fasility: "",
    unique: "",
    tariff: "",
    rute: "",
    maps: "",
    image: "",
  });

  // Label untuk input dalam Bahasa Indonesia
  const labelMap: Record<string, string> = {
    name: "Nama Wisata",
    owner: "Pemilik / Pengelola",
    type: "Jenis Wisata",
    address: "Alamat",
    phone: "Nomor Telepon",
    accesebility: "Aksesibilitas",
    fasility: "Fasilitas",
    unique: "Keunikan",
    tariff: "Tarif Masuk",
    rute: "Rute Perjalanan",
    maps: "Link Google Maps",
    image: "URL Gambar",
  };

  // 🧭 Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("wisata").select("*");
      if (!error && data) setWisata(formatter(data as any[]));
    };
    fetchData();
  }, []);

  // ✏️ Handle Edit
  const handleEdit = (id: number) => {
    const item = wisata.find((w) => w.id === id);
    if (!item) return;
    setEditId(id);
    setFormData(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🗑️ Handle Delete
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Apakah kamu yakin ingin menghapus data ini?");
    if (!confirmDelete) return;

    const supabase = createClient();
    const { error } = await supabase.from("wisata").delete().eq("id", id);
    if (error) {
      alert("Gagal menghapus data!");
    } else {
      alert("Data wisata berhasil dihapus!");
      setWisata((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // 🧩 Handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🧩 Handle submit (Tambah / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🚨 Validasi form wajib diisi
    const requiredFields = ["name", "type", "address", "tariff", "image"];
    const emptyFields = requiredFields.filter((f) => !formData[f as keyof typeof formData].trim());
    if (emptyFields.length > 0) {
      alert("Mohon lengkapi semua kolom wajib: " + emptyFields.map((f) => labelMap[f]).join(", "));
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (editId) {
      // 🔁 UPDATE mode
      const { error } = await supabase
        .from("wisata")
        .update({
          name: formData.name,
          owner: formData.owner,
          type: formData.type,
          address: formData.address,
          phone: formData.phone ? Number(formData.phone) : null,
          accesebility: formData.accesebility,
          fasility: formData.fasility,
          unique: formData.unique,
          tariff: formData.tariff,
          rute: formData.rute,
          maps: formData.maps,
          image: formData.image,
        })
        .eq("id", editId);

      if (error) alert("Gagal mengupdate wisata!");
      else {
        alert("Data wisata berhasil diperbarui!");
        setEditId(null);
        const { data: updated } = await supabase.from("wisata").select("*");
        setWisata(formatter(updated as any[]));
      }
    } else {
      // ➕ INSERT mode
      const { error } = await supabase.from("wisata").insert([
        {
          id: Math.floor(Math.random() * 10000),
          ...formData,
          phone: formData.phone ? Number(formData.phone) : null,
        },
      ]);

      if (error) alert("Gagal menambahkan wisata!");
      else {
        alert("Wisata berhasil ditambahkan!");
        const { data: updated } = await supabase.from("wisata").select("*");
        setWisata(formatter(updated as any[]));
      }
    }

    // reset form
    setFormData({
      name: "",
      owner: "",
      type: "",
      address: "",
      phone: "",
      accesebility: "",
      fasility: "",
      unique: "",
      tariff: "",
      rute: "",
      maps: "",
      image: "",
    });
    setLoading(false);
  };

  return (
    <div className="w-full space-y-8">
      {/* 🧾 Form Tambah / Edit Wisata */}
      <div className="bg-white border border-orange-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Wisata" : "Tambah Wisata Baru"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <Label htmlFor={key}>{labelMap[key]}</Label>
              <Input
                id={key}
                name={key}
                type={key === "phone" ? "number" : "text"}
                value={(formData as any)[key]}
                onChange={handleChange}
                placeholder={`Masukkan ${labelMap[key]}`}
              />
            </div>
          ))}

          <div className="md:col-span-2 mt-4 flex gap-2">
            <Button type="submit" className="bg-orange-600" disabled={loading}>
              {loading
                ? "Menyimpan..."
                : editId
                ? "Perbarui Wisata"
                : "Tambah Wisata"}
            </Button>

            {editId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditId(null);
                  setFormData({
                    name: "",
                    owner: "",
                    type: "",
                    address: "",
                    phone: "",
                    accesebility: "",
                    fasility: "",
                    unique: "",
                    tariff: "",
                    rute: "",
                    maps: "",
                    image: "",
                  });
                }}
              >
                Batal Edit
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* 🧭 List Wisata */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Daftar Wisata</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wisata.length === 0 ? (
            <p className="text-gray-500">Belum ada data wisata.</p>
          ) : (
            wisata.map((destination) => (
              <DestinationCard
                key={destination.id}
                {...destination}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
