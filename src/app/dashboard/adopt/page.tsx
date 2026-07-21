"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { Search, MapPin, Heart, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function AdoptPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/adoptions`);
        if (res.data.success) {
          setPets(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch adoptions", "Could not load adoption listings.");
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [toast]);

  const toggleFavorite = (id: string, name: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(x => x !== id));
      toast.info("Removed Favorite", `${name} removed from favorites.`);
    } else {
      setFavorites([...favorites, id]);
      toast.success("Added to Favorites! ❤️", `${name} added to your favorites list.`);
    }
  };

  const filtered = pets.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || 
                       (p.breed && p.breed.join(', ').toLowerCase().includes(search.toLowerCase()));
    if (filter === "All") return matchSearch;
    return p.type?.toUpperCase() === filter.toUpperCase() && matchSearch;
  });

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Adopt a Pet</h1>
        <p className="text-sm text-gray-500 mt-1">Adopt, don't shop. Find loving rescued pets near you.</p>
      </div>

      {/* Verification Notice */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-3 text-emerald-800">
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold">Verified Adoption Listings</p>
          <p className="mt-0.5">Every adoption profile is posted by registered, verified NGOs. No breeding listings allowed.</p>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex gap-2">
        {["All", "Dog", "Cat", "Bird", "Other"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === cat
                ? "bg-emerald-700 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by pet name, breed..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600 bg-white"
        />
      </div>

      {/* Pet Cards List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No pets found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((pet) => (
            <div key={pet._id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
              {/* Header image with overlay */}
              <div className="relative h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
                {pet.images && pet.images.length > 0 ? (
                  <img
                    src={pet.images[0]}
                    alt={pet.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Heart className="w-12 h-12 text-gray-300" />
                )}
                
                <button
                  onClick={() => toggleFavorite(pet._id, pet.name)}
                  className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all ${
                    favorites.includes(pet._id)
                      ? "bg-rose-500/20 text-rose-500"
                      : "bg-black/30 text-white hover:text-rose-500"
                  }`}
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
                <span className="absolute bottom-4 left-4 bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                  {pet.gender || 'Unknown'}
                </span>
              </div>

              <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-gray-900 text-lg leading-tight">{pet.name}</h3>
                    <span className="text-xs font-semibold text-gray-400">{pet.age ? `${pet.age} Years` : 'Age Unknown'}</span>
                  </div>
                  <p className="text-xs text-emerald-800 font-bold">{pet.breed && pet.breed.join(', ')}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mt-2 line-clamp-3">{pet.description}</p>
                </div>

                <div className="border-t border-gray-50 pt-3 flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wide uppercase truncate max-w-[60%] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {pet.shelter?.organizationName || 'Unknown NGO'}
                  </span>
                  <Link
                    href={`/dashboard/donate?orgId=${pet.shelter?._id}&orgName=${encodeURIComponent(pet.shelter?.organizationName || '')}`}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-[10px] rounded-lg transition-all"
                  >
                    Sponsor Pet
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
