import { X, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { editProfile } from "../services/profileService";

export default function EditProfileModal({ user, edit, onClose }) {
  console.log("user: ", user);
  console.log(user.profile?.user?.name);
  const [formData, setFormData] = useState({
    name: "",
    profilePhoto: "",
    biography: "",
    birth: "",
    location: "",
    banner: null, // importante
  });

  const [bannerPreview, setBannerPreview] = useState("");
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("");

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        name: `${user.profile?.user?.name ?? ""} ${
          user.profile?.lastName ?? ""
        }`,
        biography: user.profile?.biography ?? "",
        birth: user.profile?.birth ?? "",
        location: user.profile?.location ?? "",
        banner: user.profile?.banner ?? null,
      });

      setBannerPreview(user.profile?.banner ?? "");
    }
  }, [user]);

  function handleChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleProfilePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfilePhotoPreview(previewUrl);

    // guardamos el archivo para enviar luego
    handleChange("profilePhoto", file);
  }

  function handleBannerUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setBannerPreview(previewUrl);

    // guardamos el archivo para enviar luego
    handleChange("banner", file);
  }

  function handleRemoveBanner() {
    setBannerPreview("");
    handleChange("banner", null);
  }

  async function handleSave() {
    console.log("handleSave ejecutado");
    console.log("STATE:", formData);

    const fd = new FormData();

    console.log("banner value:", formData.banner);
    console.log(formData.banner instanceof File);

    if (formData.name.trim()) fd.append("name", formData.name);
    if (formData.profilePhoto instanceof File) {
      fd.append("profilePhoto", formData.profilePhoto);
    }
    if (formData.biography.trim()) fd.append("biography", formData.biography);
    if (formData.birth.trim()) fd.append("birth", formData.birth);
    if (formData.location.trim()) fd.append("location", formData.location);
    if (formData.banner instanceof File) {
      fd.append("banner", formData.banner);
    }

    console.log("FormData keys:", [...fd.keys()]);

    if ([...fd.keys()].length === 0) {
      onClose();
      return;
    }

    await editProfile(fd);
    onClose();
  }

  if (!edit) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative space-y-4">
        <div className="flex items-center justify-between">
          <div>
            {/* Botón cerrar */}
            <button
              className="p-2 rounded-full hover:bg-gray-200 transition"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-xl font-semibold">Edit Profile</h2>

          <div className="items-end">
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-black text-white rounded-full text-sm font-semibold hover:bg-black transition"
            >
              Save
            </button>
          </div>
        </div>

        <div className="relative">
          {/* BANNER */}
          <div className="relative w-full h-40 rounded-xl overflow-hidden">
            {bannerPreview ? (
              <img
                src={bannerPreview}
                alt="Profile banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}

            {/* Acciones banner */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/20">
              <label className="flex items-center justify-center cursor-pointer bg-black/20 w-12 h-12 rounded-full text-white shadow">
                <Camera />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerUpload}
                />
              </label>

              <button
                onClick={handleRemoveBanner}
                disabled={!bannerPreview}
                className="flex items-center justify-center w-12 h-12 bg-black/20 text-white rounded-full shadow"
              >
                <X />
              </button>
            </div>
          </div>

          {/* PROFILE PHOTO (SUPERPUESTA) */}
          <div className="absolute -bottom-10 left-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-gray-300">
              {profilePhotoPreview ? (
                <img
                  src={profilePhotoPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : null}

              {/* Acción avatar */}
              <label className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 cursor-pointer transition">
                <Camera className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePhotoUpload}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-12">
          <label className="font-medium mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border  border-gray-300 px-3 py-2 rounded mb-3"
          />

          <label className="font-medium mb-2">Biography</label>
          <textarea
            value={formData.biography}
            onChange={(e) => handleChange("biography", e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded mb-3"
          />

          <label className="font-medium mb-2">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded mb-3"
          />

          <label className="font-medium mb-2">Birth</label>
          <input
            type="text"
            value={formData.birth}
            onChange={(e) => handleChange("birth", e.target.value)}
            className="w-full border  border-gray-300 px-3 py-2 rounded mb-3"
          />
        </div>
      </div>
    </div>
  );
}
