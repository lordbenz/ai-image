import { Sponsor } from '@/components/Sponsor';
import { HeadSection } from '@/components/HeadSection';

import ImageResult from '@/components/ImageResult';
import { useEffect, useState } from 'react';
import { FormData } from '../types/types';
import { createAiTask, delay, getAiTaskResult } from '@/services/ai';
import dynamic from 'next/dynamic';
import { useCardCanvas } from '@/hooks/useCardCanvas';
import { fabric } from 'fabric';
const CardCanvas = dynamic(() => import('../components/Canvas'), {
  ssr: false,
});

const AIForm = dynamic(() => import('../components/AIForm'), {
  ssr: false,
});

function createImageObject(url: string) {
  return new Promise<fabric.Image>((resolve) => {
    fabric.Image.fromURL(url, (image) => {
      if (!image) {
        return;
      }
      resolve(image);
    });
  });
}

export default function Home() {
  const cardCanvasRef = useCardCanvas();
  const canvas = cardCanvasRef.current;
  const [imagePreview, setImagePreview] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const [template, setTemplate] = useState('');
  const [aiImageUrl, setAiImageUrl] = useState('');

  useEffect(() => {
    if (!canvas || aiImageUrl === '' || template === '') return;
    const templateObject = canvas
      .getObjects()
      //@ts-ignore
      .find((obj) => obj.id === 'BACKGROUND_IMAGE');

    if (!templateObject) return;

    createImageObject(aiImageUrl).then((aiImage) => {
      if (!aiImage.width || !aiImage.height) return;

      const bounds = canvas.getElement().getBoundingClientRect();

      const scaleFactor = Math.min(
        Math.min(1, bounds.width / aiImage.width),
        Math.min(1, bounds.height / aiImage.height)
      );

      aiImage.scale(scaleFactor);

      aiImage.set({
        top:
          bounds.top +
          Math.max(bounds.height - aiImage.height * scaleFactor, 0) /
            2,
        left:
          bounds.left +
          Math.max(bounds.width - aiImage.width * scaleFactor, 0) / 2,
      });
    });
  }, [aiImageUrl, template]);

  useEffect(() => {
    if (!canvas || template === '') return;
    createImageObject(template).then((templateImage) => {
      if (!templateImage.width || !templateImage.height) return;

      const previousTemplate = canvas
        .getObjects()
        //@ts-ignore
        .find((obj) => obj.id === 'BACKGROUND_IMAGE');

      if (previousTemplate) {
        canvas.remove(previousTemplate);
      }
      const bounds = canvas.getElement().getBoundingClientRect();

      const scaleFactor = Math.min(
        Math.min(1, bounds.width / templateImage.width),
        Math.min(1, bounds.height / templateImage.height)
      );
      templateImage.scale(scaleFactor);

      templateImage.set({
        top:
          bounds.top +
          Math.max(
            bounds.height - templateImage.height * scaleFactor,
            0
          ) /
            2,
        left:
          bounds.left +
          Math.max(
            bounds.width - templateImage.width * scaleFactor,
            0
          ) /
            2,
      });
      //@ts-ignore
      templateImage.id = 'BACKGROUND_IMAGE';
      canvas.add(templateImage);
      canvas.centerObject(templateImage);

      canvas.requestRenderAll();
    });
  }, [template]);
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
          setAiImageUrl(taskResultResponse.images[0].original);
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
              setTemplate={setTemplate}
              setImagePreview={setImagePreview}
            />
          </div>
          <div className="flex w-full md:w-1/2 m-10">
            <CardCanvas />
            <ImageResult imagePreview={imagePreview} />
          </div>
        </div>
        <Sponsor />
      </div>
    </>
  );
}
