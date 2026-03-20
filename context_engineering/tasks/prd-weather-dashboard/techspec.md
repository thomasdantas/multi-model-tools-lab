# Especificação Técnica - Weather Dashboard

## Resumo Executivo

O Weather Dashboard será implementado como uma nova página integrada à aplicação existente, utilizando a arquitetura full-stack TypeScript já estabelecida (React + Express). O backend intermediará todas as chamadas às APIs Open-Meteo (Geocoding e Forecast), formatando os dados antes de enviá-los ao frontend. A interface seguirá o design system Apple-like com glassmorphism, gradientes adaptativos às condições climáticas e componentes Tailwind CSS.

A estratégia de implementação prioriza um endpoint unificado que aceita tanto coordenadas (lat/lon) quanto nome de cidade, resolvendo internamente via Geocoding API quando necessário. Os ícones climáticos serão mapeados a partir dos códigos WMO usando a biblioteca Lucide React já instalada no projeto.

## Arquitetura do Sistema

### Visão Geral dos Componentes

**Backend (Express.js)**

- `weather.routes.ts` - Rotas Express para endpoints de clima
- `weather.controller.ts` - Controller com lógica de orquestração das APIs
- `weather.service.ts` - Serviço com chamadas HTTP às APIs Open-Meteo
- `weather.types.ts` - Interfaces TypeScript para request/response

**Frontend (React)**

- `WeatherDashboard.tsx` - Componente principal da página
- `CurrentWeather.tsx` - Exibição do clima atual
- `HourlyForecast.tsx` - Previsão horária (24h) com scroll horizontal
- `DailyForecast.tsx` - Previsão de 7 dias
- `WeatherSearch.tsx` - Campo de busca de cidade
- `WeatherIcon.tsx` - Mapeamento WMO para ícones Lucide
- `weather.hooks.ts` - Custom hooks (useWeather, useGeolocation)
- `weather.types.ts` - Interfaces compartilhadas
- `weather.utils.ts` - Utilitários (formatação, mapeamento WMO)

**Relacionamentos**

```
Frontend                          Backend                         External
┌─────────────────┐              ┌──────────────────┐            ┌─────────────────┐
│ WeatherDashboard│──fetch──────>│ /api/weather/*   │──axios────>│ Open-Meteo APIs │
│  ├─ Search      │              │  ├─ Controller   │            │  ├─ Geocoding   │
│  ├─ Current     │<─────────────│  ├─ Service      │<───────────│  └─ Forecast    │
│  ├─ Hourly      │   JSON       │  └─ Types        │   JSON     └─────────────────┘
│  └─ Daily       │              └──────────────────┘
└─────────────────┘
```

## Design de Implementação

### Interfaces Principais

```typescript
// backend/src/weather/weather.types.ts
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
```

```typescript
// frontend/src/components/weather/weather.types.ts
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

### Modelos de Dados

**Mapeamento WMO Weather Codes**

```typescript
// frontend/src/components/weather/weather.utils.ts
const WMO_CODES: Record<number, { description: string; icon: string; gradient: string }> = {
  0: { description: "Céu limpo", icon: "Sun", gradient: "from-yellow-400 to-orange-500" },
  1: { description: "Principalmente limpo", icon: "Sun", gradient: "from-yellow-400 to-orange-500" },
  2: { description: "Parcialmente nublado", icon: "CloudSun", gradient: "from-blue-400 to-gray-400" },
  3: { description: "Nublado", icon: "Cloud", gradient: "from-gray-400 to-gray-600" },
  45: { description: "Neblina", icon: "CloudFog", gradient: "from-gray-300 to-gray-500" },
  48: { description: "Neblina com geada", icon: "CloudFog", gradient: "from-gray-300 to-blue-300" },
  51: { description: "Garoa leve", icon: "CloudDrizzle", gradient: "from-gray-400 to-blue-500" },
  53: { description: "Garoa moderada", icon: "CloudDrizzle", gradient: "from-gray-500 to-blue-600" },
  55: { description: "Garoa intensa", icon: "CloudDrizzle", gradient: "from-gray-600 to-blue-700" },
  61: { description: "Chuva leve", icon: "CloudRain", gradient: "from-blue-400 to-blue-600" },
  63: { description: "Chuva moderada", icon: "CloudRain", gradient: "from-blue-500 to-blue-700" },
  65: { description: "Chuva forte", icon: "CloudRain", gradient: "from-blue-600 to-blue-800" },
  71: { description: "Neve leve", icon: "Snowflake", gradient: "from-blue-100 to-blue-300" },
  73: { description: "Neve moderada", icon: "Snowflake", gradient: "from-blue-200 to-blue-400" },
  75: { description: "Neve forte", icon: "Snowflake", gradient: "from-blue-300 to-blue-500" },
  95: { description: "Tempestade", icon: "CloudLightning", gradient: "from-gray-700 to-purple-900" },
  96: { description: "Tempestade com granizo", icon: "CloudLightning", gradient: "from-gray-800 to-purple-900" },
  99: { description: "Tempestade com granizo forte", icon: "CloudLightning", gradient: "from-gray-900 to-purple-900" },
};
```

### Endpoints de API

| Método | Caminho | Descrição | Query Params |
|--------|---------|-----------|--------------|
| GET | `/api/weather/forecast` | Retorna clima atual e previsões | `latitude`, `longitude` OU `city` |
| GET | `/api/weather/geocoding` | Busca coordenadas por cidade | `city` (obrigatório) |

**GET /api/weather/forecast**

Request (por coordenadas):
```
GET /api/weather/forecast?latitude=-23.55&longitude=-46.63
```

Request (por cidade):
```
GET /api/weather/forecast?city=São Paulo
```

Response (200):
```json
{
  "location": {
    "name": "São Paulo",
    "country": "Brazil",
    "latitude": -23.55,
    "longitude": -46.63
  },
  "current": {
    "temperature": 25,
    "feelsLike": 27,
    "humidity": 65,
    "windSpeed": 12,
    "weatherCode": 2,
    "weatherDescription": "Parcialmente nublado"
  },
  "hourly": [
    { "time": "14:00", "temperature": 25, "weatherCode": 2 }
  ],
  "daily": [
    { "date": "2025-02-03", "dayOfWeek": "Segunda", "temperatureMin": 18, "temperatureMax": 28, "weatherCode": 2 }
  ]
}
```

**GET /api/weather/geocoding**

Request:
```
GET /api/weather/geocoding?city=São Paulo
```

Response (200):
```json
{
  "results": [
    {
      "name": "São Paulo",
      "latitude": -23.5475,
      "longitude": -46.6361,
      "country": "Brazil",
      "admin1": "São Paulo"
    }
  ]
}
```

## Pontos de Integração

**Open-Meteo Geocoding API**

- Endpoint: `https://geocoding-api.open-meteo.com/v1/search`
- Parâmetros: `name` (string), `count` (int, default 5), `language` (string, default "pt")
- Sem API key necessária
- Tratamento: Retornar 404 se `results` vier vazio

**Open-Meteo Forecast API**

- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Parâmetros obrigatórios: `latitude`, `longitude`
- Parâmetros hourly: `temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
- Parâmetros daily: `temperature_2m_max,temperature_2m_min,weather_code`
- Parâmetros adicionais: `timezone=auto`, `forecast_days=7`
- Tratamento de erros: Propagar mensagem de erro da API com status 500

**Timeout e Retry**

- Timeout padrão: 10 segundos
- Sem retry automático (simplicidade inicial)
- Log de erros com contexto (city ou coordinates)

## Abordagem de Testes

### Testes Unitários

**Backend**

- `weather.service.test.ts`: Testar formatação de dados da API Open-Meteo
- `weather.controller.test.ts`: Testar validação de parâmetros e códigos de status
- Mock do axios para simular respostas da Open-Meteo

Cenários críticos:
- Requisição com cidade válida
- Requisição com coordenadas válidas
- Cidade não encontrada (404)
- Parâmetros ausentes (400)
- Erro da API externa (500)

**Frontend**

- `WeatherIcon.test.tsx`: Testar mapeamento WMO para ícones corretos
- `weather.utils.test.ts`: Testar formatação de datas e temperaturas
- `useWeather.test.ts`: Testar estados de loading, success e error

### Testes de Integração

- Testar fluxo completo: Controller → Service → Mock Open-Meteo
- Testar transformação de dados entre camadas
- Usar supertest para testar endpoints Express

### Testes E2E

**Playwright**

- Fluxo de busca por cidade: digitar cidade → ver resultados
- Fluxo de geolocalização: permitir → ver clima local
- Tratamento de erro: cidade inválida → mensagem amigável
- Responsividade: testar em viewport mobile e desktop

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **Backend - Types e Service** (base da integração)
   - Criar interfaces TypeScript
   - Implementar WeatherService com axios
   - Testar chamadas à Open-Meteo isoladamente

2. **Backend - Controller e Routes** (expor API)
   - Criar WeatherController com validação
   - Configurar rotas em /api/weather
   - Testar endpoints com Postman/curl

3. **Frontend - Types e Hooks** (lógica de dados)
   - Criar interfaces compartilhadas
   - Implementar useWeather e useGeolocation
   - Testar hooks isoladamente

4. **Frontend - Componentes Base** (UI atômica)
   - WeatherIcon com mapeamento WMO
   - Componentes de loading/skeleton
   - Estilos base com Tailwind

5. **Frontend - Componentes de Exibição** (composição)
   - CurrentWeather, HourlyForecast, DailyForecast
   - WeatherSearch com input
   - Integrar com hooks

6. **Frontend - WeatherDashboard** (página completa)
   - Compor todos os componentes
   - Implementar gradientes adaptativos
   - Glassmorphism e polish visual

7. **Testes e Ajustes**
   - Testes unitários backend/frontend
   - Testes E2E com Playwright
   - Ajustes de responsividade

### Dependências Técnicas

- Axios deve ser instalado no backend: `npm install axios`
- Nenhuma dependência adicional no frontend (Lucide já instalado)
- Configuração de proxy Vite pode ser necessária para desenvolvimento

## Monitoramento e Observabilidade

**Logs Backend**

```typescript
console.log("Weather forecast requested", { city, latitude, longitude });
console.log("Open-Meteo API response received", { responseTime: duration });
console.error("Open-Meteo API error", { endpoint, status, message });
console.error("Geocoding failed", { city, reason: "not_found" });
```

**Métricas Sugeridas (futuro)**

- Tempo de resposta por endpoint
- Taxa de erros por tipo (404, 500)
- Cidades mais buscadas

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Endpoint unificado | Aceitar lat/lon OU city | Simplifica frontend, resolve geocoding no backend |
| Ícones | Lucide React | Já instalado, consistente com design system |
| Estrutura componentes | /components/weather | Melhor organização, reutilização futura |
| HTTP client backend | Axios | Padrão definido nas rules do projeto |
| Estilização | Tailwind CSS | Padrão do projeto, suporta glassmorphism |

### Riscos Conhecidos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Rate limit Open-Meteo | Baixa | Médio | API é gratuita sem limite documentado; monitorar logs |
| Geolocalização negada | Alta | Baixo | UX clara com fallback para busca manual |
| Latência API externa | Média | Médio | Timeout de 10s, skeleton loading no frontend |
| Cidade não encontrada | Média | Baixo | Mensagem amigável, sugestão de tentar outro nome |

### Conformidade com Padrões

As seguintes rules do projeto se aplicam a esta implementação:

- **code-standards.md**: Nomenclatura em inglês, camelCase para variáveis/funções, PascalCase para componentes, kebab-case para arquivos
- **http.md**: Padrão REST, uso de Express, códigos HTTP corretos (200, 400, 404, 500), axios para cliente HTTP
- **logging.md**: console.log/console.error com contexto estruturado, sem dados sensíveis
- **node.md**: TypeScript obrigatório, async/await, tipagem forte (sem `any`), imports ES6
- **react.md**: Componentes funcionais, TypeScript com .tsx, Tailwind CSS, Context API se necessário, useMemo para otimização
- **tests.md**: Jest, estrutura AAA, testes independentes, mocks para Date se necessário

### Arquivos Relevantes e Dependentes

**Backend (a criar)**
- `backend/src/weather/weather.routes.ts`
- `backend/src/weather/weather.controller.ts`
- `backend/src/weather/weather.service.ts`
- `backend/src/weather/weather.types.ts`

**Frontend (a criar)**
- `frontend/src/components/weather/WeatherDashboard.tsx`
- `frontend/src/components/weather/CurrentWeather.tsx`
- `frontend/src/components/weather/HourlyForecast.tsx`
- `frontend/src/components/weather/DailyForecast.tsx`
- `frontend/src/components/weather/WeatherSearch.tsx`
- `frontend/src/components/weather/WeatherIcon.tsx`
- `frontend/src/components/weather/weather.hooks.ts`
- `frontend/src/components/weather/weather.types.ts`
- `frontend/src/components/weather/weather.utils.ts`

**Arquivos existentes a modificar**
- `backend/src/index.ts` - Adicionar import das rotas weather
- `frontend/src/App.tsx` - Adicionar rota para WeatherDashboard

**Testes (a criar)**
- `backend/src/weather/weather.service.test.ts`
- `backend/src/weather/weather.controller.test.ts`
- `frontend/src/components/weather/WeatherIcon.test.tsx`
- `frontend/src/components/weather/weather.utils.test.ts`
- `e2e/weather-dashboard.spec.ts`
