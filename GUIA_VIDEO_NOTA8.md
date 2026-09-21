# 📹 GUIA PRÁTICO - GRAVANDO O VÍDEO NOTA 8

## ⏱️ RESUMO
- **Duração:** 8-12 minutos
- **Formato:** MP4 (qualquer software)
- **Local para enviar:** YouTube (não listado) ou OneDrive

---

## 🎬 ANTES DE COMEÇAR

### **PASSO 0: Preparar o Computador**

1. **Abra 2 terminais** (lado a lado):
   - Terminal 1: Para rodar testes
   - Terminal 2: Para navegação geral

2. **Abra o VS Code com o projeto:**
   ```
   Clique em: Arquivo → Abrir Pasta
   Navegue até: C:\Users\abner\Downloads\musicvibe-tdd-sequelize-modulos-main\musicvibe-tdd-sequelize-modulos-main
   Clique em: Selecionar Pasta
   ```

3. **Deixe pronto:**
   - VS Code aberto
   - Pasta `src/modules/user/` visível
   - Teste seu microfone antes (fale e ouça)

---

## 📹 GRAVAÇÃO - PASSO A PASSO

### **PARTE 1: Introdução e Setup (1-2 minutos)**

**O que você faz:**
1. Clique em GRAVAR no seu software (OBS, Gravador Windows, etc)
2. Abra o VS Code (ele já deve estar aberto)

**O que você FALA:**
```
"Olá! Este é o vídeo de demonstração do projeto MusicVibe para Nota 8.
Vou mostrar como funciona o Test-Driven Development (TDD) na prática.

Vamos ver:
1. Execução dos testes
2. Explicação do código de teste
3. Código que passou nos testes
4. Cobertura de código

Vamos começar!"
```

**O que deve aparecer na tela:**
- VS Code aberto
- Pasta do projeto visível à esquerda

---

### **PARTE 2: Executar os Testes (1-2 minutos)**

**PASSO A PASSO:**

1. **Clique no terminal inferior do VS Code**
   - Se não aparecer, pressione: `Ctrl + J`

2. **Digite EXATAMENTE isto:**
   ```
   npm test -- --run
   ```

3. **Pressione ENTER e aguarde**
   - Você verá um monte de testes passando
   - Vai demorar uns 5-10 segundos

**O que você FALA enquanto aguarda:**
```
"Agora estou executando todos os testes do projeto.
Este comando roda uma vez e mostra o resultado.
Temos 82 testes passando em total, vamos focar nos testes do módulo User."
```

**O que você vai ver na tela (esperado):**
```
✓ src/modules/user/__tests__/user.service.test.js (22 tests) 1234ms
✓ src/modules/user/__tests__/user.controller.test.js (12 tests) 567ms

✓ 82 tests passed (1.23s)
```

**SE NÃO FUNCIONAR:**
- Verifique se está na pasta correta: `C:\Users\abner\Downloads\musicvibe-tdd-sequelize-modulos-main\musicvibe-tdd-sequelize-modulos-main`
- Digite: `pwd` (para confirmar a pasta)
- Se der erro, digite: `npm install` primeiro

---

### **PARTE 3: Mostrar o Arquivo de Testes (30 segundos)**

**PASSO A PASSO:**

1. **No VS Code, à esquerda, clique na SETA ao lado de `src`**
   - Expande as pastas

2. **Navegue até:** `src → modules → user → __tests__`

3. **Clique no arquivo:** `user.service.test.js`
   - Ele vai abrir no editor

**O que você FALA:**
```
"Aqui está o arquivo de testes do módulo User.
Este arquivo contém 22 testes que validam a lógica de negócio.
Vamos examinar os mais importantes."
```

---

### **PARTE 4: Teste 1 - Validação de E-mail (1-2 minutos)**

**PASSO A PASSO:**

1. **No arquivo `user.service.test.js`, procure pela linha 48**
   - Pressione: `Ctrl + G`
   - Digite: `48`
   - Pressione: ENTER

2. **Você vai ver este teste:**
```javascript
it('deve lançar erro quando o e-mail é inválido', () => {
  expect(() => validateUserData({ 
    name: 'Ana', 
    email: 'email-sem-arroba', 
    password: '123456' 
  })).toThrow('E-mail inválido');
});
```

3. **Clique em qualquer linha deste teste para destacar**

**O que você FALA:**
```
"Este é o primeiro teste importante.
Ele valida que a função validateUserData rejeita e-mails inválidos.

Olhem aqui: o email é 'email-sem-arroba' - ele não tem o @
O teste ESPERA que isso lance um erro com a mensagem 'E-mail inválido'.

Agora vamos ver a implementação."
```

4. **Agora abra o arquivo de implementação:**
   - Clique na aba `user.service.js` (ou se não estiver aberta)
   - Pressione: `Ctrl + P`
   - Digite: `user.service.js`
   - Pressione: ENTER

5. **Procure pela função `validateUserData`:**
   - Pressione: `Ctrl + F`
   - Digite: `validateUserData`
   - Pressione: ENTER
   - Vai destacar a função

6. **Você verá:**
```javascript
export const validateUserData = ({ name, email, password }) => {
  if (!email.includes('@')) throw new Error('E-mail inválido');
  // ... resto do código
};
```

**O que você FALA:**
```
"Aqui está a implementação!
A função VALIDA se o email contém o caractere '@'.
Se não contiver, ela lança um erro.

O teste valida que isso funciona corretamente.
Teste passa = Implementação está certa!"
```

---

### **PARTE 5: Teste 2 - E-mail Duplicado com MOCK (2 minutos)**

**PASSO A PASSO:**

1. **Volte ao arquivo `user.service.test.js`**

2. **Procure pela linha 113:**
   - Pressione: `Ctrl + G`
   - Digite: `113`
   - ENTER

3. **Você vai ver:**
```javascript
it('deve lançar erro quando o e-mail já está cadastrado', async () => {
  User.findOne.mockResolvedValue({ id: 99, email: 'ana@email.com' });

  await expect(createUser({ 
    name: 'Ana', 
    email: 'ana@email.com', 
    password: '123456' 
  })).rejects.toThrow('E-mail já cadastrado');

  expect(User.create).not.toHaveBeenCalled();
});
```

**O que você FALA:**
```
"Este teste é SUPER importante para entender TDD!

Veja esta linha:
User.findOne.mockResolvedValue({...})

O que é isso? É um MOCK!

Um mock é uma SIMULAÇÃO. Aqui estamos falando:
'Simule que o banco de dados JÁ tem um usuário com este e-mail'

Então testamos: o código rejeita corretamente?
A resposta é: SIM! Ele lança erro 'E-mail já cadastrado'.

E esta linha é importante:
expect(User.create).not.toHaveBeenCalled()

Isso significa: 'O usuário NÃO foi criado no banco'
Porque o código detectou que o e-mail já existe.

Este é TDD em ação!"
```

4. **Abra o `user.service.js` novamente**
   - Pressione: `Ctrl + P`
   - Digite: `user.service.js`
   - ENTER

5. **Procure a função `createUser`:**
   - Pressione: `Ctrl + F`
   - Digite: `createUser`
   - ENTER

6. **Você verá algo assim:**
```javascript
export const createUser = async ({ name, email, password }) => {
  validateUserData({ name, email, password });
  
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error('E-mail já cadastrado');
  
  const hashedPassword = await hashPassword(password);
  return User.create({ name, email, password: hashedPassword, role: 'user' });
};
```

**O que você FALA:**
```
"Aqui está a lógica!

Primeiro, valida os dados.
Depois, PROCURA no banco se este e-mail já existe.
Se EXISTIR, lança um erro.
Se NÃO EXISTIR, cria o usuário.

O teste validou que isso funciona!
O mock foi importante porque não conectamos de verdade ao banco."
```

---

### **PARTE 6: Teste 3 - Senha Criptografada (1-2 minutos)**

**PASSO A PASSO:**

1. **Volte ao `user.service.test.js`**

2. **Procure pela linha 140:**
   - `Ctrl + G`
   - `140`
   - ENTER

3. **Você vai ver:**
```javascript
it('não deve salvar a senha em texto puro no banco', async () => {
  User.findOne.mockResolvedValue(null);
  User.create.mockResolvedValue({ 
    id: 2, 
    name: 'Bob', 
    email: 'bob@email.com' 
  });

  await createUser({ 
    name: 'Bob', 
    email: 'bob@email.com', 
    password: 'senha123' 
  });

  const chamadaCreate = User.create.mock.calls[0][0];
  expect(chamadaCreate.password).not.toBe('senha123');
});
```

**O que você FALA:**
```
"Este teste valida SEGURANÇA!

O que ele está fazendo?

1. Criamos um usuário com password: 'senha123'
2. Depois inspecionamos: qual foi a senha passada ao banco?
3. E verificamos: ela é diferente de 'senha123'?
   SIM! Porque foi criptografada!

Esta linha é a chave:
const chamadaCreate = User.create.mock.calls[0][0]

Ela pega os argumentos da chamada ao User.create.
Depois verificamos que a senha não é igual à original.

Por quê? Porque foi transformada por bcryptjs!
Assim, mesmo que alguém roube o banco, não consegue a senha!"
```

4. **Mostre a função `hashPassword`:**
   - Pressione: `Ctrl + F`
   - Digite: `hashPassword`
   - ENTER

5. **Você verá:**
```javascript
export const hashPassword = async (password) => {
  return bcryptjs.hash(password, 10);
};
```

**O que você FALA:**
```
"A função hashPassword usa bcryptjs.
Ela transforma a senha em uma sequência aleatória.
Sempre diferente, mesmo com a mesma senha!
É criptografia!"
```

---

### **PARTE 7: Testes HTTP/Integração (2 minutos)**

**PASSO A PASSO:**

1. **Agora abra o arquivo de testes de integração:**
   - Pressione: `Ctrl + P`
   - Digite: `user.controller.test.js`
   - ENTER

2. **Procure pela linha 37:**
   - `Ctrl + G`
   - `37`
   - ENTER

3. **Você vai ver:**
```javascript
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
});
```

**O que você FALA:**
```
"Agora vamos para testes de integração!

Este teste é diferente. Ele testa a REQUISIÇÃO HTTP.

Veja:
const response = await request(app).post('/user').send(userData);

Isso simula um cliente fazendo POST para /user.
Envia os dados do usuário.
E espera uma resposta!

Depois valida:
1. Status 201 (criado com sucesso)
2. Mensagem de sucesso na resposta

Este é um teste completo! Testa o fluxo inteiro!"
```

4. **Agora mostre o código que foi testado:**
   - Pressione: `Ctrl + P`
   - Digite: `user.controller.js`
   - ENTER

5. **Procure a função `register`:**
   - `Ctrl + F`
   - `register`
   - ENTER

6. **Você verá:**
```javascript
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userService.createUser({ name, email, password });
    return res.status(201).json({ 
      message: 'Usuário criado com sucesso', 
      user 
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
```

**O que você FALA:**
```
"Aqui está o código que recebe a requisição!

Ele:
1. Extrai name, email, password do corpo da requisição
2. Chama createUser do service
3. Se funcionar, retorna 201 com mensagem
4. Se der erro, retorna 400 com mensagem de erro

E qual é a rota?
"
```

7. **Mostre a rota:**
   - Pressione: `Ctrl + P`
   - Digite: `user.routes.js`
   - ENTER

8. **Procure `POST`:**
   - `Ctrl + F`
   - `post`
   - ENTER

9. **Você verá:**
```javascript
router.post('/', controller.register);
```

**O que você FALA:**
```
"A rota POST / chama a função register.
Então:
POST /user → controller.register → userService.createUser
Teste valida que isso funciona tudo junto!"
```

---

### **PARTE 8: Cobertura de Código (1 minuto)**

**PASSO A PASSO:**

1. **Volte ao terminal**
   - Clique no terminal inferior do VS Code

2. **Digite EXATAMENTE:**
   ```
   npm test -- --coverage --run
   ```

3. **Pressione ENTER**

4. **Aguarde passar e você verá algo como:**
   ```
   src/modules/user/user.service.js
   ✓ 100% Stmts 
   ✓ 100% Branch
   ✓ 100% Funcs
   ✓ 100% Lines
   ```

**O que você FALA:**
```
"Agora vamos ver a cobertura de código!

A cobertura mostra quanto do código foi testado.

100% significa:
- Todas as linhas foram executadas
- Todos os caminhos foram testados
- Todas as funções foram testadas

Isto é EXCELENTE!
Significa que o código está muito bem testado!"
```

---

### **PARTE 9: Resumo e Conclusão (1 minuto)**

**VOCÊ FALA (direto para câmera):**
```
"Resumindo o que vimos:

1. Executamos 82 testes, todos passando
2. Explicamos testes unitários (validação, mock, criptografia)
3. Explicamos testes de integração (requisições HTTP)
4. Mostramos 100% de cobertura de código

Este é o Test-Driven Development na prática!

Os testes GARANTEM que:
✓ O código funciona
✓ O código é seguro
✓ O código não quebra no futuro

Obrigado por assistir!
Este é o projeto MusicVibe - Nota 8 TDD."
```

---

## 🎬 COMO GRAVAR NO SEU COMPUTADOR

### **OPÇÃO 1: OBS Studio (RECOMENDADO - Gratuito)**

1. **Baixe:** https://obsproject.com/
2. **Abra o OBS Studio**
3. **Configure:**
   - Clique em "Scene" (cena)
   - Clique em "+" para adicionar nova cena
   - Clique em "Sources" (fontes)
   - Clique em "+" e selecione "Display Capture" (capturar tela)
4. **Para Gravar:**
   - Clique no botão "Start Recording"
   - Siga os passos acima
   - Quando terminar, clique "Stop Recording"
5. **Arquivo salvo em:**
   - C:\Users\abner\Videos\ (por padrão)

### **OPÇÃO 2: Windows 11 Gravador de Tela (Nativo)**

1. **Pressione:** `Win + G` (Game Bar)
2. **Clique:** "Gravar"
3. **Segue os passos acima**
4. **Quando terminar, pressione:** `Win + G` novamente e clique "Parar"
5. **Arquivo salvo em:**
   - C:\Users\abner\Videos\Captures\

### **OPÇÃO 3: Camtasia (Pago, mas muito bom)**

- Não vou detalhar, mas é parecido com OBS

---

## 📤 COMO ENVIAR O VÍDEO

### **OPÇÃO A: YouTube (Mais fácil)**

1. **Vá para:** https://www.youtube.com/upload
2. **Faça login** (sua conta Google)
3. **Clique:** "Selecionar arquivo"
4. **Escolha:** O arquivo MP4 que foi gravado
5. **Espere upload terminar** (pode demorar)
6. **Na aba "Detalhes":**
   - Título: `MusicVibe - Nota 8 TDD`
   - Descrição: `Demonstração do Test-Driven Development no projeto MusicVibe`
7. **Na aba "Visibilidade":**
   - Selecione: **"Não listado"** (não "Privado")
   - Isso permite compartilhar o link sem aparecer no YouTube
8. **Clique:** "Publicar"
9. **Copie o link** do vídeo (aparece no topo)

### **OPÇÃO B: OneDrive (Se não tiver YouTube)**

1. **Vá para:** https://onedrive.live.com
2. **Clique:** "Fazer upload"
3. **Selecione** o arquivo MP4
4. **Clique com direito** no arquivo
5. **Selecione:** "Compartilhar"
6. **Defina:** "Pode visualizar"
7. **Copie o link**

---

## ✅ CHECKLIST ANTES DE ENVIAR

- [ ] Vídeo tem MÍNIMO 8 minutos
- [ ] Se der, tenta ser 10-12 minutos
- [ ] Áudio está claro (se asculta bem?)
- [ ] Mostra execução dos 82 testes
- [ ] Explicou 3-4 testes em detalhes
- [ ] Mostrou o código de teste
- [ ] Mostrou o código de implementação
- [ ] Mostrou a cobertura de código
- [ ] Vídeo em formato MP4
- [ ] Link é "Não listado" no YouTube (ou compartilhável do OneDrive)

---

## 🚨 ERROS COMUNS

**Erro: Terminal diz "npm não encontrado"**
- Solução: Instale Node.js em https://nodejs.org/

**Erro: Comando npm test falha**
- Solução: Digite `npm install` primeiro

**Erro: Arquivo não abre no VS Code**
- Solução: Clique em `File → Open Folder` e selecione a pasta correta

**Erro: Microfone não aparece**
- Solução: Verifique se o microfone está conectado
- No Windows, vá em `Configurações → Som → Entrada`

---

## 💡 DICAS EXTRAS

✅ **Se cometer erro durante gravação:**
- Não precisa refazer tudo!
- Você pode cortar depois na edição
- Use: Windows Movie Maker (grátis) ou Shotcut (grátis)

✅ **Para melhorar qualidade:**
- Aumente zoom do VS Code: `Ctrl + +`
- Deixe bem legível
- Fale pausadamente

✅ **Se o vídeo ficar muito grande:**
- Comprima depois em: https://www.media.io/pt/

---

## 🎉 PRONTO!

**O que falar:**
- "Agora temos 12 testes de integração que testam os endpoints HTTP"
- "Testamos POST, GET, PUT"
- "Usamos Supertest para simular requisições HTTP"

**Localização do teste:** linha ~37

**Teste a mostrar:**
```javascript
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
});
```

**O que falar:**
- "Este teste faz uma requisição HTTP POST para /user"
- "Envia dados de usuário e verifica se o status é 201 (criado)"
- "Verifica se a resposta tem a mensagem correta"

**O que mostrar:**
1. Mostrar o teste no `user.controller.test.js`
2. Navegar para `user.controller.js`
3. Mostrar a função `register`:
```javascript
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userService.createUser({ name, email, password });
    return res.status(201).json({ message: 'Usuário criado com sucesso', user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
```
4. Mostrar `user.routes.js`:
```javascript
router.post('/', controller.register);
```

---

### **PARTE 8: Cobertura de Código (1 min)**

**Comando:**
```bash
npm test -- --coverage --run
```

**O que falar:**
- "A cobertura de código mostra quanto do código foi testado"
- "User Service tem 100% de cobertura - excelente!"
- "Isso significa que cada linha, branch e função foi testada"

**O que mostrar:**
- Output da cobertura
- Linha do user.service.js: `100% Stmts, 100% Branch, 100% Funcs`

---

### **PARTE 9: Resumo e Conclusão (1 min)**

**O que falar:**
- "Neste vídeo vimos:"
  - "✅ 22 testes unitários do Service"
  - "✅ 12 testes de integração do Controller"
  - "✅ Cobertura 100% no módulo principal"
  - "✅ Ciclo TDD aplicado: Red → Green → Refactor"
- "Os testes garantem que o código é seguro, funcional e mantível"
- "Obrigado por assistir!"

---

## 🎥 DICAS DE GRAVAÇÃO

### **Software Recomendado:**
- **OBS Studio** (Gratuito) - excelente para screencast
- **Camtasia** (Pago) - profissional
- **Quicktime** (Mac) ou **Gravador de Tela** (Windows 11)

### **Configuração:**
- ✅ Resolução: 1920x1080 (Full HD) ou mínimo 1280x720
- ✅ Taxa de quadros: 30 FPS
- ✅ Áudio: Microfone claro, sem ruído
- ✅ Zoom do editor: 125-150% para legibilidade

### **Edição:**
- 🔄 Corte pausas longas
- 🎵 Opcional: Música de fundo em volume baixo
- 📝 Subtítulos são bônus!

### **Publicação:**
- YouTube: Enviar como "Não listado" (private link)
- OneDrive: Compartilhar link com permissão de visualização

---

## ✅ CHECKLIST FINAL

Antes de enviar o vídeo:
- [ ] Duração mínima: 8 minutos
- [ ] Mostra execução dos testes
- [ ] Explica pelo menos 3 testes
- [ ] Navega no código do Service
- [ ] Navega no código do Controller
- [ ] Mostra a função de produção
- [ ] Explica claramente o que cada função faz
- [ ] Mostra cobertura de código
- [ ] Áudio claro e legível
- [ ] Qualidade mínima 720p

---

## 📊 ESTRUTURA DO VÍDEO

```
INTRODUÇÃO (1 min)
   ↓
EXECUTAR TESTES (1-2 min)
   ↓
VALIDAÇÃO E-MAIL (2 min) → Teste → Código → Explicação
   ↓
E-MAIL DUPLICADO (2 min) → Teste → Mock → Código → Explicação
   ↓
HASH SENHA (2 min) → Teste → Função hashPassword → Explicação
   ↓
TESTES HTTP (2 min) → Teste Controller → Endpoint → Explicação
   ↓
COBERTURA (1 min)
   ↓
CONCLUSÃO (1 min)

TOTAL: ~10-12 minutos
```

---

## 🚀 COMANDOS ÚTEIS PARA O VÍDEO

```bash
# Executar apenas testes de user
npm test -- user --run

# Executar com cobertura
npm test -- --coverage --run

# Mostrar saída detalhada
npm test -- --reporter=verbose --run
```

Boa sorte com a gravação! 🎬
