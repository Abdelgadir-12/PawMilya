import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Link } from "react-router-dom";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  
  const toggleItem = (question: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [question]: !prev[question]
    }));
  };
  
  
  const faqItems: FAQItem[] = [
    
    {
      question: "What are your clinic hours?",
      answer: "Our clinic is open Monday through Friday from 8:00 AM to 5:00 PM, Saturday from 8:00 AM to 4:00 PM, and Sunday from 8:00 AM to 4:00 PM. .",
      category: "general"
    },
    {
      question: "Do I need an appointment to visit?",
      answer: "Yes, appointments are required for most services to ensure we can provide the best care for your pet. However, we accept walk-ins for emergency situations. You can book an appointment online or by calling our clinic.",
      category: "general"
    },
    {
      question: "What types of animals do you treat?",
      answer: "We primarily treat dogs, cats, and small mammals like rabbits, guinea pigs, and hamsters. We also offer limited services for birds and reptiles. If you have an exotic pet, please visit us to confirm we can provide appropriate care.",
      category: "general"
    },
    
    
    {
      question: "How often should my pet have a checkup?",
      answer: "We recommend annual wellness exams for adult pets in good health. Senior pets (typically over 7 years for dogs and over 10 years for cats) should have checkups every 6 months. Puppies and kittens require more frequent visits for initial vaccinations and monitoring.",
      category: "checkups"
    },
    {
      question: "What happens during a routine checkup?",
      answer: "A routine checkup includes a comprehensive physical examination (eyes, ears, teeth, heart, lungs, skin, weight), discussion of any concerns, preventive care recommendations, and any necessary vaccinations. We may recommend additional tests based on your pet's age, health status, and risk factors.",
      category: "checkups"
    },
    {
      question: "How should I prepare my pet for a checkup?",
      answer: "For the best experience, bring your pet on a leash or in a carrier, bring any medical records if you're a new patient, and prepare a list of questions or concerns. If possible, collect a fresh stool sample. For cats, consider withholding food for 2-3 hours before the appointment if car sickness is an issue.",
      category: "checkups"
    },
    
    
    {
      question: "Which vaccines does my pet need?",
      answer: "Core vaccines for dogs include rabies, distemper, parvovirus, and adenovirus. For cats, core vaccines include rabies, feline viral rhinotracheitis, calicivirus, and panleukopenia. Non-core vaccines depend on your pet's lifestyle, environment, and risk factors. We'll recommend an appropriate vaccination schedule during your visit.",
      category: "vaccinations"
    },
    {
      question: "How often are vaccinations needed?",
      answer: "Vaccination schedules vary by vaccine type, local regulations, and your pet's age and health. Most adult pets require rabies vaccines every 1-3 years (determined by law). Other core vaccines are typically given every 1-3 years after the initial series. We'll create a personalized vaccination schedule for your pet.",
      category: "vaccinations"
    },
    {
      question: "Are there side effects from vaccinations?",
      answer: "Most pets experience minimal or no side effects from vaccinations. Common mild reactions include temporary soreness at the injection site, mild fever, reduced appetite, or lethargy for 1-2 days. Severe reactions are rare but can include vomiting, diarrhea, facial swelling, or difficulty breathing. Contact us immediately if you notice these symptoms.",
      category: "vaccinations"
    },
    
    
    {
      question: "What surgical procedures do you offer?",
      answer: "We provide a wide range of surgical services including spay/neuter, mass removals, dental extractions, wound repairs, orthopedic procedures, and various soft tissue surgeries. All surgeries are performed with modern equipment and comprehensive pain management protocols.",
      category: "surgery"
    },
    {
      question: "How should I prepare my pet for surgery?",
      answer: "Typically, we require pets to fast (no food) for 8-12 hours before surgery, but water is usually allowed until 2-4 hours before. Follow your veterinarian's specific instructions. Arrive at the scheduled drop-off time, and plan to complete necessary paperwork and discuss the procedure details with our team.",
      category: "surgery"
    },
    {
      question: "What are the risks associated with pet surgery?",
      answer: "All surgical procedures involve some risk, including reaction to anesthesia, infection, bleeding, or postoperative complications. However, we minimize these risks through thorough pre-surgical evaluations, modern anesthesia protocols, continuous monitoring during surgery, and comprehensive pain management. We'll discuss specific risks related to your pet's procedure during the pre-surgical consultation.",
      category: "surgery"
    },
    {
      question: "What is the typical cost range for pet surgeries?",
      answer: "Surgical costs vary widely depending on the procedure complexity, your pet's size and health status, and necessary aftercare. Basic procedures like spay/neuter typically range from $200-500, dental procedures from $300-800, and more complex surgeries can range from $1,000-4,000+. We provide detailed cost estimates before any procedure.",
      category: "surgery"
    },
    {
      question: "How long is the recovery period after surgery?",
      answer: "Recovery time varies by procedure. Simple surgeries like spay/neuter typically require 10-14 days of restricted activity. Orthopedic procedures may require 6-12 weeks of carefully managed recovery. We'll provide detailed post-operative care instructions, including activity restrictions, medication schedules, and follow-up appointments.",
      category: "surgery"
    },
    
    
    {
      question: "What grooming services do you offer?",
      answer: "Our grooming services include baths, haircuts, nail trims, ear cleaning, anal gland expression, de-shedding treatments, and specialized skin treatments. We customize our services to match your pet's breed, coat type, and specific needs.",
      category: "grooming"
    },
    {
      question: "How often should my pet be groomed?",
      answer: "Grooming frequency depends on your pet's breed, coat type, and lifestyle. Most dogs benefit from professional grooming every 4-8 weeks. Long-haired breeds may need more frequent grooming to prevent matting. Short-haired breeds may need less frequent full grooms but can benefit from regular nail trims and ear cleaning.",
      category: "grooming"
    },
    {
      question: "What's involved in the pet grooming process?",
      answer: "Our grooming process typically includes: (1) Pre-groom consultation to discuss your preferences, (2) Preliminary brush-out to remove loose fur and detangle, (3) Bath with appropriate shampoo and conditioner, (4) Blow-dry and further brushing, (5) Haircut if requested, (6) Nail trimming, ear cleaning, and other hygiene services, (7) Final styling and finishing touches.",
      category: "grooming"
    },
  ];
  
  
  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = !searchQuery || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const categories = [
    { id: "all", name: "All Questions" },
    { id: "general", name: "General" },
    { id: "checkups", name: "Checkups" },
    { id: "vaccinations", name: "Vaccinations" },
    { id: "surgery", name: "Surgery" },
    { id: "grooming", name: "Grooming" }
  ];

  return (
    <div className="min-h-screen pt-20">
      {}
      <section className="bg-pet-gray py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our services, appointments, pet care, and more.
            </p>
          </div>
        </div>
      </section>
      
      {}
      <section className="section-container">
        <div className="max-w-4xl mx-auto">
          {}
          <div className="mb-10 space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for questions..."
                className="w-full px-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id 
                      ? "bg-pet-blue-dark text-white" 
                      : "bg-pet-gray hover:bg-pet-gray-dark/10"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {}
          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((item, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleItem(item.question)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-white text-left transition-colors hover:bg-gray-50"
                  >
                    <h3 className="font-medium text-lg">{item.question}</h3>
                    <ChevronDown 
                      className={`transition-transform duration-300 ${
                        expandedItems[item.question] ? "rotate-180" : ""
                      }`} 
                      size={20} 
                    />
                  </button>
                  
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ${
                      expandedItems[item.question] 
                        ? "max-h-96 py-4 border-t border-gray-100" 
                        : "max-h-0 py-0"
                    }`}
                  >
                    <p className="text-muted-foreground">{item.answer}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">No matching questions found.</p>
                <p className="text-sm text-muted-foreground mb-6">Try adjusting your search or browse a different category.</p>
                <button
                  onClick={() => {setSearchQuery(""); setActiveCategory("all");}}
                  className="px-4 py-2 bg-pet-blue-dark text-white rounded-lg hover:bg-pet-blue-dark/90 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
          
          {}
          <div className="mt-16 text-center p-8 bg-pet-blue/5 rounded-xl border border-pet-blue/20">
            <h2 className="text-2xl font-medium mb-3">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Can't find the answer you're looking for? Contact our team or schedule an appointment to discuss your specific concerns.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/appointment"
                className="px-5 py-2.5 bg-pet-blue-dark text-white rounded-lg hover:bg-pet-blue-dark/90 transition-colors"
              >
                Book an Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
