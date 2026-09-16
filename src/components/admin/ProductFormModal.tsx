import React, { useState, useEffect } from 'react';
import { JerseyProduct } from '../../types';
import { X } from 'lucide-react';
import { ProductMediaSection } from './ProductMediaSection';
import { SizesSelector } from './SizesSelector';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: JerseyProduct) => void;
  initialData?: JerseyProduct | null;
}

interface FormErrors {
  name?: string;
  team?: string;
  retailPrice?: string;
  wholesalePrice?: string;
  image?: string;
  sizes?: string;
}

// Validación del formulario (fuera del componente para mantenerlo puro)
const validateProduct = (data: Partial<JerseyProduct>): FormErrors => {
  const errors: FormErrors = {};
  const retail = Number(data.retailPrice || 0);
  const wholesale = Number(data.wholesalePrice || 0);

  if (!data.name?.trim()) errors.name = 'El nombre de la camiseta es obligatorio.';
  if (!data.team?.trim()) errors.team = 'Indica el equipo o selección.';
  if (!retail || retail <= 0) {
    errors.retailPrice = 'Debe ser un precio mayor a 0.';
  }
  if (!wholesale || wholesale <= 0) {
    errors.wholesalePrice = 'Debe ser un precio mayor a 0.';
  } else if (retail > 0 && wholesale > retail) {
    errors.wholesalePrice = 'El precio mayorista no puede superar al precio detal.';
  }
  if (!data.image && (!data.images || data.images.length === 0)) {
    errors.image = 'Debe tener al menos una imagen.';
  }
  if (!data.sizes || data.sizes.length === 0) {
    errors.sizes = 'Selecciona al menos una talla.';
  }
  return errors;
};

// Construye un JerseyProduct válido normalizando los datos del formulario
const buildProduct = (data: Partial<JerseyProduct>): JerseyProduct => {
  const images = [...(data.images || [])];
  let image = data.image || '';
  // Si solo hay imágenes secundarias, la primera pasa a ser la principal
  if (!image && images.length > 0) {
    image = images[0];
    images.splice(0, 1);
  }
  return {
    id: data.id || `prod-${Date.now()}`,
    name: (data.name || '').trim(),
    team: (data.team || '').trim(),
    league: data.league || '',
    season: data.season || '2024/2025',
    category: data.category || 'clubes-europa',
    version: data.version || 'Versión Fan',
    retailPrice: Number(data.retailPrice || 0),
    wholesalePrice: Number(data.wholesalePrice || 0),
    image,
    images,
    badges: data.badges || [],
    description: data.description || '',
    sizes: data.sizes || [],
    popularPlayers: data.popularPlayers,
    isFeatured: data.isFeatured,
    inStock: data.inStock !== false,
    fabricTech: data.fabricTech,
    video: data.video,
  };
};

export function ProductFormModal({ isOpen, onClose, onSave, initialData }: ProductFormModalProps) {
  const [formData, setFormData] = useState<Partial<JerseyProduct>>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: `prod-${Date.now()}`,
        name: '',
        team: '',
        league: '',
        season: '2024/2025',
        category: 'clubes-europa',
        version: 'Versión Fan',
        retailPrice: 25,
        wholesalePrice: 18,
        image: '',
        images: [],
        badges: [],
        description: '',
        sizes: ['S', 'M', 'L', 'XL'],
        inStock: true,
      });
    }
    setFormErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    // Limpiar el error del campo mientras el usuario corrige
    setFormErrors((prev) => {
      if (!prev[name as keyof FormErrors]) return prev;
      const next = { ...prev };
      delete next[name as keyof FormErrors];
      return next;
    });
  };

  const handleSizeToggle = (size: JerseyProduct['sizes'][number]) => {
    setFormData((prev) => {
      const currentSizes = prev.sizes || [];
      if (currentSizes.includes(size)) {
        return { ...prev, sizes: currentSizes.filter((s) => s !== size) };
      } else {
        return { ...prev, sizes: [...currentSizes, size] };
      }
    });
    setFormErrors((prev) => (prev.sizes ? { ...prev, sizes: undefined } : prev));
  };

  const handleMediaChange = (patch: { image?: string; images?: string[]; video?: string }) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    if (patch.video !== undefined || patch.image !== undefined) {
      setFormErrors((prev) => {
        if (!prev.image) return prev;
        const next = { ...prev };
        delete next.image;
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateProduct(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    onSave(buildProduct(formData));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? 'Editar' : 'Agregar'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 text-slate-900">
          <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
            {Object.keys(formErrors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                Revisa el formulario: hay campos obligatorios sin completar o con valores inválidos.
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la Camiseta *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success ${formErrors.name ? 'border-red-400' : 'border-slate-300'}`}
                />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Equipo / Selección *</label>
                <input
                  type="text"
                  name="team"
                  value={formData.team || ''}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success ${formErrors.team ? 'border-red-400' : 'border-slate-300'}`}
                />
                {formErrors.team && <p className="text-xs text-red-500 mt-1">{formErrors.team}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Liga / Torneo</label>
                <input
                  type="text"
                  name="league"
                  value={formData.league || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                <select
                  name="category"
                  value={formData.category || 'clubes-europa'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success"
                >
                  <option value="clubes-europa">Clubes Europa</option>
                  <option value="selecciones">Selecciones</option>
                  <option value="retro">Retro / Clásicas</option>
                  <option value="version-jugador">Versión Jugador (Especial)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Versión</label>
                <select
                  name="version"
                  value={formData.version || 'Versión Fan'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success"
                >
                  <option value="Versión Fan">Versión Fan</option>
                  <option value="Versión Jugador">Versión Jugador</option>
                  <option value="Edición Especial Retro">Edición Especial Retro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Precio Detal ($) *</label>
                <input
                  type="number"
                  name="retailPrice"
                  value={formData.retailPrice || 0}
                  onChange={handleChange}
                  required
                  min={0}
                  className={`w-full px-3 py-2 border rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success ${formErrors.retailPrice ? 'border-red-400' : 'border-slate-300'}`}
                />
                {formErrors.retailPrice && <p className="text-xs text-red-500 mt-1">{formErrors.retailPrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Precio Mayorista ($) *</label>
                <input
                  type="number"
                  name="wholesalePrice"
                  value={formData.wholesalePrice || 0}
                  onChange={handleChange}
                  required
                  min={0}
                  className={`w-full px-3 py-2 border rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success ${formErrors.wholesalePrice ? 'border-red-400' : 'border-slate-300'}`}
                />
                {formErrors.wholesalePrice && <p className="text-xs text-red-500 mt-1">{formErrors.wholesalePrice}</p>}
              </div>

              {/* IMÁGENES + VIDEO */}
              <ProductMediaSection
                image={formData.image || ''}
                images={formData.images || []}
                video={formData.video}
                onChange={handleMediaChange}
              />
              {formErrors.image && (
                <p className="col-span-1 md:col-span-2 text-xs text-red-500 font-medium -mt-2">{formErrors.image}</p>
              )}

              {/* TALLAS */}
              <SizesSelector sizes={formData.sizes || []} onToggle={handleSizeToggle} error={formErrors.sizes} />

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción corta</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success"
                />
              </div>

            </div>
          </form>
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 safe-area-bottom">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none px-4 py-3 text-base font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors touch-feedback"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="productForm"
            className="flex-1 sm:flex-none px-4 py-3 text-base font-medium text-white bg-brand-success rounded-lg hover:bg-emerald-700 transition-colors touch-feedback"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}