import { useCallback, useEffect, useState } from 'react';
import { supabase, POPUP_IMAGES_TABLE } from '../supabase/client';

export function usePopupImages(postTitle) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImages = useCallback(async () => {
    if (!postTitle) {
      setImages([]);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from(POPUP_IMAGES_TABLE)
      .select('*')
      .eq('post_title', postTitle)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) {
      setError(error);
      setImages([]);
    } else {
      setImages(data ?? []);
    }
    setLoading(false);
  }, [postTitle]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return { images, loading, error, refetch: fetchImages };
}
