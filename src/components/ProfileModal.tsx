// src/components/ProfileModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Creator } from '../types';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../firebaseConfig'; // Import storage

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Creator>) => void;
  initialData?: Creator;
}

const categories = ['Developer', 'Designer', 'Creator', 'Researcher', 'Advocate', 'Other'];

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Creator>>({
    name: '',
    bio: '',
    category: 'Developer',
    avatar: '',
    social: { twitter: '', github: '', website: '' },
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState(''); // Separate state for URL input

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        bio: initialData.bio,
        category: initialData.category,
        avatar: initialData.avatar,
        social: initialData.social || { twitter: '', github: '', website: '' },
      });
      setAvatarUrlInput(initialData.avatar || '');
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      social: { ...prev.social, [name]: value },
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setAvatarFile(file);
      } else {
        alert('Please select an image file.');
      }
    }
  };

  const handleSubmit = async () => {
    setUploading(true);
    let avatarUrl = avatarUrlInput; // Use URL input as default

    if (avatarUrl && !isValidUrl(avatarUrl)) {
      alert('Invalid avatar URL.');
      setUploading(false);
      return;
    }

    if (avatarFile) {
      try {
        const storageRef = ref(storage, `avatars/${Date.now()}_${avatarFile.name}`);
        await uploadBytes(storageRef, avatarFile);
        avatarUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error('Failed to upload avatar:', error);
        alert('Failed to upload avatar. Using URL if provided.');
      }
    }

    const updatedData = { ...formData, avatar: avatarUrl };
    onSave(updatedData);
    setUploading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-2 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors z-10"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold">Edit Profile</h2>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Avatar Upload (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg"
            />
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mt-4 mb-2">Or Avatar URL</label>
            <input
              type="text"
              value={avatarUrlInput}
              onChange={(e) => setAvatarUrlInput(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Twitter (optional)</label>
            <input
              type="text"
              name="twitter"
              value={formData.social?.twitter || ''}
              onChange={handleSocialChange}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">GitHub (optional)</label>
            <input
              type="text"
              name="github"
              value={formData.social?.github || ''}
              onChange={handleSocialChange}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Website (optional)</label>
            <input
              type="text"
              name="website"
              value={formData.social?.website || ''}
              onChange={handleSocialChange}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};