import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { HOME_NAV_LINKS, BUTA_RANQUIL_DATA, CHOS_MALAL_DATA } from '../constants';
import type { Activity } from '../types';
import ActivityCard from '../components/ActivityCard';

const ActivitiesPage: React.FC = () => {
    const [view, setView] = React.useState<'grid' | 'list'>('grid');
    return (
        <div className="bg-white">
            <Header navLinks={HOME_NAV_LINKS} isHome={false} />
            <main className='pt-20'>
        <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Actividades en la Región</h1>
                <p className="text-lg text-gray-600">Descubrí todo lo que podés hacer en Buta Ranquil y Chos Malal.</p>
            </div>
        </section>
        
        <section className="py-20">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center md:text-left">{BUTA_RANQUIL_DATA.activities.title} en {BUTA_RANQUIL_DATA.name}</h2>
                 <div className="flex justify-end mb-4 gap-2">
                    <button className={`px-3 py-1 rounded ${view === 'grid' ? 'bg-gray-200' : ''}`} onClick={() => setView('grid')}>Grid</button>
                    <button className={`px-3 py-1 rounded ${view === 'list' ? 'bg-gray-200' : ''}`} onClick={() => setView('list')}>Lista</button>
                 </div>
                 <div className={view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8' : 'flex flex-col gap-4'}>
                    {BUTA_RANQUIL_DATA.activities.items.map((activity, index) => (
                        <div key={index} className={view === 'grid' ? '' : 'w-full'}>
                          <ActivityCard activity={activity} accentColor={BUTA_RANQUIL_DATA.accentColor} />
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center md:text-left">{CHOS_MALAL_DATA.activities.title} en {CHOS_MALAL_DATA.name}</h2>
                 <div className={view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8' : 'flex flex-col gap-4'}>
                    {CHOS_MALAL_DATA.activities.items.map((activity, index) => (
                        <div key={index} className={view === 'grid' ? '' : 'w-full'}>
                          <ActivityCard activity={activity} accentColor={CHOS_MALAL_DATA.accentColor} />
                        </div>
                    ))}
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default ActivitiesPage;