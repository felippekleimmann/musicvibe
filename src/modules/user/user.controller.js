import * as userService from './user.service.js';

export const index = (req, res) => {
  return res.json({ module: 'user', message: 'Módulo user funcionando no MusicVibe' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userService.createUser({ name, email, password });
    return res.status(201).json({ message: 'Usuário criado com sucesso', user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { newRole } = req.body;
    const currentUser = req.user;

    const user = await userService.updateUserRole(currentUser, id, newRole);
    return res.json({ message: 'Perfil atualizado', user });
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
};
