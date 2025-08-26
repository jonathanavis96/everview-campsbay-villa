import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Mountain, Waves, Shirt, Eye } from 'lucide-react';
import masterBedroomImage from '@/assets/master-bedroom-ocean.jpg';

const BedroomsSection = () => {
  const bedrooms = [
    {
      name: 'Master Suite',
      features: ['Private Balcony', 'Ocean Views', 'Dressing Room', 'En-suite Bathroom'],
      icon: Eye,
      highlight: 'Panoramic ocean views',
      image: masterBedroomImage,
    },
    {
      name: 'Ocean King (Upstairs)',
      features: ['Mountain Views', 'Ocean Views', 'En-suite Bathroom', 'Built-in Storage'],
      icon: Waves,
      highlight: 'Stunning sea vistas',
      image: masterBedroomImage, // Placeholder - would generate separate images
    },
    {
      name: 'Garden King (Upstairs)',
      features: ['Private Balcony', 'Mountain Views', 'En-suite Bathroom', 'Garden Outlook'],
      icon: Mountain,
      highlight: 'Tranquil mountain setting',
      image: masterBedroomImage, // Placeholder
    },
    {
      name: 'Ground Floor King',
      features: ['Mountain Views', 'Garden Access', 'En-suite Bathroom', 'Complete Privacy'],
      icon: Mountain,
      highlight: 'Private garden level',
      image: masterBedroomImage, // Placeholder
    },
  ];

  return (
    <section id="bedrooms" className="section-spacing">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-ever-ink mb-6">
            Bedrooms & Layout
          </h2>
          <p className="font-body text-xl text-ever-body max-w-3xl mx-auto">
            Four beautifully appointed bedrooms, each with their own character and stunning views. 
            Every room offers en-suite facilities and thoughtful design details.
          </p>
        </div>

        {/* Bedrooms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {bedrooms.map((bedroom, index) => (
            <Card key={index} className="card-luxury overflow-hidden group">
              <div className="relative overflow-hidden">
                <img
                  src={bedroom.image}
                  alt={bedroom.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="border border-ever-champ bg-ever-champ/20 text-ever-ink">
                    <bedroom.icon className="w-4 h-4 mr-2" />
                    {bedroom.highlight}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-heading text-2xl font-bold text-ever-ink mb-4">
                  {bedroom.name}
                </h3>
                
                <div className="grid grid-cols-2 gap-2">
                  {bedroom.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center text-sm text-ever-body"
                    >
                      <div className="w-2 h-2 bg-ever-champ rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sleeping Arrangements Summary */}
        <div className="bg-white border border-ever-line rounded-2xl p-8 text-center">
          <h3 className="font-heading text-2xl font-bold text-ever-ink mb-4">
            Sleeping Arrangements
          </h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="flex items-center">
              <Bed className="h-6 w-6 text-ever-blue mr-3" />
              <span className="font-body text-lg text-ever-body">
                <strong className="font-semibold">4</strong> Queen Beds
              </span>
            </div>
            <div className="flex items-center">
              <Shirt className="h-6 w-6 text-ever-blue mr-3" />
              <span className="font-body text-lg text-ever-body">
                <strong className="font-semibold">4.5</strong> Bathrooms
              </span>
            </div>
            <div className="flex items-center">
              <Eye className="h-6 w-6 text-ever-blue mr-3" />
              <span className="font-body text-lg text-ever-body">
                Comfortably sleeps <strong className="font-semibold">8 guests</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BedroomsSection;