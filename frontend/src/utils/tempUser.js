export function getTempUserId() {
  /*
  -------------------------
  CHECK EXISTING USER
  -------------------------
  */

  const existingUser = localStorage.getItem("temp_user_id");

  if (existingUser) {
    return existingUser;
  }

  /*
  -------------------------
  CREATE NEW TEMP USER
  -------------------------
  */

  const newUserId = `temp_user_${crypto.randomUUID()}`;

  localStorage.setItem("temp_user_id", newUserId);

  return newUserId;
}
