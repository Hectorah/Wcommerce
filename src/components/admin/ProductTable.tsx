import React, { useState, useMemo } from 'react';
import { JerseyProduct } from '../../types';
import { Edit2, Trash2, Image as ImageIcon, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductTableProps {
  products: JerseyProduct[];
  onEdit: (product: JerseyProduct) => void;
  onDelete: (productId: string) => void;
  onToggleStock: (productId: string) => void;
}

export function ProductTable({ products, onEdit, onDelete, onToggleStock }: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const lower = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.team.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower) ||
        p.league.toLowerCase().includes(lower)
    );
  }, [products, searchTerm]);

  // Paginar productos
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Si la página actual queda vacía tras filtrar/eliminar, volver a una válida
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Buscador */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Volver a pág 1 al buscar
            }}
            className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg bg-white text-sm text-slate-900 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {filteredProducts.length} producto{filteredProducts.length !== 1 && 's'}
        </div>
      </div>

      {/* Vista de escritorio (oculta en móvil) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Producto</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoría</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Precios</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tallas</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Stock</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.team}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {product.category}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col text-sm">
                    <span className="text-slate-900">Detal: ${product.retailPrice}</span>
                    <span className="text-brand-primary text-xs">Mayor: ${product.wholesalePrice}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {product.sizes.map((size) => (
                      <span key={size} className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                        {size}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => onToggleStock(product.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-success focus:ring-offset-2 ${
                      product.inStock !== false ? 'bg-brand-success' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        product.inStock !== false ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <p className="text-[10px] mt-1 text-slate-500">
                    {product.inStock !== false ? 'Disponible' : 'Agotado'}
                  </p>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 text-slate-500 hover:text-brand-success bg-slate-100 hover:bg-green-50 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-1.5 text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  {searchTerm ? 'No se encontraron productos con esa búsqueda.' : 'No hay productos registrados.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Vista móvil (oculta en escritorio) */}
      <div className="sm:hidden">
        {paginatedProducts.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            {searchTerm ? 'No se encontraron productos con esa búsqueda.' : 'No hay productos registrados.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{product.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">{product.team}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-1.5 text-slate-500 hover:text-brand-success bg-slate-100 hover:bg-green-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">Categoría:</span>
                        <span className="ml-1 font-medium text-slate-700">{product.category}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Precio:</span>
                        <span className="ml-1 font-bold text-slate-900">${product.retailPrice}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.sizes.slice(0, 3).map((size) => (
                        <span key={size} className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                          {size}
                        </span>
                      ))}
                      {product.sizes.length > 3 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                          +{product.sizes.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onToggleStock(product.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-success focus:ring-offset-2 ${
                            product.inStock !== false ? 'bg-brand-success' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              product.inStock !== false ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className="text-xs text-slate-500">
                          {product.inStock !== false ? 'Disponible' : 'Agotado'}
                        </span>
                      </div>
                      <span className="text-xs text-brand-primary font-medium">
                        Mayor: ${product.wholesalePrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Mostrando <span className="font-medium text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
            <span className="font-medium text-slate-900">
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
            </span>{' '}
            de <span className="font-medium text-slate-900">{filteredProducts.length}</span> resultados
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-slate-700 px-2">
              Pág {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
