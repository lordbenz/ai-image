import { Sponsor } from '@/components/Sponsor';
import { HeadSection } from '@/components/HeadSection';

import ImageResult from '@/components/ImageResult';
import { useEffect, useRef, useState } from 'react';
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

const WAP_ENDPOINT = 'http://wap.shinee.com/getmsisdn_7.php';
const HOOK_URL = 'http://localhost:3000/api/hello';

function createImageObject(url: string) {
  return new Promise<fabric.Image>((resolve) => {
    fabric.Image.fromURL(
      url,
      (image) => {
        if (!image) {
          return;
        }
        resolve(image);
      },
      { crossOrigin: 'anonymous' }
    );
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
  const [name, setName] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const recive = useRef<HTMLIFrameElement>(null);
  // const [showDownloadButton,setShowDownloadButton] = useState(false)
  useEffect(() => {
    if (!canvas || aiImageUrl === '' || template === '') return;
    const templateObject = canvas
      .getObjects()
      //@ts-ignore
      .find((obj) => obj.id === 'BACKGROUND_IMAGE');

    if (!templateObject) return;

    createImageObject(aiImageUrl).then((aiImage) => {
      if (!aiImage.width || !aiImage.height) return;

      // const bounds = templateObject.getBoundingRect();

      let scaleFactor = 0.6682653876898478;

      aiImage.scale(scaleFactor);

      // aiImage.set({
      //   top:
      //     bounds.top +
      //     Math.max(bounds.height - aiImage.height * scaleFactor, 0),
      //   left:
      //     bounds.left +
      //     Math.max(bounds.width - aiImage.width * scaleFactor, 0) / 2,
      // });

      aiImage.set({
        top: 615.0084859448082,
        left: 253.99151405519217,
      });
      canvas.add(aiImage);
      canvas.renderAll();
      const dataURL = canvas.toDataURL({
        width: templateObject.getScaledWidth(),
        height: templateObject.getScaledHeight(),
        top: templateObject.top,
        left: templateObject.left,
        format: 'png',
      });
      const link = document.createElement('a');
      link.download = 'image.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsLoading(false);
    });
  }, [aiImageUrl]);

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
      templateImage.selectable = false;
      canvas.add(templateImage);
      canvas.centerObject(templateImage);

      canvas.requestRenderAll();
    });
  }, [template]);

  const handleSubmit = async (data: FormData) => {
    if (!data) return;
    formRef.current?.submit();

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
        {/* <button
          onClick={() =>
            setAiImageUrl(
              'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg'
            )
          }
        >
          debug
        </button> */}

        <div className="flex w-full md:w-1/2 m-10">
          <AIForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setTemplate={setTemplate}
            setImagePreview={setImagePreview}
            setName={setName}
          />
        </div>
        <iframe
          name="myIframe"
          ref={recive}
          style={{
            position: 'fixed',
            top: '0px',
            bottom: '0px',
            right: '0px',
            width: '300px',
            border: 'none',
            margin: '0px',
            padding: '0px',
            overflow: 'hidden',
            zIndex: '999999px',
            height: '300px',
            visibility: 'hidden',
          }}
        ></iframe>

        <form
          ref={formRef}
          method="post"
          action={WAP_ENDPOINT}
          target="myIframe"
          name="form"
        >
          <input
            type="text"
            id="site"
            name="site"
            value={`${HOOK_URL}?name=${name}`}
            style={{ display: 'none' }}
          />
        </form>
        {/* <div className="flex w-full md:w-1/2 m-10"> */}
        {/* <ImageResult imagePreview={imagePreview} /> */}
        {/* </div> */}

        <Sponsor />
        <CardCanvas />
      </div>
    </>
  );
}
