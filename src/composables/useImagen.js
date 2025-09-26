import { computed } from "vue";
import { ref as storageRef } from "firebase/storage";
import { useFirebaseStorage, useStorageFile } from "vuefire";
import { uid } from "uid";

export default function useImagen() {
  const storage = useFirebaseStorage();
  const storageRefPath = storageRef(storage, `/usuarios/${uid()}`);

  const { url, upload } = useStorageFile(storageRefPath);

  function uploadImagen(e) {
    const data = e.target.files[0];
    if (data) {
      upload(data);
    }
  }
  const imagen = computed(() => {
    return url.value ? url.value : null;
  });

  return {
    url,
    uploadImagen,
    imagen,
  };
}
