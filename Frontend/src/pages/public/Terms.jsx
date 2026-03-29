import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, Scale } from 'lucide-react'

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#051F20] relative overflow-x-hidden py-24 px-4 sm:px-6 lg:px-8">
      
      {/* ─── AMBIENT BACKGROUND GLOW ─── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#006F73]/15 rounded-full blur-[150px] pointer-events-none" />

      {/* ─── BACK TO HOME BUTTON ─── */}
      <Link
        to="/"
        className={`
          absolute top-6 left-6 md:top-8 md:left-8 z-50 
          flex items-center gap-2 px-4 py-2.5 rounded-xl 
          bg-[#085558]/20 hover:bg-[#006F73]/40 
          border border-[#84BABF]/10 hover:border-[#84BABF]/40 
          text-[#84BABF] hover:text-[#E0EDE9] text-sm font-bold tracking-wide 
          backdrop-blur-md shadow-lg transition-all duration-300 group
          animate-fade-in
        `}
      >
        <ArrowLeft size={18} strokeWidth={2.5} className="transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="hidden sm:inline">Back to Home</span>
        <span className="sm:hidden">Back</span>
      </Link>

      <div className="max-w-4xl mx-auto relative z-10 animate-slide-up">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#085558]/30 border border-[#84BABF]/20 mb-6 shadow-inner">
            <FileText size={32} className="text-[#E0EDE9]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#E0EDE9] via-white to-[#84BABF] bg-clip-text text-transparent tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-[#84BABF] max-w-2xl mx-auto">
            These Terms govern your use of the ShopNest platform. Please read them carefully to understand your rights and responsibilities.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-[#0B2B26]/60 backdrop-blur-2xl border border-[#84BABF]/20 rounded-[2rem] p-8 md:p-14 shadow-2xl shadow-[#06363D]">
          
          <div className="border-b border-[#84BABF]/10 pb-6 mb-8">
            <p className="text-[#84BABF] text-sm font-bold uppercase tracking-widest">
              Effective Date: March 25, 2026
            </p>
          </div>

          <div className="space-y-10 text-[15px] sm:text-base text-[#84BABF] leading-relaxed">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-[#E0EDE9] mb-4 tracking-tight">1. Acceptance of Terms</h2>
              <p>
                By creating an account, accessing, or using the ShopNest Point of Sale (POS) software, mobile applications, and associated services (collectively, the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Service.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-[#E0EDE9] mb-4 tracking-tight">2. Description of Service</h2>
              <p>
                ShopNest provides cloud-based software that allows businesses to manage inventory, process point-of-sale transactions, generate financial reports, and manage staff ("Cashiers"). The Service does not include the provision of physical POS hardware (e.g., receipt printers, barcode scanners, or cash drawers) unless explicitly stated in a separate hardware agreement.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-[#E0EDE9] mb-4 tracking-tight">3. User Accounts and Security</h2>
              <p className="mb-4">To use ShopNest, you must register for an account. We offer two primary account types: <strong>Owner</strong> and <strong>Cashier</strong>.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[#E0EDE9]">Owner Responsibility:</strong> As a business Owner, you are fully responsible for all activities that occur under your account and the accounts of the Cashiers you authorize.</li>
                <li><strong className="text-[#E0EDE9]">Information Accuracy:</strong> You agree to provide accurate, current, and complete information during registration and to keep this information updated.</li>
                <li><strong className="text-[#E0EDE9]">Account Security:</strong> You are responsible for safeguarding passwords and ensuring your staff logs out of shared terminals appropriately. You must notify us immediately of any unauthorized use or security breach.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-[#E0EDE9] mb-4 tracking-tight">4. Acceptable Use Policy</h2>
              <p className="mb-4">You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Conduct illegal transactions or sell prohibited goods (e.g., illegal drugs, counterfeit items).</li>
                <li>Attempt to bypass, exploit, or reverse-engineer any security mechanisms, API rate limits, or source code of the ShopNest platform.</li>
                <li>Upload or transmit viruses, malware, or any other malicious code.</li>
                <li>Interfere with or disrupt the integrity or performance of the Service for other users.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-[#E0EDE9] mb-4 tracking-tight">5. Billing, Subscriptions, and Refunds</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[#E0EDE9]">Subscription Fees:</strong> ShopNest is billed on a recurring subscription basis (monthly or annually). Fees are billed in advance and are non-refundable.</li>
                <li><strong className="text-[#E0EDE9]">Payment Processing:</strong> We use third-party payment processors to bill your account. By providing payment information, you authorize us to charge the applicable subscription fees automatically.</li>
                <li><strong className="text-[#E0EDE9]">Changes to Pricing:</strong> We reserve the right to modify our pricing at any time. We will provide at least 30 days' notice before any price changes take effect on your next billing cycle.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-[#E0EDE9] mb-4 tracking-tight">6. Intellectual Property Rights</h2>
              <p className="mb-4">
                <strong className="text-[#E0EDE9]">ShopNest IP:</strong> The Service, including its original content, features, functionality, and design, is exclusively owned by ShopNest Inc. and is protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                <strong className="text-[#E0EDE9]">Your Data:</strong> You retain complete ownership of all business and customer data you input into the Service. You grant ShopNest a limited, worldwide license to host, copy, and process this data solely for the purpose of providing the Service to you.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-[#E0EDE9] mb-4 tracking-tight">7. Limitation of Liability</h2>
              <p className="mb-4 uppercase tracking-wide text-xs font-bold text-rose-400">Please read this section carefully</p>
              <p className="italic">
                To the maximum extent permitted by applicable law, in no event shall ShopNest, its directors, employees, or partners be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any unauthorized access to or use of our secure servers; (iii) interruption of business due to platform downtime or hardware incompatibility.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-[#E0EDE9] mb-4 tracking-tight">8. Termination</h2>
              <p>
                You may cancel your subscription at any time through your Owner dashboard. We may terminate or suspend your account immediately, without prior notice, if you breach these Terms of Service. Upon termination, your right to use the Service will immediately cease. We reserve the right to delete all data associated with your account 90 days after termination.
              </p>
            </section>

            {/* Section 9 - Legal/Contact */}
            <section className="bg-[#06363D]/40 rounded-2xl p-6 sm:p-8 mt-12 border border-[#84BABF]/20">
              <h2 className="text-xl font-bold text-[#E0EDE9] mb-2 tracking-tight">9. Governing Law & Contact</h2>
              <p className="mb-6">
                These Terms shall be governed and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
              </p>
              <div className="flex flex-col gap-3 border-t border-[#84BABF]/10 pt-6">
                <p className="font-medium text-[#E0EDE9] flex items-center gap-2">
                  <Scale size={18} className="text-[#006F73]" />
                  Legal Department
                </p>
                <div className="ml-7 text-sm text-[#84BABF]">
                  <p>Email: legal@shopnest.com</p>
                  <p>Address: 123 Commerce Blvd, Suite 400, San Francisco, CA 94107</p>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  )
}