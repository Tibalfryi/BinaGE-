// src/app/property/[id]/page.tsx
"use client"; 

import type { Metadata, ResolvingMetadata } from 'next';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Property } from '@/types';
import { mockProperties } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ArrowLeft, BedDouble, Building, DollarSign, Dog, CheckCircle, XCircle, Mail, Phone, Send, Ruler, Heater, Home as HomeIcon, Share2, Heart, MessageCircle, Info
} from 'lucide-react';
import { AppHeader } from '@/components/layout/app-header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/context/language-context'; // Assuming you have a language context for translations
import { useTranslation } from '@/hooks/use-translation'; // Assuming you have a translation hook

// Helper to get amenity icon and text
const AmenityDisplay = ({ label, value, icon, t }: { label: string; value: boolean | string | number; icon: React.ReactNode; t: (key: string) => string }) => (
  <div className="flex flex-col items-center text-center p-3 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
    <div className="text-primary mb-1.5">{icon}</div>
    <span className="text-xs text-muted-foreground mb-0.5">{t(label)}</span>
    {typeof value === 'boolean' ? (
      value ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
    ) : (
      <span className="text-sm font-semibold capitalize">{String(value)}</span>
    )}
  </div>
);

interface PropertyDetailPageProps {
  params: { id: string };
}

// export async function generateMetadata(
//   { params }: PropertyDetailPageProps,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const id = params.id;
//   const property = mockProperties.find(p => p.id === id);

//   if (!property) {
//     return {
//       title: 'Property Not Found - BinaGE Lite',
//       description: 'The property you are looking for could not be found.',
//     };
//   }

//   const title = `${property.name || property.address} - Rent in Batumi | BinaGE Lite`;
//   const description = property.description.substring(0, 160) + (property.description.length > 160 ? '...' : '');
//   const imageUrl = property.photo_urls[0] || 'https://placehold.co/1200x630.png?text=BinaGE+Property';

//   return {
//     title: title,
//     description: description,
//     openGraph: {
//       title: title,
//       description: description,
//       images: [{ url: imageUrl, width: 1200, height: 630, alt: property.name || property.address }],
//       type: 'article', // or 'product' if more appropriate
//       // url: `your-app-url/property/${id}`, // Replace with actual URL
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: title,
//       description: description,
//       images: [imageUrl],
//     },
//   };
// }


export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { t } = useTranslation(); // For future i18n of this page

  useEffect(() => {
    if (id) {
      const foundProperty = mockProperties.find(p => p.id === id);
      setProperty(foundProperty || null);
      if (foundProperty) {
        setIsFavorite(foundProperty.is_favorite || false);
        // Update document title dynamically on client-side as fallback or if generateMetadata is not used/sufficient
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
    // Here you would typically update the backend or global state
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
    { labelKey: 'propertyDetailPage.features.rooms', value: property.rooms === 0 ? t('propertyDetailPage.features.studio') : `${property.rooms}`, icon: <BedDouble className="w-6 h-6" /> },
    { labelKey: 'propertyDetailPage.features.area', value: `${property.area} m²`, icon: <Ruler className="w-6 h-6" /> },
    { labelKey: 'propertyDetailPage.features.floor', value: String(property.floor), icon: <Building className="w-6 h-6" /> },
    { labelKey: 'propertyDetailPage.features.heating', value: t(`propertyFilterForm.heatingOptions.${property.heating}` as any) || property.heating, icon: <Heater className="w-6 h-6" /> },
    { labelKey: 'propertyDetailPage.features.balcony', value: property.balcony, icon: <HomeIcon className="w-6 h-6" /> },
    { labelKey: 'propertyDetailPage.features.dishwasher', value: property.dishwasher, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.643 10.055L10.055 12.643M10.055 10.055L12.643 12.643"/><path d="M16.079 6.611L6.611 16.079M6.611 6.611L16.079 16.079"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg> } ,
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
              {property.photo_urls.length > 0 && (
                <div className="relative group">
                  <Image
                    src={property.photo_urls[currentImageIndex]}
                    alt={`${property.name || property.address} - Image ${currentImageIndex + 1}`}
                    width={1200}
                    height={600}
                    className="w-full h-[300px] md:h-[450px] lg:h-[550px] object-cover rounded-t-xl"
                    priority
                    data-ai-hint="apartment building photo"
                  />
                  {/* Price Badge */}
                  <Badge variant="secondary" className="absolute top-4 left-4 bg-black/60 text-white text-lg font-bold py-2 px-4 rounded-md border-none">
                    <DollarSign className="inline h-5 w-5 mr-1.5" /> {property.price} {t('propertyDetailPage.priceUnit')}
                  </Badge>

                  {/* Favorite Button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleFavorite} 
                    className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white hover:text-red-400 rounded-full w-10 h-10"
                    aria-label={isFavorite ? t('propertyDetailPage.removeFromFavorites') : t('propertyDetailPage.addToFavorites')}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </Button>

                  {property.photo_urls.length > 1 && (
                    <>
                      <Button onClick={prevImage} variant="outline" size="icon" className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white border-none opacity-70 group-hover:opacity-100 transition-opacity"> <ArrowLeft className="w-5 h-5"/> </Button>
                      <Button onClick={nextImage} variant="outline" size="icon" className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white border-none opacity-70 group-hover:opacity-100 transition-opacity"> <ArrowLeft className="w-5 h-5 rotate-180"/> </Button>
                       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {property.photo_urls.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`h-2 w-2 rounded-full ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'} transition-all`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4 md:p-6 lg:p-8">
              <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
                    {property.name || t('propertyDetailPage.propertyDetailsTitle')}
                  </CardTitle>
                  <div className="flex items-center text-muted-foreground text-sm sm:text-base">
                    <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                    <span>{property.address}</span>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">{t('propertyDetailPage.keyFeaturesTitle')}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
                  
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-3 border-b pb-2">{t('propertyDetailPage.descriptionTitle')}</h3>
                    <CardDescription className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                      {property.description}
                    </CardDescription>
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <Card className="shadow-lg rounded-lg border">
                    <CardHeader className="bg-slate-100 rounded-t-lg p-4">
                      <CardTitle className="text-lg text-center">{t('propertyDetailPage.contactLandlordTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      {property.owner_contact.email && (
                        <Button variant="outline" className="w-full justify-center py-3 text-base" asChild>
                          <a href={`mailto:${property.owner_contact.email}`} className="flex items-center gap-2">
                            <Mail className="h-5 w-5" /> {t('propertyDetailPage.contact.email')}
                          </a>
                        </Button>
                      )}
                      {property.owner_contact.phone && (
                        <Button variant="outline" className="w-full justify-center py-3 text-base" asChild>
                          <a href={`tel:${property.owner_contact.phone}`} className="flex items-center gap-2">
                           <Phone className="h-5 w-5" /> {t('propertyDetailPage.contact.call')}
                          </a>
                        </Button>
                      )}
                      {property.owner_contact.telegram && (
                        <Button variant="outline" className="w-full justify-center py-3 text-base" asChild>
                          <a href={`https://t.me/${property.owner_contact.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Send className="h-5 w-5" /> Telegram
                          </a>
                        </Button>
                      )}
                       {/* Placeholder for WhatsApp if data exists
                       {property.owner_contact.whatsapp && (
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <a href={`https://wa.me/${property.owner_contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                           <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                          </a>
                        </Button>
                       )}
                       */}
                       {!property.owner_contact.email && !property.owner_contact.phone && !property.owner_contact.telegram && (
                         <p className="text-sm text-center text-muted-foreground py-4">{t('propertyDetailPage.contact.notProvided')}</p>
                       )}
                    </CardContent>
                  </Card>
                  
                  <Button 
                    onClick={handleShare} 
                    variant="outline" 
                    className="w-full py-3 text-base"
                  >
                    <Share2 className="mr-2 h-5 w-5" /> {t('propertyDetailPage.shareButton')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
      {/* Fixed Contact Button for Mobile */}
      <div className="sticky bottom-0 left-0 right-0 md:hidden p-3 bg-background/80 backdrop-blur-sm border-t z-10 shadow-top">
        <Button 
          size="lg" 
          className="w-full text-base py-3 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => {
            // Option 1: Scroll to contact section
            const contactSection = document.getElementById('contact-card-section'); // You'd need to add this ID to the contact card
            if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
            // Option 2: Show a modal with contact options (more complex)
            // Option 3: For simplicity, an alert or direct to one contact method
            alert(t('propertyDetailPage.contactLandlordMobilePrompt'));
          }}
        >
          {t('propertyDetailPage.contactLandlordTitle')}
        </Button>
      </div>
    </div>
  );
}
