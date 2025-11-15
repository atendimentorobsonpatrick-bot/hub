
import React from 'react';
import { Link } from 'react-router-dom';

const CommunityPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <h1 className="text-4xl font-bold text-center mb-6 text-brand-text-dark">
          Our Commitment to Community
        </h1>
        <p className="text-lg text-gray-600 text-center mb-10">
          AURA is founded on the principles of safety, respect, and authenticity. This is our promise to you.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-brand-pink mb-3">1. Mandatory Verification for All</h2>
            <p className="text-gray-700 leading-relaxed">
              Trust begins with authenticity. Every member of the AURA community—both users and models—undergoes a mandatory verification process. This foundational step ensures every interaction is genuine, fostering a community built on mutual respect. Your privacy is our priority; all verification data is encrypted and handled with the utmost security.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-brand-pink mb-3">2. Zero-Tolerance for Disrespect</h2>
            <p className="text-gray-700 leading-relaxed">
              Respect is the cornerstone of our platform. We enforce a strict zero-tolerance policy against harassment, hate speech, and any form of discourteous behavior. We empower our users to report any conduct that violates our standards, and we take immediate, decisive action on all reports to maintain the integrity of our community.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-brand-pink mb-3">3. Uncompromising Privacy and Discretion</h2>
            <p className="text-gray-700 leading-relaxed">
              Your conversations are your own. We are fundamentally committed to protecting your privacy and ensuring your one-on-one calls are confidential and secure. AURA does not record, store, or share video content from any call, ever.
            </p>
          </div>
        </div>

        <div className="text-center mt-12 border-t border-gray-200 pt-8">
            <p className="text-gray-700 mb-4">Ready to experience a higher standard of connection?</p>
            <Link
                to="/catalog"
                className="inline-block bg-brand-pink hover:bg-brand-pink-hover text-white font-bold py-3 px-8 rounded-lg transition duration-300"
            >
                Explore The Gallery
            </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;