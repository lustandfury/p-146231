
import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

interface PhotoType {
  id: string;
  imageUrl: string;
  caption?: string;
}

interface PhotoUploadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (photos: PhotoType[]) => void;
}

export const PhotoUploadDrawer: React.FC<PhotoUploadDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedImages, setSelectedImages] = useState<PhotoType[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      
      // Simulate upload delay
      setTimeout(() => {
        const newPhotos: PhotoType[] = Array.from(e.target.files!).map((file, index) => ({
          id: `new-photo-${Date.now()}-${index}`,
          imageUrl: URL.createObjectURL(file),
          caption: file.name
        }));
        
        setSelectedImages(prev => [...prev, ...newPhotos]);
        setIsUploading(false);
      }, 1000);
    }
  };

  const removeSelectedImage = (photoId: string) => {
    setSelectedImages(prev => prev.filter(photo => photo.id !== photoId));
  };

  const handleSave = () => {
    if (selectedImages.length > 0) {
      onSave(selectedImages);
      resetForm();
    } else {
      onClose();
    }
  };

  const resetForm = () => {
    setSelectedImages([]);
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
      }
    }} shouldScaleBackground>
      <DrawerContent className="px-4 pb-6">
        <DrawerHeader className="text-center">
          <DrawerTitle>Add Photos</DrawerTitle>
        </DrawerHeader>
        
        <div className="flex flex-col space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto">
            {selectedImages.map(photo => (
              <div key={photo.id} className="relative aspect-square">
                <img 
                  src={photo.imageUrl} 
                  alt={photo.caption || "Preview"} 
                  className="w-full h-full object-cover rounded-md"
                />
                <button 
                  onClick={() => removeSelectedImage(photo.id)}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
                  aria-label="Remove photo"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center h-32">
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              multiple
            />
            <label 
              htmlFor="imageUpload" 
              className="flex flex-col items-center cursor-pointer"
            >
              {isUploading ? (
                <div className="text-center">
                  <div className="spinner mb-2 h-8 w-8 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin mx-auto"></div>
                  <p className="text-sm text-gray-500">Uploading...</p>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-blue-100 rounded-full mb-2">
                    <Camera size={24} className="text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-700 mb-1 font-medium">
                    {selectedImages.length > 0 ? "Add more photos" : "Add photos"}
                  </p>
                  <p className="text-xs text-gray-500">or drag and drop</p>
                </>
              )}
            </label>
          </div>

          <DrawerFooter className="px-0 mt-4">
            <Button 
              onClick={handleSave} 
              className="w-full bg-blue-600"
              disabled={selectedImages.length === 0 || isUploading}
            >
              {selectedImages.length > 0 ? `Add ${selectedImages.length} Photo${selectedImages.length !== 1 ? 's' : ''}` : 'Cancel'}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
