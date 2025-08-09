jsx
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

import { IoHeartOutline, IoHeart } from 'react-icons/io5'; // Иконки сердца

// --- Компонент Лайтбокса ---
const Lightbox = ({ images, currentIndex, onClose }) => {
  const [swiper, setSwiper] = useState(null);
  const [initialSlideSet, setInitialSlideSet] = useState(false);

  // Использование эффекта для установки начального слайда после инициализации Swiper
  useEffect(() => {
    if (swiper && images && !initialSlideSet) {
      swiper.slideTo(currentIndex, 0); // Устанавливаем начальный слайд без анимации
      setInitialSlideSet(true);
    }
  }, [swiper, images, currentIndex, initialSlideSet]);


  if (!images || images.length === 0) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      onClick={onClose} // Закрыть при клике вне изображения
    >
      <button
        className="absolute top-4 right-4 text-white text-3xl"
        onClick={onClose}
      >
        &times; {/* Простой крестик для закрытия */}
      </button>

      <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}> {/* Предотвратить закрытие при клике по Swiper */}
        <Swiper
          onSwiper={setSwiper} // Получаем экземпляр Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          navigation={images.length > 1} // Навигация только если фото > 1
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-full" // Swiper занимает всю доступную область модального окна
        >
          {images.map((item, index) => (
            <SwiperSlide key={index} className="flex items-center justify-center"> {/* Центрируем слайд */}
              <img src={item.original} alt={`Fullscreen photo ${index + 1}`} className="max-w-full max-h-full object-contain" /> {/* Изображение подстраивается */}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

// --- Компонент Галереи Недвижимости ---

// Предполагаемая структура данных объекта недвижимости
const mockPropertyData = {
  id: "111",
  photos: [
    "https://images.unsplash.com/photo-1568605114936-8da185aa6491?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1574362811049-c93bd705b07d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
     "https://images.unsplash.com/photo-1574362811049-c93bd705b07d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1574362811049-c93bd705b07d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
  ],
  price: 600,
  favorite: false
};

const PropertyGallery = ({ propertyId }) => {
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); // Состояние для кнопки избранного

  const [lightboxOpen, setLightboxOpen] = useState(false); // Состояние для лайтбокса
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Индекс текущего фото в лайтбоксе


  useEffect(() => {
    // В реальном приложении здесь будет запрос к Supabase
    const fetchPropertyData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки
        const data = mockPropertyData;
        const error = null;

        if (error) {
          setError(error);
        } else {
          setPropertyData(data);
          setIsFavorite(data.favorite); // Устанавливаем начальное состояние избранного
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [propertyId]);

  // Переключение состояния избранного (без сохранения в Supabase в этой версии)
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Реализовать сохранение в Supabase
  };

  // Открытие лайтбокса по клику на слайд
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  // Закрытие лайтбокса
  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImageIndex(0); // Сбрасываем индекс при закрытии
  };


  if (loading) {
    return <div className="flex justify-center items-center h-72">Загрузка...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-72 text-red-500">Ошибка загрузки данных: {error.message}</div>;
  }

  if (!propertyData || !propertyData.photos || propertyData.photos.length === 0) {
    return <div className="flex justify-center items-center h-72">Фотографии отсутствуют.</div>;
  }

  const { photos, price } = propertyData;

  const images = photos.map(url => ({ original: url }));

  const showNavigation = images.length > 1;

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-md" style={{ height: '40vh' }}> {/* Высота и стили контейнера */}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={showNavigation}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-full" // Swiper занимает всю высоту и ширину контейнера
      >
        {images.map((item, index) => (
          <SwiperSlide key={index} onClick={() => openLightbox(index)}> {/* Добавляем обработчик клика */}
            <img
              src={item.original}
              alt={`Property photo ${index + 1}`}
              className="w-full h-full object-cover cursor-pointer" // Курсор "указующий палец"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Блок с ценой */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 rounded-xl px-3 py-1 text-white text-xl font-bold shadow-md z-10">
        {price}$
      </div>

      {/* Кнопка "В избранное" */}
      <button
        className="absolute top-4 right-4 z-10 text-white text-3xl focus:outline-none"
        onClick={toggleFavorite}
        aria-label="Добавить в избранное"
      >
        {isFavorite ? <IoHeart className="text-red-500" /> : <IoHeartOutline />} {/* Иконка меняется */}
      </button>

      {/* Компонент Лайтбокса */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
};

export default PropertyGallery;