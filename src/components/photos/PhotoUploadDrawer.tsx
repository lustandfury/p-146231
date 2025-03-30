
import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PhotoType } from "@/services/collectionService";

interface PhotoUploadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (photos: PhotoType[]) => void;
  collectionId?: string;
}

export const PhotoUploadDrawer: React.FC<PhotoUploadDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  collectionId
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    const newCaptions = newFiles.map(() => "");
    
    setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
    setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    setCaptions(prevCaptions => [...prevCaptions, ...newCaptions]);
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    setCaptions(prevCaptions => prevCaptions.filter((_, i) => i !== index));
  };

  const handleCaptionChange = (index: number, caption: string) => {
    setCaptions(prevCaptions => {
      const newCaptions = [...prevCaptions];
      newCaptions[index] = caption;
      return newCaptions;
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    const uploadedPhotos: PhotoType[] = [];
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const caption = captions[i];
        const fileName = `${Date.now()}-${file.name}`;
        
        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('photos')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(fileName);
          
        // Insert photo record in database
        const { data: photoData, error: photoError } = await supabase
          .from('photos')
          .insert({
            storage_key: fileName,
            caption: caption,
            collection_id: collectionId
          })
          .select()
          .single();
          
        if (photoError) throw photoError;
        
        // Link photo to collection if collectionId is provided
        if (collectionId) {
          const { error: linkError } = await supabase
            .from('collection_photos')
            .insert({
              collection_id: collectionId,
              photo_id: photoData.id
            });
            
          if (linkError) throw linkError;
        }
        
        // Add to our array of uploaded photos
        uploadedPhotos.push({
          id: photoData.id,
          imageUrl: publicUrl,
          caption: caption,
          collection_id: collectionId,
          storage_key: fileName
        });
      }
      
      // Clear all states
      cleanupPreviews();
      setSelectedFiles([]);
      setPreviews([]);
      setCaptions([]);
      
      toast.success(`${uploadedPhotos.length} photo${uploadedPhotos.length > 1 ? 's' : ''} uploaded successfully`);
      onSave(uploadedPhotos);
      onClose();
      
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos');
    } finally {
      setIsUploading(false);
    }
  };

  const cleanupPreviews = () => {
    previews.forEach(preview => URL.revokeObjectURL(preview));
  };

  const handleClose = () => {
    cleanupPreviews();
    setSelectedFiles([]);
    setPreviews([]);
    setCaptions([]);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="px-4 pb-6 max-h-[80vh]">
        <DrawerHeader className="text-center">
          <DrawerTitle>Add Photos</DrawerTitle>
        </DrawerHeader>
        
        <div className="flex flex-col space-y-4 py-4 overflow-y-auto">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center">
            <input
              type="file"
              id="photoUpload"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <label 
              htmlFor="photoUpload" 
              className="flex flex-col items-center cursor-pointer p-4"
            >
              <div className="p-3 bg-blue-100 rounded-full mb-2">
                <Camera size={24} className="text-blue-600" />
              </div>
              <p className="text-sm font-medium mb-1">Upload photos</p>
              <p className="text-xs text-gray-500">Click to browse or drag and drop</p>
            </label>
          </div>
          
          {previews.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Selected Photos ({previews.length})</h3>
              
              {previews.map((preview, index) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="relative mb-2">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <button 
                      onClick={() => handleRemoveFile(index)} 
                      className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                  
                  <div className="mt-2">
                    <Label htmlFor={`caption-${index}`} className="text-xs font-medium">
                      Add a caption (optional)
                    </Label>
                    <Input 
                      id={`caption-${index}`}
                      value={captions[index] || ''}
                      onChange={(e) => handleCaptionChange(index, e.target.value)}
                      placeholder="Write a caption..."
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DrawerFooter>
          <Button 
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0}
            className="w-full"
          >
            {isUploading ? (
              <>
                <span className="mr-2 spinner h-4 w-4 rounded-full border-2 border-gray-300 border-t-white animate-spin"></span>
                Uploading...
              </>
            ) : `Upload ${selectedFiles.length > 0 ? selectedFiles.length : ''} Photo${selectedFiles.length !== 1 ? 's' : ''}`}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
