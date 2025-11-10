import { ShoppingBag } from "lucide-react";

const PetShop = () => {
  return (
    <div className="min-h-screen pt-20">
      <section className="bg-pet-gray py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Pet Shop</h1>
            <p className="text-lg text-muted-foreground">
              Explore our wide range of pet products, including food, toys, accessories, and healthcare items, all tailored to meet your pet's needs.
            </p>
          </div>
        </div>
      </section>

      <section className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all text-center">
            <div className="w-16 h-16 bg-pet-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="text-pet-teal-dark" size={32} />
            </div>
            <h3 className="text-xl font-medium mb-2">Premium Pet Food</h3>
            <p className="text-muted-foreground">
              High-quality nutrition for dogs, cats, and other pets to keep them healthy and happy.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all text-center">
            <div className="w-16 h-16 bg-pet-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="text-pet-blue-dark" size={32} />
            </div>
            <h3 className="text-xl font-medium mb-2">Toys & Accessories</h3>
            <p className="text-muted-foreground">
              Fun and engaging toys, along with stylish and functional accessories for your pets.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all text-center">
            <div className="w-16 h-16 bg-pet-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="text-pet-teal-dark" size={32} />
            </div>
            <h3 className="text-xl font-medium mb-2">Healthcare Products</h3>
            <p className="text-muted-foreground">
              Essential healthcare items, including supplements, grooming tools, and more.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PetShop;
