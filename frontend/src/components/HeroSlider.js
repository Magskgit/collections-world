import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  {
    key: 'shop',
    image: '/images/shop.jpg',
    eyebrow: '🏬 Visit Us In Chennai',
    title: "India's Biggest Toy Wholesale Market",
    text: 'Wide range · Best prices · Bulk deals · Quality assured',
    cta: 'Shop Now 🛍️',
    to: '/products',
    dark: true,
  },
  {
    key: 'offer50',
    bg: 'linear-gradient(135deg,#FF6B35,#FF3D81)',
    eyebrow: '🔥 Special Offer',
    title: 'Up to 50% OFF',
    text: 'Baby dresses, toys, gifts, bags, fancy & stationery — grab the deals before they go!',
    cta: 'Grab The Deals',
    to: '/products',
  },
  {
    key: 'loyalty',
    bg: 'linear-gradient(135deg,#6C63FF,#3BB2F6)',
    eyebrow: '⭐ Loyalty Reward',
    title: 'Extra 5% OFF for Existing Customers',
    text: 'Tick "existing customer" at checkout and save more on every order.',
    cta: 'Start Shopping',
    to: '/products',
  },
  {
    key: 'sweet',
    bg: 'linear-gradient(135deg,#FF8FB1,#FFB86B)',
    eyebrow: '🍦 New In Store',
    title: 'Sweet Escape is Here!',
    text: 'Soft serve, milkshakes, sugarcane juice, popcorn & cool drinks.',
    cta: 'Explore Sweet Escape 🍦',
    to: '/products?category=sweet-escape',
  },
  {
    key: 'cod',
    bg: 'linear-gradient(135deg,#10B981,#3BB2F6)',
    eyebrow: '🚚 Easy Ordering',
    title: 'Cash on Delivery Available',
    text: 'Order online, pay when it arrives. Questions? Call 9994090118.',
    cta: 'Order Now',
    to: '/products',
  },
];

const INTERVAL_MS = 5000;

export default function HeroSlider() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (i) => setIndex((i + SLIDES.length) % SLIDES.length),
    []
  );

  useEffect(() => {
    if (paused) return undefined;
    const t = setTimeout(() => go(index + 1), INTERVAL_MS);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  return (
    <section
      className="slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="slider__track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {SLIDES.map((s) => (
          <div
            key={s.key}
            className="slider__slide"
            style={s.image
              ? { backgroundImage: `url(${s.image})` }
              : { background: s.bg }}
          >
            {s.image && <div className="slider__shade" />}
            <div className="slider__content">
              <div className="slider__eyebrow">{s.eyebrow}</div>
              <h2 className="slider__title">{s.title}</h2>
              <p className="slider__text">{s.text}</p>
              <button className="btn slider__cta" onClick={() => navigate(s.to)}>
                {s.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="slider__arrow slider__arrow--prev" onClick={() => go(index - 1)} aria-label="Previous slide">‹</button>
      <button className="slider__arrow slider__arrow--next" onClick={() => go(index + 1)} aria-label="Next slide">›</button>

      <div className="slider__dots">
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            className={`slider__dot ${i === index ? 'active' : ''}`}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
