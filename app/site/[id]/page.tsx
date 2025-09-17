'use client'
import { use, useEffect, useState } from 'react';


import { UserProfile } from '@/app/admin/user/[id]/rekomendasi/componets/card-user';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

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
      {
        recommendations.message && (
        <Alert className='max-w-lg m-auto border-orange-300 bg-orange-50/50 flex flex-col items-start gap-2'>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{recommendations.message}</AlertTitle>
          <AlertDescription>
            <Link href="/site/destination" className='underline'>Lihat Destinasi</Link>
          </AlertDescription>
        </Alert>
      )}
      <div>
       {recommendations.user && (
        <UserProfile user={recommendations.user} rated_destinations={recommendations.rated_destinations} />
       )}
      </div>
      {/* <div className="mt-5">
        <h2 className='font-semibold text-lg py-4'>Rekomendasi Wisata</h2>
        {recommendations.recommendations.length === 0 && (<p>Tidak ada rekomendasi tersedia.</p>)}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {recommendations.recommendations.map((rec: any, index: number) => (
            <DestinationCard key={index} {...rec} />
          ))}
        </div>
      </div> */}
    </div>
  )
}