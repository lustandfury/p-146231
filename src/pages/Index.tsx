
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { CreateCollectionDialog } from "@/components/collections/CreateCollectionDialog";
import { CollectionType } from "@/components/collections/CollectionCard";
import { toast } from "sonner";

const Index = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [collections, setCollections] = useState<CollectionType[]>([
    {
      id: "1",
      title: "TCU Grad 2025",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/b4fcca08618062d33eb67fee4b4c56cb0d66b188"
    },
    {
      id: "2",
      title: "May's Birthday Bash",
      imageUrl: "/lovable-uploads/8dd3cd0b-f7d7-4f94-82f7-768b047780be.png",
      location: "Miami Beach"
    }
  ]);

  const handleCreateCollection = (name: string, location: string) => {
    // In a real app, this would call an API to create the collection
    const newCollection: CollectionType = {
      id: `${collections.length + 1}`,
      title: name,
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/b4fcca08618062d33eb67fee4b4c56cb0d66b188",
      location: location || undefined
    };
    
    setCollections([...collections, newCollection]);
    toast.success(`Collection "${name}" created successfully!`);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[430px] h-screen bg-white mx-auto my-0 max-md:w-full max-sm:w-full">
      <Header onAddClick={() => setIsCreateDialogOpen(true)} />
      <main className="flex flex-col flex-1 w-full max-w-[390px] px-0 py-5 overflow-auto max-md:p-[15px] max-sm:p-2.5">
        <CollectionGrid collections={collections} />
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
