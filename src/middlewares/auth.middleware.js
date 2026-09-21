export const isAuthenticated = (req, res, next) => {
  if (!req.session?.user) return res.status(401).json({ error: 'Usuário não autenticado' });
  next();
};
export const isAdmin = (req, res, next) => {
  if (req.session?.user?.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' });
  next();
};
