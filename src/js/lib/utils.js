'use strict';

export function numberWithCommas (x) {
  return x.toLocaleString();
}

export function formatPrice (price, currency, coma = false) {


  const currencySymbols = {
    'USD': '$', // US Dollar
    'EUR': '€', // Euro
    'CRC': '₡', // Costa Rican Colón
    'GBP': '£', // British Pound Sterling
    'ILS': '₪', // Israeli New Sheqel
    'INR': '₹', // Indian Rupee
    'JPY': '¥', // Japanese Yen
    'KRW': '₩', // South Korean Won
    'NGN': '₦', // Nigerian Naira
    'PHP': '₱', // Philippine Peso
    'PLN': 'zł', // Polish Zloty
    'PYG': '₲', // Paraguayan Guarani
    'THB': '฿', // Thai Baht
    'UAH': '₴', // Ukrainian Hryvnia
    'VND': '₫' // Vietnamese Dong
  };

  let formatPrice = price / 100;

  if (coma) {
    formatPrice = numberWithCommas(formatPrice);
  }

  return `${formatPrice} ${currencySymbols[currency]}`;
}
