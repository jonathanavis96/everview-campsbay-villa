import { Badge } from '@/components/ui/badge';
import { Bed, Users, Home, Car, Zap, Shield } from 'lucide-react';

const VillaOverview = () => {
  const features = [
    { icon: Bed, text: '4 Bedrooms' },
    { icon: Users, text: 'Sleeps 8' },
    { icon: Home, text: 'Private Villa' },
    { icon: Car, text: 'Secure Parking' },
    { icon: Zap, text: 'Full Backup Power' },
    { icon: Shield, text: 'Premium Security' },
  ];

  return (
    <section id="overview" className="section-spacing bg-luxury-cream/30">
      <div className="container-luxury">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Header */}
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-luxury-charcoal mb-6">
            Your Private Sanctuary
          </h2>
          <p className="font-body text-xl text-muted-foreground mb-12 leading-relaxed">
            Discover unparalleled luxury in this exclusive 4-bedroom villa, where panoramic ocean views 
            meet sophisticated design. Perfect for families and intimate groups seeking privacy, comfort, 
            and the finest Cape Town has to offer.
          </p>

          {/* At a Glance Features */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-luxury text-center p-6 hover:scale-105 transition-transform duration-300"
              >
                <feature.icon className="h-8 w-8 text-luxury-gold mx-auto mb-4" />
                <p className="font-body text-sm font-medium text-foreground">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          {/* Featured Callout */}
          <div className="bg-gradient-to-r from-luxury-gold/10 to-luxury-champagne/20 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h3 className="font-heading text-2xl font-bold text-luxury-charcoal mb-3">
                  Villa Floor Plan
                </h3>
                <p className="font-body text-muted-foreground">
                  Explore the thoughtful layout and premium amenities throughout every level of Everview.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Badge
                  variant="secondary"
                  className="bg-luxury-gold text-white px-6 py-3 text-base hover:bg-luxury-gold/90 cursor-pointer transition-colors"
                >
                  Download Floor Plan (PDF)
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VillaOverview;