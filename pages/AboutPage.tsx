
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <h1 className="text-4xl font-bold text-center mb-6 text-brand-text-dark">
          The Story of AURA
        </h1>
        <p className="text-lg text-gray-600 text-center mb-10">
          We're here to redefine digital intimacy through authentic, one-on-one experiences.
        </p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
                In an era of endless scrolling and fleeting interactions, AURA was founded on a simple yet powerful belief: technology should foster deeper, more genuine human connections. We saw a need for a private, premium space where individuals could engage in meaningful conversations, free from the noise of public platforms.
            </p>
            <p>
                AURA is more than a service; it is a sanctuary. We meticulously curate our gallery, partnering only with verified, authentic models who share our vision. This allows us to cultivate a community built on a foundation of trust, safety, and mutual respect. We empower our models with a sophisticated platform to connect with their audience, and we offer our users an unparalleled opportunity for real, memorable interactions.
            </p>
            <p>
                Whether you seek a captivating conversation, a moment of shared laughter, or a truly personal connection, AURA provides the private stage for it to unfold.
            </p>
        </div>
         <div className="mt-12 border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold text-center text-brand-text-dark">
                Our Guiding Principles
            </h3>
            <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <li className="bg-pink-50 p-4 rounded-lg">
                    <span className="font-bold text-brand-pink">Authenticity</span>
                    <p className="text-sm text-gray-600">Real people. Real conversations.</p>
                </li>
                 <li className="bg-pink-50 p-4 rounded-lg">
                    <span className="font-bold text-brand-pink">Privacy</span>
                     <p className="text-sm text-gray-600">Your connections are yours alone.</p>
                </li>
                 <li className="bg-pink-50 p-4 rounded-lg">
                    <span className="font-bold text-brand-pink">Exclusivity</span>
                    <p className="text-sm text-gray-600">A curated experience, unmatched quality.</p>
                </li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;