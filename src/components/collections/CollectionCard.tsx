
import React from "react";
import { Link } from "react-router-dom";

export interface CollectionType {
  id: string;
  title: string;
  imageUrl: string;
  location?: string;
}

interface CollectionCardProps {
  collection: CollectionType;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  return (
    <Link to={`/collection/${collection.id}`} className="block w-full">
      <div className="mb-5">
        <img
          src={collection.imageUrl}
          alt={collection.title}
          className="w-full h-[180px] object-cover shadow-[0px_4px_6px_1px_rgba(0,0,0,0.10),0px_2px_4px_-1px_rgba(0,0,0,0.06)] rounded-md"
        />
        <div className="mt-2">
          <div className="text-sm font-medium text-neutral-900">{collection.title}</div>
          {collection.location && (
            <div className="text-xs text-gray-500">{collection.location}</div>
          )}
        </div>
      </div>
    </Link>
  );
};
