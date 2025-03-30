
import React from "react";
import { CollectionCard, CollectionType } from "./CollectionCard";

interface CollectionGridProps {
  collections: CollectionType[];
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({ collections }) => {
  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="p-4 bg-gray-100 rounded-full mb-4">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M15.9998 5.91026C16.7362 5.91026 17.3332 6.50721 17.3332 7.24359V25.9103C17.3332 26.6466 16.7362 27.2436 15.9998 27.2436C15.2635 27.2436 14.6665 26.6466 14.6665 25.9103V7.24359C14.6665 6.50721 15.2635 5.91026 15.9998 5.91026Z" fill="#9CA3AF"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M5.3335 16.5769C5.3335 15.8405 5.93045 15.2436 6.66683 15.2436H25.3335C26.0699 15.2436 26.6668 15.8405 26.6668 16.5769C26.6668 17.3133 26.0699 17.9103 25.3335 17.9103H6.66683C5.93045 17.9103 5.3335 17.3133 5.3335 16.5769Z" fill="#9CA3AF"/>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No collections yet</h3>
        <p className="text-sm text-gray-500">Create your first collection by tapping the + button above</p>
      </div>
    );
  }

  return (
    <div className={`grid ${collections.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
      {collections.map((collection, index) => (
        <CollectionCard 
          key={collection.id} 
          collection={collection} 
          isFirst={index === 0}
        />
      ))}
    </div>
  );
};
