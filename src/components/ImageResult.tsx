import React from 'react';
type ImageResultProps = {
  imagePreview: string | null | undefined;
};

const ImageResult = ({ imagePreview }: ImageResultProps) => {
  if (imagePreview) {
    return <img src={imagePreview} alt="Image Preview" />;
  }

  return null;
};

export default ImageResult;
