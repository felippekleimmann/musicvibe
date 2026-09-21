# 🎯 RESUMO RÁPIDO - NOTA 9

## 📊 O QUE VOCÊ TEM AGORA
```
✅ NOTA 8: 82 testes + vídeo
```

## 📊 O QUE PRECISA PARA NOTA 9
```
✅ TUDO de Nota 8
+ 15 testes de ALBUM (novo)
+ 15 testes de ARTIST (novo)  
+ 8+ testes de API com Postman (novo)
+ Vídeo Nota 9 (novo)
```

---

## 🚀 PLANO RÁPIDO (3 HORAS)

### **BLOCO 1: Testes Album (45 min)**
1. Abra: `src/modules/album/album.service.js`
2. Crie: `src/modules/album/__tests__/album.service.test.js`
3. Copie o template de 15 testes do `GUIA_NOTA9.md`
4. Rode: `npm test -- --run`
5. Todos passando? ✅ Próximo bloco!

### **BLOCO 2: Testes Artist (45 min)**
1. Abra: `src/modules/artist/artist.service.js`
2. Crie: `src/modules/artist/__tests__/artist.service.test.js`
3. Copie o template e adapte para Artist
4. Rode: `npm test -- --run`
5. Todos passando? ✅ Próximo bloco!

### **BLOCO 3: Postman + Testes de API (45 min)**
1. Instale: https://www.postman.com/downloads/
2. Teste 8 endpoints (POST, GET, PUT, DELETE)
3. Salve as requisições no Postman
4. Crie: `API_TESTS.md` com documentação

### **BLOCO 4: Vídeo Nota 9 (60 min)**
1. Grav 8-10 minutos mostrando:
   - Testes do Album rodando
   - Testes do Artist rodando
   - Requisições API no Postman
2. Edite e publique no YouTube/OneDrive

### **BLOCO 5: Documentação (15 min)**
1. Atualize RELATORIO.md
2. Crie COBERTURA_FINAL.md

---

## 📋 TEMPLATE DOS TESTES

**Copie isso para album.service.test.js:**

```javascript
import { describe, it, expect, vi } from 'vitest';
import * as albumService from '../album.service.js';
import Album from '../../../models/Album.js';

vi.mock('../../../models/Album.js');

describe('Album Service', () => {
  describe('getAllAlbums', () => {
    it('deve retornar lista de álbuns', async () => {
      const albums = [
        { id: 1, name: 'Album 1', artistId: 1 },
        { id: 2, name: 'Album 2', artistId: 2 }
      ];
      Album.findAll.mockResolvedValue(albums);
      const result = await albumService.getAllAlbums();
      expect(result).toEqual(albums);
    });

    it('deve retornar array vazio quando não há álbuns', async () => {
      Album.findAll.mockResolvedValue([]);
      const result = await albumService.getAllAlbums();
      expect(result).toEqual([]);
    });

    it('deve lançar erro se o banco falhar', async () => {
      Album.findAll.mockRejectedValue(new Error('DB Error'));
      await expect(albumService.getAllAlbums()).rejects.toThrow('DB Error');
    });
  });

  describe('getAlbumById', () => {
    it('deve retornar álbum por ID', async () => {
      const album = { id: 1, name: 'Album Test', artistId: 1 };
      Album.findByPk.mockResolvedValue(album);
      const result = await albumService.getAlbumById(1);
      expect(result).toEqual(album);
    });

    it('deve lançar erro se ID não é fornecido', async () => {
      await expect(albumService.getAlbumById()).rejects.toThrow('ID é obrigatório');
    });

    it('deve retornar null se álbum não existe', async () => {
      Album.findByPk.mockResolvedValue(null);
      const result = await albumService.getAlbumById(999);
      expect(result).toBeNull();
    });
  });

  describe('createAlbum', () => {
    it('deve criar álbum com dados válidos', async () => {
      const newAlbum = { name: 'Novo Album', artistId: 1 };
      const created = { id: 3, ...newAlbum };
      Album.create.mockResolvedValue(created);
      const result = await albumService.createAlbum(newAlbum);
      expect(result).toEqual(created);
    });

    it('deve lançar erro se nome não é fornecido', async () => {
      await expect(albumService.createAlbum({ artistId: 1 }))
        .rejects.toThrow('Nome é obrigatório');
    });

    it('deve lançar erro se artistId não é fornecido', async () => {
      await expect(albumService.createAlbum({ name: 'Album' }))
        .rejects.toThrow('artistId é obrigatório');
    });
  });

  describe('updateAlbum', () => {
    it('deve atualizar álbum existente', async () => {
      Album.findByPk.mockResolvedValue({ id: 1, name: 'Old Name' });
      Album.update.mockResolvedValue([1]);
      await albumService.updateAlbum(1, { name: 'New Name' });
      expect(Album.update).toHaveBeenCalled();
    });

    it('deve lançar erro se álbum não existe', async () => {
      Album.findByPk.mockResolvedValue(null);
      await expect(albumService.updateAlbum(999, { name: 'Test' }))
        .rejects.toThrow('Álbum não encontrado');
    });

    it('deve lançar erro se ID não é fornecido', async () => {
      await expect(albumService.updateAlbum(null, { name: 'Test' }))
        .rejects.toThrow('ID é obrigatório');
    });
  });

  describe('deleteAlbum', () => {
    it('deve deletar álbum existente', async () => {
      Album.findByPk.mockResolvedValue({ id: 1 });
      Album.destroy.mockResolvedValue(1);
      await albumService.deleteAlbum(1);
      expect(Album.destroy).toHaveBeenCalled();
    });

    it('deve lançar erro se álbum não existe', async () => {
      Album.findByPk.mockResolvedValue(null);
      await expect(albumService.deleteAlbum(999))
        .rejects.toThrow('Álbum não encontrado');
    });

    it('deve lançar erro se ID não é fornecido', async () => {
      await expect(albumService.deleteAlbum())
        .rejects.toThrow('ID é obrigatório');
    });
  });
});
```

**Para Artist:** Copie o mesmo padrão e substitua "Album" por "Artist"

---

## 🔗 TESTES COM POSTMAN (Resumo)

**Método 1: Criar usuário**
```
POST http://localhost:3000/user
Body (JSON):
{
  "name": "Ana",
  "email": "ana@email.com",
  "password": "senha123"
}
```

**Método 2: Buscar usuário**
```
GET http://localhost:3000/user/1
```

**Método 3: Atualizar role**
```
PUT http://localhost:3000/user/1
Body (JSON):
{
  "newRole": "admin"
}
```

**Método 4: Validação - email duplicado**
```
POST http://localhost:3000/user
Body (JSON):
{
  "name": "Ana2",
  "email": "ana@email.com",   ← MESMO EMAIL
  "password": "senha123"
}
Esperado: Status 400 (erro)
```

**Método 5: Validação - senha curta**
```
POST http://localhost:3000/user
Body (JSON):
{
  "name": "Bob",
  "email": "bob@email.com",
  "password": "123"   ← MUITO CURTA
}
Esperado: Status 400 (erro)
```

---

## ✅ CHECKLIST ANTES DE APRESENTAR

**Testes:**
- [ ] 15 testes Album - TUDO PASSOU
- [ ] 15 testes Artist - TUDO PASSOU
- [ ] `npm test -- --run` = 112+ testes passando

**API:**
- [ ] Postman instalado
- [ ] 8 requisições testadas e documentadas
- [ ] `API_TESTS.md` criado

**Vídeo:**
- [ ] 8-10 minutos
- [ ] Mostra testes rodando
- [ ] Mostra Postman testando
- [ ] Audio claro

**Documentação:**
- [ ] RELATORIO.md atualizado
- [ ] COBERTURA_FINAL.md criado

---

## 📤 ENTREGAR PARA NOTA 9

1. **Arquivo ZIP** (com tudo)
2. **APRESENTACAO_TDD_MUSICVIBE.pptx** (mesmo de antes)
3. **RELATORIO.md** (atualizado)
4. **API_TESTS.md** (novo)
5. **COBERTURA_FINAL.md** (novo)
6. **Vídeo Nota 9** (novo, 8-10 min)

---

## 🎉 PRONTO PARA COMEÇAR?

1. Abra: `GUIA_NOTA9.md` (leitura: 15 min)
2. Passo 1: Crie testes Album (45 min)
3. Passo 2: Crie testes Artist (45 min)
4. Passo 3: Postman + API tests (45 min)
5. Passo 4: Grav vídeo (60 min)

**Total: ~3 horas para NOTA 9!** 🚀

