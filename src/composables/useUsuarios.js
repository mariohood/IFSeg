import { collection } from "firebase/firestore";
import { useFirestore, useCollection } from "vuefire";

export default function useUsuarios() {
  const db = useFirestore();
  const usuariosCollection = useCollection(collection(db, "usuarios"));

  return {
    usuariosCollection,
  };
}
