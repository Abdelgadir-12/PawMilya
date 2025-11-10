import { Syringe, Calendar, AlertCircle } from 'lucide-react';

const Vaccination = () => {
  return (
    <div className="min-h-screen pt-20">
      <section className="bg-pet-gray py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Pet Vaccination Services</h1>
            <p className="text-lg text-muted-foreground">
              Protect your pet with our comprehensive vaccination programs
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <a 
              href="/services/booking" 
              className="inline-block px-8 py-3 bg-pet-blue-dark text-white rounded-full font-medium hover:bg-pet-blue-darker transition-colors"
            >
              Book Your Appointment
            </a>
          </div>
        </div>
      </section>

      <section className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Syringe className="text-pet-blue-dark" />
              Core Vaccines
            </h2>
            <ul className="space-y-4">
              <li className="flex flex-col gap-1">
                <span className="font-medium">DHPP/FVRCP (Dog/Cat)</span>
                <span className="text-sm text-muted-foreground">Protection against common diseases</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-medium">Rabies Vaccine</span>
                <span className="text-sm text-muted-foreground">Mandatory protection required by law</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-medium">Bordetella</span>
                <span className="text-sm text-muted-foreground">Essential for social and boarding dogs</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-medium">Deworming Services</span>
                <span className="text-sm text-muted-foreground">Regular deworming to ensure your pet's health</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="text-pet-blue-dark" />
              Vaccination Schedule
            </h2>
            <ul className="space-y-4">
              <li className="text-sm"><strong>2 weeks:</strong> First Deworming</li>
              <li className="text-sm"><strong>4 weeks:</strong> Second Deworming</li>
              <li className="text-sm"><strong>6 weeks:</strong> First CPV/CV vaccine</li>
              <li className="text-sm"><strong>8 weeks:</strong> DHLPPI/+5L4</li>
              <li className="text-sm"><strong>10 weeks:</strong> DHLPPI/+CV</li>
              <li className="text-sm"><strong>12 weeks:</strong> DHLPPI + Rabies</li>
              <li className="text-sm"><strong>24 weeks:</strong> Rabies booster + Kennel Cough</li>
              <li className="text-sm"><strong>36 weeks:</strong> Annual boosters begin</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-pet-gray/20 p-6 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-pet-blue-dark mt-1" />
            <div>
              <h3 className="font-medium mb-2">Important Information</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Vaccination schedules may vary based on your pet's age, health, and lifestyle</li>
                <li>• Initial consultation required for new patients</li>
                <li>• Please bring previous vaccination records if available</li>
                <li>• Pets should be healthy at time of vaccination</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Vaccination;