import { Brain } from "lucide-react";

const Tonometry = () => {
  return (
    <div className="min-h-screen pt-20">
      <section className="bg-pet-gray py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Tonometry</h1>
            <p className="text-lg text-muted-foreground">
              Eye pressure testing to detect and manage glaucoma in pets, ensuring their vision and comfort.
            </p>
          </div>
        </div>
      </section>

      <section className="section-container">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">What is Tonometry?</h2>
              <p className="text-muted-foreground">
                Tonometry is a diagnostic procedure used to measure the pressure inside your pet's eyes. It is essential for detecting and managing conditions like glaucoma, which can lead to vision loss if untreated.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <div className="w-32 h-32 bg-pet-blue/20 rounded-full flex items-center justify-center">
                <Brain className="text-pet-blue-dark" size={64} />
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Why is it Important?</h2>
            <p className="text-muted-foreground">
              Regular tonometry checks can help identify eye conditions early, allowing for timely treatment and preventing complications. This is especially important for pets prone to eye issues.
            </p>
          </div>

          <div className="mt-12 text-center">
            <a
              href="/appointment"
              className="inline-block px-6 py-3 bg-pet-blue-dark text-white rounded-lg hover:bg-pet-blue-dark/90 transition-colors shadow-sm"
            >
              Book a Tonometry Appointment
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tonometry;
