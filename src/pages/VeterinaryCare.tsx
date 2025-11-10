import { Link } from "react-router-dom";

const VeterinaryCare = () => {
  const services = [
    {
      title: "General Checkups",
      description: "Routine health assessments for all pets.",
    },
    {
      title: "Vaccination & Deworming",
      description: "Preventive care to keep illnesses away.",
    },
    {
      title: "Surgery & Emergency Care",
      description: "Minor to major procedures, handled safely.",
    },
    {
      title: "Dental Care",
      description: "Oral exams, cleaning, and extractions if needed.",
    },
    {
      title: "Diagnostic Tests",
      description: "Blood tests, tonometry (eye pressure), X-rays, etc.",
    },
    {
      title: "Geriatric Pet Care",
      description: "Special care plans for senior pets.",
    },
    {
      title: "Skin & Allergy Treatment",
      description: "Relief from itching, infections, and rashes.",
    },
    {
      title: "Nutrition & Weight Management",
      description: "Diet plans and fitness monitoring.",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-pet-gray py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Veterinary Care</h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive veterinary services to ensure the health and well-being of your pets.
            </p>
          </div>
        </div>
      </section>

      <section className="section-container">
        <h2 className="section-title">📋 Services Offered</h2>
        <p className="section-subtitle">
          We provide a wide range of veterinary services to meet the unique needs of your pets.
        </p>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in mt-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-medium mb-2">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Ready to schedule an appointment for veterinary care?
          </p>
          <Link
            to="/appointment"
            className="inline-block px-6 py-3 bg-pet-blue-dark text-white rounded-lg hover:bg-pet-blue-dark/90 transition-colors shadow-sm"
          >
            Book Your Appointment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default VeterinaryCare;