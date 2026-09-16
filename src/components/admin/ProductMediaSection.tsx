import React, { useRef, useState } from 'react';
import { Upload, Plus, Trash2, Video, Play } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';

interface ProductMediaSectionProps {
  image: string;
  images: string[];
  video?: string;
  onChange: (patch: { image?: string; images?: string[]; video?: string }) => void;
}

export function ProductMediaSection({ image, images = [], video, onChange }: ProductMediaSectionProps) {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    type: 'error' | 'info';
    title: string;
    message: string;
  }>({ isOpen: false, type: 'info', title: '', message: '' });

  const notifyProdOnly = () => {
    setFeedback({
      isOpen: true,
      type: 'info',
      title: 'Solo URLs públicas',
      message: 'En Vercel no existe el servidor de subida. Publica el archivo en un hosting (ImgBB, TikTok, YouTube...) y pega su URL.'
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // El servidor de subida solo existe en desarrollo (Vercel no lo tiene)
    if (!import.meta.env.DEV) {
      notifyProdOnly();
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, data: reader.result }),
        });
        if (!response.ok) throw new Error('Upload failed');
        const { url } = await response.json();
        if (!image) {
          onChange({ image: url });
        } else {
          onChange({ images: [...images, url] });
        }
      };
    } catch (err) {
      console.error(err);
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'Error de Subida',
        message: 'Ocurrió un problema al subir la imagen.'
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    if (!image) {
      onChange({ image: url });
    } else {
      onChange({ images: [...images, url] });
    }
    setNewImageUrl('');
  };

  const handleRemoveMainImage = async () => {
    // Eliminar el archivo local solo existe en desarrollo
    if (import.meta.env.DEV && image.startsWith('/uploads/')) {
      await fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ url: image }) }).catch(() => {});
    }
    onChange({ image: '' });
  };

  const handleRemoveImage = async (index: number) => {
    const url = images[index];
    if (import.meta.env.DEV && url.startsWith('/uploads/')) {
      await fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ url }) }).catch(() => {});
    }
    const next = [...images];
    next.splice(index, 1);
    onChange({ images: next });
  };

  // Subida de video (máx 15 segundos)
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // El servidor de subida solo existe en desarrollo (Vercel no lo tiene)
    if (!import.meta.env.DEV) {
      notifyProdOnly();
      if (videoInputRef.current) videoInputRef.current.value = '';
      return;
    }

    // Verificar duración antes de subir
    const videoEl = document.createElement('video');
    videoEl.preload = 'metadata';
    videoEl.src = URL.createObjectURL(file);
    await new Promise<void>(resolve => {
      videoEl.onloadedmetadata = () => resolve();
    });

    if (videoEl.duration > 15) {
      URL.revokeObjectURL(videoEl.src);
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'Video muy largo',
        message: `El video tiene ${Math.round(videoEl.duration)}s. El máximo permitido es 15 segundos.`
      });
      if (videoInputRef.current) videoInputRef.current.value = '';
      return;
    }
    URL.revokeObjectURL(videoEl.src);

    setUploadingVideo(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, data: reader.result }),
        });
        if (!response.ok) throw new Error('Upload failed');
        const { url } = await response.json();

        // Eliminar video anterior si es local
        if (video?.startsWith('/uploads/')) {
          await fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ url: video }) }).catch(() => {});
        }
        onChange({ video: url });
      };
    } catch (err) {
      console.error(err);
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'Error de Subida',
        message: 'Ocurrió un problema al subir el video.'
      });
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleRemoveVideo = async () => {
    if (import.meta.env.DEV && video?.startsWith('/uploads/')) {
      await fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ url: video }) }).catch(() => {});
    }
    onChange({ video: undefined });
  };

  const hasImages = Boolean(image) || images.length > 0;

  return (
    <>
      {/* IMÁGENES */}
      <div className="col-span-1 md:col-span-2 border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          Imágenes del Artículo
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex gap-2">
            <input
              type="url"
              placeholder="URL de imagen (ej: https://...)"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success text-sm"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-3 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Agregar
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>o</span>
            <label className="cursor-pointer px-4 py-2 bg-green-200 text-emerald-700 hover:bg-green-200 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Upload className="w-4 h-4" />
              {uploading ? 'Subiendo...' : 'Subir Archivo'}
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
          {image && (
            <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm aspect-square">
              <img src={image} alt="Main" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2">
                <span className="text-white text-[10px] font-bold bg-brand-success px-2 py-1 rounded">PRINCIPAL</span>
                <button type="button" onClick={handleRemoveMainImage} className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {images.map((imgUrl, idx) => (
            <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm aspect-square">
              <img src={imgUrl} alt={`Extra ${idx}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
                <button type="button" onClick={() => handleRemoveImage(idx)} className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {!hasImages && (
          <p className="text-xs text-red-500 font-medium">Debe agregar al menos una imagen (la primera será la principal).</p>
        )}
      </div>

      {/* VIDEO DEL ARTÍCULO */}
      <div className="col-span-1 md:col-span-2 border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Video className="w-4 h-4 text-brand-primary" />
          Video del Artículo (máx. 15 segundos)
        </h3>

        {video ? (
          <div className="flex items-start gap-3">
            <video
              src={video}
              className="w-28 h-28 rounded-lg object-cover border border-slate-200 bg-black"
              muted
              loop
              autoPlay
              playsInline
            />
            <div className="flex flex-col gap-2 justify-center">
              <span className="text-xs font-medium text-brand-success flex items-center gap-1">
                <Play className="w-3.5 h-3.5" /> Video cargado
              </span>
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" /> Quitar video
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <label className="cursor-pointer px-4 py-2.5 bg-blue-200 text-amber-800 hover:bg-blue-200 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm">
              <Upload className="w-4 h-4" />
              {uploadingVideo ? 'Subiendo...' : 'Subir Video (MP4 ≤ 15s)'}
              <input
                type="file"
                accept="video/mp4,video/*"
                className="hidden"
                ref={videoInputRef}
                onChange={handleVideoUpload}
                disabled={uploadingVideo}
              />
            </label>
            <p className="text-xs text-slate-500">El video aparecerá en la galería del producto en la tienda.</p>
          </div>
        )}
      </div>

      <FeedbackModal
        isOpen={feedback.isOpen}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onCancel={() => setFeedback(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}