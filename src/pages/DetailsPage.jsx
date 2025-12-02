import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ICONS } from '../components/icons.jsx';

// --- IMPORT FIREBASE API FUNCTIONS ---
// 💡 IMPORTANT: getListingDetails and submitContactForm must be defined in utils/api.js
import { getListingDetails, submitContactForm } from '../utils/api'; 

// Removed: import { residentialListings, commercialListings, plots } from '../data/...';

const DetailsPage = () => {
  const { id } = useParams(); // Property ID from the URL
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true); // 💡 NEW: Loading state
  const [error, setError] = useState(null);     // 💡 NEW: Error state

  // Gallery State (Remains the same)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [allPhotos, setAllPhotos] = useState([]);

  // Form State (Remains the same)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 💡 NEW: Submitting state

  // --- 💡 DATA FETCHING useEffect (REPLACED) ---
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 1. Call the Firebase API function to fetch the single property
        const found = await getListingDetails(id); 
        
        if (found) {
          setProperty(found);
          
          // 2. Process Images and Set Initial Form Data
          let rawImages = found.images || (found.photos ? found.photos.map(p => p.url) : []);
          if (rawImages.length === 0) {
            rawImages = ['https://via.placeholder.com/1200x800?text=No+Image+Available'];
          }
          setAllPhotos(rawImages);

          setFormData(prev => ({
            ...prev, 
            message: `I am interested in this ${found.propertyType || 'property'} in ${found.locality}. Please contact me.`
          }));
        } else {
          // If the ID is valid but no document is found
          setError("Property not found. It may have been sold or removed.");
          setProperty(null); // Ensure property is null if not found
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to connect to the database. Please try again.");
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    if (id) {
      fetchProperty();
    } else {
      setError("Invalid property link.");
      setLoading(false);
    }
    
  }, [id]);

  // --- 💡 CONTACT FORM SUBMISSION (UPDATED) ---
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const submissionData = {
      ...formData,
      listingId: property.id, // Include property ID
      listingTitle: property.title,
    };
    
    try {
      // Use the Firebase-connected API function
      const result = await submitContactForm(submissionData);
      
      if (result.success) {
        setIsSubmitted(true);
      } else {
        alert(result.message || "Failed to send enquiry.");
      }
      
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Error sending enquiry. Please try calling instead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- GALLERY HANDLERS (Remain the same) ---
  const openGallery = (index = 0) => {
    setPhotoIndex(index);
    setIsGalleryOpen(true);
    document.body.style.overflow = 'hidden'; 
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = ''; 
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % allPhotos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  // --- 💡 CONDITIONAL RENDERING ---
  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <ICONS.Loader className="h-8 w-8 animate-spin text-navy" />
        <p className='ml-3 text-lg text-slate-600'>Fetching property...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex h-[60vh] items-center justify-center flex-col text-center p-6">
        <ICONS.AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-navy">404 - Property Not Found</h1>
        <p className="text-slate-600 mt-2">{error || "The property you are looking for does not exist or the link is broken."}</p>
        <button onClick={() => navigate('/buy')} className="mt-6 bg-navy text-white px-6 py-3 rounded-full font-bold hover:bg-blue-900 transition">
          Explore Listings
        </button>
      </div>
    );
  }
  
  // --- DYNAMIC GRID RENDERER (Remains the same) ---
  const renderPhotoGrid = () => {
    const count = allPhotos.length;
    // ... (Your grid rendering logic based on count)
    // Case 1: Only 1 Photo
    if (count === 1) {
      return (
        <div className="h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden relative group cursor-pointer" onClick={() => openGallery(0)}>
          <img src={allPhotos[0]} alt="Main" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
          <div className="absolute bottom-4 right-4">
             <button className="bg-white px-4 py-2 rounded-lg shadow-md text-sm font-bold text-navy flex items-center gap-2">
               <ICONS.Grid className="w-4 h-4" /> View Photos
             </button>
          </div>
        </div>
      );
    }
    // Case 2: Two Photos (Split 50/50)
    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-2 h-[400px] md:h-[500px] rounded-3xl overflow-hidden">
          {allPhotos.map((img, idx) => (
            <div key={idx} onClick={() => openGallery(idx)} className="relative cursor-pointer group overflow-hidden">
              <img src={img} alt={`img-${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            </div>
          ))}
        </div>
      );
    }
    // Case 3: Three Photos (1 Large Left, 2 Stacked Right)
    if (count === 3) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[400px] md:h-[500px] rounded-3xl overflow-hidden">
          <div onClick={() => openGallery(0)} className="md:col-span-2 relative cursor-pointer group overflow-hidden">
            <img src={allPhotos[0]} alt="Main" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
          </div>
          <div className="hidden md:flex flex-col gap-2">
            <div onClick={() => openGallery(1)} className="h-1/2 relative cursor-pointer group overflow-hidden">
              <img src={allPhotos[1]} alt="img-1" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            </div>
            <div onClick={() => openGallery(2)} className="h-1/2 relative cursor-pointer group overflow-hidden">
              <img src={allPhotos[2]} alt="img-2" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            </div>
          </div>
        </div>
      );
    }
    // Case 4: Four Photos (1 Large Left, 1 Top Right, 2 Bottom Right)
    if (count === 4) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-3xl overflow-hidden">
          <div onClick={() => openGallery(0)} className="md:col-span-2 md:row-span-2 relative cursor-pointer group overflow-hidden">
            <img src={allPhotos[0]} alt="Main" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
          </div>
          <div onClick={() => openGallery(1)} className="md:col-span-2 relative cursor-pointer group overflow-hidden">
            <img src={allPhotos[1]} alt="img-1" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
          </div>
          <div onClick={() => openGallery(2)} className="relative cursor-pointer group overflow-hidden">
            <img src={allPhotos[2]} alt="img-2" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
          </div>
          <div onClick={() => openGallery(3)} className="relative cursor-pointer group overflow-hidden">
            <img src={allPhotos[3]} alt="img-3" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
          </div>
        </div>
      );
    }
    // Case 5+: Standard Airbnb Grid (1 Large, 4 Small)
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-3xl overflow-hidden relative">
        <div onClick={() => openGallery(0)} className="md:col-span-2 md:row-span-2 cursor-pointer relative group overflow-hidden">
          <img src={allPhotos[0]} alt="Main" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
        </div>
        
        {allPhotos.slice(1, 5).map((photo, idx) => (
           <div key={idx} onClick={() => openGallery(idx + 1)} className="hidden md:block cursor-pointer relative group overflow-hidden">
             <img src={photo} alt={`img-${idx+1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
             {/* Overlay on the last visible image if there are more */}
             {idx === 3 && count > 5 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition">
                 <span className="text-white font-display font-bold text-xl tracking-wider">+ {count - 5} Photos</span>
              </div>
             )}
           </div>
        ))}

        {/* Mobile Button */}
        <button 
          onClick={() => openGallery(0)}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg text-sm font-bold text-navy flex items-center gap-2 hover:bg-white transition md:hidden"
        >
          <ICONS.Grid className="w-4 h-4" /> View Photos
        </button>

        {/* Desktop Button */}
        <button 
          onClick={() => openGallery(0)}
          className="hidden md:flex absolute bottom-6 right-6 bg-white px-5 py-2.5 rounded-xl shadow-lg text-sm font-bold text-navy items-center gap-2 hover:scale-105 transition"
        >
          <ICONS.Grid className="w-4 h-4" /> Show all photos
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* --- 1. DYNAMIC PHOTO GRID --- */}
      <div className="pt-6 pb-8 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-navy font-semibold transition">
            <ICONS.ArrowLeft className="h-5 w-5" /> Back
          </button>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-white transition text-sm font-semibold">
              <ICONS.Share className="w-4 h-4" /> Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-white transition text-sm font-semibold text-red-500">
              <ICONS.Heart className="w-4 h-4" /> Save
            </button>
          </div>
        </div>

        {/* RENDER THE CORRECT GRID LAYOUT */}
        {renderPhotoGrid()}
      </div>

      {/* --- 2. MAIN CONTENT --- */}
      <div className="site-container grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT: DETAILS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Title & Price */}
          <div className="pb-6 border-b border-gray-200">
            <div className="flex flex-wrap gap-3 mb-3">
               <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded-md tracking-wider">{property.propertyType}</span>
               <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase rounded-md tracking-wider">{property.status || 'Ready to Move'}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-navy mb-2">{property.title}</h1>
            <p className="text-slate-500 flex items-center gap-1 text-lg">
              <ICONS.MapPin className="h-5 w-5 text-slate-400" /> {property.locality}, {property.city}
            </p>
            
            <div className="mt-6 flex items-end gap-2">
              <p className="text-4xl font-bold text-navy">
                ₹{property.price ? property.price.toLocaleString() : property.rent?.toLocaleString() + '/mo'}
              </p>
              {property.price && property.areaSqft && <p className="text-slate-500 mb-1.5">@ ₹{Math.round(property.price / property.areaSqft).toLocaleString()}/sq.ft</p>}
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 py-6 border-b border-gray-200">
             <div className="text-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <ICONS.Home className="w-6 h-6 mx-auto text-navy mb-2" />
                <p className="font-bold text-slate-700">{property.bhkType || '-'}</p>
                <p className="text-xs text-slate-400">Config</p>
             </div>
             <div className="text-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <ICONS.Area className="w-6 h-6 mx-auto text-navy mb-2" />
                <p className="font-bold text-slate-700">{property.areaSqft || property.areaSqyd || '-'}</p>
                <p className="text-xs text-slate-400">{property.areaSqyd ? 'Sq. Yd.' : 'Sq. Ft.'}</p>
             </div>
             <div className="text-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <ICONS.Bath className="w-6 h-6 mx-auto text-navy mb-2" />
                <p className="font-bold text-slate-700">{property.bathrooms || '-'}</p>
                <p className="text-xs text-slate-400">Baths</p>
             </div>
             <div className="text-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hidden md:block">
                <ICONS.Compass className="w-6 h-6 mx-auto text-navy mb-2" />
                <p className="font-bold text-slate-700">East</p>
                <p className="text-xs text-slate-400">Facing</p>
             </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xl font-bold text-navy mb-4">About this property</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              Located in the heart of {property.locality}, this {property.propertyType} offers a perfect blend of comfort and convenience. 
              Ideal for families looking for a peaceful yet connected lifestyle. The property features modern fittings, ample natural light, 
              and is situated close to major schools, hospitals, and shopping complexes.
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-xl font-bold text-navy mb-4">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
              {property.amenities?.map((amenity, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-700">
                  <ICONS.CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: STICKY CONTACT FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
            
            {/* Agent Header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="h-14 w-14 rounded-full bg-navy text-white flex items-center justify-center font-bold text-xl">
                {property.postedBy ? property.postedBy.charAt(0) : 'A'}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Listed by</p>
                <h3 className="font-bold text-navy text-lg">{property.postedBy || 'Aura Agent'}</h3>
                <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                  <ICONS.Shield className="h-3 w-3" /> Verified Seller
                </div>
              </div>
            </div>

            {/* Form */}
            {!isSubmitted ? (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <h3 className="font-bold text-navy">Contact Seller</h3>
                <input type="text" required placeholder="Name" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-navy outline-none text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input type="tel" required placeholder="Phone" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-navy outline-none text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <input type="email" required placeholder="Email" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-navy outline-none text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <textarea rows="3" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-navy outline-none text-sm resize-none" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                
                <button type="submit" disabled={isSubmitting} className="w-full bg-navy text-white py-3.5 rounded-xl font-bold hover:bg-blue-900 transition shadow-lg disabled:bg-gray-400">
                  {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                </button>
              </form>
            ) : (
              <div className="text-center py-8 bg-green-50 rounded-xl border border-green-100">
                <ICONS.CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-2" />
                <h3 className="font-bold text-navy">Details Sent!</h3>
                <p className="text-xs text-slate-600">The seller will call you shortly.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- 3. FULL SCREEN LIGHTBOX (Modal) (Remains the same) --- */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
            onClick={closeGallery}
          >
            {/* ... Gallery JSX remains the same ... */}
            <div className="flex justify-between items-center p-4 text-white" onClick={e => e.stopPropagation()}>
              <button onClick={closeGallery} className="flex items-center gap-2 hover:text-gray-300"><ICONS.X className="w-6 h-6" /> Close</button>
              <span className="font-medium">{photoIndex + 1} / {allPhotos.length}</span>
              <button className="p-2 bg-white/10 rounded-full hover:bg-white/20"><ICONS.Share className="w-5 h-5" /></button>
            </div>
            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center relative px-4 md:px-20" onClick={e => e.stopPropagation()}>
              <button onClick={prevPhoto} className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition"><ICONS.ChevronLeft className="w-8 h-8" /></button>
              <img src={allPhotos[photoIndex]} alt="Gallery Full" className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"/>
              <button onClick={nextPhoto} className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition"><ICONS.ChevronRight className="w-8 h-8" /></button>
            </div>
            {/* Thumbnails Strip */}
            <div className="h-20 flex justify-center gap-2 pb-4 px-4 overflow-x-auto" onClick={e => e.stopPropagation()}>
              {allPhotos.map((photo, idx) => (
                <img key={idx} src={photo} onClick={() => setPhotoIndex(idx)} className={`h-full aspect-square object-cover rounded-lg cursor-pointer transition ${photoIndex === idx ? 'border-2 border-white scale-105' : 'opacity-50 hover:opacity-100'}`} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE STICKY FOOTER (Remains the same) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-50 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <button className="flex-1 border border-green-600 text-green-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
          <ICONS.MessageSquare className="h-5 w-5" /> WhatsApp
        </button>
        <button onClick={() => document.querySelector('form').scrollIntoView({ behavior: 'smooth' })} className="flex-1 bg-navy text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
          <ICONS.Phone className="h-5 w-5" /> Contact
        </button>
      </div>

    </div>
  );
};

export default DetailsPage;