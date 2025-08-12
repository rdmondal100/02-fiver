"use client";
import Image from 'next/image';

const people = [
  {
    name: 'Irma',
    nativeLanguage: 'German',
    learningLanguage: 'English',
    imageSrc: 'https://res.cloudinary.com/dh20zdtys/image/upload/v1723734938/jane_xtm2nz.jpg',
  },
  {
    name: 'Jane',
    nativeLanguage: 'English',
    learningLanguage: 'Spanish',
    imageSrc: 'https://res.cloudinary.com/dh20zdtys/image/upload/v1723734935/irma_ycsya6.jpg',
  },
];

const TeamSection = () => {
  return (
    <div className="mt-20 px-4 flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-semibold text-primary">
          What is Enlighten?
        </h2>
        <p className="mt-6 text-base sm:text-lg text-primary font-medium">
          The language learning app where people teach each other languages while sharing commitment to safeguarding our environment.
        </p>
        <p className="text-xl font-bold text-[#2e7d32] mt-5">
          Join us as we learn from each other and unite in our mission to protect our planet!
        </p>
      </div>

      {/* Cards Section */}
      <div className="mt-16 flex flex-col lg:flex-row items-center justify-center gap-10 w-full">
        {people.map((person, index) => (
          <div key={index} className="relative w-full max-w-sm">
            <Image
              src={person.imageSrc}
              alt={person.name}
              width={500}
              height={500}
              className="object-cover w-full h-auto rounded-xl shadow-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 rounded-b-xl">
              <p className="text-white text-lg sm:text-xl">
                {person.name} – native speaker of {person.nativeLanguage}.<br />
                Learns {person.learningLanguage}.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div >
  );
};

export default TeamSection;
