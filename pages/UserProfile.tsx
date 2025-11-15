
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { VerificationDetails, VerificationStatus } from '../types';
import { UploadIcon, UserIcon, PencilIcon } from '../components/Icons';

const UserProfile: React.FC = () => {
  const { user, submitVerification, updateUserProfilePic, updateUserProfile, addNotification } = useAppContext();
  
  // State for editing personal details
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  
  // State for verification form
  const [formData, setFormData] = useState<VerificationDetails>({
    documentType: 'drivers_license',
    documentNumber: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });

  useEffect(() => {
    if (user) {
        setName(user.name);
        setBio(user.bio || '');
    }
  }, [user]);

  if (!user) {
    return <div className="text-center py-20">Loading your profile...</div>;
  }
  
  const handleVerificationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitVerification(formData);
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if(file.size > 5 * 1024 * 1024) { // 5MB limit
            addNotification("File is too large. Please select an image under 5MB.", 'error');
            return;
        }
        if(!file.type.startsWith('image/')) {
            addNotification("Invalid file type. Please select an image (JPEG, PNG, etc.).", 'error');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                updateUserProfilePic(reader.result as string);
            }
        };
        reader.readAsDataURL(file);
    }
  }
  
  const handleProfileSave = () => {
    updateUserProfile({ name, bio });
    setIsEditing(false);
  }
  
  const handleProfileCancel = () => {
    if(user) {
        setName(user.name);
        setBio(user.bio || '');
    }
    setIsEditing(false);
  }

  const VerificationStatusBadge: React.FC<{ status: VerificationStatus }> = ({ status }) => {
    const statusStyles = {
      unverified: { bg: 'bg-red-100', text: 'text-red-800', label: 'Unverified' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Review' },
      verified: { bg: 'bg-green-100', text: 'text-green-800', label: 'Verified' },
    };
    const currentStatus = statusStyles[status];
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${currentStatus.bg} ${currentStatus.text}`}>
        {currentStatus.label}
      </span>
    );
  };
  
  const renderVerificationContent = () => {
    switch(user.verificationStatus) {
        case 'unverified':
            return (
                <div>
                    <p className="text-gray-600 mb-6">
                        To ensure the safety and authenticity of our community, we require government-issued ID verification. Your information is used for a one-time check and is never stored or shared.
                    </p>
                    <form onSubmit={handleVerificationSubmit} className="space-y-6">
                        {/* Document Type and Number */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">Document Type</label>
                                <select id="documentType" name="documentType" value={formData.documentType} onChange={handleVerificationFormChange} className="mt-1 block w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-brand-pink focus:border-brand-pink">
                                    <option value="drivers_license">Driver's License</option>
                                    <option value="passport">Passport</option>
                                    <option value="national_id">National ID</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700">Document Number</label>
                                <input type="text" id="documentNumber" name="documentNumber" value={formData.documentNumber} onChange={handleVerificationFormChange} placeholder="e.g., D12345678" className="mt-1 block w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-brand-pink focus:border-brand-pink" required />
                            </div>
                        </div>
                        
                        {/* Address */}
                        <fieldset>
                            <legend className="block text-sm font-medium text-gray-700 mb-2">Address on ID</legend>
                            <div className="space-y-4">
                                <input type="text" name="address1" id="address1" placeholder="Address Line 1" required value={formData.address1} onChange={handleVerificationFormChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-brand-pink focus:border-brand-pink" />
                                <input type="text" name="address2" id="address2" placeholder="Address Line 2 (Optional)" value={formData.address2 || ''} onChange={handleVerificationFormChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-brand-pink focus:border-brand-pink" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleVerificationFormChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-brand-pink focus:border-brand-pink" />
                                    <input type="text" name="state" placeholder="State / Province" required value={formData.state} onChange={handleVerificationFormChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-brand-pink focus:border-brand-pink" />
                                    <input type="text" name="zip" placeholder="ZIP / Postal Code" required value={formData.zip} onChange={handleVerificationFormChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-brand-pink focus:border-brand-pink" />
                                </div>
                                <div>
                                    <select name="country" id="country" required value={formData.country} onChange={handleVerificationFormChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-brand-pink focus:border-brand-pink">
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>United Kingdom</option>
                                        <option>Australia</option>
                                    </select>
                                </div>
                            </div>
                        </fieldset>

                        <button type="submit" className="w-full bg-brand-pink hover:bg-brand-pink-hover text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                            Submit for Verification
                        </button>
                    </form>
                </div>
            );
        case 'pending':
             return (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="py-1"><svg className="h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.273-1.21 2.91 0l5.396 10.273c.636 1.21-.212 2.628-1.455 2.628H4.316c-1.243 0-2.09-1.418-1.455-2.628L8.257 3.099zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg></div>
                        <div>
                            <p className="font-bold text-yellow-800">Your Documents Are Under Review.</p>
                            <p className="text-sm text-yellow-700">Verification is typically completed within 24 hours. We appreciate your patience.</p>
                        </div>
                    </div>
                </div>
             );
        case 'verified':
            return (
                 <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="py-1"><svg className="h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></div>
                        <div>
                            <p className="font-bold text-green-800">Your Account is Verified!</p>
                            <p className="text-sm text-green-700">Thank you for helping us keep AURA a secure community.</p>
                        </div>
                    </div>
                </div>
            );
    }
  }

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-10">My Account</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 text-center">
                <div className="relative w-40 h-40 mx-auto">
                    <img 
                        src={user.profilePic || ''} 
                        alt="Profile" 
                        className={`w-40 h-40 rounded-full object-cover border-4 border-brand-pink shadow-md ${!user.profilePic && 'hidden'}`}
                    />
                    {!user.profilePic && (
                        <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                           <UserIcon className="w-24 h-24 text-gray-400" />
                        </div>
                    )}
                </div>
                
                <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
                <p className="text-md text-gray-500">{user.email}</p>

                <div className="mt-6">
                    <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    <label htmlFor="photo-upload" className="cursor-pointer inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm">
                        <UploadIcon className="w-5 h-5" />
                        Change Photo
                    </label>
                </div>
            </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
            {/* Personal Details Card */}
            <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
                <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                    <h2 className="text-2xl font-semibold">Profile Details</h2>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="inline-flex items-center gap-2 text-sm font-medium text-brand-pink hover:underline">
                            <PencilIcon className="w-4 h-4" />
                            Edit
                        </button>
                    )}
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Display Name</label>
                        <input id="displayName" type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} className="mt-1 w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-200 disabled:cursor-not-allowed" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address (Cannot be changed)</label>
                        <input id="email" type="email" value={user.email} disabled className="mt-1 w-full p-3 bg-gray-200 border border-gray-300 rounded-md shadow-sm cursor-not-allowed" />
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">About Me</label>
                        <textarea id="bio" rows={4} placeholder={isEditing ? 'Tell us a little about yourself...' : 'No bio provided.'} value={bio} onChange={(e) => setBio(e.target.value)} disabled={!isEditing} className="mt-1 w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-200 disabled:cursor-not-allowed"></textarea>
                    </div>
                    {isEditing && (
                        <div className="flex justify-end gap-4 pt-4">
                            <button onClick={handleProfileCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-5 rounded-lg transition duration-300">Cancel</button>
                            <button onClick={handleProfileSave} className="bg-brand-pink hover:bg-brand-pink-hover text-white font-bold py-2 px-5 rounded-lg transition duration-300">Save Changes</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Verification Card */}
            <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-semibold">
                      Account Verification
                    </h2>
                    <VerificationStatusBadge status={user.verificationStatus} />
                </div>
                {renderVerificationContent()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;