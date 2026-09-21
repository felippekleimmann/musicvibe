import bcrypt from 'bcryptjs';
export const validateLoginData = ({ email, password }) => { if (!email) throw new Error('E-mail é obrigatório'); if (!password) throw new Error('Senha é obrigatória'); return true; };
export const comparePassword = async (password, hash) => bcrypt.compare(password, hash);
export const canAccessProtectedRoute = (session) => Boolean(session?.user);
export const canAccessAdminRoute = (session) => session?.user?.role === 'admin';
