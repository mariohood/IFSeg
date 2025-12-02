import { computed, ref } from "vue";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { useFirestore, useCollection, useFirebaseStorage } from "vuefire";

export default function useUsuarios() {
  const storage = useFirebaseStorage();
  const db = useFirestore();
  const usuariosCollection = useCollection(collection(db, "usuarios"));

  async function deleteUsuario(id, urlImage) {
    if (confirm("Deseja excluir este usuário?")) {
      const docRef = doc(db, "usuarios", id);
      const imageRef = storageRef(storage, urlImage);

      await Promise.all([deleteDoc(docRef), deleteObject(imageRef)]);
    }
  }

  return {
    usuariosCollection,
    deleteUsuario,
  };
}
