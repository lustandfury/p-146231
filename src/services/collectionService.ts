
import { supabase } from "@/integrations/supabase/client";
import { CollectionType } from "@/components/collections/CollectionCard";

class CollectionService {
  async getCollections(): Promise<CollectionType[]> {
    const { data, error } = await supabase
      .from('collections')
      .select('*');

    if (error) {
      console.error('Error fetching collections:', error);
      return [];
    }

    return data.map(collection => ({
      id: collection.id,
      title: collection.name,
      imageUrl: collection.image_url || "https://cdn.builder.io/api/v1/image/assets/TEMP/b4fcca08618062d33eb67fee4b4c56cb0d66b188",
      location: collection.location
    }));
  }

  async addCollection(collection: Omit<CollectionType, "id">): Promise<CollectionType> {
    const { data, error } = await supabase
      .from('collections')
      .insert({
        name: collection.title,
        image_url: collection.imageUrl,
        location: collection.location
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding collection:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.name,
      imageUrl: data.image_url,
      location: data.location
    };
  }

  async addPhotoToCollection(collectionId: string, photoUrl: string): Promise<void> {
    const { error } = await supabase
      .from('photos')
      .insert({
        collection_id: collectionId,
        storage_key: photoUrl
      });

    if (error) {
      console.error('Error adding photo to collection:', error);
      throw error;
    }
  }
}

export const collectionService = new CollectionService();
