
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { InlineEditor } from '@/components/InlineEditor';
import { supabase } from '@/integrations/supabase/client';
import { useHomepageContent } from '@/hooks/useHomepageContent';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Award, Building, Wrench } from 'lucide-react';

const AboutUs = () => {
  const { getContent, updateContent } = useHomepageContent();

  const handleContentSave = async (section: string, field: string, content: string) => {
    try {
      const success = await updateContent(section, field, content);
      return success;
    } catch (error) {
      console.error('Error saving content:', error);
      return false;
    }
  };

  const stats = [
    {
      icon: Building,
      number: "500+",
      label: "Projects Completed",
      color: "bg-blue-600"
    },
    {
      icon: Users,
      number: "25+",
      label: "Years Experience",
      color: "bg-blue-700"
    },
    {
      icon: Award,
      number: "50+",
      label: "Awards Won",
      color: "bg-blue-800"
    },
    {
      icon: Wrench,
      number: "100%",
      label: "Customer Satisfaction",
      color: "bg-blue-900"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <InlineEditor
              content={getContent('about', 'hero_title') || 'About Northern Pines Construction'}
              onSave={(content) => handleContentSave('about', 'hero_title', content)}
              className="text-4xl md:text-5xl font-bold text-white mb-6 block"
              placeholder="About Northern Pines Construction"
            />
            <InlineEditor
              content={getContent('about', 'hero_subtitle') || 'Building Excellence Since 1999'}
              onSave={(content) => handleContentSave('about', 'hero_subtitle', content)}
              className="text-xl text-blue-400 font-semibold mb-8 block"
              placeholder="Building Excellence Since 1999"
            />
            <InlineEditor
              content={getContent('about', 'hero_description') || 'We are a family-owned construction company dedicated to delivering exceptional craftsmanship and unparalleled service to our clients throughout Northern New Hampshire.'}
              onSave={(content) => handleContentSave('about', 'hero_description', content)}
              multiline
              className="text-lg text-gray-300 max-w-3xl mx-auto block"
              placeholder="We are a family-owned construction company..."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`${stat.color} rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <InlineEditor
                content={getContent('about', 'story_title') || 'Our Story'}
                onSave={(content) => handleContentSave('about', 'story_title', content)}
                className="text-3xl font-bold text-white mb-6 block"
                placeholder="Our Story"
              />
              <InlineEditor
                content={getContent('about', 'story_content') || 'Founded in 1999 by master carpenter John Northern, Northern Pines Construction began as a small residential contractor with a simple mission: to build homes and commercial spaces that stand the test of time. What started as a one-man operation has grown into a full-service construction company, but our commitment to quality craftsmanship and personal service remains unchanged.\n\nOver the years, we have expanded our services to include custom home building, commercial construction, renovations, and sustainable building practices. Our team of skilled craftsmen and project managers work closely with each client to bring their vision to life, ensuring every project meets our exacting standards for quality and durability.'}
                onSave={(content) => handleContentSave('about', 'story_content', content)}
                multiline
                className="text-gray-300 leading-relaxed whitespace-pre-line block"
                placeholder="Founded in 1999 by master carpenter John Northern..."
              />
            </div>
            <div className="bg-gray-900 border border-blue-800 rounded-lg p-8">
              <InlineEditor
                content={getContent('about', 'mission_title') || 'Our Mission'}
                onSave={(content) => handleContentSave('about', 'mission_title', content)}
                className="text-2xl font-bold text-blue-400 mb-4 block"
                placeholder="Our Mission"
              />
              <InlineEditor
                content={getContent('about', 'mission_content') || 'To deliver exceptional construction services that exceed our clients\' expectations while maintaining the highest standards of safety, quality, and environmental responsibility. We believe in building lasting relationships with our clients, partners, and community through honest communication, reliable service, and superior craftsmanship.'}
                onSave={(content) => handleContentSave('about', 'mission_content', content)}
                multiline
                className="text-gray-300 leading-relaxed block"
                placeholder="To deliver exceptional construction services..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <InlineEditor
              content={getContent('about', 'team_title') || 'Meet Our Team'}
              onSave={(content) => handleContentSave('about', 'team_title', content)}
              className="text-3xl font-bold text-white mb-6 block"
              placeholder="Meet Our Team"
            />
            <InlineEditor
              content={getContent('about', 'team_description') || 'Our experienced professionals are dedicated to bringing your construction dreams to life.'}
              onSave={(content) => handleContentSave('about', 'team_description', content)}
              className="text-lg text-gray-300 max-w-2xl mx-auto block"
              placeholder="Our experienced professionals are dedicated..."
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((member) => (
              <Card key={member} className="bg-gray-800 border-blue-700">
                <CardContent className="p-6 text-center">
                  <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-gray-400" />
                  </div>
                  <InlineEditor
                    content={getContent('about', `team_member_${member}_name`) || `Team Member ${member}`}
                    onSave={(content) => handleContentSave('about', `team_member_${member}_name`, content)}
                    className="text-xl font-semibold text-white mb-2 block"
                    placeholder={`Team Member ${member}`}
                  />
                  <InlineEditor
                    content={getContent('about', `team_member_${member}_role`) || 'Position Title'}
                    onSave={(content) => handleContentSave('about', `team_member_${member}_role`, content)}
                    className="text-blue-400 mb-4 block"
                    placeholder="Position Title"
                  />
                  <InlineEditor
                    content={getContent('about', `team_member_${member}_bio`) || 'Brief bio and experience description.'}
                    onSave={(content) => handleContentSave('about', `team_member_${member}_bio`, content)}
                    multiline
                    className="text-gray-300 text-sm block"
                    placeholder="Brief bio and experience description."
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
