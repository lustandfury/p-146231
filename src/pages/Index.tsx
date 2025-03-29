
import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { CreateCollectionDialog } from "@/components/collections/CreateCollectionDialog";
import { CollectionType } from "@/components/collections/CollectionCard";
import { toast } from "sonner";
import { collectionService } from "@/services/collectionService";

const Index = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setIsLoading(true);
      const data = await collectionService.getCollections();
      setCollections(data);
    } catch (error) {
      toast.error("Failed to load collections");
      console.error("Failed to load collections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCollection = async (name: string, location: string, imageUrl?: string) => {
    try {
      const newCollection = await collectionService.addCollection({
        title: name,
        imageUrl: imageUrl || "https://cdn.builder.io/api/v1/image/assets/TEMP/b4fcca08618062d33eb67fee4b4c56cb0d66b188",
        location: location || undefined
      });
      
      setCollections(prev => [...prev, newCollection]);
      toast.success(`Collection "${name}" created successfully!`);
    } catch (error) {
      toast.error("Failed to create collection");
      console.error("Failed to create collection:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[430px] h-screen bg-white mx-auto my-0 max-md:w-full max-sm:w-full">
      <Header onAddClick={() => setIsCreateDialogOpen(true)} />
      <main className="flex flex-col flex-1 w-full max-w-[390px] px-0 py-5 overflow-auto max-md:p-[15px] max-sm:p-2.5">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="spinner h-8 w-8 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin"></div>
          </div>
        ) : (
          <CollectionGrid collections={collections} />
        )}
      </main>
      <BottomNav />
      
      <CreateCollectionDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleCreateCollection}
      />
    </div>
  );
};

export default Index;
