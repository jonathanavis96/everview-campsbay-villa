import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MessageCircle, Calendar, Star, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    message: '',
    contactMethod: 'email'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Enquiry Submitted!",
      description: "We'll respond within 24 hours with availability and pricing.",
    });
  };

  const directBookingBenefits = [
    {
      icon: Star,
      title: 'Best Rates Guaranteed',
      description: 'Exclusive pricing with no booking platform fees'
    },
    {
      icon: MessageCircle,
      title: 'Direct Communication',
      description: 'Speak directly with your dedicated host team'
    },
    {
      icon: CheckCircle,
      title: 'Exclusive Flexibility',
      description: 'Special offers and customized experiences'
    }
  ];

  return (
    <section id="enquire" className="section-spacing bg-luxury-cream/30">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-luxury-charcoal mb-6">
            Plan Your Stay at Everview
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to experience luxury in Camps Bay? Get in touch to check availability, 
            discuss your requirements, and secure your exclusive villa getaway.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="space-y-8">
            <Card className="card-luxury">
              <CardContent className="p-8">
                <h3 className="font-heading text-2xl font-bold text-luxury-charcoal mb-6">
                  Send Your Enquiry
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="font-body font-medium text-foreground">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="font-body font-medium text-foreground">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>

                  {/* Dates and Guests */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="checkIn" className="font-body font-medium text-foreground">
                        Check-in Date
                      </Label>
                      <Input
                        id="checkIn"
                        name="checkIn"
                        type="date"
                        value={formData.checkIn}
                        onChange={handleInputChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkOut" className="font-body font-medium text-foreground">
                        Check-out Date
                      </Label>
                      <Input
                        id="checkOut"
                        name="checkOut"
                        type="date"
                        value={formData.checkOut}
                        onChange={handleInputChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="guests" className="font-body font-medium text-foreground">
                        Number of Guests
                      </Label>
                      <select
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background"
                      >
                        <option value="">Select</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <option key={num} value={num}>{num} Guest{num !== 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message" className="font-body font-medium text-foreground">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="mt-2"
                      rows={4}
                      placeholder="Tell us about your requirements, special occasions, or any questions..."
                    />
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <Label className="font-body font-medium text-foreground">
                      Preferred Contact Method
                    </Label>
                    <div className="flex gap-4 mt-2">
                      {[
                        { value: 'email', label: 'Email', icon: Mail },
                        { value: 'phone', label: 'Phone', icon: Phone },
                        { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle }
                      ].map(method => (
                        <label key={method.value} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="contactMethod"
                            value={method.value}
                            checked={formData.contactMethod === method.value}
                            onChange={handleInputChange}
                            className="mr-2 text-luxury-gold"
                          />
                          <method.icon className="w-4 h-4 mr-1" />
                          <span className="font-body text-sm">{method.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="btn-luxury w-full">
                    Send Enquiry
                    <Calendar className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Direct Contact */}
            <Card className="card-luxury">
              <CardContent className="p-8">
                <h3 className="font-heading text-xl font-bold text-luxury-charcoal mb-4">
                  Direct Contact
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-luxury-gold mr-3" />
                    <div>
                      <div className="font-body font-medium">Phone</div>
                      <a href="tel:+27822227457" className="text-sm text-muted-foreground hover:text-luxury-gold">
                        (+27) 82 222 7457
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 text-luxury-gold mr-3" />
                    <div>
                      <div className="font-body font-medium">WhatsApp</div>
                      <a href="https://wa.me/27765864469" className="text-sm text-muted-foreground hover:text-luxury-gold">
                        +27 76 586 4469
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Why Book Direct */}
          <div className="space-y-8">
            <Card className="card-luxury">
              <CardContent className="p-8">
                <h3 className="font-heading text-2xl font-bold text-luxury-charcoal mb-6">
                  Why Book Direct?
                </h3>
                <div className="space-y-6">
                  {directBookingBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-luxury-gold/10 p-3 rounded-xl mr-4 flex-shrink-0">
                        <benefit.icon className="h-6 w-6 text-luxury-gold" />
                      </div>
                      <div>
                        <h4 className="font-body font-semibold text-luxury-charcoal mb-2">
                          {benefit.title}
                        </h4>
                        <p className="font-body text-sm text-muted-foreground">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials Placeholder */}
            <Card className="card-luxury">
              <CardContent className="p-8">
                <h3 className="font-heading text-xl font-bold text-luxury-charcoal mb-6">
                  Guest Experiences
                </h3>
                <div className="space-y-6">
                  <blockquote className="border-l-4 border-luxury-gold pl-4">
                    <p className="font-body text-muted-foreground italic mb-2">
                      "The most private and relaxing stay we've ever had in Camps Bay. Every detail was perfect."
                    </p>
                    <footer className="font-body text-sm text-luxury-gold">— Sarah & James, UK</footer>
                  </blockquote>
                  
                  <blockquote className="border-l-4 border-luxury-gold pl-4">
                    <p className="font-body text-muted-foreground italic mb-2">
                      "Unparalleled luxury with breathtaking views. The solar power meant we never worried about load-shedding!"
                    </p>
                    <footer className="font-body text-sm text-luxury-gold">— Michael & Family, Germany</footer>
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;