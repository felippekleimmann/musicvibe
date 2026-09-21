import bcrypt from 'bcryptjs';
import { User } from '../../models/User.js';

export const validateUserData = ({ name, email, password }) => {
  if (!name) throw new Error('Nome é obrigatório');
  if (!email) throw new Error('E-mail é obrigatório');
  if (!email.includes('@')) throw new Error('E-mail inválido');
  if (!password || password.length < 6) throw new Error('Senha deve ter no mínimo 6 caracteres');
  return true;
};

export const hashPassword = async (password) => bcrypt.hash(password, 10);

export const canManageUsers = (user) => user?.role === 'admin';

export const createUser = async ({ name, email, password }) => {
  validateUserData({ name, email, password });

  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error('E-mail já cadastrado');

  const hashedPassword = await hashPassword(password);
  return User.create({ name, email, password: hashedPassword, role: 'user' });
};

export const getUserByEmail = async (email) => {
  if (!email) throw new Error('E-mail é obrigatório');
  return User.findOne({ where: { email } });
};

export const getUserById = async (id) => {
  if (!id) throw new Error('ID é obrigatório');
  return User.findByPk(id);
};

export const updateUserRole = async (requestingUser, userId, newRole) => {
  if (!canManageUsers(requestingUser)) throw new Error('Apenas administradores podem alterar perfis');

  const user = await User.findByPk(userId);
  if (!user) throw new Error('Usuário não encontrado');

  return user.update({ role: newRole });
};
