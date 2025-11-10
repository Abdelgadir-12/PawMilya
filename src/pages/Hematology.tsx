import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Beaker, Pill } from "lucide-react";

const Hematology = () => {
  return (
    <div className="min-h-screen pt-20 bg-pet-gray">
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Pill className="text-pet-blue-dark" size={32} />
              <CardTitle className="text-3xl font-bold">Hematology</CardTitle>
            </div>
            <p className="text-muted-foreground text-lg">
              Advanced blood diagnostics for your pet's health and well-being.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">What is Hematology?</h2>
              <p>
                Hematology is the study of blood and its disorders. Our veterinary hematology services include complete blood counts (CBC), blood smears, and advanced diagnostics to detect anemia, infections, clotting disorders, and more. Early detection helps us provide the best care for your pet.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Common Hematology Tests</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Complete Blood Count (CBC)</li>
                <li>Blood Smear Evaluation</li>
                <li>Platelet Count</li>
                <li>White Blood Cell Differential</li>
                <li>Clotting Time Tests</li>
                <li>Reticulocyte Count</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">When is Hematology Recommended?</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Routine wellness exams</li>
                <li>Pre-surgical screening</li>
                <li>Unexplained weight loss or lethargy</li>
                <li>Suspected infections or immune disorders</li>
                <li>Monitoring chronic conditions</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Why Choose Us?</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>State-of-the-art laboratory equipment</li>
                <li>Experienced veterinary team</li>
                <li>Fast, accurate results</li>
                <li>Personalized treatment plans</li>
              </ul>
            </div>
            <div className="text-center mt-8">
              <a
                href="/appointment"
                className="inline-block px-6 py-3 bg-pet-blue-dark text-white rounded-lg hover:bg-pet-blue-dark/90 transition-colors shadow-sm"
              >
                Book a Hematology Test
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Hematology;
