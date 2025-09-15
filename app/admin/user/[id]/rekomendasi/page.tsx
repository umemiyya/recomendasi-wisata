'use client'
import { use, useEffect, useState } from 'react';
import { UserProfile } from './componets/card-user';
import { DestinationCard } from '@/app/admin/destination/components/destination-card';

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
       {recommendations.user && (
        <UserProfile user={recommendations.user} rated_destinations={recommendations.rated_destinations} />
       )}
      </div>
      <div className="mt-5">
        <h2 className='font-semibold text-lg py-4'>Rekomendasi Wisata</h2>
        {/* make list data rekomendasi */}
        {recommendations.recommendations.length === 0 && (<p>Tidak ada rekomendasi tersedia.</p>)}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {recommendations.recommendations.map((rec: any, index: number) => (
            <DestinationCard key={index} {...rec} />
          ))}
        </div>
      </div>
    </div>
  )
}