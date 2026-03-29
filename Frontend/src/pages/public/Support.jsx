import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import { ArrowLeft, LifeBuoy, Mail, Phone, BookOpen, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function Support() {
  const formRef = useRef()
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      // NOTE: You must replace these 3 strings with your actual EmailJS IDs
      // Get them for free at www.emailjs.com
      const SERVICE_ID = 'service_urm2mua' 
      const TEMPLATE_ID = 'template_d8htrtu' 
      const PUBLIC_KEY = 'JpI7SzrL93-qZ3wfJ'

      await emailjs.sendForm(
        SERVICE_ID, 
        TEMPLATE_ID, 
        formRef.current, 
        PUBLIC_KEY
      )
      
      setStatus('success')
      setFormData({ user_name: '', user_email: '', message: '' }) // Reset form

    } catch (error) {
      console.error('Email failed to send:', error)
      setStatus('error')
    }
  }

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

      <div className="max-w-5xl mx-auto relative z-10 animate-slide-up">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#085558]/30 border border-[#84BABF]/20 mb-6 shadow-inner">
            <LifeBuoy size={32} className="text-[#E0EDE9]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#E0EDE9] via-white to-[#84BABF] bg-clip-text text-transparent tracking-tight mb-4">
            How can we help?
          </h1>
          <p className="text-lg text-[#84BABF] max-w-2xl mx-auto">
            Whether you have a question about features, pricing, or technical issues, our team is ready to answer all your questions.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-[#0B2B26]/60 backdrop-blur-xl border border-[#84BABF]/20 rounded-2xl p-6 text-center hover:bg-[#0B2B26]/80 transition-colors">
            <Mail size={28} className="text-[#006F73] mx-auto mb-4" />
            <h3 className="text-[#E0EDE9] font-bold text-lg mb-2">Email Us</h3>
            <p className="text-[#84BABF] text-sm">Drop us a line and we'll get back to you within 24 hours.</p>
            <p className="mt-4 text-[#E0EDE9] font-semibold">support@shopnest.com</p>
          </div>

          <div className="bg-[#0B2B26]/60 backdrop-blur-xl border border-[#84BABF]/20 rounded-2xl p-6 text-center hover:bg-[#0B2B26]/80 transition-colors">
            <Phone size={28} className="text-[#006F73] mx-auto mb-4" />
            <h3 className="text-[#E0EDE9] font-bold text-lg mb-2">Call Us</h3>
            <p className="text-[#84BABF] text-sm">Need urgent help? Give us a call during business hours.</p>
            <p className="mt-4 text-[#E0EDE9] font-semibold">+91 6002364082</p>
          </div>

          <div className="bg-[#0B2B26]/60 backdrop-blur-xl border border-[#84BABF]/20 rounded-2xl p-6 text-center hover:bg-[#0B2B26]/80 transition-colors">
            <BookOpen size={28} className="text-[#006F73] mx-auto mb-4" />
            <h3 className="text-[#E0EDE9] font-bold text-lg mb-2">Documentation</h3>
            <p className="text-[#84BABF] text-sm">Browse our detailed guides and API documentation.</p>
            <button className="mt-4 text-emerald-400 font-bold hover:text-emerald-300 transition-colors underline underline-offset-4">
              Visit Help Center
            </button>
          </div>

        </div>

        {/* Contact Form Container */}
        <div className="bg-[#0B2B26]/80 backdrop-blur-2xl border border-[#84BABF]/20 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-[#06363D] max-w-3xl mx-auto">
          
          {/* Conditional Rendering based on form status */}
          {status === 'success' ? (
            <div className="text-center py-10 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 mb-6">
                <CheckCircle size={40} className="text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-[#E0EDE9] mb-4">Message Sent!</h2>
              <p className="text-[#84BABF] text-lg max-w-md mx-auto mb-8">
                Thank you for reaching out. An automated confirmation email has been sent to your inbox. Our team will review your message and reply shortly.
              </p>
              <button 
                onClick={() => setStatus('idle')}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-4 transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-[#E0EDE9] mb-8 text-center">Send us a message</h2>
              
              {status === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                  <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-red-200">Something went wrong while sending your message. Please try again later or contact us directly via email.</p>
                </div>
              )}

              <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-[#84BABF] tracking-wide">Full Name</label>
                    <input 
                      type="text" 
                      name="user_name"
                      required
                      value={formData.user_name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full rounded-xl px-4 py-3 text-sm bg-[#06363D]/40 backdrop-blur-md shadow-inner border border-[#84BABF]/20 text-[#E0EDE9] placeholder:text-[#84BABF]/30 focus:outline-none focus:ring-4 focus:ring-[#006F73]/20 focus:border-[#84BABF]/60 transition-all"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-[#84BABF] tracking-wide">Email Address</label>
                    <input 
                      type="email" 
                      name="user_email"
                      required
                      value={formData.user_email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full rounded-xl px-4 py-3 text-sm bg-[#06363D]/40 backdrop-blur-md shadow-inner border border-[#84BABF]/20 text-[#E0EDE9] placeholder:text-[#84BABF]/30 focus:outline-none focus:ring-4 focus:ring-[#006F73]/20 focus:border-[#84BABF]/60 transition-all"
                    />
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-[#84BABF] tracking-wide">Your Message</label>
                  <textarea 
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="How can we help you today?"
                    className="w-full rounded-xl px-4 py-3 text-sm bg-[#06363D]/40 backdrop-blur-md shadow-inner border border-[#84BABF]/20 text-[#E0EDE9] placeholder:text-[#84BABF]/30 focus:outline-none focus:ring-4 focus:ring-[#006F73]/20 focus:border-[#84BABF]/60 transition-all resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 py-3.5 mt-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-900 font-black rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:shadow-none transition-all duration-300"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} strokeWidth={2.5} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

        </div>

      </div>
    </div>
  )
}