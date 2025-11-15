import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import ModelCard from '../components/ModelCard';
import { ModelStatus } from '../types';
import { SearchIcon, VideoIcon, SparklesIcon, ShieldCheckIcon, LockClosedIcon, ChevronDownIcon } from '../components/Icons';

const HomePage: React.FC = () => {
    const { models, isLoadingModels } = useAppContext();
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const featuredModels = models.filter(m => m.status === ModelStatus.Online).slice(0, 3);

    const handleFaqToggle = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const howItWorksSteps = [
        {
            icon: <SearchIcon className="w-10 h-10 text-white" />,
            title: 'Discover Your Match',
            description: 'Browse our gallery of verified models. Find the personality that resonates with you.',
        },
        {
            icon: <VideoIcon className="w-10 h-10 text-white" />,
            title: 'Secure Your Time',
            description: 'Choose your call duration and complete a simple, secure purchase to connect instantly.',
        },
        {
            icon: <SparklesIcon className="w-10 h-10 text-white" />,
            title: 'Experience the Moment',
            description: 'Enjoy your private, one-on-one video call. A real conversation, in total privacy.',
        }
    ];
    
    const whyAuraFeatures = [
        {
            icon: <ShieldCheckIcon className="w-10 h-10 text-brand-pink" />,
            title: 'Verified Authenticity',
            description: 'Every model is identity-verified, ensuring our community is real, respectful, and safe.'
        },
        {
            icon: <LockClosedIcon className="w-10 h-10 text-brand-pink" />,
            title: 'Absolute Privacy',
            description: 'Your conversations are yours alone. All calls are end-to-end encrypted and never recorded.'
        },
        {
            icon: <SparklesIcon className="w-10 h-10 text-brand-pink" />,
            title: 'Curated & Exclusive',
            description: 'We are a boutique platform. Connect with a hand-picked selection of models you won\'t find anywhere else.'
        }
    ];

    const faqs = [
        {
            question: 'Is this platform secure and private?',
            answer: 'Absolutely. We prioritize your privacy above all. All video calls are end-to-end encrypted and are never recorded or stored. Our payment processing is handled by industry-leading, PCI-compliant providers to ensure your financial data is always secure.'
        },
        {
            question: 'How do I know the models are real?',
            answer: 'Every model on AURA undergoes a mandatory identity verification process before they can be featured in our gallery. This ensures that you are connecting with real, authentic individuals who are committed to providing a genuine experience.'
        },
        {
            question: 'What happens immediately after I purchase a call?',
            answer: 'As soon as your secure payment is complete, you will be taken directly to a private waiting room. Your one-on-one video call with the model will begin automatically. You have the full purchased duration for your private conversation.'
        },
        {
            question: 'Are the calls recorded?',
            answer: 'Never. We have a strict policy against recording or storing any video or audio from the calls. Your conversations are completely private and disappear the moment the call ends, ensuring total discretion and peace of mind.'
        },
        {
            question: 'Can I schedule a call for a later time?',
            answer: 'Currently, AURA is designed for instant connections. You can only purchase calls with models who are online and available at that moment. This ensures immediate, real-time interactions without the need for scheduling.'
        },
    ];

  return (
    <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-12">
                    {/* Banner Image: On mobile, this will appear FIRST */}
                    <div className="lg:order-2 flex items-center justify-center">
                       <img
                            src="https://images.unsplash.com/photo-1542628682-88321d2a4128?q=80&w=800&auto=format&fit=crop"
                            alt="AURA Models"
                            className="max-h-[50vh] lg:max-h-[70vh] w-auto object-contain pt-8 lg:pt-0 rounded-lg"
                        />
                    </div>

                    {/* Text Content: On mobile, this will appear SECOND */}
                    <div className="lg:order-1 text-center lg:text-left pb-16 pt-8 lg:py-24">
                        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-brand-text-dark tracking-tight">
                        Real Connections, <br/>
                        <span className="text-brand-pink">Total Privacy</span>
                        </h1>
                        <p className="mt-6 max-w-lg mx-auto lg:mx-0 text-lg text-gray-600 leading-8">
                        Welcome to AURA, the premier sanctuary for live, one-on-one video calls with authentic, verified models. Experience a new standard of private conversation.
                        </p>
                        <Link
                        to="/catalog"
                        className="mt-10 inline-block bg-brand-pink hover:bg-brand-pink-hover text-white font-bold py-4 px-10 rounded-lg transition duration-300 transform hover:scale-105 text-lg shadow-lg hover:shadow-xl shadow-brand-pink/30 uppercase"
                        >
                        Explore THE GALLERY
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Featured Models Section */}
        <div id="featured-models" className="bg-white pt-20 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center font-serif text-brand-text-dark mb-12">
                Connect Instantly
                </h2>
                {isLoadingModels ? (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-pink mx-auto"></div>
                </div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredModels.length > 0 ? (
                        featuredModels.map(model => <ModelCard key={model.id} model={model} />)
                    ) : (
                        <p className="text-center text-gray-500 col-span-full bg-gray-50 p-12 rounded-lg shadow-inner border border-gray-200">No models are available at this moment. Please check back soon.</p>
                    )}
                </div>
                )}
            </div>
        </div>
        
        {/* Why Choose AURA Section */}
        <div className="py-16 bg-brand-light-bg">
           <div className="container mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-serif text-brand-text-dark">The AURA Difference</h2>
                <p className="text-gray-600 mt-2">An experience built on trust, quality, and discretion.</p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {whyAuraFeatures.map(feature => (
                    <div key={feature.title} className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-pink-100 mx-auto mb-6">
                           {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-brand-text-dark mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold font-serif text-brand-text-dark">Frequently Asked Questions</h2>
                    <p className="text-gray-600 mt-2">Have questions? We have answers.</p>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300">
                            <button
                                onClick={() => handleFaqToggle(index)}
                                className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 focus:outline-none"
                                aria-expanded={openFaqIndex === index}
                            >
                                <span className="text-lg font-medium text-brand-text-dark">{faq.question}</span>
                                <ChevronDownIcon className={`w-6 h-6 text-brand-pink transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`grid transition-all duration-500 ease-in-out ${openFaqIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden">
                                     <div className="px-5 pb-5 bg-white">
                                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    </div>
  );
};

export default HomePage;