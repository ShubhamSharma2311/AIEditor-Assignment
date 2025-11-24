import { useState } from 'react';
import { imageAPI } from '../lib/api';
import Loader from './Loader';
import ErrorAlert from './ErrorAlert';
import ImagePreview from './ImagePreview';

export default function ImageEditor() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [instruction, setInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setEditedImage(null);
      setError(null);
    }
  };

  const handleEditImage = async () => {
    if (!selectedImage || !instruction.trim()) {
      setError('Please select an image and provide an instruction');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await imageAPI.editImage(selectedImage, instruction);
      setEditedImage(response.editedImage);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to edit image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded" />
                ) : (
                  <div>
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600">Click to upload an image</p>
                    <p className="text-sm text-gray-400 mt-1">PNG, JPG, WEBP (max 10MB)</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          </div>
          {selectedImage && (
            <p className="text-sm text-gray-600 mt-2">
              Selected: {selectedImage.name}
            </p>
          )}
        </div>

        {/* Example Instructions */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Try These Examples:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setInstruction('blur the image')}
              className="px-4 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium"
            >
              🌫️ Blur
            </button>
            <button
              onClick={() => setInstruction('make it grayscale')}
              className="px-4 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              ⚫ Grayscale
            </button>
            <button
              onClick={() => setInstruction('brighten the image')}
              className="px-4 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors font-medium"
            >
              ☀️ Brighten
            </button>
            <button
              onClick={() => setInstruction('make it more vibrant and colorful')}
              className="px-4 py-2 text-sm bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors font-medium"
            >
              🎨 Vibrant
            </button>
            <button
              onClick={() => setInstruction('sharpen the image')}
              className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              🔍 Sharpen
            </button>
            <button
              onClick={() => setInstruction('invert colors')}
              className="px-4 py-2 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
            >
              🔄 Invert
            </button>
            <button
              onClick={() => setInstruction('rotate 90 degrees')}
              className="px-4 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
            >
              ↻ Rotate
            </button>
            <button
              onClick={() => setInstruction('flip horizontal')}
              className="px-4 py-2 text-sm bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors font-medium"
            >
              ↔️ Flip
            </button>
          </div>
        </div>

        {/* Instruction Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Editing Instruction
          </label>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g., 'blur the image', 'make it grayscale', 'brighten the image'"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Edit Button */}
        <button
          onClick={handleEditImage}
          disabled={isLoading || !selectedImage || !instruction.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Edit Image with AI
            </>
          )}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <Loader />
        </div>
      )}

      {/* Result Display */}
      {editedImage && !isLoading && previewUrl && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Results</h2>
          <ImagePreview originalImage={previewUrl} editedImage={editedImage} />
        </div>
      )}
    </div>
  );
}
