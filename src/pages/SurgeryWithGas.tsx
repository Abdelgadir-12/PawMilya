import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

const SurgeryWithGas = () => {
  return (
    <div className="min-h-screen pt-20">
      <section className="bg-pet-gray py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-pet-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartPulse className="text-pet-blue-dark" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Surgery with Gas Anesthetic Machine</h1>
            <p className="text-lg text-muted-foreground">
              State-of-the-art surgical procedures using advanced gas anesthesia for optimal safety and comfort.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg">
              <h2 className="text-3xl font-bold mb-6">What is Gas Anesthesia?</h2>
              <p className="mb-4">
                Gas anesthesia, also known as inhalation anesthesia, is a modern and precise method of keeping pets unconscious 
                and pain-free during surgical procedures. Unlike traditional injectable anesthetics, gas anesthesia provides 
                veterinarians with moment-to-moment control over the depth of anesthesia.
              </p>
              <div className="bg-pet-blue/10 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold mb-3">Key Benefits:</h3>
                <ul className="space-y-2">
                  <li>✓ Precise control over anesthesia levels</li>
                  <li>✓ Rapid adjustments during surgery</li>
                  <li>✓ Smoother induction and recovery</li>
                  <li>✓ Minimal stress on vital organs</li>
                  <li>✓ Constant monitoring of vital signs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Our Surgical Services</h2>
              <ul className="space-y-3">
                <li>• Soft Tissue Surgery</li>
                <li>• Orthopedic Procedures</li>
                <li>• Spay and Neuter</li>
                <li>• Tumor Removal</li>
                <li>• Dental Surgery</li>
                <li>• Emergency Surgery</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Why Gas Anesthesia?</h2>
              <ul className="space-y-3">
                <li>• Safer than injectable anesthesia</li>
                <li>• Better control of anesthesia depth</li>
                <li>• Faster recovery time</li>
                <li>• Reduced post-operative complications</li>
                <li>• Continuous monitoring capabilities</li>
                <li>• Suitable for longer procedures</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Pre-Surgery Information</h2>
            <div className="space-y-4">
              <p>Before any surgical procedure, we require:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pre-surgical blood work to ensure your pet's safety</li>
                <li>Fasting for 8-12 hours before surgery</li>
                <li>Current vaccination records</li>
                <li>Detailed medical history</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/appointment"
              className="inline-block px-6 py-3 bg-pet-blue-dark text-white rounded-lg hover:bg-pet-blue-dark/90 transition-colors shadow-sm"
            >
              Schedule a Surgical Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SurgeryWithGas;
