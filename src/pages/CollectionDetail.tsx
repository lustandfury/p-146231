
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ChevronLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { PhotoUploadDrawer } from "@/components/photos/PhotoUploadDrawer";
import { supabase } from "@/integrations/supabase/client";
import { collectionService } from "@/services/collectionService";
import { CollectionType } from "@/components/collections/CollectionCard";

interface PhotoType {
  id: string;
  imageUrl: string;
  caption?: string;
}

type ActionType = "confirm" | "notMe" | "inappropriate";

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoType | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(false);
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [collection, setCollection] = useState<CollectionType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast.error("Collection ID is missing");
      navigate("/");
      return;
    }

    const fetchCollectionAndPhotos = async () => {
      try {
        setIsLoading(true);
        // Fetch collection details
        const collectionData = await collectionService.getCollectionById(id);
        if (!collectionData) {
          toast.error("Collection not found");
          navigate("/");
          return;
        }
        
        setCollection(collectionData);

        // Fetch photos for this collection
        const { data: photosData, error: photosError } = await supabase
          .from('photos')
          .select('*')
          .eq('collection_id', id);

        if (photosError) throw photosError;

        // Convert Supabase photos to our PhotoType
        if (photosData) {
          const formattedPhotos: PhotoType[] = await Promise.all(
            photosData.map(async (photo) => {
              const { data: { publicUrl } } = supabase.storage
                .from('photos')
                .getPublicUrl(photo.storage_key);

              return {
                id: photo.id,
                imageUrl: publicUrl,
                caption: photo.caption
              };
            })
          );

          setPhotos(formattedPhotos);
        }
      } catch (error) {
        console.error('Error fetching collection and photos:', error);
        toast.error('Failed to load collection');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectionAndPhotos();
  }, [id, navigate]);

  const handleAction = (photo: PhotoType, action: ActionType) => {
    setSelectedPhoto(photo);
    setActionType(action);
    setIsDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedPhoto || !actionType) return;
    
    switch (actionType) {
      case "confirm":
        toast.success("Photo confirmed as you");
        break;
      case "notMe":
        toast.success("Reported as 'not me'");
        break;
      case "inappropriate":
        toast.success("Reported as inappropriate");
        break;
    }
    
    setIsDialogOpen(false);
    setSelectedPhoto(null);
    setActionType(null);
  };

  const handlePhotoUpload = (newPhotos: PhotoType[]) => {
    setPhotos(prev => [...prev, ...newPhotos]);
    toast.success(`${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''} added to collection`);
    setIsUploadDrawerOpen(false);
  };

  const getDialogContent = () => {
    switch (actionType) {
      case "confirm":
        return {
          title: "Confirm Photo",
          description: "Are you sure this photo contains you?"
        };
      case "notMe":
        return {
          title: "Report Photo",
          description: "Report this photo as not containing you?"
        };
      case "inappropriate":
        return {
          title: "Report Photo",
          description: "Report this photo as inappropriate?"
        };
      default:
        return {
          title: "",
          description: ""
        };
    }
  };

  const dialogContent = getDialogContent();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="spinner h-8 w-8 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin"></div>
      </div>
    );
  }

  if (!collection) {
    return <div className="p-4">Collection not found</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center justify-between py-4 px-5 border-b">
        <div className="flex items-center">
          <button onClick={() => navigate("/")} className="mr-4">
            <ChevronLeft />
          </button>
          <h1 className="text-lg font-semibold">{collection.title}</h1>
        </div>
        <button 
          onClick={() => setIsUploadDrawerOpen(true)} 
          className="p-2"
          aria-label="Add photos"
        >
          <Plus size={24} />
        </button>
      </header>
      <div className="flex-1 overflow-auto p-4">
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M15.9998 5.91026C16.7362 5.91026 17.3332 6.50721 17.3332 7.24359V25.9103C17.3332 26.6466 16.7362 27.2436 15.9998 27.2436C15.2635 27.2436 14.6665 26.6466 14.6665 25.9103V7.24359C14.6665 6.50721 15.2635 5.91026 15.9998 5.91026Z" fill="#9CA3AF"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M5.3335 16.5769C5.3335 15.8405 5.93045 15.2436 6.66683 15.2436H25.3335C26.0699 15.2436 26.6668 15.8405 26.6668 16.5769C26.6668 17.3133 26.0699 17.9103 25.3335 17.9103H6.66683C5.93045 17.9103 5.3335 17.3133 5.3335 16.5769Z" fill="#9CA3AF"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No photos yet</h3>
            <p className="text-sm text-gray-500">Add your first photo by tapping the + button above</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="mb-4">
                <div className="relative">
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.caption || collection.title} 
                    className="w-full h-auto aspect-square object-cover rounded-lg shadow-md"
                  />
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 text-xs"
                    onClick={() => handleAction(photo, "confirm")}
                  >
                    Confirm It's Me
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => handleAction(photo, "notMe")}
                  >
                    Not Me
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => handleAction(photo, "inappropriate")}
                  >
                    Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PhotoUploadDrawer 
        isOpen={isUploadDrawerOpen}
        onClose={() => setIsUploadDrawerOpen(false)}
        onSave={handlePhotoUpload}
      />
    </div>
  );
};

export default CollectionDetail;
