import React, { useState, useRef, useEffect } from 'react';
import { Camera, Wand2, Upload, Loader2, Image as ImageIcon, Move, ZoomIn, Check, X, RotateCw, Crop } from 'lucide-react';
import { editProfileImage } from '../services/geminiService';

interface PhotoEditorProps {
  currentPhotoUrl?: string;
  onUpdate: (url: string) => void;
}

interface CropState {
  isOpen: boolean;
  imageSrc: string;
  x: number;
  y: number;
  zoom: number; // User adjustable zoom (multiplier of baseScale)
  baseScale: number; // Calculated scale to fit image in container
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({ currentPhotoUrl, onUpdate }) => {
  const [prompt, setPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Store original uploaded image to allow re-cropping/panning without quality loss
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  // Crop State
  const [crop, setCrop] = useState<CropState>({
    isOpen: false,
    imageSrc: '',
    x: 0,
    y: 0,
    zoom: 1,
    baseScale: 1
  });
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragStartRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  // Constants
  const PREVIEW_SIZE = 256; // 64 * 4 (tailwind w-64)
  const OUTPUT_SIZE = 400; // Final image resolution

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setOriginalImage(result); 
        
        // Open crop modal with reset state
        setCrop({
          isOpen: true,
          imageSrc: result,
          x: 0,
          y: 0,
          zoom: 1,
          baseScale: 1 // Will be calculated on image load
        });
        
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReAdjust = () => {
    const srcToUse = originalImage || currentPhotoUrl;
    
    if (srcToUse) {
      // Note: We reset x/y/zoom because reconstructing the exact previous state 
      // without storing it persistently is complex. Starting fresh with the 
      // high-res original is safer for UX than a broken state.
      setCrop({
        isOpen: true,
        imageSrc: srcToUse,
        x: 0,
        y: 0,
        zoom: 1,
        baseScale: 1
      });
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    // Calculate the scale needed to make the image "cover" the preview box initially.
    // We want the smaller dimension of the image to fit the preview box (256px).
    // Math.max ensures we scale based on the dimension that needs to be effectively "zoomed out" less 
    // to fill the box, or essentially "Cover" logic.
    const scaleX = PREVIEW_SIZE / naturalWidth;
    const scaleY = PREVIEW_SIZE / naturalHeight;
    const newBaseScale = Math.max(scaleX, scaleY);

    setCrop(prev => ({
      ...prev,
      baseScale: newBaseScale,
      x: 0,
      y: 0,
      zoom: 1 // Reset user zoom to 1 (which means 1x baseScale)
    }));
  };

  const handleGeminiEdit = async () => {
    if (!currentPhotoUrl || !prompt.trim()) return;

    setIsEditing(true);
    setError(null);

    try {
      const newImageUrl = await editProfileImage(currentPhotoUrl, prompt);
      onUpdate(newImageUrl);
      setOriginalImage(newImageUrl); 
      setPrompt(''); 
    } catch (err) {
      setError("Fotoğraf düzenlenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsEditing(false);
    }
  };

  // --- Cropping Logic ---

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    dragStartRef.current = { x: clientX - crop.x, y: clientY - crop.y };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    setCrop(prev => ({
      ...prev,
      x: clientX - dragStartRef.current.x,
      y: clientY - dragStartRef.current.y
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCropConfirm = () => {
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (ctx && img) {
      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      // Math for mapping Preview coordinates to Output coordinates
      // 1. Ratio between Output and Preview
      const ratio = OUTPUT_SIZE / PREVIEW_SIZE;

      // 2. Center the context
      ctx.translate(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2);

      // 3. Apply Pan (Scaled by ratio)
      ctx.translate(crop.x * ratio, crop.y * ratio);

      // 4. Apply Scale
      // We must combine the calculated baseScale (which fits img to 256px) 
      // with the user's zoom, AND the ratio to up-scale to 400px.
      const totalScale = crop.baseScale * crop.zoom * ratio;
      ctx.scale(totalScale, totalScale);

      // 5. Draw Image Centered
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

      const croppedUrl = canvas.toDataURL('image/jpeg', 0.9);
      onUpdate(croppedUrl);
      setCrop(prev => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Camera className="w-5 h-5 text-primary" />
        Profil Fotoğrafı
      </h3>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Photo Display */}
        <div className="relative group shrink-0">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-md bg-slate-100 flex items-center justify-center relative">
             {currentPhotoUrl ? (
                <img 
                  src={currentPhotoUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
             ) : (
                <ImageIcon className="w-12 h-12 text-slate-300" />
             )}
             
             {/* Hover Overlay for Quick Actions */}
             {currentPhotoUrl && (
               <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                 <button 
                   onClick={handleReAdjust}
                   className="p-2 bg-white/90 rounded-full text-slate-700 hover:text-primary shadow-sm"
                   title="Konumu ve Boyutu Ayarla"
                 >
                   <Move className="w-4 h-4" />
                 </button>
               </div>
             )}
          </div>
          
          <div className="absolute -bottom-2 -right-2 flex gap-1">
             {currentPhotoUrl && (
                <button 
                  onClick={handleReAdjust}
                  className="bg-white text-slate-700 p-2 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  title="Konumu Ayarla"
                >
                  <Crop className="w-4 h-4" />
                </button>
             )}
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                title="Yeni Fotoğraf Yükle"
              >
                <Upload className="w-4 h-4" />
             </button>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* AI Editor Controls */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            AI Fotoğraf Düzenleyici (Gemini 2.5)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Örn: "Arka planı beyaz yap", "Gülümseme ekle"'
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              disabled={!currentPhotoUrl || isEditing}
            />
            <button
              onClick={handleGeminiEdit}
              disabled={!currentPhotoUrl || !prompt.trim() || isEditing}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {isEditing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Düzenle</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            İpucu: "Konumu Ayarla" butonu ile çerçeve içindeki görüntüyü kaydırabilir, AI ile stil verebilirsiniz.
          </p>
          {error && (
            <p className="text-xs text-red-500 mt-2">{error}</p>
          )}
        </div>
      </div>

      {/* Crop Modal */}
      {crop.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-slate-800">Fotoğrafı Ayarla</h4>
              <button onClick={() => setCrop(prev => ({ ...prev, isOpen: false }))} className="text-slate-500 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Crop Area */}
            {/* This container needs to match PREVIEW_SIZE in pixels exactly for the logic to work */}
            <div className="w-full flex justify-center mb-6">
                <div 
                    className="relative bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center cursor-move select-none touch-none shadow-inner"
                    style={{ width: `${PREVIEW_SIZE}px`, height: `${PREVIEW_SIZE}px` }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                >
                {/* Mask Overlay - Circular */}
                <div className="absolute inset-0 pointer-events-none z-10 border-[999px] border-slate-900/50 rounded-full w-full h-full mix-blend-hard-light box-content -m-[999px]"></div>
                
                {/* Visual Guide Circle */}
                <div className="absolute inset-0 border-2 border-white/50 rounded-full z-20 pointer-events-none"></div>

                {/* The Image */}
                <img 
                    ref={imageRef}
                    src={crop.imageSrc} 
                    alt="Crop preview"
                    className="max-w-none origin-center"
                    onLoad={handleImageLoad}
                    style={{
                    transform: `translate(${crop.x}px, ${crop.y}px) scale(${crop.baseScale * crop.zoom})`
                    }}
                    draggable={false}
                />
                
                </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ZoomIn className="w-4 h-4 text-slate-500" />
                <input 
                  type="range" 
                  min="0.5" 
                  max="3" 
                  step="0.1" 
                  value={crop.zoom}
                  onChange={(e) => setCrop(prev => ({ ...prev, zoom: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setCrop(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button 
                  onClick={handleCropConfirm}
                  className="flex-1 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Uygula
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PhotoEditor;