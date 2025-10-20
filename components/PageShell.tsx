import React from 'react';
import Header from './Header';
import Footer from './Footer';
import type { LocationPageData } from '../types';

interface Props {
  data: LocationPageData;
  children?: React.ReactNode;
}

const PageShell: React.FC<Props> = ({ data, children }) => {
  const { hero, navLinks, bookingButton, accentColor, name } = data;

  return (
    <div className="bg-white">
      <Header navLinks={navLinks} showBookingButton={bookingButton} accentColor={accentColor} locationName={name} />

      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] bg-cover bg-center text-white" style={{ backgroundImage: `url('${hero.image}')` }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">{hero.title}</h1>
          <p className="text-md md:text-lg max-w-3xl">{hero.subtitle}</p>
        </div>
      </section>

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default PageShell;
