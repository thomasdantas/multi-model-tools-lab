# Painel de Clima

Painel de clima com frontend e backend, utilizando a API Open-Meteo (gratuita, sem API key).

## Como executar

```bash
cd cursor/backend
npm install
npm start
```

Acesse http://localhost:3000 no navegador.

## Funcionalidades

- **Busca por cidade**: Digite o nome da cidade e veja o clima atual
- **Geolocalização**: Use o botão "Usar minha localização" para ver o clima onde você está
- Dados exibidos: temperatura, umidade, vento e condição do tempo

## Estrutura

- `backend/` - Servidor Express com endpoint `/api/weather`
- `frontend/` - Interface HTML/CSS/JS estática
