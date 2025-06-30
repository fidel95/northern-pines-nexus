
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ContentItem {
  id: string;
  section: string;
  field_name: string;
  content: string;
  content_type: string;
  updated_at: string;
}

export const useHomepageContent = () => {
  const [content, setContent] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .order('section', { ascending: true });

      if (error) throw error;

      const contentMap: Record<string, Record<string, string>> = {};
      data?.forEach((item: ContentItem) => {
        if (!contentMap[item.section]) {
          contentMap[item.section] = {};
        }
        contentMap[item.section][item.field_name] = item.content;
      });

      setContent(contentMap);
    } catch (error) {
      console.error('Error fetching homepage content:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (section: string, fieldName: string, newContent: string) => {
    try {
      const { error } = await supabase
        .from('homepage_content')
        .upsert({
          section,
          field_name: fieldName,
          content: newContent,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section,field_name'
        });

      if (error) throw error;

      // Update local state
      setContent(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [fieldName]: newContent
        }
      }));

      return true;
    } catch (error) {
      console.error('Error updating content:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return { content, loading, updateContent, refetch: fetchContent };
};
