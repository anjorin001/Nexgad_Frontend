import { UserProfile } from "../components/UserProfile";
import { dummyUserData } from "../helper/DummyUserData";

const Profile = () => {
  return (
    <div className=" bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      {" "}
      <UserProfile
        userData={dummyUserData}
        onUpdateProfile={(data) => console.log("Update profile:", data)}
        onChangePassword={(current, newPass) => console.log("Change password")}
        onLogout={() => console.log("Logout")}
        onDeleteAccount={() => console.log("Delete account")}
        onUploadProfilePicture={(file) =>
          console.log("Upload profile picture:", file.name)
        }
      />
    </div>
  );
};

export default Profile;
