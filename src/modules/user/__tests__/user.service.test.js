import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validateUserData,
  hashPassword,
  canManageUsers,
  createUser,
  getUserByEmail,
  getUserById,
  updateUserRole,
} from '../user.service.js';

vi.mock('../../../models/User.js', () => ({
  User: {
    findOne: vi.fn(),
    create: vi.fn(),
    findByPk: vi.fn(),
    rawAttributes: {
      name: { type: 'STRING' },
      email: { type: 'STRING' },
      password: { type: 'STRING' },
      role: { type: 'STRING' },
    },
  },
}));

import { User } from '../../../models/User.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('validateUserData', () => {
  it('deve retornar true para dados válidos', () => {
    const result = validateUserData({ name: 'Ana', email: 'ana@email.com', password: '123456' });
    expect(result).toBe(true);
  });

  it('deve lançar erro quando o nome está ausente', () => {
    expect(() => validateUserData({ name: '', email: 'ana@email.com', password: '123456' }))
      .toThrow('Nome é obrigatório');
  });

  it('deve lançar erro quando o e-mail é inválido', () => {
    expect(() => validateUserData({ name: 'Ana', email: 'email-sem-arroba', password: '123456' }))
      .toThrow('E-mail inválido');
  });

  it('deve lançar erro quando a senha tem menos de 6 caracteres', () => {
    expect(() => validateUserData({ name: 'Ana', email: 'ana@email.com', password: '123' }))
      .toThrow('Senha deve ter no mínimo 6 caracteres');
  });

  it('deve lançar erro quando o e-mail está ausente', () => {
    expect(() => validateUserData({ name: 'Ana', email: '', password: '123456' }))
      .toThrow('E-mail é obrigatório');
  });
});

describe('hashPassword', () => {
  it('deve retornar um hash diferente da senha original', async () => {
    const hash = await hashPassword('minhasenha');
    expect(hash).not.toBe('minhasenha');
    expect(hash).toHaveProperty('length');
  });

  it('deve gerar hashes diferentes para a mesma senha (salt aleatório)', async () => {
    const hash1 = await hashPassword('mesmasenha');
    const hash2 = await hashPassword('mesmasenha');
    expect(hash1).not.toBe(hash2);
  });
});

describe('canManageUsers', () => {
  it('deve retornar true para usuário admin', () => {
    expect(canManageUsers({ role: 'admin' })).toBe(true);
  });

  it('deve retornar false para usuário comum', () => {
    expect(canManageUsers({ role: 'user' })).toBe(false);
  });

  it('deve retornar false quando não há usuário (null)', () => {
    expect(canManageUsers(null)).toBe(false);
  });
});

describe('createUser', () => {
  it('deve criar o usuário quando os dados são válidos e o e-mail é único', async () => {

    User.findOne.mockResolvedValue(null);

    User.create.mockResolvedValue({ id: 1, name: 'Ana', email: 'ana@email.com', role: 'user' });

    const result = await createUser({ name: 'Ana', email: 'ana@email.com', password: '123456' });

    expect(User.findOne).toHaveBeenCalledOnce();
    expect(User.create).toHaveBeenCalledOnce();
    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('role', 'user');
  });

  it('deve lançar erro quando o e-mail já está cadastrado', async () => {

    User.findOne.mockResolvedValue({ id: 99, email: 'ana@email.com' });

    await expect(createUser({ name: 'Ana', email: 'ana@email.com', password: '123456' }))
      .rejects.toThrow('E-mail já cadastrado');

    expect(User.create).not.toHaveBeenCalled();
  });

  it('não deve salvar a senha em texto puro no banco', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: 2, name: 'Bob', email: 'bob@email.com' });

    await createUser({ name: 'Bob', email: 'bob@email.com', password: 'senha123' });

    const chamadaCreate = User.create.mock.calls[0][0];
    expect(chamadaCreate.password).not.toBe('senha123');
  });
});

describe('getUserByEmail', () => {
  it('deve retornar o usuário quando o e-mail existe', async () => {
    User.findOne.mockResolvedValue({ id: 1, email: 'ana@email.com', name: 'Ana' });

    const result = await getUserByEmail('ana@email.com');

    expect(User.findOne).toHaveBeenCalledOnce();
    expect(result).toHaveProperty('email', 'ana@email.com');
  });

  it('deve retornar null quando o e-mail não existe', async () => {
    User.findOne.mockResolvedValue(null);

    const result = await getUserByEmail('naoexiste@email.com');

    expect(result).toBeNull();
  });

  it('deve lançar erro quando nenhum e-mail é informado', async () => {
    await expect(getUserByEmail('')).rejects.toThrow('E-mail é obrigatório');
    expect(User.findOne).not.toHaveBeenCalled();
  });
});

describe('getUserById', () => {
  it('deve retornar o usuário quando o ID existe', async () => {
    User.findByPk.mockResolvedValue({ id: 1, name: 'Ana', email: 'ana@email.com' });

    const result = await getUserById(1);

    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(result).toHaveProperty('id', 1);
  });

  it('deve retornar null quando o ID não existe', async () => {
    User.findByPk.mockResolvedValue(null);

    const result = await getUserById(999);

    expect(result).toBeNull();
  });

  it('deve lançar erro quando nenhum ID é informado', async () => {
    await expect(getUserById(null)).rejects.toThrow('ID é obrigatório');
    expect(User.findByPk).not.toHaveBeenCalled();
  });
});

describe('updateUserRole', () => {
  it('deve atualizar o perfil quando o solicitante é admin', async () => {
    const mockUpdate = vi.fn().mockResolvedValue({ id: 5, role: 'admin' });
    User.findByPk.mockResolvedValue({ id: 5, role: 'user', update: mockUpdate });

    const result = await updateUserRole({ role: 'admin' }, 5, 'admin');

    expect(User.findByPk).toHaveBeenCalledWith(5);
    expect(mockUpdate).toHaveBeenCalledWith({ role: 'admin' });
    expect(result).toHaveProperty('role', 'admin');
  });

  it('deve lançar erro quando o solicitante não é admin', async () => {
    await expect(updateUserRole({ role: 'user' }, 5, 'admin'))
      .rejects.toThrow('Apenas administradores podem alterar perfis');

    expect(User.findByPk).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando o usuário alvo não existe', async () => {
    User.findByPk.mockResolvedValue(null);

    await expect(updateUserRole({ role: 'admin' }, 999, 'admin'))
      .rejects.toThrow('Usuário não encontrado');
  });
});
