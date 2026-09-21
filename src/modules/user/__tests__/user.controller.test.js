import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../app.js';
import * as userService from '../user.service.js';

vi.mock('../user.service.js', () => ({
  createUser: vi.fn(),
  getUserById: vi.fn(),
  updateUserRole: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /user', () => {
  it('deve retornar 200 e a mensagem do módulo', async () => {
    const response = await request(app).get('/user');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('module', 'user');
    expect(response.body).toHaveProperty('message');
  });

  it('deve retornar JSON como content-type', async () => {
    const response = await request(app).get('/user');

    expect(response.type).toMatch(/json/);
  });
});

describe('POST /user (register)', () => {
  it('deve criar usuário com dados válidos e retornar 201', async () => {
    const userData = {
      name: 'João Silva',
      email: 'joao@email.com',
      password: 'senha123',
    };

    userService.createUser.mockResolvedValue({
      id: 1,
      name: 'João Silva',
      email: 'joao@email.com',
      role: 'user',
    });

    const response = await request(app).post('/user').send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Usuário criado com sucesso');
    expect(response.body.user).toHaveProperty('id', 1);
    expect(userService.createUser).toHaveBeenCalledWith(userData);
  });

  it('deve retornar 400 quando falha validação', async () => {
    const userData = {
      name: 'João',
      email: 'email-invalido',
      password: 'senha123',
    };

    userService.createUser.mockRejectedValue(
      new Error('E-mail inválido')
    );

    const response = await request(app).post('/user').send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'E-mail inválido');
  });

  it('deve retornar 400 quando e-mail já está cadastrado', async () => {
    const userData = {
      name: 'Ana Silva',
      email: 'ana@email.com',
      password: 'senha123',
    };

    userService.createUser.mockRejectedValue(
      new Error('E-mail já cadastrado')
    );

    const response = await request(app).post('/user').send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'E-mail já cadastrado');
  });

  it('deve retornar 400 quando senha tem menos de 6 caracteres', async () => {
    const userData = {
      name: 'Maria',
      email: 'maria@email.com',
      password: '123',
    };

    userService.createUser.mockRejectedValue(
      new Error('Senha deve ter no mínimo 6 caracteres')
    );

    const response = await request(app).post('/user').send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Senha deve ter no mínimo 6 caracteres');
  });
});

describe('GET /user/:id', () => {
  it('deve retornar 200 e o usuário quando ID existe', async () => {
    const userId = 1;
    const userData = {
      id: 1,
      name: 'Pedro',
      email: 'pedro@email.com',
      role: 'user',
    };

    userService.getUserById.mockResolvedValue(userData);

    const response = await request(app).get(`/user/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(userData);
    expect(userService.getUserById).toHaveBeenCalledWith('1');
  });

  it('deve retornar 404 quando usuário não existe', async () => {
    const userId = 999;

    userService.getUserById.mockResolvedValue(null);

    const response = await request(app).get(`/user/${userId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Usuário não encontrado');
  });

  it('deve retornar 500 em caso de erro no servidor', async () => {
    const userId = 1;

    userService.getUserById.mockRejectedValue(
      new Error('Erro ao buscar usuário')
    );

    const response = await request(app).get(`/user/${userId}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});

describe('PUT /user/:id (updateRole)', () => {
  it('deve atualizar perfil e retornar 200 quando admin solicita', async () => {
    const userId = 2;
    const requestBody = { newRole: 'admin' };
    const currentUser = { id: 1, role: 'admin' };

    userService.updateUserRole.mockResolvedValue({
      id: 2,
      name: 'Lucas',
      email: 'lucas@email.com',
      role: 'admin',
    });

    const response = await request(app)
      .put(`/user/${userId}`)
      .send(requestBody)
      .set('Authorization', 'Bearer token');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Perfil atualizado');
    expect(response.body.user).toHaveProperty('role', 'admin');
  });

  it('deve retornar 403 quando usuário não é admin', async () => {
    const userId = 2;
    const requestBody = { newRole: 'admin' };

    userService.updateUserRole.mockRejectedValue(
      new Error('Apenas administradores podem alterar perfis')
    );

    const response = await request(app)
      .put(`/user/${userId}`)
      .send(requestBody);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error', 'Apenas administradores podem alterar perfis');
  });

  it('deve retornar 403 quando usuário alvo não existe', async () => {
    const userId = 999;
    const requestBody = { newRole: 'admin' };

    userService.updateUserRole.mockRejectedValue(
      new Error('Usuário não encontrado')
    );

    const response = await request(app)
      .put(`/user/${userId}`)
      .send(requestBody);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error');
  });
});
