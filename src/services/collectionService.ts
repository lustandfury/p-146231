
import { CollectionType } from "@/components/collections/CollectionCard";

// Mock database service - In a real app, this would connect to a backend
class CollectionService {
  private collections: CollectionType[] = [
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
  ];

  async getCollections(): Promise<CollectionType[]> {
    return Promise.resolve([...this.collections]);
  }

  async addCollection(collection: Omit<CollectionType, "id">): Promise<CollectionType> {
    const newCollection = {
      ...collection,
      id: `${this.collections.length + 1}`
    };
    
    this.collections.push(newCollection);
    return Promise.resolve(newCollection);
  }

  async addPhotoToCollection(collectionId: string, photoUrl: string): Promise<void> {
    // In a real app, this would update the collection with new photos
    return Promise.resolve();
  }
}

export const collectionService = new CollectionService();
