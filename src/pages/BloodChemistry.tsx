import React from "react";

const BloodChemistry: React.FC = () => {
  React.useEffect(() => {
    document.title = "Blood Chemistry | Pet Care";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] pt-20 pb-16">
      <section className="max-w-4xl mx-auto px-4 py-12 rounded-3xl shadow-xl bg-white/90 mt-10 mb-8 border border-blue-100 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 font-display drop-shadow-sm">
              Blood Chemistry
            </h1>
            <p className="text-lg text-blue-800 mb-6">
              Unlocking the secrets of your pet’s health with advanced blood chemistry analysis.
            </p>
            <ul className="list-disc pl-6 text-blue-700 space-y-2 text-base">
              <li>Comprehensive organ function assessment</li>
              <li>Early detection of metabolic and systemic diseases</li>
              <li>Pre-anesthetic and wellness screening</li>
              <li>Monitoring of chronic conditions and medication effects</li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="/map.png"
              alt="Blood Chemistry Illustration"
              className="w-64 h-64 object-contain rounded-2xl border-4 border-blue-200 shadow-lg bg-blue-50"
            />
          </div>
        </div>
      </section>
      <section className="max-w-3xl mx-auto px-4 py-8 bg-blue-50 rounded-2xl shadow-md border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">What is Blood Chemistry?</h2>
        <p className="text-blue-800 mb-4">
          Blood chemistry tests measure the levels of various substances in your pet’s blood, providing vital information about the health of organs such as the liver, kidneys, and pancreas. These tests help veterinarians diagnose diseases, monitor ongoing conditions, and ensure your pet is healthy before surgery or anesthesia.
        </p>
        <h3 className="text-xl font-semibold text-blue-800 mb-2">Common Blood Chemistry Panels:</h3>
        <ul className="list-disc pl-6 text-blue-700 space-y-1 mb-4">
          <li>Liver Enzymes (ALT, AST, ALP)</li>
          <li>Kidney Function (BUN, Creatinine)</li>
          <li>Electrolytes (Sodium, Potassium, Chloride)</li>
          <li>Blood Glucose</li>
          <li>Total Protein & Albumin</li>
          <li>Cholesterol & Triglycerides</li>
        </ul>
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
            <h4 className="font-semibold text-blue-900 mb-2">Why is it important?</h4>
            <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1">
              <li>Detects hidden illnesses before symptoms appear</li>
              <li>Guides treatment and medication choices</li>
              <li>Monitors response to therapy</li>
              <li>Ensures safe anesthesia and surgery</li>
            </ul>
          </div>
          <div className="flex-1 bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
            <h4 className="font-semibold text-blue-900 mb-2">When is it recommended?</h4>
            <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1">
              <li>Annual wellness exams</li>
              <li>Before surgery or dental procedures</li>
              <li>When your pet is ill or showing symptoms</li>
              <li>For senior pets or those on long-term medication</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8">
          <a
            href="/appointment"
            className="inline-block px-8 py-3 bg-blue-800 text-white rounded-lg font-semibold shadow-md hover:bg-blue-900 transition-colors"
          >
            Book a Blood Chemistry Test
          </a>
        </div>
      </section>
    </div>
  );
};

export default BloodChemistry;
