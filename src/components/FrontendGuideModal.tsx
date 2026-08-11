import React, { useState } from 'react';
import { X, Code, Palette, Cpu, FileCode, CheckCircle, Copy } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FrontendGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/80 rounded-xl border border-emerald-500/30">
              <Code className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Gabay sa Pag-edit ng Frontend Code</h2>
              <p className="text-xs text-emerald-200">
                Paano baguhin ang Text, Design (Kulay/Layout), at Functions ng Barangay SF II System
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-700 rounded-lg text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-8 text-slate-700 text-sm leading-relaxed">
          
          {/* Tagalog Introduction */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900">
            <p className="font-semibold text-base mb-1">👋 Kumusta! Narito ang simpleng paliwanag:</p>
            <p>
              Ang web application na ito ay binuo gamit ang <strong>React + TypeScript + Tailwind CSS</strong>. 
              Madali mong mababago ang anumang **Text**, **Design / Kulay**, o **Functionality** sa pamamagitan ng pag-edit sa mga nakatukoy na files sa folder na <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono text-xs">/src</code>.
            </p>
          </div>

          {/* Section 1: PAANO BAGUHIN ANG TEXT */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <FileCode className="w-5 h-5 text-emerald-600" />
              <h3>1. Saan at Paano Babaguhin ang TEXT (Nilalaman)</h3>
            </div>
            <p className="text-slate-600">
              Kung gusto mong baguhin ang pangalan ng Barangay, Punong Barangay, mga Opisyal, Purok, o mga text sa UI:
            </p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-800 font-mono text-xs bg-slate-200 px-2 py-1 rounded">
                  📁 /src/data/seedData.ts
                </span>
                <button
                  onClick={() => handleCopy(`export const INITIAL_BARANGAY_INFO = { barangay_name: 'Barangay SF II', address: 'Nestor Nabaunag, Limay, Bataan' };`, 'text-ex')}
                  className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  {copiedSection === 'text-ex' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Sample
                </button>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600">
                <li><strong>Barangay Information & Default Names:</strong> Buksan ang <code className="bg-slate-200 px-1 rounded">/src/data/seedData.ts</code>. Dito pwedeng baguhin ang Kapitan name, Municipal, Province, Contact, at Purok 1-8 descriptions.</li>
                <li><strong>UI Labels & Headers:</strong> Buksan ang <code className="bg-slate-200 px-1 rounded">/src/components/Header.tsx</code> para sa top navigation labels.</li>
                <li><strong>Certificate Templates:</strong> Buksan ang <code className="bg-slate-200 px-1 rounded">/src/components/Certificates.tsx</code> para baguhin ang pormal na Tagalog/English text sa Clearance, Indigency, at Good Moral.</li>
              </ul>
            </div>
          </div>

          {/* Section 2: PAANO BAGUHIN ANG DESIGN & KULAY */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Palette className="w-5 h-5 text-emerald-600" />
              <h3>2. Saan at Paano Babaguhin ang DESIGN at KULAY</h3>
            </div>
            <p className="text-slate-600">
              Ang styling ay gumagamit ng <strong>Tailwind CSS</strong> utility classes na nakasulat mismo sa loob ng mga JSX element (<code className="bg-slate-100 px-1 rounded">className="..."</code>).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <span className="font-semibold text-emerald-800 text-xs uppercase tracking-wider block">🎨 Pagpapalit ng Kulay (Theme Color)</span>
                <p className="text-xs text-slate-600">
                  Sa mga files tulad ng <code className="bg-slate-200 px-1 rounded">Header.tsx</code> o <code className="bg-slate-200 px-1 rounded">Dashboard.tsx</code>, palitan ang Tailwind color classes:
                </p>
                <div className="bg-slate-900 text-slate-100 font-mono text-xs p-2.5 rounded-lg">
                  <span className="text-emerald-400">bg-emerald-800</span> → Green theme<br/>
                  <span className="text-blue-400">bg-blue-800</span> → Blue theme<br/>
                  <span className="text-amber-400">bg-slate-900</span> → Dark theme
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <span className="font-semibold text-emerald-800 text-xs uppercase tracking-wider block">📐 Global Styles</span>
                <p className="text-xs text-slate-600">
                  Buksan ang <code className="bg-slate-200 px-1 rounded">/src/index.css</code> kung gusto mong magdagdag ng custom print styles o custom font styling.
                </p>
                <div className="bg-slate-900 text-slate-100 font-mono text-xs p-2.5 rounded-lg">
                  @import "tailwindcss";<br/>
                  /* Add custom print @media rules here */
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: PAANO BAGUHIN ANG FUNCTION AT LOGIC */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Cpu className="w-5 h-5 text-emerald-600" />
              <h3>3. Saan at Paano Babaguhin ang FUNCTIONALITY (Logic)</h3>
            </div>
            <p className="text-slate-600">
              Ang bawat feature ng system ay nakahiwalay sa sarili nitong component sa <code className="bg-slate-100 px-1 rounded">/src/components/</code>:
            </p>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Feature / Function</th>
                    <th className="p-3">File Location</th>
                    <th className="p-3">Ano ang Mababago Dito?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-medium text-slate-900">Resident Search & Filters</td>
                    <td className="p-3 font-mono text-emerald-700 font-semibold">/src/components/Residents.tsx</td>
                    <td className="p-3 text-slate-600">Filtering algorithm (Purok, Senior Citizen, PWD, Voter status) & Add/Edit resident modals.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-900">Certificate Generation & Printing</td>
                    <td className="p-3 font-mono text-emerald-700 font-semibold">/src/components/Certificates.tsx</td>
                    <td className="p-3 text-slate-600">Certificate issuing logic, official signature names, OR number generator & print preview layout.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-900">Blotter & Incident Reports</td>
                    <td className="p-3 font-mono text-emerald-700 font-semibold">/src/components/Blotter.tsx</td>
                    <td className="p-3 text-slate-600">Adding new blotter cases, updating case status (Settled, Referred to PNP), officer assignments.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-900">SQL / JSON Generator</td>
                    <td className="p-3 font-mono text-emerald-700 font-semibold">/src/utils/sqlExporter.ts</td>
                    <td className="p-3 text-slate-600">SQL table structure schemas, CREATE TABLE queries, and INSERT formatting for external databases.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-900">Main State Management</td>
                    <td className="p-3 font-mono text-emerald-700 font-semibold">/src/App.tsx</td>
                    <td className="p-3 text-slate-600">Holds global React state (`useState`) for residents, households, blotters, certificates, and current active tab.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Summary Tip */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 text-xs space-y-1">
            <p className="font-bold">💡 Tip sa Pag-edit:</p>
            <p>
              Kapag pinalitan mo ang kahit anong salita o kulay sa mga files sa taas at i-save ito, awtomatikong mag-uupdate ang iyong preview screen sa kanan!
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
          >
            Naintindihan ko na (Close)
          </button>
        </div>
      </div>
    </div>
  );
};