export const validationSchema = {
  nome(value) {
    if (value?.length >= 3) return true;
    return "O nome do usuário é obligatorio o muy corto";
  },
  sobrenome(value) {
    if (value?.length >= 3) return true;
    return "O sobrenome do usuário é obligatorio o muy corto";
  },
  matricula(value) {
    /*
        ^ - Representa el inicio de la cadena.
        [0-9]+ - Representa cualquier número del 0 al 9. El + indica que debe haber al menos un dígito, pero puede haber más.
        $ - Representa el final de la cadena.
    */
    if (/^[0-9]+$/.test(value)) return true;
    return "A matricula só podem ser números";
  },
  curso(value) {
    if (value) return true;
    return "Seleccione um curso";
  },
  ambiente(value) {
    if (value) return true;
    return "Seleccione um ambiente";
  },
  descripcion(value) {
    if (value) return true;
    return "Agrega una Descripción";
  },
};

export const imageSchema = {
  imagen(value) {
    if (value) return true;
    return "La Imagen es Obligatoria";
  },
};
