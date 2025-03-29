
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

// Mock data - in a real app, this would come from an API
const collectionsData = [
  {
    id: "1",
    title: "TCU Grad 2025",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/b4fcca08618062d33eb67fee4b4c56cb0d66b188",
    photos: [
      { 
        id: "photo1",
        imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/b4fcca08618062d33eb67fee4b4c56cb0d66b188",
        caption: "Group photo"
      },
      { 
        id: "photo2",
        imageUrl: "/lovable-uploads/8dd3cd0b-f7d7-4f94-82f7-768b047780be.png",
        caption: "May's Birthday Bash"
      }
    ]
  },
  {
    id: "2",
    title: "May's Birthday Bash",
    imageUrl: "/lovable-uploads/8dd3cd0b-f7d7-4f94-82f7-768b047780be.png",
    location: "Miami Beach",
    photos: [
      { 
        id: "photo3",
        imageUrl: "/lovable-uploads/8dd3cd0b-f7d7-4f94-82f7-768b047780be.png",
        caption: "Birthday celebration"
      }
    ]
  }
];

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

  const collection = collectionsData.find(c => c.id === id);

  if (!collection) {
    return <div className="p-4">Collection not found</div>;
  }

  const handleAction = (photo: PhotoType, action: ActionType) => {
    setSelectedPhoto(photo);
    setActionType(action);
    setIsDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedPhoto || !actionType) return;
    
    // Here you would typically make an API call
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

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center py-4 px-5 border-b">
        <button onClick={() => navigate("/")} className="mr-4">
          <ChevronLeft />
        </button>
        <h1 className="text-lg font-semibold">{collection.title}</h1>
      </header>
      <div className="flex-1 overflow-auto p-4">
        {collection.photos.map(photo => (
          <div key={photo.id} className="mb-8">
            <div className="relative">
              <img 
                src={photo.imageUrl} 
                alt={photo.caption || collection.title} 
                className="w-full h-auto rounded-lg shadow-md"
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
    </div>
  );
};

export default CollectionDetail;
