import { Sponsor } from '@/components/Sponsor';
import { HeadSection } from '@/components/HeadSection';
import { AIForm } from '@/components/AIForm';
import ImageResult from '@/components/ImageResult';
import { useState } from 'react';
import { FormData } from '../types/types';
import { createAiTask, delay, getAiTaskResult } from '@/services/ai';

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    if (!data) return;

    const createdTaskResponse = await createAiTask(data.imageUrl);
    setIsLoading(true);
    let isFinished = false;

    while (!isFinished) {
      try {
        await delay(2000);
        const taskResultResponse = await getAiTaskResult(
          createdTaskResponse.batchTaskId
        );
        if (
          (!taskResultResponse.query &&
            taskResultResponse.taskStatus === 22) ||
          taskResultResponse.images[0].taskStatus === 22
        ) {
          isFinished = true;
          setImagePreview(taskResultResponse.images[0].original);
          setIsLoading(false);
        }
      } catch (error) {
        isFinished = true;
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="home-container text-white fixed bottom-0">
        <HeadSection />
        <div className="flex flex-col md:flex-row w-full m-10">
          <div className="flex w-full md:w-1/2 m-10">
            <AIForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
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
