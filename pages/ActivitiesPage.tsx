import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { HOME_NAV_LINKS, BUTA_RANQUIL_DATA, CHOS_MALAL_DATA } from '../constants';
import ActivityCard from '../components/ActivityCard';
import type { Activity } from '../types';

// --- 1. UTILIDADES Y CONFIGURACIÓN ---
const COORDS = {
    BUTA: { lat: -37.0478, lng: -69.7469 },
    CHOS: { lat: -37.3780, lng: -70.2709 },
};

// MAPEO DE ICONOS (Hardcodeo Solicitado para corregir las estrellas)
// Asignamos una clase de FontAwesome basada en el título de la actividad.
const getIconClassByTitle = (title: string): string => {
    const map: Record<string, string> = {
        'Trekking': 'fa-solid fa-person-hiking',
        'Cabalgatas': 'fa-solid fa-horse',
        'Pesca': 'fa-solid fa-fish',
        'Fotografía': 'fa-solid fa-camera',
        'Camping': 'fa-solid fa-campground',
        'Kayak': 'fa-solid fa-water',
        'Senderismo': 'fa-solid fa-person-hiking',
        'Ciclismo': 'fa-solid fa-bicycle',
        'Avistaje de Aves': 'fa-solid fa-crow', // o fa-binoculars
        'Museos': 'fa-solid fa-building-columns',
        'Gastronomía': 'fa-solid fa-utensils',
    };
    // Retorna el icono mapeado o una estrella por defecto si no coincide
    return map[title] || 'fa-solid fa-star';
};

const getWeatherInfo = (code: number) => {
    if (code === 0) return { label: 'Despejado', icon: 'fa-sun', color: 'text-yellow-400' };
    if (code >= 1 && code <= 3) return { label: 'Nublado', icon: 'fa-cloud-sun', color: 'text-gray-300' };
    if (code === 45 || code === 48) return { label: 'Niebla', icon: 'fa-smog', color: 'text-gray-400' };
    if (code >= 51 && code <= 67) return { label: 'Lluvia', icon: 'fa-cloud-showers-heavy', color: 'text-blue-400' };
    if (code >= 71 && code <= 77) return { label: 'Nieve', icon: 'fa-snowflake', color: 'text-cyan-200' };
    if (code >= 95 && code <= 99) return { label: 'Tormenta', icon: 'fa-bolt', color: 'text-purple-400' };
    return { label: 'Variable', icon: 'fa-cloud', color: 'text-gray-300' };
};

// --- 2. WIDGET DE CLIMA (Componente Reutilizable) ---
interface WeatherWidgetProps {
    locationName: string;
    lat: number;
    lng: number;
    accentColor: string;
    variant?: 'mobile' | 'desktop'; // Para ajustar estilos internos si hace falta
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ locationName, lat, lng, accentColor, variant = 'desktop' }) => {
    const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&timezone=auto`);
                const data = await res.json();
                if (data.current_weather) {
                    setWeather({
                        temp: Math.round(data.current_weather.temperature),
                        code: data.current_weather.weathercode,
                    });
                }
            } catch (error) {
                console.error("Error clima:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, [lat, lng]);

    const borderColors = {
        cyan: 'border-l-cyan-400',
        orange: 'border-l-orange-400',
        green: 'border-l-green-400',
    }[accentColor] || 'border-l-gray-400';

    if (loading) {
        return (
            <div className={`bg-white/10 backdrop-blur-md rounded-xl w-full animate-pulse border border-white/10 ${variant === 'mobile' ? 'h-16' : 'h-24'}`}></div>
        );
    }

    if (!weather) return null;

    const info = getWeatherInfo(weather.code);

    return (
        <div className={`
            group relative overflow-hidden 
            bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 
            rounded-xl md:rounded-2xl 
            transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
            flex items-center justify-between
            ${variant === 'mobile' ? 'p-3' : 'p-5'}
        `}>
            <div className={`absolute left-0 top-0 bottom-0 ${variant === 'mobile' ? 'w-1' : 'w-1.5'} ${borderColors} h-full opacity-80`}></div>
            
            <div className={`flex flex-col ${variant === 'mobile' ? 'pl-2' : 'pl-0'}`}>
                <span className={`${variant === 'mobile' ? 'text-[10px]' : 'text-xs'} font-bold uppercase tracking-widest text-white/70 mb-1`}>
                    {locationName}
                </span>
                <div className="flex items-center gap-2 md:gap-3">
                    <span className={`${variant === 'mobile' ? 'text-2xl' : 'text-5xl'} font-extralight text-white tracking-tighter`}>
                        {weather.temp}°
                    </span>
                    <span className={`${variant === 'mobile' ? 'text-xs' : 'text-sm'} text-white/90 font-medium leading-none`}>
                        {info.label}
                    </span>
                </div>
            </div>

            <div className={`${variant === 'mobile' ? 'text-2xl pr-1' : 'text-5xl'} ${info.color} drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transform group-hover:scale-110 transition-transform duration-500`}>
                <i className={`fas ${info.icon}`}></i>
            </div>
        </div>
    );
};

// --- 3. COMPONENTES HERO SEPARADOS ---

// A) MOBILE HERO (Optimizado para pantallas pequeñas)
const MobileHero = () => {
    return (
        <section className="relative min-h-[80vh] flex flex-col justify-end pb-12 overflow-hidden md:hidden">
            {/* Fondo */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

            <div className="container mx-auto px-4 relative z-10 space-y-6">
                 {/* Texto Centrado */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-[10px] font-bold tracking-widest text-cyan-300 uppercase mb-4">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                        Patagonia Norte
                    </div>
                    <h1 className="text-4xl font-bold text-white leading-tight tracking-tight mb-2">
                        Tu Próxima <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white">Gran Aventura</span>
                    </h1>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-xs mx-auto">
                        Curaduría de las mejores experiencias en Buta Ranquil y Chos Malal.
                    </p>
                </div>

                {/* Widgets Compactos en Grid de 2 columnas para ahorrar espacio vertical */}
                <div className="grid grid-cols-2 gap-3">
                    <WeatherWidget locationName="Buta Ranquil" lat={COORDS.BUTA.lat} lng={COORDS.BUTA.lng} accentColor="orange" variant="mobile" />
                    <WeatherWidget locationName="Chos Malal" lat={COORDS.CHOS.lat} lng={COORDS.CHOS.lng} accentColor="cyan" variant="mobile" />
                </div>
            </div>
        </section>
    );
};

// B) DESKTOP HERO (Diseño Editorial y Simétrico)
const DesktopHero = () => {
    return (
        <section className="relative min-h-[85vh] hidden md:flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center bg-fixed transform scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/90"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-transparent"></div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10 pt-20"> {/* Ajuste px-12 para simetría */}
                <div className="grid grid-cols-2 gap-16 items-center">
                    
                    {/* Columna Izquierda: Texto */}
                    <div className="text-left space-y-8 animate-fade-in-up">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-xs font-bold tracking-widest text-cyan-300 uppercase mb-6">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                                Patagonia Norte
                            </div>
                            <h1 className="text-7xl font-bold text-white leading-[1.1] tracking-tight">
                                Descubre <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white">Tu Próxima</span> <br/>
                                Aventura.
                            </h1>
                        </div>
                        <p className="text-xl text-slate-300 max-w-lg leading-relaxed font-light border-l-2 border-white/20 pl-6">
                            Una curaduría de las mejores experiencias en Buta Ranquil y Chos Malal. Desde la adrenalina de los volcanes hasta la calma de los valles.
                        </p>
                    </div>

                    {/* Columna Derecha: Widgets */}
                    {/* FIX: Eliminado 'ml-auto' y 'max-w-md'. Usamos justify-self-end o simplemente dejamos que el grid posicione. */}
                    <div className="flex flex-col gap-5 w-full max-w-md justify-self-end animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="text-right mb-2">
                            <span className="text-white/60 text-sm font-medium uppercase tracking-widest">Condiciones Actuales</span>
                        </div>
                        <WeatherWidget locationName="Buta Ranquil" lat={COORDS.BUTA.lat} lng={COORDS.BUTA.lng} accentColor="orange" />
                        <WeatherWidget locationName="Chos Malal" lat={COORDS.CHOS.lat} lng={COORDS.CHOS.lng} accentColor="cyan" />
                    </div>

                </div>
            </div>
            
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
                <i className="fas fa-chevron-down text-2xl"></i>
            </div>
        </section>
    );
};


// --- 4. PAGE COMPONENT ---

// Preparación de datos con inyección de iconos
const ALL_ACTIVITIES = [
    ...BUTA_RANQUIL_DATA.activities.items.map(item => ({ 
        ...item, 
        location: 'Buta Ranquil', 
        accentColor: BUTA_RANQUIL_DATA.accentColor,
        // INYECCIÓN DE ICONOS: Si no tiene iconClass, la calculamos
        iconClass: (item as any).iconClass || getIconClassByTitle(item.title)
    })),
    ...CHOS_MALAL_DATA.activities.items.map(item => ({ 
        ...item, 
        location: 'Chos Malal', 
        accentColor: CHOS_MALAL_DATA.accentColor,
        iconClass: (item as any).iconClass || getIconClassByTitle(item.title)
    }))
];

const ActivitiesPage: React.FC = () => {
    const [filter, setFilter] = useState<'ALL' | 'BUTA' | 'CHOS'>('ALL');
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredActivities = ALL_ACTIVITIES.filter(act => {
        if (filter === 'ALL') return true;
        if (filter === 'BUTA') return act.location === 'Buta Ranquil';
        if (filter === 'CHOS') return act.location === 'Chos Malal';
        return true;
    });

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col font-sans selection:bg-cyan-200 selection:text-cyan-900">
            <Header navLinks={HOME_NAV_LINKS} isHome={false} />
            
            <main className="flex-grow">
                
                {/* Renderizamos condicionalmente por CSS (hidden/block) para evitar flashes de re-render */}
                <MobileHero />
                <DesktopHero />
        
                {/* BARRA DE FILTROS */}
                <section className={`sticky top-0 z-40 transition-all duration-300 border-b border-gray-200/50 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-md py-3' : 'bg-white py-4 md:py-6'}`}>
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            
                            {/* Tabs */}
                            <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                                <div className="bg-slate-100/80 p-1 rounded-xl inline-flex whitespace-nowrap shadow-inner min-w-full md:min-w-0">
                                    {[
                                        { id: 'ALL', label: 'Todas' },
                                        { id: 'BUTA', label: 'Buta Ranquil' },
                                        { id: 'CHOS', label: 'Chos Malal' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setFilter(tab.id as any)}
                                            className={`
                                                relative z-10 px-4 md:px-5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-300 flex-1 md:flex-auto text-center
                                                ${filter === tab.id 
                                                    ? 'bg-white text-slate-800 shadow-sm' 
                                                    : 'text-slate-500 hover:text-slate-700'}
                                            `}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Controles */}
                            <div className="flex items-center justify-between w-full md:w-auto gap-4">
                                <span className="text-xs font-medium text-slate-400 md:hidden">
                                    {filteredActivities.length} resultados
                                </span>
                                <span className="hidden lg:block text-sm font-medium text-slate-400">
                                    <strong>{filteredActivities.length}</strong> experiencias
                                </span>
                                
                                <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm ml-auto md:ml-0">
                                    <button 
                                        onClick={() => setView('grid')}
                                        className={`p-2 rounded md:px-3 transition-colors ${view === 'grid' ? 'bg-cyan-50 text-cyan-600' : 'text-gray-400'}`}
                                    >
                                        <i className="fas fa-th-large"></i>
                                    </button>
                                    <button 
                                        onClick={() => setView('list')}
                                        className={`p-2 rounded md:px-3 transition-colors ${view === 'list' ? 'bg-cyan-50 text-cyan-600' : 'text-gray-400'}`}
                                    >
                                        <i className="fas fa-list"></i>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* CONTENIDO PRINCIPAL */}
                <section className="py-12 md:py-20 px-4 md:px-0 min-h-screen">
                    <div className="container mx-auto px-2 md:px-6">
                        
                        {filteredActivities.length > 0 ? (
                             <div className={
                                 view === 'grid' 
                                 ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8' 
                                 : 'flex flex-col gap-4 md:gap-6 max-w-4xl mx-auto'
                             }>
                                {filteredActivities.map((item, index) => (
                                    <div 
                                        key={index} 
                                        className={`
                                            group
                                            transform transition-all duration-500 hover:-translate-y-2
                                            ${view === 'grid' ? 'h-full' : 'w-full'}
                                            animate-fade-in-up
                                        `}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="h-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 relative">
                                            
                                            {/* Badge Ubicación */}
                                            {view === 'grid' && (
                                                <div className="absolute top-3 right-3 z-10">
                                                    <span className={`
                                                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md
                                                        ${item.location === 'Buta Ranquil' ? 'bg-orange-500/90 text-white' : 'bg-cyan-500/90 text-white'}
                                                    `}>
                                                        <i className="fas fa-map-marker-alt text-[8px]"></i>
                                                        {item.location}
                                                    </span>
                                                </div>
                                            )}

                                            <ActivityCard 
                                                activity={item} 
                                                accentColor={item.accentColor as any} 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                                <div className="bg-gray-100 p-6 md:p-8 rounded-full mb-4 md:mb-6">
                                    <i className="fas fa-search text-3xl md:text-4xl text-gray-400"></i>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-2">Sin resultados</h3>
                                <button onClick={() => setFilter('ALL')} className="mt-4 text-cyan-600 font-semibold hover:underline">
                                    Ver todas
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default ActivitiesPage;