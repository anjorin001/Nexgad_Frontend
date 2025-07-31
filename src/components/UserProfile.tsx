import React, { useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  DollarSign,
  Edit2, 
  Lock, 
  LogOut, 
  Trash2,
  Camera,
  Save,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  defaultLocation: {
    city: string;
    state: string;
  };
  currency: string;
  language: string;
  joinedDate: string;
}

interface UserProfileProps {
  userData: UserData;
  onUpdateProfile?: (updatedData: Partial<UserData>) => void;
  onChangePassword?: (currentPassword: string, newPassword: string) => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
  onUploadProfilePicture?: (file: File) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userData,
  onUpdateProfile,
  onChangePassword,
  onLogout,
  onDeleteAccount,
  onUploadProfilePicture
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [editData, setEditData] = useState<Partial<UserData>>(userData);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const nigerianStates = [
    'Abuja (FCT)', 'Lagos', 'Kano', 'Kaduna', 'Port Harcourt', 'Ibadan',
    'Benin City', 'Jos', 'Enugu', 'Aba', 'Warri', 'Calabar', 'Ilorin',
    'Akure', 'Sokoto', 'Maiduguri', 'Zaria', 'Owerri', 'Uyo', 'Asaba'
  ];

  const currencies = [
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ha', name: 'Hausa' },
    { code: 'yo', name: 'Yoruba' },
    { code: 'ig', name: 'Igbo' }
  ];

  const handleEditSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile(editData);
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match');
      return;
    }
    if (passwordData.new.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    if (onChangePassword) {
      onChangePassword(passwordData.current, passwordData.new);
    }
    setPasswordData({ current: '', new: '', confirm: '' });
    setIsChangingPassword(false);
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUploadProfilePicture) {
      onUploadProfilePicture(file);
    }
  };

  const handleDeleteAccount = () => {
    if (onDeleteAccount) {
      onDeleteAccount();
    }
    setShowDeleteConfirm(false);
  };

  const getInitials = () => {
    return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-[#CBDCEB] p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Profile Picture */}
          <div className="relative">
            {userData.profilePicture ? (
              <img
                src={userData.profilePicture}
                alt={`${userData.firstName} ${userData.lastName}`}
                className="w-20 h-20 rounded-full object-cover border-4 border-[#CBDCEB]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#456882] text-white flex items-center justify-center text-2xl font-bold border-4 border-[#CBDCEB]">
                {getInitials()}
              </div>
            )}
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#1B3C53] text-white rounded-full flex items-center justify-center hover:bg-[#456882] transition-colors duration-200"
            >
              <Camera className="w-4 h-4" />
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
            />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1B3C53] mb-1">
              {userData.firstName} {userData.lastName}
            </h1>
            <p className="text-[#456882] mb-2">{userData.email}</p>
            <p className="text-sm text-[#456882]/70">
              Member since {new Date(userData.joinedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
              })}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1B3C53] text-white rounded-lg hover:bg-[#456882] transition-colors duration-200 font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
            <button
              onClick={() => setIsChangingPassword(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#CBDCEB] text-[#1B3C53] rounded-lg hover:bg-[#456882] hover:text-white transition-colors duration-200 font-medium"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Information */}
        <div className="bg-white rounded-lg border border-[#CBDCEB] p-6">
          <h2 className="text-xl font-bold text-[#1B3C53] mb-6 flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Information
          </h2>

          <div className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-[#456882] mb-2">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.firstName || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
                />
              ) : (
                <p className="text-[#1B3C53] font-medium">{userData.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-[#456882] mb-2">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.lastName || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
                />
              ) : (
                <p className="text-[#1B3C53] font-medium">{userData.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#456882] mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
                />
              ) : (
                <p className="text-[#1B3C53] font-medium">{userData.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#456882] mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number (Optional)
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+234 xxx xxx xxxx"
                  className="w-full px-3 py-2 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
                />
              ) : (
                <p className="text-[#1B3C53] font-medium">{userData.phone || 'Not provided'}</p>
              )}
            </div>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-[#CBDCEB]">
              <button
                onClick={handleEditSave}
                className="flex items-center gap-2 px-4 py-2 bg-[#1B3C53] text-white rounded-lg hover:bg-[#456882] transition-colors duration-200 font-medium"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={handleEditCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg border border-[#CBDCEB] p-6">
          <h2 className="text-xl font-bold text-[#1B3C53] mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Preferences
          </h2>

          <div className="space-y-4">
            {/* Default Location */}
            <div>
              <label className="block text-sm font-medium text-[#456882] mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Default Location
              </label>
              {isEditing ? (
                <select
                  value={`${editData.defaultLocation?.city}, ${editData.defaultLocation?.state}`}
                  onChange={(e) => {
                    const [city, state] = e.target.value.split(', ');
                    setEditData(prev => ({ 
                      ...prev, 
                      defaultLocation: { city, state }
                    }));
                  }}
                  className="w-full px-3 py-2 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
                >
                  {nigerianStates.map(state => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-[#1B3C53] font-medium">
                  {userData.defaultLocation.city}, {userData.defaultLocation.state}
                </p>
              )}
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-[#456882] mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Preferred Currency
              </label>
              {isEditing ? (
                <select
                  value={editData.currency || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-[#1B3C53] font-medium">
                  {currencies.find(c => c.code === userData.currency)?.name} ({userData.currency})
                </p>
              )}
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-[#456882] mb-2">Language</label>
              {isEditing ? (
                <select
                  value={editData.language || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
                >
                  {languages.map(language => (
                    <option key={language.code} value={language.code}>
                      {language.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-[#1B3C53] font-medium">
                  {languages.find(l => l.code === userData.language)?.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg border border-[#CBDCEB] p-6 mt-6">
        <h2 className="text-xl font-bold text-[#1B3C53] mb-6">Account Actions</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#456882] text-white rounded-lg hover:bg-[#1B3C53] transition-colors duration-200 font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
          >
            <Trash2 className="w-5 h-5" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-[#1B3C53] mb-4">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#456882] mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.current}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#456882]"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#456882] mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.new}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#456882]"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#456882] mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#456882]"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handlePasswordChange}
                className="flex-1 bg-[#1B3C53] text-white py-2 px-4 rounded-lg hover:bg-[#456882] transition-colors duration-200 font-medium"
              >
                Update Password
              </button>
              <button
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({ current: '', new: '', confirm: '' });
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-red-600 mb-4">Delete Account</h3>
            <p className="text-[#456882] mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
              >
                Yes, Delete Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
