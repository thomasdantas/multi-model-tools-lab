import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface WeatherSearchProps {
  onSearch: (city: string) => void;
  onGeolocation: () => void;
  isLoading: boolean;
}

export function WeatherSearch({ onSearch, onGeolocation, isLoading }: WeatherSearchProps) {
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Digite o nome da cidade..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading || !city.trim()}>
          Buscar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onGeolocation}
          disabled={isLoading}
        >
          <MapPin className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
