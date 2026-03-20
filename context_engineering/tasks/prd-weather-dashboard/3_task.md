# Tarefa 3.0: Integração e Testes E2E

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Integrar o frontend com o backend, configurar as rotas da aplicação e criar testes E2E com Playwright para validar os fluxos completos do Weather Dashboard. Esta tarefa garante que todas as partes funcionam corretamente juntas.

<requirements>
- Frontend deve consumir a API do backend (não APIs externas diretamente)
- Página deve estar acessível via rota na aplicação
- Todos os fluxos principais devem ser testados end-to-end
- Interface deve funcionar corretamente em diferentes viewports
</requirements>

## Subtarefas

- [ ] 3.1 Configurar proxy no Vite para desenvolvimento (se necessário)
- [ ] 3.2 Conectar hooks do frontend aos endpoints do backend
- [ ] 3.3 Adicionar rota `/weather` no `App.tsx` do frontend
- [ ] 3.4 Testar integração manualmente (verificar se tudo funciona junto)
- [ ] 3.5 Criar testes E2E com Playwright (`e2e/weather-dashboard.spec.ts`)
- [ ] 3.6 Executar testes E2E e corrigir problemas encontrados

## Detalhes de Implementação

### Configuração do Proxy (se necessário)

Se o frontend rodar em porta diferente do backend durante desenvolvimento, configure o proxy no `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

### Conexão Frontend → Backend

No hook `useWeather`, as chamadas devem apontar para os endpoints do backend:

```typescript
// Buscar por cidade
const response = await fetch(`/api/weather/forecast?city=${encodeURIComponent(city)}`);

// Buscar por coordenadas
const response = await fetch(`/api/weather/forecast?latitude=${lat}&longitude=${lon}`);
```

### Rota no App.tsx

Adicionar a rota para o Weather Dashboard:

```typescript
import { WeatherDashboard } from './components/weather/WeatherDashboard';

// No router
<Route path="/weather" element={<WeatherDashboard />} />
```

### Testes E2E com Playwright

Os testes devem cobrir os fluxos principais definidos no PRD:

**Fluxo 1: Busca por cidade**
1. Acessar `/weather`
2. Digitar nome de uma cidade no campo de busca
3. Submeter a busca
4. Verificar que os dados climáticos são exibidos
5. Verificar que previsão horária está visível
6. Verificar que previsão de 7 dias está visível

**Fluxo 2: Geolocalização (mock)**
1. Mockar a API de geolocalização do navegador
2. Acessar `/weather`
3. Verificar que os dados climáticos são exibidos automaticamente

**Fluxo 3: Cidade não encontrada**
1. Acessar `/weather`
2. Digitar nome de cidade inexistente
3. Submeter a busca
4. Verificar que mensagem de erro amigável é exibida

**Fluxo 4: Responsividade**
1. Testar em viewport desktop (1280x720)
2. Testar em viewport tablet (768x1024)
3. Testar em viewport mobile (375x667)
4. Verificar que todos os elementos estão visíveis e funcionais

### Estrutura do Arquivo de Teste E2E

```typescript
// e2e/weather-dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Weather Dashboard', () => {
  test.describe('Busca por cidade', () => {
    test('should display weather data when searching for a valid city', async ({ page }) => {
      await page.goto('/weather');

      // Preencher campo de busca
      await page.getByPlaceholder(/cidade/i).fill('São Paulo');
      await page.getByRole('button', { name: /buscar/i }).click();

      // Verificar dados exibidos
      await expect(page.getByText('São Paulo')).toBeVisible();
      await expect(page.getByText(/°C/)).toBeVisible();
    });

    test('should show error message for invalid city', async ({ page }) => {
      await page.goto('/weather');

      await page.getByPlaceholder(/cidade/i).fill('CidadeInexistente123');
      await page.getByRole('button', { name: /buscar/i }).click();

      await expect(page.getByText(/não encontrada/i)).toBeVisible();
    });
  });

  test.describe('Previsões', () => {
    test('should display hourly forecast with horizontal scroll', async ({ page }) => {
      await page.goto('/weather');
      await page.getByPlaceholder(/cidade/i).fill('São Paulo');
      await page.getByRole('button', { name: /buscar/i }).click();

      // Verificar previsão horária
      const hourlySection = page.locator('[data-testid="hourly-forecast"]');
      await expect(hourlySection).toBeVisible();
    });

    test('should display 7-day forecast', async ({ page }) => {
      await page.goto('/weather');
      await page.getByPlaceholder(/cidade/i).fill('São Paulo');
      await page.getByRole('button', { name: /buscar/i }).click();

      // Verificar previsão de 7 dias
      const dailySection = page.locator('[data-testid="daily-forecast"]');
      await expect(dailySection).toBeVisible();
    });
  });

  test.describe('Responsividade', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/weather');

      await page.getByPlaceholder(/cidade/i).fill('São Paulo');
      await page.getByRole('button', { name: /buscar/i }).click();

      await expect(page.getByText('São Paulo')).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/weather');

      await page.getByPlaceholder(/cidade/i).fill('São Paulo');
      await page.getByRole('button', { name: /buscar/i }).click();

      await expect(page.getByText('São Paulo')).toBeVisible();
    });
  });

  test.describe('Geolocalização', () => {
    test('should request geolocation permission on load', async ({ page, context }) => {
      // Mockar geolocalização
      await context.grantPermissions(['geolocation']);
      await context.setGeolocation({ latitude: -23.55, longitude: -46.63 });

      await page.goto('/weather');

      // Verificar que dados são carregados automaticamente
      await expect(page.getByText(/°C/)).toBeVisible({ timeout: 10000 });
    });
  });
});
```

## Critérios de Sucesso

- Frontend consome corretamente os endpoints do backend
- Página está acessível em `/weather`
- Busca por cidade funciona end-to-end
- Geolocalização funciona (quando permitida)
- Mensagens de erro são exibidas corretamente
- Interface funciona em desktop, tablet e mobile
- Todos os testes E2E passam
- Nenhum erro no console do navegador durante uso normal

## Testes da Tarefa

- [ ] Testes E2E - Fluxo de busca por cidade:
  - Buscar cidade válida exibe dados climáticos
  - Buscar cidade inválida exibe mensagem de erro
  - Permite buscar outra cidade após primeira busca

- [ ] Testes E2E - Fluxo de geolocalização:
  - Com permissão concedida, exibe clima local automaticamente
  - Com permissão negada, exibe campo de busca

- [ ] Testes E2E - Previsões:
  - Previsão horária é exibida com scroll horizontal
  - Previsão de 7 dias é exibida com dia atual destacado

- [ ] Testes E2E - Responsividade:
  - Desktop (1280x720): todos elementos visíveis
  - Tablet (768x1024): todos elementos visíveis
  - Mobile (375x667): todos elementos visíveis

- [ ] Testes E2E - Estados de loading e erro:
  - Loading é exibido durante carregamento
  - Erro de rede exibe mensagem amigável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

**Arquivos a criar:**
- `e2e/weather-dashboard.spec.ts`

**Arquivos a modificar:**
- `frontend/src/App.tsx` (adicionar rota `/weather`)
- `frontend/src/components/weather/weather.hooks.ts` (conectar ao backend)
- `vite.config.ts` (proxy, se necessário)

**Dependências:**
- Playwright (verificar se já está configurado no projeto)
- Backend rodando na porta correta
- Frontend rodando na porta correta
