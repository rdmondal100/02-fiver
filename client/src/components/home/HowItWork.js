import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      title: "1. Join the community",
      description:
        "Download the app and register – it’s free! We review each application individually to ensure the Enlighten’s community remains a safe and welcoming place for our users.",
      imgSrc: "/phone2.png",
    },
    {
      title: "2. Find your partner",
      description:
        "Immediately after registration, we will help you to find suitable partners. Use filters by language, location, interests and other parameters.",
      imgSrc: "/phone3.png",
    },
    {
      title: "3. Start communicating!",
      description:
        "Use message correction and translation functions right in the application.",
      imgSrc: "/phone4.png",
    },
  ];

  return (
    <div className="flex flex-col items-center px-4  bg-cover bg-center w-full mt-20 ">
      <h1 className="text-[35px] font-semibold mb-8 text-primary">
        How does Enlighten work?
      </h1>

      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-between w-full max-w-4xl mb-12`}
        >
          {/* Phone Image */}
          <div className="w-full md:w-1/2 flex justify-center mb-4 md:mb-0">
            <img src={step.imgSrc} alt={`Step ${index + 1}`} className="max-w-xs" />
          </div>

          {/* Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left md:ml-8">
            <h3 className="text-[30px] font-semibold mb-4 text-primary">{step.title}</h3>
            <p className="text-[20px] text-primary font-medium">{step.description}</p>
          </div>
        </div>
      ))}

    </div>
  );
};

export default HowItWorks;
