"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { Search, MapPin, Heart, ShieldCheck, Filter, Award } from "lucide-react";
import Link from "next/link";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  orgName: string;
  image: string;
  about: string;
}

const MOCK_PETS: Pet[] = [
  {
    id: "pet-1",
    name: "Rocky",
    species: "Dog",
    breed: "Indie (Mixed Breed)",
    age: "1.5 Years",
    gender: "Male",
    orgName: "Paws & Care Foundation",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400",
    about: "Very active and loving puppy. Rescued from a motor accident, now fully recovered and looking for a home.",
  },
  {
    id: "pet-2",
    name: "Bella",
    species: "Cat",
    breed: "Domestic Shorthair",
    age: "8 Months",
    gender: "Female",
    orgName: "Cupa India",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400",
    about: "Extremely playful, loves chasing toy mice. Vaccinated and dewormed.",
  },
  {
    id: "pet-3",
    name: "Coco",
    species: "Dog",
    breed: "Labrador Retriever Mix",
    age: "3 Years",
    gender: "Male",
    orgName: "Voice for Strays",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400",
    about: "Calm, friendly, and great with children. Ideal house dog.",
  },
];

export default function AdoptPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const toast = useToast();

  const toggleFavorite = (id: string, name: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(x => x !== id));
      toast.info("Removed Favorite", `${name} removed from favorites.`);
    } else {
      setFavorites([...favorites, id]);
      toast.success("Added to Favorites! ❤️", `${name} added to your favorites list.`);
    }
  };

  const filtered = MOCK_PETS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.breed.toLowerCase().includes(search.toLowerCase());
    if (filter === "All") return matchSearch;
    return p.species === filter && matchSearch;
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
        {["All", "Dog", "Cat"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === cat
                ? "bg-emerald-700 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-300"
            }`}
          >
            {cat}s
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((pet) => (
          <div key={pet.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
            {/* Header image with overlay */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <button
                onClick={() => toggleFavorite(pet.id, pet.name)}
                className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all ${
                  favorites.includes(pet.id)
                    ? "bg-rose-500/20 text-rose-500"
                    : "bg-black/30 text-white hover:text-rose-500"
                }`}
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
              <span className="absolute bottom-4 left-4 bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                {pet.gender}
              </span>
            </div>

            <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-gray-900 text-lg leading-tight">{pet.name}</h3>
                  <span className="text-xs font-semibold text-gray-400">{pet.age}</span>
                </div>
                <p className="text-xs text-emerald-800 font-bold">{pet.breed}</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-2">{pet.about}</p>
              </div>

              <div className="border-t border-gray-50 pt-3 flex items-center justify-between mt-auto">
                <span className="text-[10px] font-bold text-gray-400 tracking-wide uppercase truncate max-w-[60%]">
                  🏢 {pet.orgName}
                </span>
                <Link
                  href={`/dashboard/donate?orgName=${encodeURIComponent(pet.orgName)}`}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-[10px] rounded-lg transition-all"
                >
                  Sponsor Pet
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
