import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Microscope } from "lucide-react";

const DigitalXRay = () => {
  return (
    <div className="min-h-screen pt-20 bg-pet-gray">
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Microscope className="text-pet-blue-dark" size={32} />
              <CardTitle className="text-3xl font-bold">Digital X-Ray</CardTitle>
            </div>
            <p className="text-muted-foreground text-lg">
              High-quality digital imaging for accurate and safe diagnosis of your pet's health.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">What is Digital X-Ray?</h2>
              <p>
                Digital X-ray (radiography) is a non-invasive diagnostic tool that provides detailed images of your pet's bones, organs, and tissues. It helps veterinarians quickly diagnose injuries, illnesses, and monitor ongoing conditions with minimal discomfort to your pet.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">When is Digital X-Ray Used?</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Detecting fractures or bone abnormalities</li>
                <li>Evaluating heart, lungs, and abdominal organs</li>
                <li>Diagnosing tumors or masses</li>
                <li>Identifying foreign objects</li>
                <li>Dental assessments</li>
                <li>Pre-surgical planning</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Why Choose Digital X-Ray?</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Fast, high-resolution images</li>
                <li>Lower radiation exposure</li>
                <li>Immediate results for quicker treatment</li>
                <li>Easy sharing with specialists if needed</li>
              </ul>
            </div>
            <div className="text-center mt-8">
              <a
                href="/appointment"
                className="inline-block px-6 py-3 bg-pet-blue-dark text-white rounded-lg hover:bg-pet-blue-dark/90 transition-colors shadow-sm"
              >
                Book a Digital X-Ray
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default DigitalXRay;
