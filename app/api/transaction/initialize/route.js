// app/api/transaction/initialize/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { amount, currency, email, first_name, last_name, phone_number, tx_ref, callback_url, return_url, customization, meta } = await request.json();

  const response = await fetch('https://api.chapa.co/v1/transaction/initialize', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer CHASECK_TEST-ZY7Rb6Lsp4AXI5uigVCiO0uSuGgS0eln',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount,
      currency,
      email,
      first_name,
      last_name,
      phone_number,
      tx_ref,
      callback_url,
      return_url,
      "customization[title]": customization.title,
      "customization[description]": customization.description,
      "meta[hide_receipt]": meta.hide_receipt
    })
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: data }, { status: response.status });
  }

  return NextResponse.json(data);
}
