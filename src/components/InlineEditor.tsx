
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Edit3, Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface InlineEditorProps {
  content: string;
  onSave: (value: string) => Promise<boolean> | boolean;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  disabled?: boolean;
}

export const InlineEditor: React.FC<InlineEditorProps> = ({
  content,
  onSave,
  className = "",
  placeholder = "Click to edit...",
  multiline = false,
  disabled = false,
}) => {
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(content);
  }, [content]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
      } else {
        inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
      }
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (!isAdmin || disabled) return;
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (value.trim() === content.trim()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const result = await onSave(value.trim());
      if (result !== false) {
        setIsEditing(false);
        toast({
          title: "Content Updated",
          description: "Your changes have been saved successfully.",
        });
      } else {
        toast({
          title: "Save Failed",
          description: "Failed to save your changes. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Save Error",
        description: "An error occurred while saving. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter" && e.ctrlKey && multiline) {
      e.preventDefault();
      handleSave();
    }
  };

  if (!isAdmin) {
    return (
      <div className={className}>
        {multiline ? (
          <div className="whitespace-pre-wrap">{content}</div>
        ) : (
          <span>{content}</span>
        )}
      </div>
    );
  }

  if (isEditing) {
    const InputComponent = multiline ? Textarea : Input;
    
    return (
      <div className="relative group">
        <InputComponent
          ref={inputRef as any}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`${className} min-h-[40px] ${multiline ? 'min-h-[100px]' : ''}`}
          placeholder={placeholder}
          disabled={isSaving}
        />
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-3 h-3 mr-1" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${className} cursor-pointer relative group hover:bg-gray-50 hover:shadow-sm transition-all duration-200 ${
        disabled ? 'cursor-not-allowed opacity-60' : ''
      }`}
      onClick={handleEdit}
    >
      {multiline ? (
        <div className="whitespace-pre-wrap">{content || placeholder}</div>
      ) : (
        <span>{content || placeholder}</span>
      )}
      {!disabled && (
        <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -right-6 top-1/2 transform -translate-y-1/2" />
      )}
    </div>
  );
};
