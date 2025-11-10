import { Pill } from "lucide-react";

const PharmacyServices = () => {
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-pet-blue/10 to-pet-teal/5">
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white/95 rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-6">
            <Pill className="text-pet-blue-dark" size={36} />
            <h1 className="text-3xl font-bold font-display">Pharmacy Services</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-8 text-center">
            Convenient access to a full range of veterinary medications, supplements, and prescription diets for your pet's health and recovery.
          </p>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-2 text-pet-blue-dark">What We Offer</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Prescription medications for acute and chronic conditions</li>
                <li>Preventive products (flea, tick, heartworm)</li>
                <li>Specialty and compounded medications</li>
                <li>Prescription and therapeutic diets</li>
                <li>Supplements and vitamins</li>
                <li>Topical treatments and wound care</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2 text-pet-blue-dark">Why Choose Our Pharmacy?</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Medications dispensed by licensed professionals</li>
                <li>Quality assurance and safety</li>
                <li>Convenient refills and reminders</li>
                <li>Expert advice on administration and side effects</li>
                <li>Competitive pricing</li>
              </ul>
            </div>
          </div>
          <div className="bg-pet-blue/10 rounded-lg p-6 mb-8 w-full text-center">
            <h3 className="text-lg font-semibold mb-2 text-pet-blue-dark">How to Get Your Pet's Medication</h3>
            <p>
              Request a prescription during your visit, or contact us for refills and advice. We ensure your pet receives the right medication, on time, every time.
            </p>
          </div>
          <a
            href="/appointment"
            className="inline-block px-8 py-3 bg-pet-blue-dark text-white rounded-lg text-lg font-semibold shadow-md hover:bg-pet-blue/90 transition-colors"
          >
            Request Medication or Refill
          </a>
        </div>
      </section>
    </div>
  );
};

export default PharmacyServices;
