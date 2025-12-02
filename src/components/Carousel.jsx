import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Carousel = ({ items = [], renderItem, slidesPerView = { base: 1 }, spaceBetween = 16 }) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const onBeforeInit = (swiper) => {
        swiper.params.navigation = swiper.params.navigation || {};
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
    };

    // ensure navigation picks up refs after mount
    useEffect(() => {
        // nothing to clean up; navigation is initialized in onSwiper below
    }, []);

    return (
        <div className="relative">
            <button ref={prevRef} aria-label="previous" className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-2 shadow">
                ‹
            </button>
            <button ref={nextRef} aria-label="next" className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-2 shadow">
                ›
            </button>

            <Swiper
                modules={[Navigation, Autoplay]}
                onBeforeInit={onBeforeInit}
                navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                slidesPerView={slidesPerView.base ?? 1}
                spaceBetween={spaceBetween}
                breakpoints={{
                    768: { slidesPerView: slidesPerView.md ?? 2 },
                    1024: { slidesPerView: slidesPerView.lg ?? 3 },
                }}
                onSwiper={(swiper) => {
                    // ensure swiper navigation is initialized once refs exist
                    setTimeout(() => {
                        if (swiper?.navigation) {
                            try {
                                swiper.navigation.init();
                                swiper.navigation.update();
                            } catch (e) {
                                /* ignore if refs not ready yet */
                            }
                        }
                    }, 0);
                }}
            >
                {items.map((item, idx) => (
                    <SwiperSlide key={idx}>{renderItem(item)}</SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Carousel;