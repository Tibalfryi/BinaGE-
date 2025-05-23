
// src/app/property/[id]/page.tsx
"use client"; 

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Property } from '@/types';
import { mockProperties } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ArrowLeft, BedDouble, Building, DollarSign, Dog, CheckCircle, XCircle, Mail, Phone, Send, Ruler, Heater, Home as HomeIcon, Share2, Heart, MessageCircle, Info, MapPin, DoorOpen, Bath, UtensilsCrossed, CookingPot
} from 'lucide-react'; // Added MapPin, DoorOpen, Bath, UtensilsCrossed, CookingPot
import { AppHeader } from '@/components/layout/app-header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from '@/hooks/use-translation'; 

// Helper to get amenity icon and text
const AmenityDisplay = ({ label, value, icon, t }: { label: string; value: boolean | string | number; icon: React.ReactNode; t: (key: string) => string }) => (
  <div className="flex flex-col items-center text-center p-3 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow min-h-[90px] justify-center">
    <div className="text-primary mb-1.5">{icon}</div>
    <span className="text-xs text-muted-foreground mb-0.5">{t(label)}</span>
    {typeof value === 'boolean' ? (
      value ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
    ) : (
      <span className="text-sm font-semibold capitalize">{String(value)}</span>
    )}
  </div>
);

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { t } = useTranslation(); 

  useEffect(() => {
    if (id) {
      const foundProperty = mockProperties.find(p => p.id === id);
      setProperty(foundProperty || null);
      if (foundProperty) {
        setIsFavorite(foundProperty.is_favorite || false);
        document.title = `${foundProperty.name || foundProperty.address} - ${t('propertyDetailPage.rentInBatumi')} | BinaGE Lite`;
      } else {
         document.title = `${t('propertyDetailPage.propertyNotFound')} | BinaGE Lite`;
      }
    }
  }, [id, t]);
  

  if (!property) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
          <Info className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-2xl font-semibold mb-2">{t('propertyDetailPage.propertyNotFoundTitle')}</h2>
          <p className="text-muted-foreground mb-6">{t('propertyDetailPage.propertyNotFoundMessage')}</p>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('propertyDetailPage.backButton')}
          </Button>
        </div>
      </div>
    );
  }
  
  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % property.photo_urls.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + property.photo_urls.length) % property.photo_urls.length);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    alert(isFavorite ? t('propertyDetailPage.removedFromFavorites') : t('propertyDetailPage.addedToFavorites'));
  };

  const handleShare = async () => {
    if (navigator.share && property) {
      try {
        await navigator.share({
          title: property.name || property.address,
          text: `${t('propertyDetailPage.checkOutProperty')}: ${property.description.substring(0, 100)}...`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        alert(t('propertyDetailPage.shareError'));
      }
    } else {
      alert(t('propertyDetailPage.shareNotAvailable'));
    }
  };

  const featureMap = [
    { labelKey: 'propertyDetailPage.features.rooms', value: property.rooms === 0 ? t('propertyDetailPage.features.studio') : `${property.rooms}`, icon: <DoorOpen className="w-6 h-6" /> },
    { labelKey: 'propertyDetailPage.features.area', value: `${property.area} m²`, icon: <Ruler className="w-6 h-6" /> },
    { labelKey: 'propertyDetailPage.features.floor', value: String(property.floor), icon: <Building className="w-6 h-6" /> },
    { labelKey: 'propertyDetailPage.features.heating', value: t(`propertyFilterForm.heatingOptions.${property.heating}` as any) || property.heating, icon: <Heater className="w-6 h-6" /> },
    { labelKey: 'propertyDetailPage.features.separateKitchen', value: property.separateKitchen, icon: <CookingPot className="w-6 h-6" /> }, 
    { labelKey: 'propertyDetailPage.features.hasBathtub', value: property.hasBathtub, icon: <Bath className="w-6 h-6" /> },
    { labelKey: 'propertyDetailPage.features.dishwasher', value: property.dishwasher, icon: <UtensilsCrossed className="w-6 h-6" /> },
    { labelKey: 'propertyDetailPage.features.oven', value: property.oven, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm-2 8H8v4h8Zm-2 8H8v-1.5h8V18Zm0-4.5H8V12h8v1.5Z"/></svg> } ,
    { labelKey: 'propertyDetailPage.features.petsAllowed', value: property.pets, icon: <Dog className="w-6 h-6" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <AppHeader />
      <ScrollArea className="flex-grow" id="property-detail-scroll">
        <div className="container mx-auto py-6 px-2 sm:px-4">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('propertyDetailPage.backButton')}
          </Button>

          <Card className="overflow-hidden shadow-xl rounded-xl">
            <CardHeader className="p-0 relative">
              {property.photo_urls.length > 0 ? (
                <div className="relative group">
                  <Image
                    src={property.photo_urls[currentImageIndex]}
                    alt={`${property.name || property.address} - Image ${currentImageIndex + 1}`}
                    width={1200}
                    height={600}
                    className="w-full h-[300px] md:h-[450px] lg:h-[550px] object-cover rounded-t-xl"
                    priority
                    data-ai-hint="apartment interior"
                  />
                  <Badge variant="secondary" className="absolute top-4 left-4 bg-black/70 text-white text-lg font-bold py-2 px-4 rounded-md border-none shadow-md">
                    <DollarSign className="inline h-5 w-5 mr-1.5" /> {property.price} {t('propertyDetailPage.priceUnit')}
                  </Badge>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleFavorite} 
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white hover:text-red-400 rounded-full w-10 h-10 shadow-md"
                    aria-label={isFavorite ? t('propertyDetailPage.removedFromFavorites') : t('propertyDetailPage.addToFavorites')}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </Button>

                  {property.photo_urls.length > 1 && (
                    <>
                      <Button onClick={prevImage} variant="outline" size="icon" className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white border-none opacity-70 group-hover:opacity-100 transition-opacity rounded-full shadow-md"> <ArrowLeft className="w-5 h-5"/> </Button>
                      <Button onClick={nextImage} variant="outline" size="icon" className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white border-none opacity-70 group-hover:opacity-100 transition-opacity rounded-full shadow-md"> <ArrowLeft className="w-5 h-5 rotate-180"/> </Button>
                       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {property.photo_urls.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`h-2.5 w-2.5 rounded-full ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'} transition-all`}
                            aria-label={`${t('propertyDetailPage.goToImage')} ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                 <Image
                    src="https://placehold.co/1200x600.png?text=No+Image+Available"
                    alt={t('propertyDetailPage.noImageAvailable')}
                    width={1200}
                    height={600}
                    className="w-full h-[300px] md:h-[450px] lg:h-[550px] object-cover rounded-t-xl"
                    data-ai-hint="placeholder house"
                  />
              )}
            </CardHeader>
            <CardContent className="p-4 md:p-6 lg:p-8">
              <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                  <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-800">
                    {property.name || t('propertyDetailPage.unnamedProperty')}
                  </CardTitle>
                  <div className="flex items-center text-muted-foreground text-base">
                    <MapPin className="mr-2 h-5 w-5 text-gray-500 flex-shrink-0" />
                    <span>{property.address}</span>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">{t('propertyDetailPage.keyFeaturesTitle')}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {featureMap.map(feature => (
                        <AmenityDisplay 
                          key={feature.labelKey} 
                          label={feature.labelKey}
                          value={feature.value} 
                          icon={feature.icon}
                          t={t}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {property.description && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-3 border-b pb-2 text-gray-700">{t('propertyDetailPage.descriptionTitle')}</h3>
                      <CardDescription className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                        {property.description}
                      </CardDescription>
                    </div>
                  )}
                  
                  <div className="mt-8 hidden lg:block">
                     <Button 
                        size="lg" 
                        className="w-full text-lg py-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                        onClick={() => {
                            const contactSection = document.getElementById('contact-details-section');
                            if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                      >
                        {t('propertyDetailPage.contactLandlordTitle')}
                      </Button>
                  </div>

                </div>

                <div className="lg:col-span-1 space-y-6" id="contact-details-section">
                  <Card className="shadow-lg rounded-lg border">
                    <CardHeader className="bg-slate-100 rounded-t-lg p-4">
                      <CardTitle className="text-lg text-center text-gray-700">{t('propertyDetailPage.contactOptionsTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      {property.owner_contact.email && (
                        <Button variant="outline" className="w-full justify-center py-3 text-base border-gray-300 hover:border-primary hover:bg-primary/5" asChild>
                          <a href={`mailto:${property.owner_contact.email}`} className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-primary" /> {t('propertyDetailPage.contact.email')}
                          </a>
                        </Button>
                      )}
                      {property.owner_contact.phone && (
                        <Button variant="outline" className="w-full justify-center py-3 text-base border-gray-300 hover:border-primary hover:bg-primary/5" asChild>
                          <a href={`tel:${property.owner_contact.phone}`} className="flex items-center gap-2">
                           <Phone className="h-5 w-5 text-primary" /> {t('propertyDetailPage.contact.call')}
                          </a>
                        </Button>
                      )}
                      {property.owner_contact.telegram && (
                        <Button variant="outline" className="w-full justify-center py-3 text-base border-gray-300 hover:border-primary hover:bg-primary/5" asChild>
                          <a href={`https://t.me/${property.owner_contact.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Send className="h-5 w-5 text-primary" /> Telegram
                          </a>
                        </Button>
                      )}
                       {!property.owner_contact.email && !property.owner_contact.phone && !property.owner_contact.telegram && (
                         <p className="text-sm text-center text-muted-foreground py-4">{t('propertyDetailPage.contact.notProvided')}</p>
                       )}
                    </CardContent>
                  </Card>
                  
                  <Button 
                    onClick={handleShare} 
                    variant="outline" 
                    className="w-full py-3 text-base border-gray-300 hover:border-accent hover:bg-accent/10"
                  >
                    <Share2 className="mr-2 h-5 w-5 text-primary" /> {t('propertyDetailPage.shareButton')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
      <div className="sticky bottom-0 left-0 right-0 lg:hidden p-3 bg-background/90 backdrop-blur-sm border-t z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.1)]">
        <Button 
          size="lg" 
          className="w-full text-base py-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
          onClick={() => {
            const contactSection = document.getElementById('contact-details-section');
            if (contactSection) {
               contactSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              alert(t('propertyDetailPage.contactLandlordMobilePrompt'));
            }
          }}
        >
          {t('propertyDetailPage.contactLandlordTitle')}
        </Button>
      </div>
    </div>
  );
}
