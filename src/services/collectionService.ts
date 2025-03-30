
import { supabase } from "@/integrations/supabase/client";
import { CollectionType } from "@/components/collections/CollectionCard";

// Define a PhotoType interface to avoid circular references
export interface PhotoType {
  id: string;
  imageUrl: string;
  caption?: string;
  collection_id?: string;
  storage_key?: string;
}

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

  async addCollection(collection: Omit<CollectionType, "id">, imageFile?: File): Promise<CollectionType> {
    let imageUrl = collection.imageUrl;

    // If an image file is provided, upload it to storage
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, imageFile);
      
      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);
      
      imageUrl = publicUrl;

      // Save the photo to the photos table as well
      const { data: photoData, error: photoError } = await supabase
        .from('photos')
        .insert({
          storage_key: fileName,
          caption: collection.title,
          location: collection.location
        })
        .select()
        .single();

      if (photoError) {
        console.error("Error creating photo record:", photoError);
      }
    }

    // Create the collection
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

    // If we uploaded a photo, link it to the collection
    if (imageFile && imageUrl) {
      const { data: photoData } = await supabase
        .from('photos')
        .select('*')
        .eq('storage_key', `${Date.now()}-${imageFile.name}`)
        .single();
      
      if (photoData) {
        await supabase
          .from('collection_photos')
          .insert({
            collection_id: data.id,
            photo_id: photoData.id
          });
      }
    }

    return {
      id: data.id,
      title: data.name,
      imageUrl: imageUrl || "https://cdn.builder.io/api/v1/image/assets/TEMP/b4fcca08618062d33eb67fee4b4c56cb0d66b188",
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

  async getPhotosByCollectionId(collectionId: string): Promise<PhotoType[]> {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('collection_id', collectionId);

    if (error) {
      console.error('Error fetching photos:', error);
      return [];
    }

    return data || [];
  }

  async addPhotoToCollection(collectionId: string, imageFile: File, caption?: string): Promise<PhotoType | null> {
    try {
      const fileName = `${Date.now()}-${imageFile.name}`;
      
      // Upload the file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, imageFile);
      
      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      // Insert the photo record
      const { data: photoData, error: photoError } = await supabase
        .from('photos')
        .insert({
          storage_key: fileName,
          caption: caption,
          collection_id: collectionId
        })
        .select()
        .single();

      if (photoError) throw photoError;

      // Link the photo to the collection
      await supabase
        .from('collection_photos')
        .insert({
          collection_id: collectionId,
          photo_id: photoData.id
        });

      return {
        id: photoData.id,
        imageUrl: publicUrl,
        caption: caption,
        collection_id: collectionId,
        storage_key: fileName
      };
    } catch (error) {
      console.error('Error adding photo to collection:', error);
      return null;
    }
  }

  async reportPhoto(photoId: string, reportType: 'confirm' | 'notMe' | 'inappropriate'): Promise<boolean> {
    try {
      // In a real application, you would store this in a database table
      // For now, we'll just log it
      console.log(`Photo ${photoId} reported as ${reportType}`);
      return true;
    } catch (error) {
      console.error('Error reporting photo:', error);
      return false;
    }
  }
}

export const collectionService = new CollectionService();
