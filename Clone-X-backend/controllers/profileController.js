const prisma = require("../prisma");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

async function getProfile(req, res) {
  const { userId } = req.params;
  const id = Number(userId);

  try {
    const profile = await prisma.profile.findFirst({
      where: { userId: id },
      include: { user: true },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({ profile });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateProfile(req, res) {
  console.log("🧾 req.body:", req.body);
  console.log("📂 req.files:", req.files);

  console.log("📂 req.files:", req.files);

  // Para banner:
  const bannerFile = req.files?.banner?.[0];

  // Para profilePhoto:
  const profilePhotoFile = req.files?.profilePhoto?.[0];

  try {
    const userId = req.user.id;

    // 1️⃣ Separar datos
    const { name, ...profileData } = req.body;

    // 2️⃣ Parseo de fecha
    if (profileData.birth) {
      profileData.birth = new Date(profileData.birth);
    }

    // 3️⃣ Subida de banner a Cloudinary (si hay archivo)

    if (bannerFile) {
      const result = await uploadToCloudinary(
        bannerFile.buffer,
        "Clone X/banners"
      );
      profileData.banner = result.secure_url;
    }

    if (profilePhotoFile) {
      const result = await uploadToCloudinary(
        profilePhotoFile.buffer,
        "Clone X/profilePhotos"
      );
      profileData.profilePhoto = result.secure_url;
    }

    // 4️⃣ Actualizar USER (tabla users)
    if (name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
    }

    // 5️⃣ Actualizar PROFILE (tabla profiles)
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: profileData,
    });

    // 6️⃣ Respuesta
    res.json(updatedProfile);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  updateProfile,
  getProfile,
};
