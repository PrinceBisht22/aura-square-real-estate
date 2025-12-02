import React from 'react';
import { ICONS } from './icons.jsx';

const TestimonialsCard = ({ testimonial }) => (
  <article className="glass-card flex flex-col gap-4 p-6">
    <div className="flex items-center gap-4">
      <img
        src={testimonial.avatar}
        alt={testimonial.name}
        className="h-14 w-14 rounded-full object-cover"
        loading="lazy"
      />
      <div>
        <h4 className="text-lg font-semibold text-navy">
          {testimonial.name}
        </h4>
        <p className="text-sm text-slate">{testimonial.city}</p>
      </div>
    </div>
    <div className="flex gap-1 text-gold">
      {Array.from({ length: testimonial.rating }).map((_, index) => (
        <ICONS.Sparkles key={index} className="h-4 w-4" />
      ))}
    </div>
    <h5 className="text-base font-semibold text-navy">{testimonial.title}</h5>
    <p className="text-sm text-slate">{testimonial.quote}</p>
  </article>
);

export default TestimonialsCard;

