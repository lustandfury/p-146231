
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
  isFirst?: boolean;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ 
  collection, 
  isFirst = false 
}) => {
  return (
    <Link 
      to={`/collection/${collection.id}`} 
      className={`block relative ${isFirst ? 'w-full col-span-2' : 'w-full'}`}
    >
      <div className="mb-5 relative">
        <img
          src={collection.imageUrl}
          alt={collection.title}
          className={`w-full ${isFirst ? 'h-[280px]' : 'h-[180px]'} object-cover shadow-[0px_4px_6px_1px_rgba(0,0,0,0.10),0px_2px_4px_-1px_rgba(0,0,0,0.06)] rounded-md`}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent rounded-b-md">
          <div className="text-sm font-medium text-white">{collection.title}</div>
          {collection.location && (
            <div className="text-xs text-gray-200">{collection.location}</div>
          )}
        </div>
      </div>
    </Link>
  );
};
