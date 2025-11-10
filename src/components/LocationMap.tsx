import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export function LocationMap() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setMapLoaded(true);
  }, []);
  
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 relative">
        <div ref={mapRef} className="w-full h-[400px] md:h-[500px] overflow-hidden relative">
          {}
          <img 
            src="map.png" 
            alt=" Map of the clinic location " 
            className="w-full h-full object-cover"
          />
          
          {}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-pet-blue-dark text-white px-3 py-1 rounded-md shadow-lg flex items-center gap-2 whitespace-nowrap">
              <MapPin size={16} />
              <span> PawMilya </span>
            </div>
          </div>
          
          {}
          <div className="absolute top-1/3 left-1/4">
            <div className="bg-white text-pet-blue-dark px-2 py-1 rounded-md shadow-sm text-xs">
              Burnham Park Vet
            </div>
          </div>
          
          <div className="absolute bottom-1/3 right-1/4">
            <div className="bg-white text-pet-blue-dark px-2 py-1 rounded-md shadow-sm text-xs">
              SM City Animal Clinic
            </div>
          </div>
          
          <div className="absolute top-1/4 right-1/3">
            <div className="bg-white text-pet-blue-dark px-2 py-1 rounded-md shadow-sm text-xs">
              Baguio Animal Hospital
            </div>
          </div>
        </div>
        
        {/* Location Legend section removed */}
      </CardContent>
    </Card>
  );
}
