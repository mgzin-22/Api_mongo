const express = require('express');

const connectDatabase = require('./config/database');
const Pessoa = require('./models/Pessoa');
const limiter = require('./config/security');

const app = express();
const PORT = 3000;

app.use(limiter);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensagem: 'API REST em Node.js com Express.' });
});

app.get('/pessoas', async (req, res) => {
  try {
    const pessoas = await Pessoa.find();
    res.status(200).json(pessoas);
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao buscar pessoas.',
      erro: error.message,
    });
  }
});

app.post('/pessoas', async (req, res) => {
  try {
    const { nome, ra } = req.body;

    if (!nome || !ra) {
      return res.status(400).json({
        mensagem: 'Os campos nome e curso sao obrigatorios.',
      });
    }

    const novaPessoa = await Pessoa.create({ nome, ra });

    res.status(201).json(novaPessoa);
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao cadastrar pessoa.',
      erro: error.message,
    });
  }
});

app.put('/pessoas', async (req, res) => {
  try {
    const { _id, nome, ra } = req.body;

    const pessoaAtualizada = await Pessoa.findByIdAndUpdate(
      _id,
      { nome, ra },
      { new: true }
    );

    if (!pessoaAtualizada) {
      return res.status(404).json({
        mensagem: 'Pessoa nao encontrada.',
      });
    }

    res.status(200).json(pessoaAtualizada);
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao atualizar pessoa.',
      erro: error.message,
    });
  }
});

app.delete('/pessoas', async (req, res) => {
  try {
    const { _id } = req.body;

    const pessoaRemovida = await Pessoa.findByIdAndDelete(_id);

    if (!pessoaRemovida) {
      return res.status(404).json({
        mensagem: 'Pessoa nao encontrada.',
      });
    }

    res.status(200).json({
      mensagem: 'Pessoa removida com sucesso.',
    });
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao remover pessoa.',
      erro: error.message,
    });
  }
});

async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Nao foi possivel iniciar a aplicacao.', error.message);
  }
}

startServer();