export const index = (req, res) => {
  return res.json({ module: 'health', message: 'Módulo health funcionando no MusicVibe' });
};
