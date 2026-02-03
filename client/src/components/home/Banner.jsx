"use client";
import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/banner/getallbanner`)
      .then((res) => {
        setBanners(res?.data?.data ?? []);
      })
      .catch((err) => {
        console.error("Banner Load Error:", err);
      });
  }, []);

  // Slick slider settings
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    arrows: false,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <section className="my-4 sm:my-6 lg:my-8">
      <Container>
        <div className="banner-slider">
          <Slider {...settings}>
            {banners.map((item) => (
              <div key={item._id} className="outline-none">
                <div className="relative w-full overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl">
                  <img
                    src={item.image}
                    alt="banner"
                    className="w-full h-[180px] xs:h-[220px] sm:h-[280px] md:h-[360px] lg:h-[450px] xl:h-[500px] object-cover"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </Container>

      <style jsx global>{`
        /* Slider dots customization */
        .banner-slider .slick-dots {
          bottom: 15px;
        }

        .banner-slider .slick-dots li button:before {
          font-size: 10px;
          color: white;
          opacity: 0.5;
        }

        .banner-slider .slick-dots li.slick-active button:before {
          color: white;
          opacity: 1;
        }

        /* Arrow customization */
        .banner-slider .slick-prev,
        .banner-slider .slick-next {
          z-index: 10;
          width: 40px;
          height: 40px;
        }

        .banner-slider .slick-prev {
          left: 15px;
        }

        .banner-slider .slick-next {
          right: 15px;
        }

        .banner-slider .slick-prev:before,
        .banner-slider .slick-next:before {
          font-size: 40px;
          opacity: 0.7;
        }

        .banner-slider .slick-prev:hover:before,
        .banner-slider .slick-next:hover:before {
          opacity: 1;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .banner-slider .slick-dots {
            bottom: 10px;
          }

          .banner-slider .slick-dots li button:before {
            font-size: 8px;
          }
        }

        /* Remove default outline on focus */
        .banner-slider .slick-slide {
          outline: none;
        }

        .banner-slider .slick-slide > div {
          outline: none;
        }
      `}</style>
    </section>
  );
};

export default Banner;