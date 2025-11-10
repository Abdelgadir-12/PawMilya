import { Card } from "@/components/ui/card";
import { HeartPulse } from "lucide-react";

const Dentistry = () => {
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-pet-teal/10 to-pet-blue/5">
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <HeartPulse className="text-pet-teal-dark" size={40} />
            <h1 className="text-4xl font-bold font-display">Dentistry</h1>
          </div>
          <Card className="p-8 shadow-lg border-0 bg-white/90">
            <h2 className="text-2xl font-semibold mb-4 text-pet-teal-dark">Why Pet Dental Care Matters</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Dental health is vital for your pet's overall well-being. Our veterinary dentistry services help prevent pain, infection, and tooth loss, ensuring your companion stays happy and healthy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-medium mb-2">Our Dental Services</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Comprehensive oral exams</li>
                  <li>Professional dental cleaning (scaling & polishing)</li>
                  <li>Dental X-rays</li>
                  <li>Tooth extractions</li>
                  <li>Treatment of gum disease</li>
                  <li>Oral surgery</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Signs Your Pet Needs Dental Care</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Bad breath</li>
                  <li>Difficulty eating or chewing</li>
                  <li>Red or bleeding gums</li>
                  <li>Loose or missing teeth</li>
                  <li>Excessive drooling</li>
                  <li>Pawing at the mouth</li>
                </ul>
              </div>
            </div>
            <div className="bg-pet-teal/10 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-2 text-pet-teal-dark">Our Approach</h3>
              <p>
                We use gentle, modern techniques and advanced equipment to ensure your pet's comfort and safety. All dental procedures are performed under anesthesia and monitored by our experienced veterinary team.
              </p>
            </div>
            <div className="text-center">
              <a
                href="/appointment"
                className="inline-block px-8 py-3 bg-pet-teal-dark text-white rounded-lg text-lg font-semibold shadow-md hover:bg-pet-teal/90 transition-colors"
              >
                Book a Dental Check-up
              </a>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dentistry;
