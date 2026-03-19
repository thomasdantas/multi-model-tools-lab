import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden bg-gradient-to-br from-gray-300 to-gray-400">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full bg-white/30" />
              <div className="space-y-2">
                <Skeleton className="h-12 w-24 bg-white/30" />
                <Skeleton className="h-5 w-32 bg-white/30" />
                <Skeleton className="h-4 w-20 bg-white/30" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-24 bg-white/30" />
              ))}
            </div>
          </div>
          <Skeleton className="mt-6 h-8 w-full bg-white/30" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
          <div className="mt-4 flex gap-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-16 flex-shrink-0" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
