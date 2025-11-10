import { Syringe, Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Vaccination = () => {
  const navigate = useNavigate();

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
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="text-pet-blue-dark" />
              Vaccination Program
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

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Ready to ensure your pet stays healthy with timely vaccinations?
          </p>
          <a
            href="/appointment"
            className="inline-block px-6 py-3 bg-pet-blue-dark text-white rounded-lg hover:bg-pet-blue-dark/90 transition-colors shadow-sm"
          >
            Book Your Appointment
          </a>
        </div>
        <div className="mb-16"></div>
      </section>
    </div>
  );
};

export default Vaccination;
