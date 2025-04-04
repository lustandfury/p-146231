
import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Camera, X } from "lucide-react";
import { toast } from "sonner";

interface CreateCollectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, location: string, imageUrl?: string, imageFile?: File) => void;
}

export const CreateCollectionDialog: React.FC<CreateCollectionDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [collectionName, setCollectionName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSaveCollection = () => {
    if (collectionName.trim()) {
      onSave(collectionName, location, selectedImage || undefined, imageFile || undefined);
      resetForm();
      onClose();
    } else {
      toast.error("Please enter a collection name");
    }
  };

  const resetForm = () => {
    setCollectionName("");
    setLocation("");
    setSelectedImage(null);
    setImageFile(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setIsUploading(false);
    }
  };

  const removeSelectedImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setImageFile(null);
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleClose} shouldScaleBackground>
      <DrawerContent className="px-4 pb-6">
        <DrawerHeader className="text-center">
          <DrawerTitle>Create New Collection</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div>
            <label htmlFor="collectionName" className="text-sm font-medium mb-1 block">
              Event Name
            </label>
            <Input
              id="collectionName"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Enter collection name"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
                placeholder="Add location (optional)"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Add Photo</label>
            {selectedImage ? (
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-md"
                />
                <button 
                  onClick={removeSelectedImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center h-48">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
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
                      <p className="text-sm text-gray-700 mb-1 font-medium">Add photo</p>
                      <p className="text-xs text-gray-500">or drag and drop</p>
                    </>
                  )}
                </label>
              </div>
            )}
          </div>

          <DrawerFooter className="px-0 pb-0">
            <Button onClick={handleSaveCollection} className="w-full bg-blue-600">
              Create Collection
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
