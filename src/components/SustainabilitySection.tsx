import { Card, CardContent } from '@/components/ui/card';
import { Sun, Droplets, Leaf, Zap, Shield, Recycle } from 'lucide-react';

const SustainabilitySection = () => {
  const sustainabilityFeatures = [
    {
      icon: Sun,
      color: "text-ever-solar",
      title: 'Solar-Powered Living',
      description: '40 high-efficiency solar panels with 26kWh battery storage',
      details: 'Complete energy independence with zero load-shedding impact. Our advanced solar system powers the entire villa, ensuring uninterrupted luxury.',
      stats: '100% renewable energy'
    },
    {
      icon: Droplets,
      color: "text-ever-blue",
      title: 'Pure Water System',
      description: 'Private borehole with advanced multi-stage filtration',
      details: 'Crystal-clear water sourced from our private borehole and purified through state-of-the-art filtration systems for peace of mind.',
      stats: 'Independent water supply'
    },
    {
      icon: Leaf,
      color: "text-ever-green",
      title: 'Eco-Luxury Design',
      description: 'Sustainable materials and energy-efficient systems',
      details: 'Thoughtfully chosen materials and smart home technology reduce environmental impact without compromising on luxury or comfort.',
      stats: 'Certified eco-friendly'
    }
  ];

  return (
    <section id="sustainability" className="section-spacing bg-gradient-to-b from-white to-ever-bg">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-ever-champ/20 text-ever-ink px-4 py-2 rounded-full text-sm font-medium mb-6 border border-ever-champ">
            <Leaf className="w-4 h-4 mr-2 text-ever-blue" />
            Sustainable Luxury
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-ever-ink mb-6">
            Eco-Conscious Excellence
          </h2>
          <p className="font-body text-xl text-ever-body max-w-3xl mx-auto">
            Experience guilt-free luxury with our commitment to sustainability. Advanced systems
            ensure your comfort while protecting the beautiful environment we call home.
          </p>
        </div>

        {/* No Load-Shedding Hero */}
        <div className="bg-gradient-to-br from-white to-ever-bg border-l-4 border-ever-blue rounded-2xl p-8 md:p-12 text-center mb-16">
          <Zap className="h-16 w-16 mx-auto mb-6 animate-pulse text-ever-solar" />
          <h3 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-ever-ink">
            Never Experience Load-Shedding
          </h3>
          <p className="font-body text-xl mb-6 text-ever-body">
            Our 26kWh battery storage and 40-panel solar array ensure uninterrupted power,
            24 hours a day, 365 days a year.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-center">
            <div className="flex items-center">
              <Shield className="h-8 w-8 mr-3 text-ever-blue" />
              <div>
                <div className="font-heading text-2xl font-bold text-ever-ink">100%</div>
                <div className="text-sm text-ever-body">Backup Power</div>
              </div>
            </div>
            <div className="flex items-center">
              <Sun className="h-8 w-8 mr-3 text-ever-solar" />
              <div>
                <div className="font-heading text-2xl font-bold text-ever-ink">40</div>
                <div className="text-sm text-ever-body">Solar Panels</div>
              </div>
            </div>
            <div className="flex items-center">
              <Recycle className="h-8 w-8 mr-3 text-ever-blue" />
              <div>
                <div className="font-heading text-2xl font-bold text-ever-ink">26kWh</div>
                <div className="text-sm text-ever-body">Battery Storage</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sustainability Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {sustainabilityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="card-luxury text-center p-8 hover:scale-105 transition-transform duration-300"
              >
                <CardContent className="p-0">
                  {/* Circle around icon */}
                  <div
                    className={`border w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${feature.color}`}
                  >
                    <Icon className={`h-10 w-10 stroke-2 ${feature.color}`} />
                  </div>

                  {/* Stats pill */}
                  <div
                    className={`text-ever-ink border px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block ${feature.color.replace("text-", "bg-")}/20 border-current`}
                  >
                    {feature.stats}
                  </div>

                  <h3 className="font-heading text-xl font-bold text-ever-ink mb-3">
                    {feature.title}
                  </h3>

                  <p className="font-body text-ever-blue font-medium mb-3">
                    {feature.description}
                  </p>

                  <p className="font-body text-ever-body text-sm leading-relaxed">
                    {feature.details}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Environmental Impact */}
        <div className="bg-white border border-ever-line rounded-2xl p-8 md:p-12 text-center">
          <h3 className="font-heading text-2xl font-bold text-ever-ink mb-6">
            Our Environmental Commitment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="font-heading text-3xl font-bold text-ever-blue mb-2">0</div>
              <div className="font-body text-sm text-ever-body">Carbon Footprint<br />from Solar Use</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-3xl font-bold text-ever-blue mb-2">
                <span className="text-base font-normal align-baseline mr-1">Up to</span>100%
              </div>
              <div className="font-body text-sm text-ever-body">Renewable Energy<br />Generation</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-3xl font-bold text-ever-blue mb-2">24/7</div>
              <div className="font-body text-sm text-ever-body">Reliable<br />Power Supply</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-3xl font-bold text-ever-blue mb-2">Pure</div>
              <div className="font-body text-sm text-ever-body">Filtered Water<br />from Borehole</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
