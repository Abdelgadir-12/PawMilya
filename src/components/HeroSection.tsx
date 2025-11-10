import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden relative">
      {}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[80%] bg-gradient-to-b from-pet-blue/10 to-transparent rounded-b-[50%]"></div>
        <div className="absolute top-20 right-[5%] w-64 h-64 rounded-full bg-pet-teal/10 blur-3xl"></div>
        <div className="absolute bottom-20 left-[10%] w-96 h-96 rounded-full bg-pet-blue/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6 animate-fade-up">
            <div className="inline-block bg-white px-4 py-1.5 rounded-full shadow-sm mb-2">
              <span className="text-sm font-medium text-pet-blue-dark">Premium Pet Care Services</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-balance leading-tight">
              Exceptional Care for Your <span className="text-pet-blue-dark">Beloved Pets</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Experience comprehensive veterinary services, professional grooming, and a curated selection of premium pet products all under one roof.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/appointment"
                className="px-6 py-3 bg-pet-blue-dark text-white rounded-full font-medium transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
              >
                Book an Appointment <ArrowRight size={18} />
              </Link>
              <Link
                to="/services"
                className="px-6 py-3 bg-white border border-gray-200 rounded-full font-medium transition-all hover:shadow hover:border-gray-300"
              >
                Our Services
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 relative animate-fade-in">
            <div className="relative w-full aspect-square md:aspect-auto md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80"
                alt="Veterinarian with a dog"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-xs bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-pet-teal/20 flex items-center justify-center shrink-0">
                    <span className="text-pet-teal-dark text-xl font-bold"></span>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
            
            {}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-3xl border-2 border-dashed border-pet-teal/30"></div>
            <div className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 bg-pet-blue/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
