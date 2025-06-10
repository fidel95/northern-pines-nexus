
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Plus, Trash2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

export const ContentEditor = ({ sections, onSectionsChange }: ContentEditorProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [formData, setFormData] = useState<Partial<ContentSection>>({
    type: 'text',
    title: '',
    content: '',
    imageUrl: '',
    buttonText: '',
    buttonLink: ''
  });

  const handleOpenDialog = (section?: ContentSection) => {
    if (section) {
      setEditingSection(section);
      setFormData(section);
    } else {
      setEditingSection(null);
      setFormData({
        type: 'text',
        title: '',
        content: '',
        imageUrl: '',
        buttonText: '',
        buttonLink: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const newSection: ContentSection = {
      id: editingSection?.id || `section-${Date.now()}`,
      type: formData.type || 'text',
      title: formData.title,
      content: formData.content,
      imageUrl: formData.imageUrl,
      buttonText: formData.buttonText,
      buttonLink: formData.buttonLink
    };

    if (editingSection) {
      const updatedSections = sections.map(s => s.id === editingSection.id ? newSection : s);
      onSectionsChange(updatedSections);
    } else {
      onSectionsChange([...sections, newSection]);
    }

    setIsDialogOpen(false);
    toast({
      title: "Content Updated",
      description: editingSection ? "Section updated successfully" : "New section added successfully"
    });
  };

  const handleDelete = (sectionId: string) => {
    const updatedSections = sections.filter(s => s.id !== sectionId);
    onSectionsChange(updatedSections);
    toast({
      title: "Content Deleted",
      description: "Section removed successfully"
    });
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span>Content Editor</span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="bg-black hover:bg-gray-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingSection ? 'Edit Section' : 'Add New Section'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Section Type</Label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as ContentSection['type']})}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    <option value="text">Text Section</option>
                    <option value="hero">Hero Section</option>
                    <option value="image">Image Section</option>
                    <option value="button">Button Section</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-gray-300">Title</Label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Section title"
                  />
                </div>

                {(formData.type === 'text' || formData.type === 'hero') && (
                  <div>
                    <Label className="text-gray-300">Content</Label>
                    <Textarea
                      value={formData.content || ''}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Section content"
                      rows={4}
                    />
                  </div>
                )}

                {formData.type === 'image' && (
                  <div>
                    <Label className="text-gray-300">Image URL</Label>
                    <Input
                      value={formData.imageUrl || ''}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}

                {formData.type === 'button' && (
                  <>
                    <div>
                      <Label className="text-gray-300">Button Text</Label>
                      <Input
                        value={formData.buttonText || ''}
                        onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Click me"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Button Link</Label>
                      <Input
                        value={formData.buttonLink || ''}
                        onChange={(e) => setFormData({...formData, buttonLink: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="/contact or https://example.com"
                      />
                    </div>
                  </>
                )}

                <Button onClick={handleSave} className="w-full bg-black hover:bg-gray-700">
                  <Save className="w-4 h-4 mr-2" />
                  {editingSection ? 'Update Section' : 'Add Section'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="flex items-center justify-between p-3 border border-gray-600 rounded-lg bg-gray-700">
              <div>
                <p className="font-medium text-white">{section.title || `${section.type} section`}</p>
                <p className="text-sm text-gray-400">Type: {section.type}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleOpenDialog(section)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(section.id)}
                  className="text-red-400 hover:text-red-300 border-gray-600 hover:bg-gray-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {sections.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No content sections. Add your first section to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
