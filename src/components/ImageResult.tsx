import React from "react";
import Image from "next/image";
import StaffTemplate from "../assets/staff.png";
import AttendeeTemplate from "../assets/attendee.png";
type ImageResultProps = {
  imagePreview: string | null | undefined;
};

const ImageResult = ({ imagePreview }: ImageResultProps) => {
  return (
    <div className="mt-4">
      {imagePreview ? (
        <img src={imagePreview} alt="Image Preview" />
      ) : (
        <div className="flex space-x-10">
          <Image
            src={StaffTemplate}
            alt="Staff Template"
            width={250}
            height={350}
          />
          <Image
            src={AttendeeTemplate}
            alt="Staff Template"
            width={250}
            height={350}
          />
        </div>
      )}
    </div>
  );
};

export default ImageResult;
