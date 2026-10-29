/** Plugin de Mongoose: expone `id` en lugar de `_id` y oculta campos internos al enviar JSON. */
export const limpiarJSON = (esquema) => {
  esquema.set('toJSON', {
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = String(ret._id);
      delete ret._id;
      delete ret.hashContrasena;
      return ret;
    },
  });
};
