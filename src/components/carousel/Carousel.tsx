"use client";

import { Box, styled } from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { CarouselProps } from "./types";

const StyledBox = styled(Box)({
  "& .swiper-button-next, & .swiper-button-prev": {
    color: "inherit",
    "&::after": {
      fontSize: "1.2rem",
    },
  },
  "& .swiper-pagination-bullet": {
    backgroundColor: "grey",
    "&-active": {
      backgroundColor: "primary.main",
    },
  },
});

const Carousel = ({
  children,
  spacing = "15",
  infinite = false,
  autoPlay = false,
  interval = 2000,
  showDots = false,
  showArrow = true,
  visibleSlides = 5,
  sx = {},
}: CarouselProps) => {
  return (
    <StyledBox sx={sx}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={spacing}
        slidesPerView={visibleSlides}
        loop={infinite}
        autoplay={
          autoPlay
            ? {
                delay: interval,
                disableOnInteraction: false,
              }
            : false
        }
        pagination={
          showDots
            ? {
                clickable: true,
              }
            : false
        }
        navigation={showArrow}
      >
        {Array.isArray(children) &&
          children.map((child, ind) => (
            <SwiperSlide key={ind}>{child}</SwiperSlide>
          ))}
      </Swiper>
    </StyledBox>
  );
};

export default Carousel;
