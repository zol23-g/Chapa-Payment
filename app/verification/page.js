'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import html2pdf from 'html2pdf.js';
import { AiOutlineDownload } from 'react-icons/ai'; // Download icon
import { AiOutlinePrinter } from 'react-icons/ai';  // Printer icon

export default function PaymentVerification() {
  const searchParams = useSearchParams();
  const [verificationData, setVerificationData] = useState(null);
  const [error, setError] = useState(null);
  const receiptRef = useRef();

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

  const handleDownloadPDF = () => {
    const element = receiptRef.current;
    const opt = {
      margin: 0.5,
      filename: `receipt_${verificationData.tx_ref}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Temporarily hide the buttons before generating the PDF
    const buttons = document.querySelector('.action-buttons');
    buttons.style.display = 'none';

    html2pdf().from(element).set(opt).save().finally(() => {
      // Show the buttons again after the PDF is generated
      buttons.style.display = 'flex';
    });
  };

  const handlePrint = () => {
    // Temporarily hide the buttons before printing
    const buttons = document.querySelector('.action-buttons');
    buttons.style.display = 'none';

    window.print();

    // Show the buttons again after printing
    buttons.style.display = 'flex';
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!verificationData) {
    return <div className="loading-message">Verifying payment...</div>;
  }

  return (
    <div className='m-[30px]' style={{ position: 'relative' }}>
      <div className="verification-container" ref={receiptRef}>
        <div className="action-buttons" style={{ position: 'absolute', top: '10px', right: '500px', display: 'flex', gap: '20px' }}>
          <button onClick={handleDownloadPDF} className="download-button">
            <AiOutlineDownload size={24} />
          </button>
          <button onClick={handlePrint} className="print-button">
            <AiOutlinePrinter size={24} />
          </button>
        </div>

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
        </div>
      </div>
    </div>
  );
}
