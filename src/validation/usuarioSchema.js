export const validationSchema = {
  nome(value) {
    if (value?.length >= 3) return true;
    return "O nome do usuário é obligatorio o muito curto";
  },
  sobrenome(value) {
    if (value?.length >= 3) return true;
    return "O sobrenome do usuário é obligatorio o muito curto";
  },
  matricula(value) {
    /*
        ^ - Representa o inicio da cadena.
        [0-9]+ - Representa cualquier número del 0 al 9. El + indica que debe haber al menos un dígito, pero puede haber más.
        $ - Representa o final da cadena.
    */
    if (/^[0-9]+$/.test(value)) return true;
    return "A matricula só podem ser números";
  },
  curso(value) {
    if (value) return true;
    return "Selecione um curso";
  },
  ambiente(value) {
    if (value) return true;
    return "Selecione um ambiente";
  },
  descricao(value) {
    if (value) return true;
    return "Agrega uma descrição";
  },
};

export const imageSchema = {
  imagen(value) {
    if (value) return true;
    return "A imagen é obrigatoria";
  },
};
