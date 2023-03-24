// AIForm.tsx
import { uploadImage } from '@/services/ai';
import React, { useState, ChangeEvent } from 'react';
import { FormData } from '../types/types';

type AIFormProps = {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
  setIsLoading: (status: boolean) => void;
};

export const AIForm = ({
  onSubmit,
  isLoading,
  setIsLoading,
}: AIFormProps) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [imageFile, setImageFile] = useState<File>();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!imageFile) return;
    setIsLoading(true);
    const uploadImageResponse = await uploadImage(imageFile);
    const url = new URL(uploadImageResponse.data.data.url);

    const formSubmitData: FormData = {
      name,
      role,
      imageUrl: `${url.origin}/dl${url.pathname}`,
    };
    onSubmit(formSubmitData);
  };

  const handleUploadImage = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  const disabled = !imageFile || name === '' || role === '';

  return (
    <form onSubmit={handleSubmit} className="">
      <div className="mb-4">
        <label htmlFor="name" className="block  font-medium mb-2">
          Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          placeholder="Enter your name"
          onChange={(event) => setName(event.target.value)}
          className="w-full border border-gray-400 p-1 text-black"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="role" className="block font-medium mb-2">
          Role:
        </label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="w-full border border-gray-400 p-1 border-none text-black"
        >
          <option value="">Select a role</option>
          <option value="Attendee">Attendee</option>
          <option value="Staff">Staff</option>
          {/* <option value="Sponsor">Sponsor</option> */}
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="image"
          className="block font-medium mb-2 border-none"
        >
          Image:
        </label>
        <input
          type="file"
          accept="image/*"
          id="image"
          name="image"
          onChange={handleUploadImage}
          className="w-full border border-gray-400 p-1 border-none"
        />
      </div>
      <button
        type="submit"
        className={
          disabled
            ? 'bg-gray-500 text-white p-2 rounded cursor-not-allowed'
            : 'bg-blue-500 text-white p-2 rounded'
        }
        disabled={disabled}
      >
        <div className="flex">
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            'Generate'
          )}
        </div>
      </button>
    </form>
  );
};
