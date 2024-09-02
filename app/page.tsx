'use client';

import { useState } from 'react';

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    amount: '9775',  // Fixed amount
    currency: 'ETB',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    tx_ref: `HST-EFBF-${Math.floor(Math.random() * 100000)}`,  // Unique transaction reference
    customization: {
      title: 'Payment for my favourite merchant',
      description: 'I love online payments',
      logo: 'https://www.hst-et.com/uploads/efbf-logo-updated.png'
    },
    meta: {
      hide_receipt: 'true'
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const return_url = `http://localhost:3000/verification?tx_ref=${formData.tx_ref}`;

    const response = await fetch('/api/transaction/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...formData, return_url })
    });

    const data = await response.json();

    if (data.status === 'success') {
      window.location.href = data.data.checkout_url;  // Redirect to Chapa checkout
    } else {
      console.error('Payment initialization failed:', data);
    }
  };

  return (
    <div className="payment-container">
      <h2>Complete Your Payment</h2>
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            readOnly
            required
          />
        </div>
        <div className="form-group">
          <label>Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            required
            disabled  // Disable currency selection to keep it fixed
          >
            <option value="ETB">ETB</option>
          </select>
        </div>
        <button type="submit" className="pay-now-button">Pay Now</button>
      </form>
    </div>
  );
}
