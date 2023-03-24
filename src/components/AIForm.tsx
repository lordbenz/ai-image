// AIForm.tsx
import React, { useState, useRef } from 'react';
import { FormData } from '../types/types';
type AIFormProps = {
  onSubmit: (data: FormData) => void;
};

export const AIForm = ({ onSubmit }: AIFormProps) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const imageInput = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formSubmitData: FormData = {
      name,
      role,
      image: imageInput.current?.files?.[0] || null,
    };
    onSubmit(formSubmitData);
  };

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
          <option value="Sponsor">Sponsor</option>
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
          ref={imageInput}
          className="w-full border border-gray-400 p-1 border-none"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded"
      >
        Submit
      </button>
    </form>
  );
};
