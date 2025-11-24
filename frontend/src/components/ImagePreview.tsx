interface ImagePreviewProps {
  originalImage: string;
  editedImage: string;
}

export default function ImagePreview({ originalImage, editedImage }: ImagePreviewProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Original Image</h3>
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <img 
            src={originalImage} 
            alt="Original" 
            className="w-full h-auto object-contain max-h-96"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Edited Image</h3>
        <div className="border-2 border-blue-200 rounded-lg overflow-hidden bg-blue-50">
          <img 
            src={editedImage} 
            alt="Edited" 
            className="w-full h-auto object-contain max-h-96"
          />
        </div>
        <div className="mt-3">
          <a
            href={editedImage}
            download="edited-image.jpg"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Download Edited Image
          </a>
        </div>
      </div>
    </div>
  );
}
