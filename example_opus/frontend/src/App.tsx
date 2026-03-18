import { useState } from 'react'
import { Search, MapPin, RefreshCw, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CurrentWeather } from '@/components/weather/CurrentWeather'
import { HourlyForecast } from '@/components/weather/HourlyForecast'
import { DailyForecast } from '@/components/weather/DailyForecast'
import { WeatherSkeleton } from '@/components/weather/WeatherSkeleton'
import { WeatherData } from '@/types/weather'

const API_URL = 'http://localhost:3000'

type LoadingState = 'idle' | 'loading' | 'success' | 'error'

interface ErrorState {
  message: string;
  canRetry: boolean;
}

function App() {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const [error, setError] = useState<ErrorState | null>(null)
  const [isGeolocating, setIsGeolocating] = useState(false)
  const [lastSearchParams, setLastSearchParams] = useState<{ city?: string; lat?: number; lon?: number } | null>(null)

  const fetchWeather = async (params: { city?: string; lat?: number; lon?: number }) => {
    setLoadingState('loading')
    setError(null)
    setLastSearchParams(params)

    const queryString = params.city 
      ? `city=${encodeURIComponent(params.city)}`
      : `lat=${params.lat}&lon=${params.lon}`

    const response = await fetch(`${API_URL}/api/weather?${queryString}`)
    
    if (response.status === 404) {
      setLoadingState('error')
      setError({ message: 'Cidade não encontrada. Verifique o nome e tente novamente.', canRetry: true })
      return
    }

    if (response.status === 400) {
      setLoadingState('error')
      setError({ message: 'Por favor, digite o nome de uma cidade.', canRetry: false })
      return
    }

    if (!response.ok) {
      setLoadingState('error')
      setError({ message: 'Erro ao buscar dados do clima. Tente novamente.', canRetry: true })
      return
    }

    const data = await response.json()
    setWeatherData(data)
    setLoadingState('success')
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!city.trim()) return
    await fetchWeather({ city: city.trim() })
  }

  const handleGeolocation = async () => {
    if (!navigator.geolocation) {
      setError({ message: 'Geolocalização não suportada pelo navegador.', canRetry: false })
      return
    }

    setIsGeolocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await fetchWeather({ 
          lat: position.coords.latitude, 
          lon: position.coords.longitude 
        })
        setIsGeolocating(false)
      },
      () => {
        setError({ message: 'Não foi possível obter sua localização.', canRetry: false })
        setIsGeolocating(false)
        setLoadingState('error')
      }
    )
  }

  const handleRetry = () => {
    if (lastSearchParams) {
      fetchWeather(lastSearchParams)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-6">
            Painel de Clima
          </h1>
          
          <form onSubmit={handleSearch} className="flex flex-wrap sm:flex-nowrap gap-2">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Digite o nome da cidade..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="pl-10"
                disabled={loadingState === 'loading'}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                type="submit"
                disabled={loadingState === 'loading' || !city.trim()}
                className="flex-1 sm:flex-none"
              >
                {loadingState === 'loading' && !isGeolocating ? (
                  <RefreshCw className="w-4 h-4 sm:mr-2" />
                ) : (
                  <Search className="w-4 h-4 sm:mr-2" />
                )}
                <span className="hidden sm:inline">Buscar</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleGeolocation}
                disabled={loadingState === 'loading'}
                title="Usar minha localização"
                className="flex-1 sm:flex-none"
              >
                {isGeolocating ? (
                  <RefreshCw className="w-4 h-4 sm:mr-2" />
                ) : (
                  <MapPin className="w-4 h-4 sm:mr-2" />
                )}
                <span className="hidden sm:inline">Usar minha localização</span>
              </Button>
            </div>
          </form>
        </header>

        <main className="space-y-6">
          {loadingState === 'idle' && (
            <div className="text-center py-20">
              <MapPin className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-lg">
                Busque uma cidade ou use sua localização atual
              </p>
            </div>
          )}

          {loadingState === 'loading' && <WeatherSkeleton />}

          {loadingState === 'error' && error && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-destructive/10 rounded-full p-4 mb-4">
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
              <p className="text-lg text-center text-muted-foreground mb-4">
                {error.message}
              </p>
              {error.canRetry && (
                <Button onClick={handleRetry} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar novamente
                </Button>
              )}
            </div>
          )}

          {loadingState === 'success' && weatherData && (
            <>
              <CurrentWeather data={weatherData} />
              <HourlyForecast data={weatherData} />
              <DailyForecast data={weatherData} />
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
