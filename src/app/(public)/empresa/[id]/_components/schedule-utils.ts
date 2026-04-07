// src/app/(public)/empresa/[id]/_components/store-utils.ts

/**
 * Verifica se a loja está dentro do horário de funcionamento para aceitar pedidos.
 * Substitui a lógica de 'isSlotInThePast' para uma visão de turno.
 */
export function isStoreOpen(operatingHours: string[]) {
  if (!operatingHours || operatingHours.length === 0) return false;

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  // Verifica se o horário atual está entre o primeiro e o último slot cadastrado
  const openingTime = operatingHours[0];
  const closingTime = operatingHours[operatingHours.length - 1];

  return currentTime >= openingTime && currentTime <= closingTime;
}

/**
 * Calcula o valor total do carrinho (útil para o checkout).
 */
export function calculateCartTotal(items: { price: number; quantity: number }[]) {
  return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
}

/**
 * Formata centavos para Real (Ex: 1000 -> "R$ 10,00")
 * Importante pois seu schema usa Int para preços.
 */
export function formatCentsToReal(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}