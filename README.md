# Pré-Check-in Hoteleiro 🏨

Sistema completo de pré-check-in mobile-first que resolve o gargalo de check-in nos horários de pico através de QR Code.

## 📋 Características

- ✅ **Frontend Mobile-First**: Página responsiva otimizada para smartphones
- ✅ **Design Moderno**: Tailwind CSS com interface limpa e intuitiva
- ✅ **Geração de QR Code**: QR Code dinâmico com dados do hóspede
- ✅ **Backend REST**: API Express com 3 endpoints principais
- ✅ **Banco de Dados em Memória**: Simulação sem dependências externas
- ✅ **CORS Habilitado**: Comunicação segura entre frontend e backend
- ✅ **Validação Completa**: Dados da FNRH (Ficha Nacional de Registro de Hóspede)

## 🛠️ Tecnologias

### Frontend
- HTML5
- Tailwind CSS (CDN)
- QRCode.js (biblioteca)
- Fetch API (JavaScript puro)

### Backend
- Node.js
- Express.js
- UUID (geração de IDs únicos)
- CORS

## 📦 Instalação

### Pré-requisitos
- Node.js 14+ e npm instalados

### Setup

1. **Clonar/Acessar o repositório**
```bash
cd site-check-in-
```

2. **Instalar dependências**
```bash
npm install
```

3. **Iniciar o servidor**
```bash
npm start
```

O servidor iniciará em `http://localhost:3000`

4. **Acessar o frontend**
Abra seu navegador em:
```
http://localhost:3000/index.html
```

## 🚀 Endpoints da API

### 1. POST `/api/checkin`
**Criar pré-check-in**

```bash
curl -X POST http://localhost:3000/api/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "documento": "123.456.789-00",
    "celular": "(11) 98765-4321",
    "dataNascimento": "1990-05-15"
  }'
```

**Response:**
```json
{
  "status": "success",
  "message": "Pré-check-in concluído com sucesso",
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "dados": {
    "nome": "João Silva",
    "documento": "123.456.789-00",
    "celular": "(11) 98765-4321",
    "dataNascimento": "1990-05-15",
    "status": "Pre-Checkin Concluido"
  }
}
```

### 2. GET `/api/recepcao/consultar/:id`
**Consultar dados do hóspede (Recepção)**

```bash
curl http://localhost:3000/api/recepcao/consultar/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "nome": "João Silva",
    "documento": "123.456.789-00",
    "celular": "(11) 98765-4321",
    "dataNascimento": "1990-05-15",
    "status": "Pre-Checkin Concluido",
    "numeroQuarto": null,
    "dataCriacao": "2026-06-02T10:30:00.000Z",
    "dataAtualizacao": "2026-06-02T10:30:00.000Z"
  }
}
```

### 3. POST `/api/recepcao/finalizar/:id`
**Finalizar check-in e atribuir quarto**

```bash
curl -X POST http://localhost:3000/api/recepcao/finalizar/a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -H "Content-Type: application/json" \
  -d '{"numeroQuarto": 512}'
```

**Response:**
```json
{
  "status": "success",
  "message": "Check-in finalizado com sucesso",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "nome": "João Silva",
    "status": "Hospede no Quarto",
    "numeroQuarto": 512,
    "dataAtualizacao": "2026-06-02T10:35:00.000Z"
  }
}
```

## 📊 Endpoints Adicionais (Debug/Admin)

### GET `/api/stats`
Retorna estatísticas do sistema
```bash
curl http://localhost:3000/api/stats
```

### GET `/api/listar`
Lista todos os check-ins
```bash
curl http://localhost:3000/api/listar
```

### GET `/api/health`
Verifica saúde do servidor
```bash
curl http://localhost:3000/api/health
```

## 🔄 Fluxo de Uso

```
1. HÓSPEDE (Antes de chegar)
   ↓
   Acessa: http://localhost:3000/index.html
   ↓
   Preenche formulário com dados FNRH
   ↓
   Clica em "Gerar QR Code"
   ↓
   Frontend faz POST /api/checkin
   ↓
   Backend retorna ID único
   ↓
   Frontend gera QR Code com ID
   ↓
   Hóspede salva/imprime QR Code

2. RECEPÇÃO (Quando hóspede chega)
   ↓
   Lê QR Code com leitor
   ↓
   Sistema faz GET /api/recepcao/consultar/:id
   ↓
   Dados carregam instantaneamente
   ↓
   Recepcionista atribui quarto
   ↓
   Sistema faz POST /api/recepcao/finalizar/:id
   ↓
   Status atualizado: "Hospede no Quarto"
```

## 📝 Dados Coletados (FNRH)

- **Nome Completo**: Campo texto obrigatório
- **CPF/Passaporte**: Documento de identificação
- **Celular**: Contato principal
- **Data de Nascimento**: Campo data

## 🎨 Recursos do Frontend

- ✅ Validação de formulário em tempo real
- ✅ Indicador de carregamento durante requisição
- ✅ Mensagens de erro intuitivas
- ✅ Exibição de QR Code com dados confirmados
- ✅ Botão de impressão do QR Code
- ✅ Função de reset para novo check-in
- ✅ Design responsivo (mobile, tablet, desktop)
- ✅ Cores coordenadas com degradê azul-indigo

## 🔧 Desenvolvimento

### Modo desenvolvimento com auto-reload:
```bash
npm run dev
```

Requer `nodemon` instalado (já está em devDependencies)

## 📱 Responsividade

- **Mobile**: 320px+ ✓
- **Tablet**: 768px+ ✓
- **Desktop**: 1024px+ ✓

## 🛡️ Segurança

- ✅ CORS habilitado (ajuste conforme necessário)
- ✅ Validação de entrada no backend
- ✅ UUIDs para identificação única
- ✅ Tratamento de erros global

## 📈 Melhorias Futuras

- [ ] Integração com banco de dados real (MongoDB/PostgreSQL)
- [ ] Autenticação de recepcionista
- [ ] Dashboard para gerenciamento
- [ ] Notificações por email/SMS
- [ ] Histórico de check-ins
- [ ] Relatórios ocupação
- [ ] Integração com PMS (Property Management System)

## 📄 Licença

MIT

## 👨‍💻 Desenvolvido por

Engenheiro de Software Full Stack Sênior & Especialista em UX
