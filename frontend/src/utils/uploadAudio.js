import { supabase } from "@/lib/supabase";

export async function uploadAudio(audioBlob, userId, chatId, messageId) {
  /*
  -------------------------
  FILE PATH
  -------------------------
  */

  const filePath = `${userId}/${chatId}/${messageId}.webm`;

  /*
  -------------------------
  UPLOAD
  -------------------------
  */

  const { error } = await supabase.storage
    .from("audio-files")
    .upload(filePath, audioBlob, {
      contentType: "audio/webm",
    });

  if (error) {
    console.error(error);
    return null;
  }

  return filePath;
}
