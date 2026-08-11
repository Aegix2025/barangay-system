import React, { useState, useMemo, useRef } from 'react';
import { FileText, Printer, CheckCircle, Search, ShieldCheck, Award, X } from 'lucide-react';
import { CertificateRecord, Resident, BarangayInfo, CertificateType } from '../types';

interface Props {
  certificates: CertificateRecord[];
  residents: Resident[];
  info: BarangayInfo;
  onIssueCertificate: (cert: CertificateRecord) => void;
}

export const Certificates: React.FC<Props> = ({
  certificates,
  residents,
  info,
  onIssueCertificate
}) => {
  const [selectedType, setSelectedType] = useState<CertificateType>('Barangay Clearance');
  const [selectedResidentId, setSelectedResidentId] = useState<string>(residents[0]?.resident_id || '');
  const [purpose, setPurpose] = useState('Employment Application');
  const [businessName, setBusinessName] = useState('');
  const [signatory, setSignatory] = useState('Hon. Nestor Nabaunag Jr.');
  const [searchTerm, setSearchTerm] = useState('');

  const printRef = useRef<HTMLDivElement>(null);

  const selectedResident = residents.find(r => r.resident_id === selectedResidentId) || residents[0];

  // Auto-generate preview certificate
  const previewCertificate: CertificateRecord | null = useMemo(() => {
    if (!selectedResident) return null;

    return {
      certificate_id: `CERT-2026-${Math.floor(100 + Math.random() * 900)}`,
      certificate_type: selectedType,
      resident_id: selectedResident.resident_id,
      resident_name: `${selectedResident.first_name} ${selectedResident.middle_name ? `${selectedResident.middle_name.charAt(0)}.` : ''} ${selectedResident.last_name} ${selectedResident.suffix}`,
      address: `${selectedResident.purok_name || 'Purok 1'}, Brgy. SF II, Limay, Bataan`,
      purpose: purpose || 'N/A',
      issue_date: new Date().toISOString().split('T')[0],
      or_number: 'N/A',
      amount_paid: 0,
      issued_by: signatory,
      status: 'Issued',
      business_name: selectedType === 'Business Clearance' ? businessName : undefined
    };
  }, [selectedResident, selectedType, purpose, businessName, signatory]);

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResident || !previewCertificate) return;

    const newCert: CertificateRecord = {
      ...previewCertificate,
      certificate_id: `CERT-2026-${Math.floor(100 + Math.random() * 900)}`,
    };

    onIssueCertificate(newCert);
    setPurpose('Employment Application');
    setBusinessName('');
    alert(`✅ Certificate issued to ${selectedResident.first_name} ${selectedResident.last_name}!`);
  };

  // Print function
  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const content = printRef.current.innerHTML;
        printWindow.document.write(`
          <html>
            <head>
              <title>Barangay SF II - Certificate</title>
              <style>
                body { 
                  font-family: 'Times New Roman', serif; 
                  padding: 40px; 
                  max-width: 800px; 
                  margin: 0 auto;
                  background: white;
                }
                .certificate {
                  border: 2px solid #1a3a2a;
                  padding: 40px;
                  border-radius: 8px;
                }
                .text-center { text-align: center; }
                .border-b { border-bottom: 2px solid #1a3a2a; padding-bottom: 16px; margin-bottom: 16px; }
                .text-xs { font-size: 10px; }
                .text-sm { font-size: 12px; }
                .text-lg { font-size: 18px; }
                .text-xl { font-size: 24px; }
                .font-bold { font-weight: bold; }
                .uppercase { text-transform: uppercase; }
                .tracking-widest { letter-spacing: 2px; }
                .underline { text-decoration: underline; }
                .underline-offset-4 { text-underline-offset: 4px; }
                .my-4 { margin-top: 16px; margin-bottom: 16px; }
                .space-y-4 > * + * { margin-top: 16px; }
                .space-y-1 > * + * { margin-top: 4px; }
                .text-justify { text-align: justify; }
                .leading-relaxed { line-height: 1.6; }
                .pt-8 { padding-top: 32px; }
                .mt-2 { margin-top: 8px; }
                .w-52 { width: 208px; }
                .mx-auto { margin-left: auto; margin-right: auto; }
                .border-slate-800 { border-color: #1e293b; }
                .h-10 { height: 40px; }
                .flex { display: flex; }
                .items-end { align-items: flex-end; }
                .justify-center { justify-content: center; }
                .justify-end { justify-content: flex-end; }
                .text-slate-500 { color: #64748b; }
                .text-slate-400 { color: #94a3b8; }
                .text-emerald-900 { color: #064e3b; }
                .text-emerald-950 { color: #022c22; }
                .font-serif { font-family: 'Times New Roman', serif; }
                .font-sans { font-family: Arial, sans-serif; }
                .decoration-2 { text-decoration-thickness: 2px; }
              </style>
            </head>
            <body>
              <div class="certificate">
                ${content}
              </div>
              <script>
                window.onload = function() { window.print(); }
              <\/script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const filteredResidents = residents.filter(r => 
    `${r.first_name} ${r.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.resident_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-gray-700 flex items-center gap-2">
            <FileText className="w-6 h-6 text-pink-400" />
            <span>Documents</span>
          </h2>
          <p className="text-xs text-gray-700 mt-0.5">
            Barangay SF II Official Certificate & Document Generator
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Document</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-700 border-b border-gray-100 pb-2">
            Create Certificate
          </h3>

          <form onSubmit={handleIssue} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Type of Certificate</label>
              <select
                value={selectedType}
                onChange={(e) => {
                  const val = e.target.value as CertificateType;
                  setSelectedType(val);
                }}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700"
              >
                <option value="Barangay Clearance">Barangay Clearance</option>
                <option value="Certificate of Residency">Certificate of Residency</option>
                <option value="Certificate of Indigency">Certificate of Indigency</option>
                <option value="Business Clearance">Business Clearance</option>
                <option value="Certificate of Good Moral">Certificate of Good Moral</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Registered Resident</label>
              <input
                type="text"
                placeholder="Find..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg mb-1 text-gray-700"
              />
              <select
                value={selectedResidentId}
                onChange={(e) => setSelectedResidentId(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 max-h-32"
              >
                {filteredResidents.slice(0, 30).map((r) => (
                  <option key={r.resident_id} value={r.resident_id}>
                    {r.last_name}, {r.first_name} ({r.purok_name || 'Purok 1'}) - {r.resident_id}
                  </option>
                ))}
              </select>
            </div>

            {selectedType === 'Business Clearance' && (
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Name of your Business</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. SF II Store & Eatery"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Purpose</label>
              <input
                type="text"
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Local Employment, Scholarship, Bank Account"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Authorized Official</label>
              <select
                value={signatory}
                onChange={(e) => setSignatory(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700"
              >
                <option value="Hon. Nestor Nabaunag Jr.">Hon. Nestor Nabaunag Jr.</option>
                <option value="Mrs. Elena S. Soriano">Mrs. Elena S. Soriano</option>
                <option value="Mr. Joseph K. Mercado">Mr. Joseph K. Mercado</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Generate Certification
            </button>
          </form>

          {/* Recently Issued List */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <h4 className="font-bold text-xs text-gray-700">Recently Issued Certificates</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {certificates.map((c) => (
                <div
                  key={c.certificate_id}
                  className="p-2.5 rounded-xl border text-xs bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="block font-semibold">{c.certificate_type}</span>
                      <span className="text-[10px] text-gray-400">{c.resident_name}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{c.issue_date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="lg:col-span-7 bg-gray-100 p-6 rounded-2xl border border-gray-200 flex flex-col items-center">
          {previewCertificate ? (
            <div ref={printRef} className="bg-white border-2 border-gray-300 shadow-xl p-8 max-w-lg w-full rounded-lg space-y-6 text-gray-700 font-serif relative">
              {/* Official Seal Watermark */}
              <div className="text-center border-b-2 border-pink-800 pb-4 space-y-1">
                <p className="text-[10px] uppercase font-sans tracking-widest text-gray-600">Republic of the Philippines</p>
                <p className="text-[11px] uppercase font-sans tracking-widest text-gray-700">Province of Bataan • Municipality of Limay</p>
                <h2 className="text-lg font-black uppercase text-pink-900 font-sans tracking-wide">
                  BARANGAY SF II
                </h2>
                <p className="text-[10px] font-sans text-gray-500">
                  Nestor Nabaunag, Limay, Bataan (2104) • Tel: (047) 244-5678
                </p>
              </div>

              {/* Document Title */}
              <div className="text-center space-y-1 my-4">
                <h1 className="text-xl font-bold uppercase tracking-widest text-pink-950 underline decoration-2 underline-offset-4">
                  {previewCertificate.certificate_type}
                </h1>
                <p className="text-[10px] font-sans text-gray-400 font-mono">ID: {previewCertificate.certificate_id}</p>
              </div>

              {/* Document Body Text */}
              <div className="text-xs leading-relaxed space-y-4 font-sans text-justify">
                <p><strong>TO WHOM IT MAY CONCERN:</strong></p>

                <p>
                  THIS IS TO CERTIFY that <strong>{previewCertificate.resident_name.toUpperCase()}</strong>, 
                  of legal age, Filipino citizen, is a bonafide resident of <strong>{previewCertificate.address}</strong>.
                </p>

                {selectedType === 'Barangay Clearance' && (
                  <p>
                    This Barangay Clearance is issued upon the request of the above-named person for the purpose of <strong>{previewCertificate.purpose.toUpperCase()}</strong>, and certifying that he/she has NO DEROGATORY RECORD filed in this office.
                  </p>
                )}

                {selectedType === 'Certificate of Indigency' && (
                  <p>
                    This is to further certify that the above-named individual belongs to an Indigent Family of Barangay SF II, Limay, Bataan, and is deserving of medical, educational, or financial assistance for <strong>{previewCertificate.purpose.toUpperCase()}</strong>.
                  </p>
                )}

                {selectedType === 'Business Clearance' && (
                  <p>
                    Clearance is hereby granted to <strong>{previewCertificate.business_name || 'Business Enterprise'}</strong> for local operation within Barangay SF II, having satisfied all barangay rules and health regulations for the purpose of <strong>{previewCertificate.purpose.toUpperCase()}</strong>.
                  </p>
                )}

                {selectedType === 'Certificate of Residency' && (
                  <p>
                    This certifies that the above-named person is a registered resident of Barangay SF II, Nestor Nabaunag, Limay, Bataan for <strong>{previewCertificate.purpose.toUpperCase()}</strong>.
                  </p>
                )}

                {selectedType === 'Certificate of Good Moral' && (
                  <p>
                    This certifies that the person named above is known to be of good moral character, law-abiding citizen, and active community member of Barangay SF II, Nestor Nabaunag, Limay, Bataan for <strong>{previewCertificate.purpose.toUpperCase()}</strong>.
                  </p>
                )}

                <p>
                  GIVEN this <strong>{formatDate(previewCertificate.issue_date)}</strong> at the Barangay Hall of Barangay SF II, Nestor Nabaunag, Limay, Bataan.
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-8 flex justify-end text-xs font-sans">
                <div className="text-center space-y-1">
                  <div className="h-10 border-b border-gray-800 w-52 mx-auto flex items-end justify-center font-bold text-gray-700">
                    {previewCertificate.issued_by}
                  </div>
                  <p className="text-[10px] text-gray-500 font-semibold">Punong Barangay / Official Signatory</p>
                  <p className="text-[10px] text-gray-400 mt-2">Date Issued: {previewCertificate.issue_date}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-20">Select a certificate to preview.</div>
          )}
        </div>
      </div>
    </div>
  );
};