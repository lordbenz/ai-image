import { fabric } from 'fabric';
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import FormData from 'form-data';

type Response = {
  result: string;
};

type BodyData = {
  templateUrl: string;
  imageUrl: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
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

  function uploadImage(file: File) {
    const UPLOAD_FILE_ENDPOINT = '';
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(UPLOAD_FILE_ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  const body = req.body as BodyData;

  const canvas = new fabric.Canvas(null, {
    width: 1024,
    height: 1024,
  });

  canvas.add(await createImageObject(body.templateUrl));
  canvas.add(await createImageObject(body.imageUrl));

  canvas.renderAll();

  res
    .status(200)
    .json({
      result: canvas
        .toDataURL({})
        .replace(/^data:image\/png;base64,/, ''),
    });
}
