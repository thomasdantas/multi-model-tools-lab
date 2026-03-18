import { Card, CardContent, CardHeader } from './ui/card';

export function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="h-8 w-32 bg-gray-200 rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-16 w-24 bg-gray-200 rounded mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-6 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-gray-200 rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-3">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="h-2 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="h-2 bg-gray-200 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
