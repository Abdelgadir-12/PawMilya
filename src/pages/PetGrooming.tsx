import React from "react";

const PetGrooming = () => {
  const groomingPackages = [
    {
      service: "PACKAGE #1 (Small Sizes)",
      price: "₱400",
      description: "Includes bath, nail trim, and ear cleaning.",
    },
    {
      service: "PACKAGE #2 (Small Sizes with Hair Cut/Shaving)",
      price: "₱500",
      description: "Includes nail trim, bath, ear cleaning, and anal sac draining.",
    },
    {
      service: "PACKAGE #3 (Medium Sizes)",
      price: "₱600",
      description: "Includes bath, nail trim, and ear cleaning.",
    },
    {
      service: "PACKAGE #4 (Large Sizes)",
      price: "₱800",
      description: "Includes bath, nail trim, and ear cleaning.",
    },
    {
      service: "PACKAGE #5 (Large Sizes with Hair Cut/Shaving)",
      price: "₱1000",
      description: "Includes nail trim, bath, ear cleaning, and anal sac draining.",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {}
      <section className="bg-pet-gray py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Pet Grooming Services</h1>
            <p className="text-lg text-muted-foreground">
              Professional grooming services to keep your pet clean, comfortable, and looking their best.
            </p>
          </div>
        </div>
      </section>

      {}
      <section className="section-container">
        <h2 className="section-title">Our Grooming Packages</h2>
        <p className="section-subtitle">
          Explore our grooming packages tailored for pets of all sizes and needs.
        </p>

        {}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          {groomingPackages.map((packageItem, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-medium mb-2">{packageItem.service}</h3>
              <p className="text-pet-blue-dark font-medium">{packageItem.price}</p>
              <p className="text-muted-foreground">{packageItem.description}</p>
            </div>
          ))}
        </div>
      </section>

      {}
      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">
          Ready to schedule a grooming session for your pet?
        </p>
        <a
          href="/appointment"
          className="inline-block px-6 py-3 bg-pet-blue-dark text-white rounded-lg hover:bg-pet-blue-dark/90 transition-colors shadow-sm"
        >
          Book Your Appointment
        </a>
      </div>
      <div className="mb-16"></div>
    </div>
  );
};

export default PetGrooming;