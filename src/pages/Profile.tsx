import React from 'react'
import { UserProfile } from '../components/UserProfile'
import { dummyUserData } from '../helper/DummyUserData'

const Profile = () => {
  return (
    <UserProfile
      userData={dummyUserData}
      onUpdateProfile={(data) => console.log('Update profile:', data)}
      onChangePassword={(current , newPass) => console.log('Change password')}
      onLogout={() => console.log('Logout')}
      onDeleteAccount={() => console.log('Delete account')}
      onUploadProfilePicture={(file) => console.log('Upload profile picture:', file.name)}
    />
  )
}

export default Profile