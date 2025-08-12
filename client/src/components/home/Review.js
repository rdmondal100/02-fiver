import React from 'react';
import { FaStar } from 'react-icons/fa';

const reviews = [
  {
    name: "Alina, Poland",
    title: '🗣️ Feels like traveling without a passport.',
    review:
      "I’ve spoken with people from five different countries this week. Enlighten makes learning exciting — it’s like exploring the world from my room.",
  },
  {
    name: "Miguel, Mexico",
    title: '💬 My confidence in speaking went from 2 to 10.',
    review:
      "I used to freeze up in conversations. Now I speak with native English speakers daily. The correction tools and friendly chats make all the difference.",
  },
  {
    name: "Amina, Egypt",
    title: '🌟 Finally, an app that speaks my language — literally.',
    review:
      "The cultural exchanges are beautiful. I’ve learned slang, humor, and even traditional songs. This isn’t just about words — it’s about people.",
  },
  {
    name: "Lucas, Germany",
    title: '🧠 Fun, fast, and feels natural.',
    review:
      "Language learning used to feel like homework. Enlighten makes it feel like play. I talk, I laugh, I learn — and the app’s design makes it easy.",
  },
  {
    name: "Yui, Japan",
    title: '🌺 It’s like having pen pals... but better.',
    review:
      "I wanted to practice French but ended up making a friend in Paris. We now send voice notes every day. Enlighten makes that possible.",
  },
  {
    name: "Raj, India",
    title: '🔥 You’ll forget you’re even studying.',
    review:
      "I come for the language but stay for the conversations. It’s social, supportive, and seriously addictive in the best way.",
  },
];

const Testimonials = () => {
  return (
    <div className="bg-gray-50 py-20">
      <div className="text-center mb-10">
        <h2 className="text-[35px] font-semibold text-primary">🌍 People Love Enlighten!</h2>
        <p className="text-gray-600 font-bold mt-3">Over 100,000 5-star reviews from language learners around the world!</p>
      </div>
      <div className=" max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 mx-auto">
        {reviews.map((review, index) => (
          <div key={index} className="p-6 rounded-lg">
            <div className="flex justify-center mb-4 space-x-2">
              {Array(5)
                .fill()
                .map((_, i) => (
                  <FaStar key={i} className="text-[#ff9400] text-4xl" />
                ))}
            </div>
            <p className='text-gray-800 mb-2 text-center font-semibold'>{review.title}</p>
            <p className="text-gray-700 mb-4 opacity-80 text-center">
              "{review.review}"
            </p>
            <p className="text-center font-semibold opacity-80">{review.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
