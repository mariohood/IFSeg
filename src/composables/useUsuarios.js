import { computed, ref } from "vue";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { useFirestore, useCollection } from "vuefire";

export default function useUsuarios() {
  const db = useFirestore();
  const usuariosCollection = useCollection(collection(db, "usuarios"));

  async function deleteUsuario(id) {
    const docRef = doc(db, "usuarios", id);
    console.log(id);
  }
  return {
    usuariosCollection,
    deleteUsuario,
  };
}
