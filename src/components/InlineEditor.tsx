
import React, { useState } from 'react';
import { Check, X, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/hooks/use-toast';

interface InlineEditorProps {
  content: string;
  onSave: (content: string) => Promise<boolean>;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
}

export const InlineEditor = ({ 
  content, 
  onSave, 
  multiline = false, 
  className = "",
  placeholder = "Click to edit..."
}: InlineEditorProps) => {
  const { isAdmin, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);

  // Update editContent when content prop changes
  React.useEffect(() => {
    setEditContent(content);
  }, [content]);

  if (!isAdmin || !user) {
    return <span className={className}>{content || placeholder}</span>;
  }

  const handleSave = async () => {
    if (editContent.trim() === content.trim()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const success = await onSave(editContent.trim());
      
      if (success) {
        setIsEditing(false);
        toast({
          title: "Content Updated",
          description: "Your changes have been saved successfully.",
        });
      } else {
        toast({
          title: "Save Failed",
          description: "There was an error saving your changes. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && !multiline && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <div className="relative group">
        {multiline ? (
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} min-h-[100px] bg-white border-2 border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder={placeholder}
            autoFocus
            disabled={isSaving}
          />
        ) : (
          <Input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} bg-white border-2 border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder={placeholder}
            autoFocus
            disabled={isSaving}
          />
        )}
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
        </div>
        {!multiline && (
          <div className="text-xs text-gray-500 mt-1">
            Press Ctrl+Enter to save, Escape to cancel
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${className} group relative cursor-pointer hover:bg-blue-50 hover:bg-opacity-50 rounded p-2 transition-all duration-200 border border-transparent hover:border-blue-200`}
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      {content || <span className="text-gray-400 italic">{placeholder}</span>}
      <Edit className="w-4 h-4 absolute top-2 right-2 opacity-0 group-hover:opacity-70 transition-opacity bg-white rounded p-0.5 shadow-sm" />
    </div>
  );
};
