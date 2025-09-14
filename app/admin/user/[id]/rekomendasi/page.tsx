'use client'
import { use, useEffect, useState } from 'react';
 
export default function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [recommendations, setRecommendations] = useState<any>({
    user: null,
    recommendations: [],
  });

  // fetch from api /api/recommendations?userId={id}
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/recommendations?userId=${id}`);
      const data = await response.json();
      setRecommendations(data);
    };
    fetchData();
  }, [id]);

  return (
    <div className='text-sm'>
      <div>
        <h2 className='font-semibold underline'>Pengguna</h2>
        {/* make list data pengguna */}
        <div>Nama: {recommendations.user?.name}</div>
        <div>Umur: {recommendations.user?.age}</div>
        <div>Jenis Kelamin: {recommendations.user?.gender}</div>
        <div>Preferensi: {recommendations.user?.preferences}</div>
      </div>
      <div className="mt-5">
        <h2 className='font-semibold underline'>Rekomendasi</h2>
        {/* make list data rekomendasi */}
        {recommendations.recommendations.length === 0 && (<p>Tidak ada rekomendasi tersedia.</p>)}
        <ul>
          {recommendations.recommendations.map((rec: any, index: number) => (
            <li key={index}>{rec.item} - Skor: {rec.score}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}