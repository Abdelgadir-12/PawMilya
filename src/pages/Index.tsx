import { HeroSection } from "@/components/HeroSection";
import { ServiceCard } from "@/components/ServiceCard";
import { NotificationPreview } from "@/components/NotificationPreview";
import { Link } from "react-router-dom";
import { Stethoscope, Scissors, Syringe, ShoppingBag, ChevronRight, Clock, Calendar, Award, Star, MapPin } from "lucide-react";
import { VetProfileCard } from "@/components/VetProfileCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { LocationMap } from "@/components/LocationMap";


const Index = () => {
  return (
    <div className="min-h-screen">
      {}
      <HeroSection />
      
      {}
      <section className="section-container">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          Comprehensive care solutions for all of your pet's needs, delivered with expertise and compassion.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceCard
            title="Veterinary Care"
            description="Professional medical care for pets, including diagnostics, treatments, and preventive services."
            icon={Stethoscope}
            priceRange="₱1,500 - ₱2,500"
          />
          
          <ServiceCard
            title="Pet Grooming"
            description="Complete grooming services including bathing, haircuts, nail trimming, and ear cleaning."
            icon={Scissors}
            priceRange="₱800 - ₱1,500"
            iconClassName="from-pet-teal to-pet-teal-dark/90"
          />
          
          <ServiceCard
            title="Vaccinations & Deworming"
            description="Essential vaccines to protect your pet against common diseases and maintain their health."
            icon={Syringe}
            priceRange="₱500 - ₱1,800"
            iconClassName="from-pet-blue-dark to-pet-blue"
          />
          
          <ServiceCard
            title="Pet Shop"
            description="Quality pet supplies, food, toys, and accessories for all your pet's needs."
            icon={ShoppingBag}
            priceRange="Varies"
            iconClassName="from-pet-teal-dark to-pet-teal"
          />
        </div>
        
        <div className="text-center mt-10">
          <Link to="/services" className="inline-flex items-center gap-1 text-pet-blue-dark font-medium hover:underline">
            View All Services <ChevronRight size={16} />
          </Link>
        </div>
      </section>
      
      {}
      <section className="bg-pet-gray py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Meet Our Expert Veterinarians</h2>
          <p className="section-subtitle">
            Our team of certified veterinarians brings years of experience and a genuine love for animals.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <VetProfileCard
              name="Dr. Yolly Ann Molintds"
              specialty="General Veterinary Medicine"
              experience={8}
              image=""
              description="Dr. Yolly specializes in preventive care and has a special interest in feline medicine. She is known for her gentle approach with anxious pets."            />
            
            <VetProfileCard
              name="Dr. Rosaline"
              specialty="Veterinary Surgery"
              experience={5}
              image=""
              description="With over a decade of surgical experience, Dr. Rosaline has performed thousands of procedures from routine spays to complex orthopedic surgeries."            />
          </div>
        </div>
      </section>
      
      {}
      <section className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">
            We provide exceptional pet care with expertise, compassion, and state-of-the-art facilities including AI-powered care.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-pet-gray/30 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-pet-teal/20 rounded-full flex items-center justify-center mb-4">
                <Award className="text-pet-teal-dark" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Expert Professionals</h3>
              <p className="text-muted-foreground">
                Our team of certified veterinarians and pet care specialists bring years of experience and a genuine love for animals.
              </p>
            </div>
            
            <div className="bg-pet-gray/30 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-pet-blue/20 rounded-full flex items-center justify-center mb-4">
                <Clock className="text-pet-blue-dark" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Convenient Hours</h3>
              <p className="text-muted-foreground">
                We offer flexible appointment times and services to ensure your pet receives care when needed.
              </p>
            </div>
            
            <div className="bg-pet-gray/30 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-pet-teal/20 rounded-full flex items-center justify-center mb-4">
                <Calendar className="text-pet-teal-dark" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">AI-Powered Support</h3>
              <p className="text-muted-foreground">
                Get instant answers to pet care questions with our AI chatbot assistant available 24/7 to provide guidance.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {}
      <section className="section-container bg-pet-gray/30">
        <h2 className="section-title">What Our Clients Say</h2>
        <p className="section-subtitle">
          Read trusted reviews from pet owners who have experienced our services firsthand.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <TestimonialCard
            name="Marco Diaz"
            petType="Cat Owner"
            rating={5}
            testimonial=" The queue for grooming is a bit long usually specially that's there's only one available groomer most of the time"
          />
          
          <TestimonialCard
            name="Elena Gomez"
            petType="Dog Owner"
            rating={5}
            testimonial=" I brought my dog here for a check up back when I was still living in Benguet. The doctor was very informative about my dog's case and taught me what I should avoid and how I should take care of my dog properly. The laboratory fees are also not expensive compared to other vet clinics."
          />
          
          <TestimonialCard
            name="Michael Tan"
            petType="Rabbit Owner"
            rating={4}
            testimonial=" I had trouble looking for it but when I got there though the staff was accommodating. There was no line as well so I  did not have to wait that long. The Doctor was very helpful and informative since I was a first time pet owner. Really happy with the service and location is accessible to me."
          />
        </div>
      </section>
      
      {}
      <section className="section-container">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img 
              src="https://images.unsplash.com/photo-1511044568932-338cba0ad803?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Pet clinic" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-pet-blue-dark/90 to-pet-blue-dark/70"></div>
          </div>
          
          <div className="relative z-10 py-16 px-6 md:py-20 md:px-12 lg:px-16 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4 text-white">
              Schedule an Appointment Today
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Whether it's a routine checkup, grooming session, or specialized treatment, our team is ready to provide exceptional care for your beloved pet.
            </p>
            <Link 
              to="/appointment" 
              className="inline-block px-8 py-4 bg-white text-pet-blue-dark font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
            >
              Book Your Appointment
            </Link>
          </div>
        </div>
      </section>
      
      {}
      
      {}
      <section className="section-container bg-pet-gray/30">
        <h2 className="section-title">Find Us in Baguio City</h2>
        <p className="section-subtitle">
          Our clinic is conveniently located in the heart of Baguio City. Visit us now.
        </p>
        
        <div className="mt-8 rounded-xl overflow-hidden shadow-lg">
          <LocationMap />
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <MapPin className="text-pet-blue-dark flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-lg">Angeles Pet Care Center - Baguio</h3>
              <p className="text-muted-foreground"> casa vallejo Bldg.2 2nd floor, Baguio, 2600 Benguet </p>
              <a 
              href="https://maps.app.goo.gl/Ef6T4AXLUybfrERF8?g_st=iw" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-pet-blue-dark font-medium hover:underline"
             >
              Get Directions
             </a>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Hours</h4>
                  <p className="text-sm text-muted-foreground">( 8am - 12pm ) - (2pm - 5pm )</p>
                </div>

                <div>
                  <h4 className="font-medium">Contact</h4>
                  <p className="text-sm text-muted-foreground">Phone: 09985514890 </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {}
      <NotificationPreview />
      
      {}

    </div>
  );
};

export default Index;
