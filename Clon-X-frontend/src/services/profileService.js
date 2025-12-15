const API_URL = import.meta.env.VITE_API_URL;

export async function editProfile(formData) {
  const token = localStorage.getItem("token");
  console.log("formData: ", formData)

  try {
    const response = await fetch(`${API_URL}/profile/edit`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, 
    });

    if (!response.ok) {
      throw new Error("Error updating profile");
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.log("Error: ", err);
    throw err;
  }
}


export async function uploadProfilePhoto(userId, file) {
  const formData = new FormData();
  formData.append("profilePhoto", file);

  const res = await fetch(`${API_URL}/profile/${userId}/photo`, {
    method: "PUT",
    body: formData,
  });

  const data = await res.json();
  return data.profile;
}
