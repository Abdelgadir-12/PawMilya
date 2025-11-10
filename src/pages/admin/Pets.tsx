
import { useState, useEffect } from "react";
import { getAllPets } from "@/lib/database";
import { getUsersFromDB } from "@/utils/usersDB"; // consider migrating usersDB to src/lib/database.getProfiles
import { useAuth } from "@/contexts/AuthContext";


const Pets = () => {
  const [pets, setPets] = useState<any[]>([]);
  const { user, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecies, setFilterSpecies] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPets();
  }, [user, isAdmin]);

  const loadPets = async () => {
    try {
      setIsLoading(true);
      if (!user) {
        setPets([]);
        setIsLoading(false);
        return;
      }
      
  // Fetch all pets from Supabase (admin helper)
  const { data: allPetsRaw, error: petsError } = await getAllPets();
  let allPets = allPetsRaw || [];
  if (petsError) console.error('Error fetching pets from DB:', petsError);
      
      // If not admin, filter by owner_id
      if (!isAdmin) {
        allPets = allPets.filter((pet: any) => (pet.owner_id || pet.owner?.id) === user.id);
      }

      // Map pets with owner information (owner may be included via the join)
      const petsWithOwners = allPets.map((pet: any) => {
        return {
          ...pet,
          owner_id: pet.owner_id || pet.owner?.id,
          owner_name: pet.owner?.full_name || pet.owner?.name || pet.owner?.email || 'Unknown',
          owner_email: pet.owner?.email || ''
        };
      });
      
      setPets(petsWithOwners);
    } catch (error) {
      console.error('❌ Error loading pets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
    }
    
    if (years < 1) {
      const totalMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
      return totalMonths === 1 ? "1 month" : `${totalMonths} months`;
    }
    
    return years === 1 ? "1 year" : `${years} years`;
  };

  const filteredPets = pets.filter(pet => {
    const matchesSearch = 
      pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (isAdmin && pet.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecies = filterSpecies === "All" || pet.species === filterSpecies;
    
    return matchesSearch && matchesSpecies;
  });

  const uniqueSpecies = Array.from(new Set(pets.map(pet => pet.species))).filter(Boolean);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pets</h1>
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search pets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md"
        />
        <select
          value={filterSpecies}
          onChange={(e) => setFilterSpecies(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="All">All Species</option>
          {uniqueSpecies.map(species => (
            <option key={species} value={species}>{species}</option>
          ))}
        </select>
      </div>

      {filteredPets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No pets found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPets.map((pet) => (
            <div key={pet.id} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg">{pet.name}</h3>
              <p className="text-sm text-gray-600">{pet.species} • {pet.breed || 'Unknown breed'}</p>
              <p className="text-sm text-gray-600">Age: {calculateAge(pet.birthDate)}</p>
              <p className="text-sm text-gray-600">Gender: {pet.gender}</p>
              {isAdmin && pet.owner_name && (
                <p className="text-sm text-gray-600 mt-2">Owner: {pet.owner_name}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pets;
