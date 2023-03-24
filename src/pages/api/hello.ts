// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import fs from 'fs/promises';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await fs.writeFile(
    `info/${nanoid()}.json`,
    JSON.stringify(req.body)
  );
  res.status(200).json({ name: 'John Doe' });
}
