const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * BANCO DE DADOS EM MEMÓRIA
 * Estrutura: {
 *   [id]: {
 *     id: string (UUID),
 *     nome: string,
 *     documento: string,
 *     celular: string,
 *     dataNascimento: string,
 *     status: string ('Pre-Checkin Concluido' | 'Hospede no Quarto'),
 *     numeroQuarto: number | null,
 *     dataCriacao: string (ISO 8601),
 *     dataAtualizacao: string (ISO 8601)
 *   }
 * }
 */
const database = {};

/**
 * POST /api/checkin
 * Recebe dados do hóspede, gera ID único (UUID) e armazena no banco
 * Body: { nome, documento, celular, dataNascimento }
 * Response: { id, status, message }
 */
app.post('/api/checkin', (req, res) => {
    try {
        const { nome, documento, celular, dataNascimento } = req.body;

        // Validação dos dados
        if (!nome || !documento || !celular || !dataNascimento) {
            return res.status(400).json({
                status: 'error',
                message: 'Todos os campos são obrigatórios'
            });
        }

        // Gerar ID único
        const id = uuidv4();
        const now = new Date().toISOString();

        // Armazenar no banco de dados
        database[id] = {
            id,
            nome,
            documento,
            celular,
            dataNascimento,
            status: 'Pre-Checkin Concluido',
            numeroQuarto: null,
            dataCriacao: now,
            dataAtualizacao: now
        };

        console.log(`✓ Check-in criado: ${id}`);

        res.status(201).json({
            status: 'success',
            message: 'Pré-check-in concluído com sucesso',
            id,
            dados: {
                nome,
                documento,
                celular,
                dataNascimento,
                status: 'Pre-Checkin Concluido'
            }
        });

    } catch (error) {
        console.error('Erro ao processar check-in:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erro ao processar check-in'
        });
    }
});

/**
 * GET /api/recepcao/consultar/:id
 * Permite consultar dados do hóspede ao ler o QR Code
 * Response: { id, nome, documento, celular, dataNascimento, status, numeroQuarto }
 */
app.get('/api/recepcao/consultar/:id', (req, res) => {
    try {
        const { id } = req.params;

        // Buscar no banco de dados
        const hospede = database[id];

        if (!hospede) {
            return res.status(404).json({
                status: 'error',
                message: 'Hóspede não encontrado'
            });
        }

        console.log(`✓ Consulta realizada: ${id}`);

        res.status(200).json({
            status: 'success',
            data: {
                id: hospede.id,
                nome: hospede.nome,
                documento: hospede.documento,
                celular: hospede.celular,
                dataNascimento: hospede.dataNascimento,
                status: hospede.status,
                numeroQuarto: hospede.numeroQuarto,
                dataCriacao: hospede.dataCriacao,
                dataAtualizacao: hospede.dataAtualizacao
            }
        });

    } catch (error) {
        console.error('Erro ao consultar check-in:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erro ao consultar check-in'
        });
    }
});

/**
 * POST /api/recepcao/finalizar/:id
 * Atualiza status para 'Hospede no Quarto' e vincula número do quarto
 * Body: { numeroQuarto }
 * Response: { id, status, numeroQuarto }
 */
app.post('/api/recepcao/finalizar/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { numeroQuarto } = req.body;

        // Validação
        if (!numeroQuarto) {
            return res.status(400).json({
                status: 'error',
                message: 'Número do quarto é obrigatório'
            });
        }

        // Buscar no banco de dados
        const hospede = database[id];

        if (!hospede) {
            return res.status(404).json({
                status: 'error',
                message: 'Hóspede não encontrado'
            });
        }

        // Atualizar status e número do quarto
        hospede.status = 'Hospede no Quarto';
        hospede.numeroQuarto = numeroQuarto;
        hospede.dataAtualizacao = new Date().toISOString();

        console.log(`✓ Check-in finalizado: ${id} - Quarto ${numeroQuarto}`);

        res.status(200).json({
            status: 'success',
            message: 'Check-in finalizado com sucesso',
            data: {
                id: hospede.id,
                nome: hospede.nome,
                status: hospede.status,
                numeroQuarto: hospede.numeroQuarto,
                dataAtualizacao: hospede.dataAtualizacao
            }
        });

    } catch (error) {
        console.error('Erro ao finalizar check-in:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erro ao finalizar check-in'
        });
    }
});

/**
 * GET /api/stats
 * Retorna estatísticas do sistema (apenas para debug/admin)
 */
app.get('/api/stats', (req, res) => {
    const totalCheckins = Object.keys(database).length;
    const preCheckins = Object.values(database).filter(h => h.status === 'Pre-Checkin Concluido').length;
    const checkinsFinalizados = Object.values(database).filter(h => h.status === 'Hospede no Quarto').length;

    res.status(200).json({
        status: 'success',
        statistics: {
            totalCheckins,
            preCheckins,
            checkinsFinalizados
        }
    });
});

/**
 * GET /api/listar
 * Lista todos os check-ins (apenas para debug/admin)
 */
app.get('/api/listar', (req, res) => {
    const checkins = Object.values(database).map(h => ({
        id: h.id,
        nome: h.nome,
        status: h.status,
        numeroQuarto: h.numeroQuarto,
        dataCriacao: h.dataCriacao
    }));

    res.status(200).json({
        status: 'success',
        total: checkins.length,
        data: checkins
    });
});

/**
 * Health Check
 */
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Servidor está operacional',
        timestamp: new Date().toISOString()
    });
});

/**
 * Iniciar Servidor
 */
app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════╗
    ║  🏨 PRÉ-CHECK-IN HOTELEIRO - BACKEND      ║
    ║  Status: ✓ Rodando                        ║
    ║  Porta: ${PORT}                              ║
    ║  Host: http://localhost:${PORT}              ║
    ╚════════════════════════════════════════════╝
    
    📍 Endpoints disponíveis:
    ✓ POST   /api/checkin
    ✓ GET    /api/recepcao/consultar/:id
    ✓ POST   /api/recepcao/finalizar/:id
    ✓ GET    /api/stats
    ✓ GET    /api/listar
    ✓ GET    /api/health
    `);
});

// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor'
    });
});

// Rota 404
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint não encontrado'
    });
});
