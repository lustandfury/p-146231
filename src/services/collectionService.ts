
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
      imageUrl: collection.description || "https://cdn.builder.io/api/v1/image/assets/TEMP/b4fcca08618062d33eb67fee4b4c56cb0d66b188",
      location: collection.description // Using description field as location for now
    }));
  }

  async addCollection(collection: Omit<CollectionType, "id">): Promise<CollectionType> {
    const { data, error } = await supabase
      .from('collections')
      .insert({
        name: collection.title,
        description: collection.location // Store location in description field
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
      imageUrl: collection.imageUrl,
      location: data.description
    };
  }

  async getCollectionById(id: string): Promise<CollectionType | null> {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching collection:', error);
      return null;
    }
    
    return {
      id: data.id,
      title: data.name,
      imageUrl: data.description || "https://cdn.builder.io/api/v1/image/assets/TEMP/b4fcca08618062d33eb67fee4b4c56cb0d66b188",
      location: data.description
    };
  }

  async getPhotosByCollectionId(collectionId: string) {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('collection_id', collectionId);

    if (error) {
      console.error('Error fetching photos:', error);
      return [];
    }

    return data;
  }
}

export const collectionService = new CollectionService();
