
import { useState } from 'react';
import { Check, X, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/SupabaseAuthContext';

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
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);

  if (!isAdmin) {
    return <span className={className}>{content}</span>;
  }

  const handleSave = async () => {
    setIsSaving(true);
    const success = await onSave(editContent);
    setIsSaving(false);
    
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="relative group">
        {multiline ? (
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className={`${className} min-h-[100px] bg-white border-2 border-blue-500`}
            placeholder={placeholder}
            autoFocus
          />
        ) : (
          <Input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className={`${className} bg-white border-2 border-blue-500`}
            placeholder={placeholder}
            autoFocus
          />
        )}
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${className} group relative cursor-pointer hover:bg-blue-50 hover:bg-opacity-50 rounded p-1 transition-colors`}
      onClick={() => setIsEditing(true)}
    >
      {content || placeholder}
      <Edit className="w-4 h-4 absolute top-1 right-1 opacity-0 group-hover:opacity-50 transition-opacity" />
    </div>
  );
};
