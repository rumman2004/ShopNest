import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import { ArrowLeft, LifeBuoy, Mail, Phone, BookOpen, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function Support() {
  const formRef = useRef()
  const [status, setStatus] = useState('idle')
  const [formData, setFormData] = useState({ user_name: '', user_email: '', message: '' })

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const SERVICE_ID = 'service_urm2mua'
      const TEMPLATE_ID = 'template_d8htrtu'
      const PUBLIC_KEY = 'JpI7SzrL93-qZ3wfJ'
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      setStatus('success')
      setFormData({ user_name: '', user_email: '', message: '' })
    } catch (error) {
      console.error('Email failed to send:', error)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[#F0EDE5] relative overflow-x-hidden py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

      {/* ─── BACK TO HOME ─── */}
      <Link to="/" className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#e5f2f1] border border-[#d9d4c8] hover:border-[#004643]/35 text-[#004643] text-sm font-bold tracking-wide shadow-sm transition-all duration-300 group animate-fade-in">
        <ArrowLeft size={18} strokeWidth={2.5} className="transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="hidden sm:inline">Back to Home</span>
        <span className="sm:hidden">Back</span>
      </Link>

      <div className="max-w-5xl mx-auto relative z-10 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#004643] border border-[#003734] mb-6 shadow-md">
            <LifeBuoy size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#182321] tracking-tight mb-4">How can we help?</h1>
          <p className="text-lg text-[#697773] max-w-2xl mx-auto">Whether you have a question about features, pricing, or technical issues, our team is ready to answer all your questions.</p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-[#d9d4c8] rounded-2xl p-6 text-center hover:border-[#004643]/25 hover:shadow-lg transition-all duration-300">
            <Mail size={28} className="text-[#004643] mx-auto mb-4" />
            <h3 className="text-[#182321] font-bold text-lg mb-2">Email Us</h3>
            <p className="text-[#697773] text-sm">Drop us a line and we'll get back to you within 24 hours.</p>
            <p className="mt-4 text-[#004643] font-semibold">support@shopnest.com</p>
          </div>
          <div className="bg-white border border-[#d9d4c8] rounded-2xl p-6 text-center hover:border-[#004643]/25 hover:shadow-lg transition-all duration-300">
            <Phone size={28} className="text-[#004643] mx-auto mb-4" />
            <h3 className="text-[#182321] font-bold text-lg mb-2">Call Us</h3>
            <p className="text-[#697773] text-sm">Need urgent help? Give us a call during business hours.</p>
            <p className="mt-4 text-[#004643] font-semibold">+91 6002364082</p>
          </div>
          <div className="bg-white border border-[#d9d4c8] rounded-2xl p-6 text-center hover:border-[#004643]/25 hover:shadow-lg transition-all duration-300">
            <BookOpen size={28} className="text-[#004643] mx-auto mb-4" />
            <h3 className="text-[#182321] font-bold text-lg mb-2">Documentation</h3>
            <p className="text-[#697773] text-sm">Browse our detailed guides and API documentation.</p>
            <button className="mt-4 text-[#004643] font-bold hover:text-[#003734] transition-colors underline underline-offset-4 decoration-[#004643]/40 hover:decoration-[#004643]">Visit Help Center</button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-[#d9d4c8] rounded-[2rem] p-8 md:p-12 shadow-lg shadow-[#d9d4c8]/40 max-w-3xl mx-auto">
          {status === 'success' ? (
            <div className="text-center py-10 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 mb-6">
                <CheckCircle size={40} className="text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-[#182321] mb-4">Message Sent!</h2>
              <p className="text-[#697773] text-lg max-w-md mx-auto mb-8">Thank you for reaching out. An automated confirmation email has been sent to your inbox. Our team will review your message and reply shortly.</p>
              <button onClick={() => setStatus('idle')} className="text-[#004643] hover:text-[#003734] font-bold underline underline-offset-4 decoration-[#004643]/40 hover:decoration-[#004643] transition-colors">Send another message</button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-[#182321] mb-8 text-center">Send us a message</h2>
              {status === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                  <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-red-700">Something went wrong while sending your message. Please try again later or contact us directly via email.</p>
                </div>
              )}
              <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-[#182321] tracking-wide">Full Name</label>
                    <input type="text" name="user_name" required value={formData.user_name} onChange={handleChange} placeholder="John Doe" className="w-full rounded-xl px-4 py-3 text-sm bg-[#faf8f2] border border-[#d9d4c8] text-[#182321] placeholder:text-[#697773]/50 focus:outline-none focus:ring-2 focus:ring-[#004643]/30 focus:border-[#004643]/50 transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-[#182321] tracking-wide">Email Address</label>
                    <input type="email" name="user_email" required value={formData.user_email} onChange={handleChange} placeholder="john@example.com" className="w-full rounded-xl px-4 py-3 text-sm bg-[#faf8f2] border border-[#d9d4c8] text-[#182321] placeholder:text-[#697773]/50 focus:outline-none focus:ring-2 focus:ring-[#004643]/30 focus:border-[#004643]/50 transition-all" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-[#182321] tracking-wide">Your Message</label>
                  <textarea name="message" required value={formData.message} onChange={handleChange} rows="5" placeholder="How can we help you today?" className="w-full rounded-xl px-4 py-3 text-sm bg-[#faf8f2] border border-[#d9d4c8] text-[#182321] placeholder:text-[#697773]/50 focus:outline-none focus:ring-2 focus:ring-[#004643]/30 focus:border-[#004643]/50 transition-all resize-none"></textarea>
                </div>
                <button type="submit" disabled={status === 'loading'} className="w-full flex items-center justify-center gap-2 py-3.5 mt-4 bg-[#004643] hover:bg-[#003734] disabled:bg-[#004643]/50 text-white font-black rounded-xl shadow-md hover:shadow-lg disabled:shadow-none transition-all duration-300">
                  {status === 'loading' ? (<><Loader2 size={18} className="animate-spin" /><span>Sending...</span></>) : (<><Send size={18} strokeWidth={2.5} /><span>Send Message</span></>)}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}