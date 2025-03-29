
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface CreateCollectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, location: string) => void;
}

export const CreateCollectionDialog: React.FC<CreateCollectionDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [collectionName, setCollectionName] = useState("");
  const [location, setLocation] = useState("");

  const handleSave = () => {
    if (collectionName.trim()) {
      onSave(collectionName, location);
      setCollectionName("");
      setLocation("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Create New Collection</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div>
            <label htmlFor="collectionName" className="text-sm font-medium mb-1 block">
              Event Name
            </label>
            <input
              id="collectionName"
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter collection name"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add location (optional)"
              />
            </div>
          </div>
          <Button onClick={handleSave} className="w-full bg-blue-600">Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
