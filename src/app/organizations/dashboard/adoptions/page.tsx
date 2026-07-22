"use client";

import { useState, useEffect } from "react";
import { PawPrint, Plus, Search, X, Loader2, UploadCloud, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdoptionsPage() {
  const [adoptions, setAdoptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    type: "DOG",
    breed: "",
    age: "",
    gender: "MALE",
    size: "MEDIUM",
    description: "",
    status: "AVAILABLE",
  });

  const fetchAdoptions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/adoptions/my`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setAdoptions(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load adoptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const payload = new FormData();
    payload.append("file", file);

    try {
      setUploadingImage(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/upload`,
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success && res.data.media?.url) {
        setUploadedImages((prev) => [...prev, res.data.media.url]);
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      const payload = {
        ...formData,
        breed: formData.breed.split(',').map(s => s.trim()), // Convert comma separated to array
        age: parseInt(formData.age) || 0,
        images: uploadedImages,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/adoptions`,
        payload,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Adoption listing created!");
        setIsModalOpen(false);
        fetchAdoptions();
        setUploadedImages([]);
        setFormData({
            name: "",
            type: "DOG",
            breed: "",
            age: "",
            gender: "MALE",
            size: "MEDIUM",
            description: "",
            status: "AVAILABLE",
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create listing");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteAdoption = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
        const res = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/adoptions/${id}`,
            { withCredentials: true }
        );
        if (res.data.success) {
            toast.success("Listing deleted");
            setAdoptions(adoptions.filter(a => a._id !== id));
        }
    } catch (error) {
        toast.error("Failed to delete");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Adoptions</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage adoption listings and applications
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Adoption Listing</span>
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search listings..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : adoptions.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl">
          <PawPrint className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-900">No Listings Yet</p>
          <p className="text-xs text-gray-500 mt-1">Click the button above to add a pet for adoption.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adoptions.map((pet) => (
            <div key={pet._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 overflow-hidden">
                {pet.images && pet.images.length > 0 ? (
                  <img src={pet.images[0]} alt={pet.name} className="w-full h-full object-cover" />
                ) : (
                  <PawPrint className="w-10 h-10" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-base">{pet.name} {pet.breed?.length > 0 && `(${pet.breed[0]})`}</h3>
                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                    pet.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {pet.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">{pet.age || '?'} years old • {pet.gender || 'Unknown'} • {pet.type || 'Pet'}</p>
              <div className="flex space-x-2 pt-2">
                <button 
                  onClick={() => deleteAdoption(pet._id)}
                  className="flex-1 py-1.5 border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
                <button className="flex-1 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800">
                  Applications (0)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Adoption Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Add Adoption Listing</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Name</label>
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="e.g. Buddy" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="DOG">Dog</option>
                    <option value="CAT">Cat</option>
                    <option value="BIRD">Bird</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Breed (comma separated)</label>
                  <input name="breed" value={formData.breed} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="e.g. Golden Retriever" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Age (years)</label>
                  <input name="age" value={formData.age} onChange={handleChange} type="number" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="e.g. 2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="UNKNOWN">Unknown</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Size</label>
                  <select name="size" value={formData.size} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="SMALL">Small</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LARGE">Large</option>
                    <option value="EXTRA_LARGE">Extra Large</option>
                  </select>
                </div>
              </div>

               <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="Tell us about the pet..."></textarea>
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">Photos (Up to 5)</label>
                
                {/* Upload Button */}
                {uploadedImages.length < 5 && (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      id="pet-photo-upload"
                      className="hidden"
                    />
                    <label
                      htmlFor="pet-photo-upload"
                      className="w-full h-24 border-2 border-dashed border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all"
                    >
                      {uploadingImage ? (
                        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                      ) : (
                        <UploadCloud className="w-6 h-6 text-gray-400" />
                      )}
                      <span className="text-xs text-gray-500 font-semibold mt-1">
                        {uploadingImage ? "Uploading..." : "Click to upload photo"}
                      </span>
                    </label>
                  </div>
                )}

                {/* Previews */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative h-16 bg-gray-50 rounded-xl border overflow-hidden group">
                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
