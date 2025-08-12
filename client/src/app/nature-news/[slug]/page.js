import { getWPBaseUrl } from "@/utils/constants";
import axios from "axios";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { BsCircleFill } from "react-icons/bs";
import { FaMessage } from "react-icons/fa6";

// Fetch post data from WordPress by slug
async function getPost(slug) {
  try {
      const WP_BASE_URL = getWPBaseUrl();

    console.log(`${WP_BASE_URL}/posts?_embed&slug=${slug}`)
    const res = await axios.get(`${WP_BASE_URL}/posts?_embed&slug=${slug}`)
    console.log(res);
    const post = res.data?.[0];
    console.log(post)

    if (!post) return null;

    return {
      title: post.title.rendered,
      content: post.content.rendered,
      image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
      date: post.date,
      author: post._embedded?.author?.[0]?.name || "Unknown Author",
      category: post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Uncategorized",
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function BlogPostPage({ params }) {
  console.log(params);
  console.log(params.slug);
  const post = await getPost(params.slug);

  if (!post) return notFound();

  const formattedDate = format(new Date(post.date), "MMMM dd, yyyy");

  return (
    <article className="max-w-4xl mx-auto px-4 py-10">
      {/* Featured Image or Fallback */}
      {post.image ? (
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-lg shadow-md mb-8">
          <img
            src={post.image}
            alt="Featured"
            className="w-full h-full object-cover brightness-75"
          />
        </div>
      ) : (
        <div className="h-[200px] w-full rounded-lg shadow-md mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      )}

      {/* Title & Meta */}
      <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1
          className="text-3xl md:text-4xl font-extrabold leading-tight text-gray-900 dark:text-white"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {/* Category Badge */}
          <span className="inline-block bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-3 py-1 rounded-full font-medium tracking-wide uppercase text-xs">
            {post.category}
          </span>

          {/* Date */}
          <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <FaMessage />
            {formattedDate}
          </span>

          {/* Author */}
          <span className="text-primary/80 dark:text-gray-400 flex items-center gap-1">
            <BsCircleFill />
            {post.author}
          </span>
        </div>
      </div>

      {/* Post Content */}
      <div className="prose dark:prose-invert prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  );
}
