
import React from "react";
import { CollectionCard, CollectionType } from "./CollectionCard";

interface CollectionGridProps {
  collections: CollectionType[];
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({ collections }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
};
