import { Card, CardContent } from '@/components/ui/card';
import { Utensils, Sofa, Wine, PlayCircle, ChefHat, Waves } from 'lucide-react';
import livingRoomImage from '@/assets/living-room-luxury.jpg';

const LivingSection = () => {
  const livingSpaces = [
    {
      name: 'Open Living Lounge',
      description: 'Spacious seating with panoramic ocean views, perfect for gathering and relaxation.',
      icon: Sofa,
      image: livingRoomImage,
    },
    {
      name: 'Gourmet Kitchen',
      description: 'Modern appliances, marble countertops, and a large island for culinary adventures.',
      icon: ChefHat,
      image: livingRoomImage, // Placeholder
    },
    {
      name: 'Indoor Dining',
      description: 'Elegant dining for 8 with stunning views and sophisticated ambiance.',
      icon: Utensils,
      image: livingRoomImage, // Placeholder
    },
    {
      name: 'Outdoor Terrace',
      description: 'Al fresco dining and entertaining with breathtaking sunset views.',
      icon: Waves,
      image: livingRoomImage, // Placeholder
    },
    {
      name: 'Wine Cellar & Bar',
      description: 'Curated wine collection and professional bar setup for memorable evenings.',
      icon: Wine,
      image: livingRoomImage, // Placeholder
    },
    {
      name: 'Entertainment Lounge',
      description: 'Pool table, media center, and comfortable seating for memorable nights.',
      icon: PlayCircle,
      image: livingRoomImage, // Placeholder
    },
  ];

  const lifestyleMoments = [
    'Sunset dinners on the terrace',
    'Movie nights in the lounge',
    'Wine cellar tastings',
    'Pool table evenings',
    'Morning coffee with ocean views',
    'Gourmet cooking experiences',
  ];

  return (
    <section id="living" className="section-spacing bg-gradient-to-b from-ever-bg to-ever-bg/90">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-ever-ink mb-6">
            Living & Entertaining
          </h2>
          <p className="font-body text-xl text-ever-body max-w-3xl mx-auto mb-8">
            Every space is designed for comfort, connection, and creating unforgettable memories 
            with family and friends.
          </p>

          {/* Lifestyle Moments */}
          <div className="bg-gradient-to-b from-white to-ever-bg border-t border-ever-champ rounded-2xl p-8 mb-16">
            <h3 className="font-heading text-2xl font-bold text-ever-ink mb-6">
              Moments to Treasure
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lifestyleMoments.map((moment, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-ever-champ rounded-full mr-3 flex-shrink-0"></div>
                  <span className="font-body text-ever-body font-medium">
                    {moment}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Living Spaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {livingSpaces.map((space, index) => (
            <Card key={index} className="card-luxury overflow-hidden group">
              <div className="relative overflow-hidden">
                <img
                  src={space.image}
                  alt={space.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 left-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                    <space.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-heading text-xl font-bold text-ever-ink mb-3">
                  {space.name}
                </h3>
                <p className="font-body text-ever-body leading-relaxed">
                  {space.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dining Experiences Highlight */}
        <div className="mt-16 bg-white border border-ever-line rounded-2xl p-8 md:p-12 text-center">
          <h3 className="font-heading text-3xl font-bold text-ever-ink mb-4">
            Multiple Dining Experiences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="text-center">
              <div className="border border-ever-champ w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Utensils className="h-8 w-8 text-ever-champ" />
              </div>
              <h4 className="font-body font-semibold text-ever-ink">Formal Dining</h4>
              <p className="text-sm text-ever-body">Elegant indoor setting</p>
            </div>
            <div className="text-center">
              <div className="border border-ever-champ w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Waves className="h-8 w-8 text-ever-champ" />
              </div>
              <h4 className="font-body font-semibold text-ever-ink">Ocean Terrace</h4>
              <p className="text-sm text-ever-body">Al fresco with views</p>
            </div>
            <div className="text-center">
              <div className="border border-ever-champ w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <ChefHat className="h-8 w-8 text-ever-champ" />
              </div>
              <h4 className="font-body font-semibold text-ever-ink">Kitchen Island</h4>
              <p className="text-sm text-ever-body">Casual breakfast nook</p>
            </div>
            <div className="text-center">
              <div className="border border-ever-champ w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wine className="h-8 w-8 text-ever-champ" />
              </div>
              <h4 className="font-body font-semibold text-ever-ink">Kitchen Island</h4>
              <p className="text-sm text-ever-body">Intimate tastings</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LivingSection;