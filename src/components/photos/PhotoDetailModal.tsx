
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share, Instagram, CheckCircle, X, AlertTriangle } from "lucide-react";
import { PhotoType } from "@/services/collectionService";
import { toast } from "sonner";

interface PhotoDetailModalProps {
  photo: PhotoType | null;
  isOpen: boolean;
  onClose: () => void;
  onReport: (type: 'confirm' | 'notMe' | 'inappropriate') => void;
}

export const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  photo,
  isOpen,
  onClose,
  onReport
}) => {
  if (!photo) return null;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: photo.caption || "Shared Photo",
          text: "Check out this photo!",
          url: photo.imageUrl,
        });
        toast.success("Shared successfully");
      } else {
        // Fallback for browsers that don't support the Web Share API
        toast.info("Copying link to clipboard...");
        await navigator.clipboard.writeText(photo.imageUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share");
    }
  };

  const handleShareToInstagram = () => {
    // In a real app, we would use Instagram's API
    // For now, just simulate it with a toast
    toast.success("Photo shared to Instagram");
    onClose();
  };

  const handleShareToTikTok = () => {
    // In a real app, we would use TikTok's API
    // For now, just simulate it with a toast
    toast.success("Photo shared to TikTok");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{photo.caption || "Photo Detail"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <img 
              src={photo.imageUrl} 
              alt={photo.caption || "Photo"} 
              className="w-full h-auto aspect-auto object-contain rounded-md"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="flex items-center justify-center gap-2"
            >
              <Share size={16} />
              Share
            </Button>
            <Button 
              variant="outline" 
              onClick={handleShareToInstagram}
              className="flex items-center justify-center gap-2"
            >
              <Instagram size={16} />
              Instagram
            </Button>
          </div>
          
          <div className="flex flex-col space-y-2 pt-2 border-t">
            <p className="text-sm font-medium text-gray-700">Is this you in the photo?</p>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                onClick={() => onReport('confirm')}
                className="flex items-center justify-center gap-1"
              >
                <CheckCircle size={16} className="text-green-500" />
                Yes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onReport('notMe')}
                className="flex items-center justify-center gap-1"
              >
                <X size={16} className="text-red-500" />
                Not me
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onReport('inappropriate')}
                className="flex items-center justify-center gap-1"
              >
                <AlertTriangle size={16} className="text-amber-500" />
                Report
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
