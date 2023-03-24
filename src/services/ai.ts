import axios from 'axios';

const AUTHORIZATION =
  'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0YzYzNTFjZTY0ZTU0YmMzYjJjMDFmMTU3NGJkNDkxZiIsImF1dGhLZXkiOiJTVEFOREFSRF9VU0VSIiwiZ3JvdXBJZCI6ImEwNjM0ZDY4YzVkZTQyNTY4YzVlM2Y3MjdmNTQyN2U0IiwiZXhwIjoxNjc5NzQ1MjY2fQ.i5O-LmDHgmaiWnvzwVcu28U7jGklLH4Jo5uvJZwgmbHwtbltg0bh7zJTHT11EXwQATFGQJkffsYW0EX1lqm5Gg';

const IDENTIFY = '35d47c4c027afe0232e94926cee42bce';

const UPLOAD_FILE_ENDPOINT = 'https://tmpfiles.org/api/v1/upload';

export const COMPLETED_STATUS = 22;

type AITaskResultResponse = {
  taskId: string;
  taskStatus: number;
  text: string;
  createdAt: number;
  hqPreview: string;
  imageId: string;
  original: string;
  preview: string;
  previous: string;
};

type TaskResponse = {
  batchTaskId: string;
  between: number;
  creditsUsed: number;
  remainingCredits: number;
  start: number;
  success: boolean;
  taskId: string;
};

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createAiTask(originalImage: string) {
  return (
    await axios.post(
      'https://web-backend-prod.zmo.ai/api/v1.0/microTask/makeUp/create',
      {
        originalImage: originalImage,
        imageWeight: null,
        numOfImages: 2,
        resolution: '640x640',
        categoryId: '47b6dd9727164c03a7b83a02f61e244e',
        styleCategoryIds: ['7641510f123642a1a6f467a85e2c3a26'],
      },
      {
        headers: {
          authority: 'web-backend-prod.zmo.ai',
          'accept-language': 'en-US,en;q=0.9',
          'app-code': 'dalle',
          authorization: AUTHORIZATION,
          identify: IDENTIFY,
          language: 'en-US',
          origin: 'https://imgcreator.zmo.ai',
          referer: 'https://imgcreator.zmo.ai/',
          'sec-ch-ua':
            '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'time-stamp': '1679659069002',
          'time-zone': 'Asia/Bangkok',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
        },
      }
    )
  ).data as TaskResponse;
}

export function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(UPLOAD_FILE_ENDPOINT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function getAiTaskResult(taskId: string) {
  return (
    await axios.get(
      `https://web-backend-prod.zmo.ai/api/v1.0/microTask/makeUp/get?batchTaskId=${taskId}`
    )
  ).data as {
    taskStatus: number;
    query: true;
    images: AITaskResultResponse[];
  };
}
