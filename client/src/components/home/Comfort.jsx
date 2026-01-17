import React from "react";
import Container from "../common/Container";
import comfort from "../../../public/638b1d9333f59.png";
import Image from "next/image";

const Comfort = () => {
  return (
    <section className="py-6 px-4 md:py-10">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* TEXT */}
          <div className="text-left">
            <h1 className="text-2xl md:text-4xl font-bold">
              Pick & Go
            </h1>

            <h3 className="text-lg md:text-2xl w-full text-gray-600 font-medium ">
              Because comfort and confidence go hand in hand.
            </h3>

            <p className="text-gray-600 text-sm md:text-sm w-full md:w-2xl ">
              We focus on carefully selecting the best clothing that is
              comfortable, looks great, and makes you confident. Apart from the
              fabric, design and fit, we go through strict quality control
              parameters to give you what you truly deserve. The power of a good
              outfit is how it can influence your perception of yourself.
            </p>
          </div>

          {/* IMAGE */}
          <div className="w-full md:w-auto flex justify-center">
            <Image
              src={comfort}
              width={500}
              height={500}
              alt="comfort"
              className="w-[360px] sm:w-[320px] md:w-[500px] h-auto"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Comfort;
