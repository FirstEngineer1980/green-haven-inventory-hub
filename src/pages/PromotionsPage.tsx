
import React, { useState, useEffect } from 'react';
import { usePromotions } from '@/context/PromotionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Calendar, Tag, Info } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const PromotionsPage = () => {
  const { promotions, loading, error } = usePromotions();
  const [activePromotions, setActivePromotions] = useState([]);

  useEffect(() => {
    // Filter active promotions (current date is between start_date and end_date)
    const now = new Date();
    const filtered = promotions.filter(promo => {
      const startDate = new Date(promo.start_date);
      const endDate = new Date(promo.end_date);
      return promo.active && startDate <= now && endDate >= now;
    });
    
    setActivePromotions(filtered);
  }, [promotions]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading promotions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                There was an error loading promotions. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Current Promotions</h1>
      
      {activePromotions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No active promotions at the moment.</p>
          <p className="mt-2 text-muted-foreground">Check back soon for new deals!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePromotions.map((promotion) => (
            <Card key={promotion.id} className="overflow-hidden flex flex-col h-full">
              {promotion.image && (
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={promotion.image} 
                    alt={promotion.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{promotion.title}</CardTitle>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {promotion.discount}% OFF
                  </Badge>
                </div>
                <CardDescription>{promotion.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Valid until: {format(new Date(promotion.end_date), 'MMM dd, yyyy')}</span>
                  </div>
                  
                  {promotion.categories && promotion.categories.length > 0 && (
                    <div className="flex items-center text-sm">
                      <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        Categories: {promotion.categories.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <ThumbsUp className="mr-2 h-4 w-4" /> Use This Promotion
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Upcoming Promotions</h2>
        {promotions.filter(p => {
          const startDate = new Date(p.start_date);
          const now = new Date();
          return p.active && startDate > now;
        }).length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No upcoming promotions scheduled.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions
              .filter(p => {
                const startDate = new Date(p.start_date);
                const now = new Date();
                return p.active && startDate > now;
              })
              .map((promotion) => (
                <Card key={promotion.id} className="bg-muted/50">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{promotion.title}</CardTitle>
                      <Badge variant="outline">{promotion.discount}% OFF</Badge>
                    </div>
                    <CardDescription>{promotion.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Starts: {format(new Date(promotion.start_date), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionsPage;
