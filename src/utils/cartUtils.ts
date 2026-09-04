import { CartItem, CustomerInfo } from '../types';
import { WHOLESALE_MIN_ITEMS, STORE_NAME } from '../data/mockProducts';

export function calculateCartSummary(cartItems: CartItem[]) {
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isWholesale = totalItems >= WHOLESALE_MIN_ITEMS;
  const itemsNeededForWholesale = Math.max(0, WHOLESALE_MIN_ITEMS - totalItems);

  // Calculate retail total (if everything was paid at retail)
  const retailTotal = cartItems.reduce((acc, item) => {
    return acc + item.product.retailPrice * item.quantity;
  }, 0);

  // Calculate actual total based on wholesale logic
  const currentTotal = cartItems.reduce((acc, item) => {
    const unitPrice = isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
    return acc + unitPrice * item.quantity;
  }, 0);

  // Potential savings if wholesale applies or if already applied
  const wholesaleTotalIfReached = cartItems.reduce((acc, item) => {
    return acc + item.product.wholesalePrice * item.quantity;
  }, 0);

  const totalSaved = isWholesale ? Math.max(0, retailTotal - currentTotal) : 0;
  const potentialSavings = !isWholesale ? Math.max(0, retailTotal - wholesaleTotalIfReached) : 0;

  return {
    totalItems,
    isWholesale,
    itemsNeededForWholesale,
    retailTotal,
    currentTotal,
    totalSaved,
    potentialSavings,
  };
}

export function generateWhatsAppMessage(
  cartItems: CartItem[],
  customerInfo: CustomerInfo,
  summary: ReturnType<typeof calculateCartSummary>
): string {
  const itemsList = cartItems
    .map((item) => {
      const unitPrice = summary.isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
      const customStr = (item.customName || item.customNumber)
        ? ` (Personalización: ${item.customNumber ? '#' + item.customNumber : ''} ${item.customName || ''})`
        : '';
      return `- ${item.quantity}x ${item.product.name} (Talla ${item.size})${customStr} - $${unitPrice} c/u`;
    })
    .join('\n');

  const saleType = summary.isWholesale
    ? `Mayorista (3+ prendas | Ahorro: $${summary.totalSaved.toFixed(2)} USD)`
    : 'Detal (1 a 2 prendas)';

  const customerName = customerInfo.name.trim() || 'Cliente no especificado';
  const customerCity = customerInfo.city.trim() || 'No especificada';
  const notesText = customerInfo.notes?.trim() ? `\n📝 *Notas/Dorsales:* ${customerInfo.notes.trim()}` : '';

  return `¡Hola! Quiero confirmar el siguiente pedido en *${STORE_NAME}*:

📋 *DETALLE DEL PEDIDO:*
${itemsList}

📊 *TIPO DE VENTA:* ${saleType}
🔢 *TOTAL DE PRENDAS:* ${summary.totalItems} unidad${summary.totalItems === 1 ? '' : 'es'}
💰 *TOTAL ESTIMADO:* $${summary.currentTotal.toFixed(2)} USD
👤 *Cliente:* ${customerName}
📍 *Ubicación / Envío:* ${customerCity}${notesText}

¿Tienen disponibilidad de estos modelos para coordinar el pago y envío?`;
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  // Clean phone number to digits only
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Selecciona el número de WhatsApp de turno usando rotación round-robin.
 * Incrementa un contador en localStorage para distribuir los pedidos.
 */
export function getNextWhatsAppNumber(numbers: string[]): string {
  if (!numbers || numbers.length === 0) return '';
  try {
    const key = 'flash_sport_wa_index';
    const current = parseInt(localStorage.getItem(key) || '0', 10);
    const next = (current + 1) % numbers.length;
    localStorage.setItem(key, String(next));
    return numbers[current];
  } catch {
    return numbers[0];
  }
}
