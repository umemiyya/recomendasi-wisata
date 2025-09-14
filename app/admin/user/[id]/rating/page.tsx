'use client'
import { use, useEffect, useState } from 'react';
 
export default function RatingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [ratings, setRatings] = useState<any>({ user: {}, rated_destinations: [] });

  // fetch from api /api/rating?userId={id}
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/rating?userId=${id}`);
      const data = await response.json();
      setRatings(data);
    };
    fetchData();
  }, [id]);

              
    /* 
    rating": 5,
    "id": 6,
    "name": "Pantai  Ujung Batu",
    "owner": "Pokdarwis",
    "type": "Wisata Bahari",
    "address": "Lingkungan Limpomajang Kelurahan Sumpang Binangae Kecamatan Barru",
    "phone": 81354709102,
    "accesebility": "Mudah Dijangkau, Jalanan Bagus/lancar",
    "fasility": "Gazebo, Panggung Pertunjukan, Mushallah Toilet",
    "unique": "Pantai Dan Masyarakat Nelayan",
    "tariff": "2000 - 50.000"
  */
            

  return (
    <div className='text-sm'>
      <div>
        <h2 className='font-semibold underline'>Pengguna</h2>
        {/* make list data pengguna */}
        <div>Nama: {ratings.user?.name}</div>
        <div>Umur: {ratings.user?.age}</div>
        <div>Jenis Kelamin: {ratings.user?.gender}</div>
        <div>Preferensi: {ratings.user?.preferences}</div>
      </div>
      <div className="mt-5">
        <h2 className='font-semibold underline'>Hasil Rating</h2>
        {ratings.rated_destinations?.length === 0 ? (<p>Tidak ada hasil rating tersedia.</p>)
        :
        <ul>
          {ratings.rated_destinations.map((rec: any, index: number) => (
            <div key={index}>
              <p className='font-semibold'>{rec.name} - Skor Rating: {rec.rating}</p>
              <div className="ml-5">
                <div>Pengelolah: {rec.owner}</div>
                <div>Jenis Wisata: {rec.type}</div>
                <div>Alamat: {rec.address}</div>
                <div>Phone: {rec.phone}</div>
              </div>
            </div>
          ))}
        </ul>
        }
      </div>
    </div>
  )
}