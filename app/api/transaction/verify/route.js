// app/api/transaction/verify/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tx_ref = searchParams.get('tx_ref');
 console.log('Transaction Reference',tx_ref)
  if (!tx_ref) {
    return NextResponse.json({ error: 'Transaction reference is required' }, { status: 400 });
  }

  const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer CHASECK_TEST-ZY7Rb6Lsp4AXI5uigVCiO0uSuGgS0eln'
    }
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: data }, { status: response.status });
  }

  return NextResponse.json(data);
}
