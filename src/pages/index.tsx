import { Sponsor } from '@/components/Sponsor';
import { HeadSection } from '@/components/HeadSection';
import { AIForm } from '@/components/AIForm';
import ImageResult from '@/components/ImageResult';
import { useState } from 'react';
import { FormData } from '../types/types';

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(
    null
  );

  const handleSubmit = (data: FormData) => {
    if (!data) return;

    console.log({ submitData: data });
    // TODO: Set imagePreview to result

    const result = generatedAIImageURL(data.image as File);
    setImagePreview(result);
  };

  const generatedAIImageURL = (file: File) => {
    // TODO: Generate AI Image

    return 'https://via.placeholder.com/250x350';
  };

  return (
    <>
      <div className="home-container text-white fixed bottom-0">
        <HeadSection />
        <div className="flex flex-col md:flex-row w-full m-10">
          <div className="flex w-full md:w-1/2 m-10">
            <AIForm onSubmit={handleSubmit} />
          </div>
          <div className="flex w-full md:w-1/2 m-10">
            <ImageResult imagePreview={imagePreview} />
          </div>
        </div>
        <Sponsor />
      </div>
    </>
  );
}
