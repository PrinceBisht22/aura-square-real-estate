import React, { useState } from 'react';
import { ICONS } from '../components/icons.jsx';
import { submitContactForm } from '../utils/api.js';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitContactForm(form);
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="site-container py-12 md:py-16">
      <div className="mx-auto max-w-5xl gap-10 md:grid md:grid-cols-2">
        <div className="space-y-6">
          <p className="floating-chip text-navy">Contact</p>
          <h1 className="text-4xl font-display font-semibold text-navy">
            Talk to the Aura Square team
          </h1>
          <p className="text-slate">
            Whether you are buying, renting, investing, or need help listing a property, our specialists are ready to help.
          </p>
          <div className="space-y-4 rounded-3xl bg-white/90 p-6 shadow-card">
            <div className="flex items-center gap-3">
              <ICONS.Phone className="h-5 w-5 text-gold" />
              <div>
                <p className="text-sm uppercase text-slate">Call us</p>
                <p className="text-lg font-semibold text-navy">+91 78953 18390</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ICONS.Mail className="h-5 w-5 text-gold" />
              <div>
                <p className="text-sm uppercase text-slate">Email</p>
                <p className="text-lg font-semibold text-navy">hello@aurasquare.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ICONS.MapPin className="h-5 w-5 text-gold" />
              <div>
                <p className="text-sm uppercase text-slate">Studio</p>
                <p className="text-lg font-semibold text-navy">
                  Aura Square, Dehradun
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-4 rounded-3xl bg-white p-6 shadow-card md:mt-0">
          {success && (
            <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-green-800 text-sm flex items-center gap-2">
              <ICONS.Check className="h-5 w-5" />
              <span>Message sent successfully! We'll get back to you soon.</span>
            </div>
          )}
          {errors.submit && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-red-800 text-sm">
              {errors.submit}
            </div>
          )}
          <label className="block space-y-2 text-sm font-semibold text-slate">
            Name
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={`w-full rounded-2xl border px-4 py-3 font-medium text-navy transition focus:outline-none focus:ring-2 focus:ring-navy/20 ${
                errors.name ? 'border-red-300' : 'border-slate/20'
              }`}
              placeholder="Your full name"
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
          </label>
          <label className="block space-y-2 text-sm font-semibold text-slate">
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={`w-full rounded-2xl border px-4 py-3 font-medium text-navy transition focus:outline-none focus:ring-2 focus:ring-navy/20 ${
                errors.email ? 'border-red-300' : 'border-slate/20'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
          </label>
          <label className="block space-y-2 text-sm font-semibold text-slate">
            Message
            <textarea
              rows={5}
              required
              value={form.message}
              onChange={(e) => updateField('message', e.target.value)}
              className={`w-full rounded-2xl border px-4 py-3 text-sm text-navy transition focus:outline-none focus:ring-2 focus:ring-navy/20 resize-none ${
                errors.message ? 'border-red-300' : 'border-slate/20'
              }`}
              placeholder="Tell us how we can help..."
            />
            {errors.message && <p className="text-xs text-red-600">{errors.message}</p>}
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-navy to-indigo px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <ICONS.Loader className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <ICONS.Send className="h-4 w-4" />
                Send message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;

