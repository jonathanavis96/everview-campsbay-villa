import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Car,
  Waves,
  Mountain,
  Utensils,
  ShoppingBag,
  Camera,
} from "lucide-react";

const LocationSection = () => {
  const nearbyAttractions = [
    {
      name: "Camps Bay Beach",
      distance: "5-8 min walk",
      distanceKm: "~0.5 km",
      icon: Waves,
      description: "World-famous white sand beach with crystal-clear waters",
      category: "Beach",
    },
    {
      name: "Table Mountain Cable Car",
      distance: "10-15 min drive",
      distanceKm: "~6 km",
      icon: Mountain,
      description: "Iconic cable car to the top of Table Mountain",
      category: "Attraction",
    },
    {
      name: "V&A Waterfront",
      distance: "15-30 min drive",
      distanceKm: "~10 km",
      icon: ShoppingBag,
      description: "Premier shopping, dining, and entertainment destination",
      category: "Shopping & Dining",
    },
    {
      name: "Cape Town International Airport",
      distance: "25-30 min drive",
      distanceKm: "~23 km",
      icon: Car,
      description: "Direct international and domestic flights",
      category: "Transport",
    },
  ];

  const diningOptions = [
    "Codfather Seafood & Sushi",
    "The Roundhouse Restaurant",
    "Azure Restaurant",
    "Camps Bay Retreat",
    "HQ Restaurant",
    "Paranga Restaurant",
  ];

  return (
    <section id="location" className="section-spacing">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-luxury-charcoal mb-6">
            Prime Camps Bay Location
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Perfectly positioned on Cramond Road, minutes from Camps Bay's
            pristine beach, world-class dining, and Cape Town's most iconic
            attractions.
          </p>

          {/* Address Badge */}
          <div className="inline-flex items-center bg-luxury-gold/10 text-luxury-gold px-6 py-3 rounded-full">
            <MapPin className="w-5 h-5 mr-2" />
            <span className="font-body font-medium">
              14 Cramond Road, Camps Bay
            </span>
          </div>
        </div>

        {/* Interactive Map */}
        <div
          className="relative w-full overflow-hidden rounded-2xl mb-16"
          style={{ paddingTop: "40%" }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d361.5336953869003!2d18.3857876684248!3d-33.952026148004215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f120!3m3!1m2!1s0x1dcc67added5d659%3A0x6777a5740e47b06d!2s14%20Cramond%20Rd%2C%20Camps%20Bay%2C%20Cape%20Town%2C%208040!5e0!3m2!1sen!2sza!4v1756208341188!5m2!1sen!2sza"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0 rounded-2xl"
          />
        </div>

        {/* Nearby Attractions */}
        <div className="mb-16">
          <h3 className="font-heading text-3xl font-bold text-luxury-charcoal text-center mb-12">
            Getting Around
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nearbyAttractions.map((attraction, index) => (
              <Card key={index} className="card-luxury">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-luxury-gold/10 p-3 rounded-xl mr-4">
                        <attraction.icon className="h-6 w-6 text-luxury-gold" />
                      </div>
                      <div>
                        <h4 className="font-heading text-lg font-bold text-luxury-charcoal">
                          {attraction.name}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {attraction.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-body font-semibold text-luxury-gold">
                        {attraction.distance}
                      </div>
                      <div className="font-body text-xs text-muted-foreground">
                        {attraction.distanceKm}
                      </div>
                    </div>
                  </div>

                  <p className="font-body text-sm text-muted-foreground">
                    {attraction.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Dining & Entertainment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Dining Options */}
          <Card className="card-luxury">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Utensils className="h-8 w-8 text-luxury-gold mr-4" />
                <h3 className="font-heading text-2xl font-bold text-luxury-charcoal">
                  World-Class Dining
                </h3>
              </div>

              <p className="font-body text-muted-foreground mb-6">
                Camps Bay offers some of Cape Town's finest restaurants, all
                within walking distance or a short drive.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {diningOptions.map((restaurant, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-luxury-gold rounded-full mr-3 flex-shrink-0"></div>
                    <span className="font-body text-sm text-foreground">
                      {restaurant}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transportation */}
          <Card className="card-luxury">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Car className="h-8 w-8 text-luxury-gold mr-4" />
                <h3 className="font-heading text-2xl font-bold text-luxury-charcoal">
                  Easy Transportation
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-luxury-champagne/20 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-luxury-gold mr-3" />
                    <span className="font-body font-medium">
                      Airport Transfer
                    </span>
                  </div>
                  <span className="font-body text-sm text-muted-foreground">
                    25-30 mins
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-luxury-champagne/20 rounded-lg">
                  <div className="flex items-center">
                    <Waves className="h-5 w-5 text-luxury-gold mr-3" />
                    <span className="font-body font-medium">Beach Walk</span>
                  </div>
                  <span className="font-body text-sm text-muted-foreground">
                    5-8 mins
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-luxury-champagne/20 rounded-lg">
                  <div className="flex items-center">
                    <Mountain className="h-5 w-5 text-luxury-gold mr-3" />
                    <span className="font-body font-medium">
                      Table Mountain
                    </span>
                  </div>
                  <span className="font-body text-sm text-muted-foreground">
                    10-15 mins
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Benefits */}
        <div className="bg-gradient-to-r from-luxury-gold/10 to-luxury-champagne/20 rounded-2xl p-8 md:p-12 text-center">
          <Camera className="h-12 w-12 text-luxury-gold mx-auto mb-6" />
          <h3 className="font-heading text-3xl font-bold text-luxury-charcoal mb-4">
            The Perfect Base
          </h3>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Minutes from Camps Bay's beach and restaurants, yet elevated for
            complete privacy. Discover why this exclusive location offers the
            best of both worlds.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
