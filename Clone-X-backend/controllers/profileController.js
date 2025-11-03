import prisma from "../prisma";


export async function updateProfile(req, res) {
  const { userId } = req.params;
  const {
    name,
    lastName,
    birth,
    banner,
    profilePhoto,
    biography,
    location,
  } = req.body;

  try {
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: Number(userId) },
    });

    if (!existingProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId: Number(userId) },
      data: {
        name,
        lastName,
        birth: birth ? new Date(birth) : undefined,
        banner,
        profilePhoto,
        biography,
        location,
      },
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
