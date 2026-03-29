import { Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Lock, Eye, Database, UserCheck, Globe, Bell, Mail } from 'lucide-react'

export default function Privacy() {
  
  // Reusable Section Component
  const Section = ({ icon: Icon, title, children }) => (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#006F73]/20 border border-[#006F73]/30 flex items-center justify-center shrink-0">
          <Icon size={20} className="text-[#84BABF]" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-[#E0EDE9]">{title}</h2>
      </div>
      <div className="pl-0 md:pl-[52px]">
        {children}
      </div>
    </section>
  )

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
        
        {/* ─── HEADER ─── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#085558]/30 border border-[#84BABF]/20 mb-6 shadow-inner">
            <ShieldCheck size={32} className="text-[#E0EDE9]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#E0EDE9] via-white to-[#84BABF] bg-clip-text text-transparent tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-[#84BABF] max-w-2xl mx-auto">
            Your privacy is critically important to us. This policy explains how ShopNest collects, uses, protects, and shares your information.
          </p>
        </div>

        {/* ─── CONTENT CARD ─── */}
        <div className="bg-[#0B2B26]/60 backdrop-blur-2xl border border-[#84BABF]/20 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-[#06363D]">
          
          {/* Last Updated & Effective Date */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-10 pb-6 border-b border-[#84BABF]/10">
            <p className="text-[#84BABF] text-sm font-bold uppercase tracking-widest">
              Last Updated: March 25, 2026
            </p>
            <p className="text-[#84BABF]/60 text-sm">
              Effective Date: January 1, 2024
            </p>
          </div>

          {/* ─── INTRODUCTION ─── */}
          <Section icon={Eye} title="Introduction">
            <p className="text-[#84BABF] leading-relaxed mb-4">
              ShopNest ("we," "us," or "our") operates the ShopNest Point-of-Sale platform (the "Service"). This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
            <p className="text-[#84BABF] leading-relaxed">
              We are committed to protecting your privacy and ensuring you understand how your data is handled. By using our Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </Section>

          {/* ─── INFORMATION WE COLLECT ─── */}
          <Section icon={Database} title="Information We Collect">
            <p className="text-[#84BABF] leading-relaxed mb-4">
              We collect several different types of information for various purposes to provide and improve our Service to you:
            </p>
            
            <h3 className="text-lg font-semibold text-[#E0EDE9] mt-6 mb-3">Personal Data</h3>
            <p className="text-[#84BABF] leading-relaxed mb-3">
              While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-[#84BABF] leading-relaxed mb-6 space-y-2">
              <li><span className="text-[#E0EDE9] font-medium">Identity Data:</span> Full name, username, business name</li>
              <li><span className="text-[#E0EDE9] font-medium">Contact Data:</span> Email address, phone number, business address</li>
              <li><span className="text-[#E0EDE9] font-medium">Financial Data:</span> Payment card details, billing address, transaction history</li>
              <li><span className="text-[#E0EDE9] font-medium">Technical Data:</span> IP address, browser type and version, device identifiers, time zone settings</li>
              <li><span className="text-[#E0EDE9] font-medium">Usage Data:</span> Information about how you use our website and services</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#E0EDE9] mt-6 mb-3">Automatically Collected Data</h3>
            <p className="text-[#84BABF] leading-relaxed">
              We automatically collect certain information when you visit, use, or navigate the Service. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, and information about how and when you use our Service.
            </p>
          </Section>

          {/* ─── HOW WE USE YOUR INFORMATION ─── */}
          <Section icon={Lock} title="How We Use Your Information">
            <p className="text-[#84BABF] leading-relaxed mb-4">
              ShopNest uses the collected data for various purposes, always with a legitimate basis for processing:
            </p>
            <ul className="list-disc pl-6 text-[#84BABF] leading-relaxed space-y-2">
              <li><span className="text-[#E0EDE9] font-medium">Service Delivery:</span> To provide, operate, and maintain our platform and your account</li>
              <li><span className="text-[#E0EDE9] font-medium">Transaction Processing:</span> To process payments and manage your subscriptions</li>
              <li><span className="text-[#E0EDE9] font-medium">Communication:</span> To contact you with service updates, security alerts, and support messages</li>
              <li><span className="text-[#E0EDE9] font-medium">Personalization:</span> To understand your preferences and deliver a tailored experience</li>
              <li><span className="text-[#E0EDE9] font-medium">Analytics:</span> To analyze usage patterns and improve our Service's functionality</li>
              <li><span className="text-[#E0EDE9] font-medium">Security:</span> To detect, prevent, and address technical issues and fraudulent activity</li>
              <li><span className="text-[#E0EDE9] font-medium">Legal Compliance:</span> To comply with legal obligations and protect our rights</li>
            </ul>
          </Section>

          {/* ─── DATA SHARING ─── */}
          <Section icon={Globe} title="Data Sharing & Third Parties">
            <p className="text-[#84BABF] leading-relaxed mb-4">
              We do not sell your personal information. We may share your information only in the following situations:
            </p>
            <ul className="list-disc pl-6 text-[#84BABF] leading-relaxed space-y-2">
              <li><span className="text-[#E0EDE9] font-medium">Service Providers:</span> We share data with third-party vendors who perform services on our behalf (e.g., payment processing, hosting, analytics)</li>
              <li><span className="text-[#E0EDE9] font-medium">Business Transfers:</span> In connection with a merger, acquisition, or sale of assets, your data may be transferred</li>
              <li><span className="text-[#E0EDE9] font-medium">Legal Requirements:</span> We may disclose information if required by law or in response to valid legal requests</li>
              <li><span className="text-[#E0EDE9] font-medium">With Your Consent:</span> We may share data for any other purpose with your explicit consent</li>
            </ul>
            <p className="text-[#84BABF] leading-relaxed mt-4">
              All third-party service providers are contractually obligated to protect your data and use it only for the purposes we specify.
            </p>
          </Section>

          {/* ─── DATA SECURITY ─── */}
          <Section icon={ShieldCheck} title="Data Security">
            <p className="text-[#84BABF] leading-relaxed mb-4">
              The security of your data is important to us. We implement industry-standard technical and organizational measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-[#84BABF] leading-relaxed space-y-2">
              <li>End-to-end encryption for data in transit (TLS/SSL)</li>
              <li>Encryption at rest for stored sensitive data (AES-256)</li>
              <li>Regular security assessments and penetration testing</li>
              <li>Role-based access controls and multi-factor authentication</li>
              <li>24/7 system monitoring and intrusion detection</li>
              <li>Secure, SOC 2 compliant cloud infrastructure</li>
            </ul>
            <p className="text-[#84BABF] leading-relaxed mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
            </p>
          </Section>

          {/* ─── DATA RETENTION ─── */}
          <Section icon={Database} title="Data Retention">
            <p className="text-[#84BABF] leading-relaxed">
              We will retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your data to the extent necessary to comply with our legal obligations (for example, retaining transaction records for tax purposes), resolve disputes, and enforce our policies. Once data is no longer needed, it will be securely deleted or anonymized.
            </p>
          </Section>

          {/* ─── YOUR RIGHTS ─── */}
          <Section icon={UserCheck} title="Your Privacy Rights">
            <p className="text-[#84BABF] leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal information. These may include:
            </p>
            <ul className="list-disc pl-6 text-[#84BABF] leading-relaxed space-y-2">
              <li><span className="text-[#E0EDE9] font-medium">Right to Access:</span> Request a copy of the personal data we hold about you</li>
              <li><span className="text-[#E0EDE9] font-medium">Right to Rectification:</span> Request correction of any inaccurate or incomplete data</li>
              <li><span className="text-[#E0EDE9] font-medium">Right to Erasure:</span> Request deletion of your personal data ("Right to be Forgotten")</li>
              <li><span className="text-[#E0EDE9] font-medium">Right to Restrict Processing:</span> Request limitation of how we use your data</li>
              <li><span className="text-[#E0EDE9] font-medium">Right to Data Portability:</span> Request a transfer of your data to another service</li>
              <li><span className="text-[#E0EDE9] font-medium">Right to Object:</span> Object to the processing of your data for certain purposes</li>
              <li><span className="text-[#E0EDE9] font-medium">Right to Opt-Out of Sale:</span> California residents can opt out of the sale of their data</li>
            </ul>
            <p className="text-[#84BABF] leading-relaxed mt-4">
              To exercise any of these rights, please contact us at <a href="mailto:privacy@shopnest.com" className="text-emerald-400 hover:underline">privacy@shopnest.com</a>. We will respond to your request within 45 days.
            </p>
          </Section>

          {/* ─── COOKIES ─── */}
          <Section icon={Eye} title="Cookies & Tracking Technologies">
            <p className="text-[#84BABF] leading-relaxed mb-4">
              We use cookies and similar tracking technologies to track activity on our Service and store certain information. Tracking technologies used include beacons, tags, and scripts to collect and track information and to improve and analyze our Service.
            </p>
            <p className="text-[#84BABF] leading-relaxed mb-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
            </p>
            <h3 className="text-lg font-semibold text-[#E0EDE9] mt-6 mb-3">Types of Cookies We Use:</h3>
            <ul className="list-disc pl-6 text-[#84BABF] leading-relaxed space-y-2">
              <li><span className="text-[#E0EDE9] font-medium">Essential Cookies:</span> Required for the operation of the Service</li>
              <li><span className="text-[#E0EDE9] font-medium">Analytics Cookies:</span> Help us understand how visitors interact with our Service</li>
              <li><span className="text-[#E0EDE9] font-medium">Preference Cookies:</span> Remember your settings and preferences</li>
            </ul>
          </Section>

          {/* ─── CHILDREN'S PRIVACY ─── */}
          <Section icon={UserCheck} title="Children's Privacy">
            <p className="text-[#84BABF] leading-relaxed">
              Our Service is not directed to anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us. If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove that information from our servers.
            </p>
          </Section>

          {/* ─── INTERNATIONAL TRANSFERS ─── */}
          <Section icon={Globe} title="International Data Transfers">
            <p className="text-[#84BABF] leading-relaxed">
              Your information, including personal data, may be transferred to and maintained on servers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction. If you are located outside the United States and choose to provide information to us, please note that we transfer the data to the United States and process it there. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.
            </p>
          </Section>

          {/* ─── POLICY UPDATES ─── */}
          <Section icon={Bell} title="Changes to This Policy">
            <p className="text-[#84BABF] leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this policy. We will also notify you via email and/or a prominent notice on our Service prior to the change becoming effective. We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </Section>

          {/* ─── CONTACT US ─── */}
          <Section icon={Mail} title="Contact Us">
            <p className="text-[#84BABF] leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-[#06363D]/50 border border-[#84BABF]/10 rounded-xl p-6 space-y-3">
              <p className="text-[#E0EDE9] font-semibold">ShopNest Inc.</p>
              <p className="text-[#84BABF]">
                <span className="text-[#E0EDE9]/80 font-medium">Email:</span>{' '}
                <a href="mailto:privacy@shopnest.com" className="text-emerald-400 hover:underline">privacy@shopnest.com</a>
              </p>
              <p className="text-[#84BABF]">
                <span className="text-[#E0EDE9]/80 font-medium">Address:</span>{' '}
                123 Commerce Street, Suite 400, San Francisco, CA 94105, USA
              </p>
              <p className="text-[#84BABF]">
                <span className="text-[#E0EDE9]/80 font-medium">Support:</span>{' '}
                <Link to="/support" className="text-emerald-400 hover:underline">Visit our Support Center</Link>
              </p>
            </div>
          </Section>

          {/* ─── LEGAL LINKS ─── */}
          <div className="mt-12 pt-8 border-t border-[#84BABF]/10 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <Link to="/terms" className="text-[#84BABF] hover:text-[#E0EDE9] transition-colors font-medium">
              Terms of Service
            </Link>
            <span className="hidden sm:inline text-[#84BABF]/30">|</span>
            <Link to="/support" className="text-[#84BABF] hover:text-[#E0EDE9] transition-colors font-medium">
              Contact Support
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}