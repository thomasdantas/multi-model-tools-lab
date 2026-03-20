# Tarefa 1.0: Backend - API de Clima

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar a camada backend completa para o Weather Dashboard, incluindo types, service, controller e routes. O backend será responsável por intermediar as chamadas às APIs externas Open-Meteo (Geocoding e Forecast), formatando os dados antes de enviá-los ao frontend.

<requirements>
- RF21: O backend deve expor endpoint para buscar clima por coordenadas
- RF22: O backend deve expor endpoint para buscar coordenadas por nome de cidade
- RF23: O backend deve consumir a API Open-Meteo para dados climáticos
- RF24: O backend deve consumir a API de Geocoding Open-Meteo para conversão de cidade em coordenadas
</requirements>

## Subtarefas

- [ ] 1.1 Criar arquivo `backend/src/weather/weather.types.ts` com todas as interfaces TypeScript
- [ ] 1.2 Criar arquivo `backend/src/weather/weather.service.ts` com chamadas HTTP às APIs Open-Meteo
- [ ] 1.3 Criar arquivo `backend/src/weather/weather.controller.ts` com lógica de validação e orquestração
- [ ] 1.4 Criar arquivo `backend/src/weather/weather.routes.ts` com rotas Express
- [ ] 1.5 Registrar as rotas no arquivo principal `backend/src/index.ts`
- [ ] 1.6 Criar testes unitários do service (`weather.service.test.ts`)
- [ ] 1.7 Criar testes unitários do controller (`weather.controller.test.ts`)

## Detalhes de Implementação

Consulte a seção **"Design de Implementação"** e **"Pontos de Integração"** do arquivo `techspec.md` para detalhes completos.

### Endpoints a implementar

| Método | Caminho | Descrição | Query Params |
|--------|---------|-----------|--------------|
| GET | `/api/weather/forecast` | Retorna clima atual e previsões | `latitude`, `longitude` OU `city` |
| GET | `/api/weather/geocoding` | Busca coordenadas por cidade | `city` (obrigatório) |

### APIs Externas

- **Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search`
  - Parâmetros: `name` (string), `count` (int, default 5), `language` (string, default "pt")

- **Forecast API**: `https://api.open-meteo.com/v1/forecast`
  - Parâmetros obrigatórios: `latitude`, `longitude`
  - Parâmetros hourly: `temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
  - Parâmetros daily: `temperature_2m_max,temperature_2m_min,weather_code`
  - Parâmetros adicionais: `timezone=auto`, `forecast_days=7`

### Interfaces Principais (weather.types.ts)

```typescript
interface WeatherRequest {
  latitude?: number;
  longitude?: number;
  city?: string;
}

interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

interface WeatherResponse {
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherDescription: string;
}

interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
}

interface DailyForecast {
  date: string;
  dayOfWeek: string;
  temperatureMin: number;
  temperatureMax: number;
  weatherCode: number;
}
```

### Códigos de Status HTTP

- `200` - Sucesso
- `400` - Parâmetros ausentes ou inválidos
- `404` - Cidade não encontrada
- `500` - Erro da API externa

### Configurações

- Timeout padrão: 10 segundos
- Instalar axios: `npm install axios`

## Critérios de Sucesso

- Endpoint `/api/weather/forecast?city=São Paulo` retorna dados climáticos formatados
- Endpoint `/api/weather/forecast?latitude=-23.55&longitude=-46.63` retorna dados climáticos formatados
- Endpoint `/api/weather/geocoding?city=São Paulo` retorna coordenadas da cidade
- Erros são tratados com códigos HTTP apropriados (400, 404, 500)
- Logs estruturados com contexto (cidade ou coordenadas)
- Código 100% tipado (sem `any`)
- Testes unitários passando com cobertura adequada

## Testes da Tarefa

- [ ] Testes de unidade para `weather.service.ts`:
  - Testar formatação de dados da API Open-Meteo
  - Testar chamada à Geocoding API com cidade válida
  - Testar chamada à Forecast API com coordenadas válidas
  - Mockar axios para simular respostas da Open-Meteo

- [ ] Testes de unidade para `weather.controller.ts`:
  - Testar requisição com cidade válida retorna 200
  - Testar requisição com coordenadas válidas retorna 200
  - Testar cidade não encontrada retorna 404
  - Testar parâmetros ausentes retorna 400
  - Testar erro da API externa retorna 500

- [ ] Testes de integração:
  - Testar fluxo completo Controller → Service → Mock Open-Meteo
  - Usar supertest para testar endpoints Express

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

**Arquivos a criar:**
- `backend/src/weather/weather.types.ts`
- `backend/src/weather/weather.service.ts`
- `backend/src/weather/weather.controller.ts`
- `backend/src/weather/weather.routes.ts`
- `backend/src/weather/weather.service.test.ts`
- `backend/src/weather/weather.controller.test.ts`

**Arquivos a modificar:**
- `backend/src/index.ts` (adicionar import das rotas weather)
