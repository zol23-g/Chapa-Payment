'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentVerification() {
  const searchParams = useSearchParams();
  const [verificationData, setVerificationData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tx_ref = searchParams.get('tx_ref');
    
    if (!tx_ref) return;

    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/transaction/verify?tx_ref=${tx_ref}`);
        const data = await response.json();

        if (data.status === 'success') {
          setVerificationData(data.data);
        } else {
          setError('Payment verification failed');
        }
      } catch (err) {
        setError('An error occurred while verifying the payment');
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!verificationData) {
    return <div className="loading-message">Verifying payment...</div>;
  }

  return (
    <div className="verification-container">
      <h2>Payment Verified</h2>
      <div className="verification-details">
        <div className="detail-item">
          <strong>Name:</strong> {verificationData.first_name} {verificationData.last_name}
        </div>
        <div className="detail-item">
          <strong>Email:</strong> {verificationData.email}
        </div>
        <div className="detail-item">
          <strong>Phone Number:</strong> {verificationData.phone_number}
        </div>
        <div className="detail-item">
          <strong>Currency:</strong> {verificationData.currency}
        </div>
        <div className="detail-item">
          <strong>Amount:</strong> {verificationData.amount} {verificationData.currency}
        </div>
        <div className="detail-item">
          <strong>Charge:</strong> {verificationData.charge}
        </div>
        <div className="detail-item">
          <strong>Mode:</strong> {verificationData.mode}
        </div>
        <div className="detail-item">
          <strong>Method:</strong> {verificationData.method}
        </div>
        <div className="detail-item">
          <strong>Type:</strong> {verificationData.type}
        </div>
        <div className="detail-item">
          <strong>Status:</strong> {verificationData.status}
        </div>
        <div className="detail-item">
          <strong>Reference:</strong> {verificationData.reference}
        </div>
        <div className="detail-item">
          <strong>Transaction Reference:</strong> {verificationData.tx_ref}
        </div>
        <div className="detail-item">
          <strong>Created At:</strong> {new Date(verificationData.created_at).toLocaleString()}
        </div>
        <div className="detail-item">
          <strong>Updated At:</strong> {new Date(verificationData.updated_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

