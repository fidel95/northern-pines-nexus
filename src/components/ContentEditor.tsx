
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';

interface ContentSection {
  id: string;
  type: 'hero' | 'text' | 'image' | 'button';
  title?: string;
  content?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface ContentEditorProps {
  sections: ContentSection[];
  onSectionsChange: (sections: ContentSection[]) => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ sections, onSectionsChange }) => {
  const [newSectionType, setNewSectionType] = useState<'hero' | 'text' | 'image' | 'button'>('text');

  const addSection = () => {
    const newSection: ContentSection = {
      id: Date.now().toString(),
      type: newSectionType,
      title: '',
      content: '',
      imageUrl: '',
      buttonText: '',
      buttonLink: ''
    };
    onSectionsChange([...sections, newSection]);
  };

  const updateSection = (id: string, updates: Partial<ContentSection>) => {
    const updatedSections = sections.map(section =>
      section.id === id ? { ...section, ...updates } : section
    );
    onSectionsChange(updatedSections);
  };

  const deleteSection = (id: string) => {
    onSectionsChange(sections.filter(section => section.id !== id));
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(section => section.id === id);
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < sections.length - 1)
    ) {
      const newSections = [...sections];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      [newSections[currentIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[currentIndex]];
      onSectionsChange(newSections);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select value={newSectionType} onValueChange={(value: any) => setNewSectionType(value)}>
          <SelectTrigger className="w-40 bg-gray-800 border-gray-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="hero">Hero</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="button">Button</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addSection} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Section
        </Button>
      </div>

      {sections.map((section, index) => (
        <Card key={section.id} className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span>{section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveSection(section.id, 'up')}
                  disabled={index === 0}
                  className="border-gray-600 text-gray-400 hover:bg-gray-700"
                >
                  <MoveUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveSection(section.id, 'down')}
                  disabled={index === sections.length - 1}
                  className="border-gray-600 text-gray-400 hover:bg-gray-700"
                >
                  <MoveDown className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteSection(section.id)}
                  className="border-red-600 text-red-400 hover:bg-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(section.type === 'hero' || section.type === 'text' || section.type === 'image') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <Input
                  value={section.title || ''}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                  placeholder="Enter title"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            )}

            {(section.type === 'hero' || section.type === 'text') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                <Textarea
                  value={section.content || ''}
                  onChange={(e) => updateSection(section.id, { content: e.target.value })}
                  placeholder="Enter content"
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={4}
                />
              </div>
            )}

            {section.type === 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <Input
                  value={section.imageUrl || ''}
                  onChange={(e) => updateSection(section.id, { imageUrl: e.target.value })}
                  placeholder="Enter image URL"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            )}

            {section.type === 'button' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Button Text</label>
                  <Input
                    value={section.buttonText || ''}
                    onChange={(e) => updateSection(section.id, { buttonText: e.target.value })}
                    placeholder="Enter button text"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Button Link</label>
                  <Input
                    value={section.buttonLink || ''}
                    onChange={(e) => updateSection(section.id, { buttonLink: e.target.value })}
                    placeholder="Enter button link"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}

      {sections.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-8">
            <p className="text-gray-400">No sections added yet. Click "Add Section" to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
