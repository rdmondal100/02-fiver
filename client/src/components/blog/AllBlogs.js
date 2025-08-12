"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import BlogCard from "./BlogCard";
import CategoryTabs from "./CategoryTabs";
import Link from "next/link";
import { getWPBaseUrl } from "@/utils/constants";

 
  const WP_BASE_URL = getWPBaseUrl();

const BlogSection = () => {
  const [categories, setCategories] = useState([{ id: 0, name: "All" }]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

const [totalPosts, setTotalPosts] = useState(0);
const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchArticles(1);
    }
  }, [selectedCategory, categories]);

  // Fetch all categories from WordPress
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${WP_BASE_URL}/categories?per_page=100`);
      const formatted = [{ id: 0, name: "All" }, ...res.data.map((cat) => ({
        id: cat.id,
        name: cat.name
      }))].filter((cat)=>cat?.name!="Uncategorized");
      console.log(formatted)
      setCategories(formatted);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  // Fetch posts from WordPress
  const fetchArticles = async (page = 1) => {
    try {
      const PAGE_LIMIT= 10
      setLoading(true);
      let endpoint = `${WP_BASE_URL}/posts?_embed&per_page=${PAGE_LIMIT}&page=${page}`;

      // If category is selected and not "All"
      if (selectedCategory !== "All") {
        const categoryObj = categories.find((cat) => cat.name === selectedCategory);
        if (categoryObj) {
          endpoint = `${WP_BASE_URL}/posts?_embed&per_page=10&page=${page}&categories=${categoryObj.id}`;
        }
      }

      const res = await axios.get(endpoint);
      const readHeader = (headers,name)=>{
        const key = Object.keys(headers).find(k=>k.toLocaleLowerCase()===name.toLocaleLowerCase())
        return key? headers[key] : undefined
      }

      const totalStr = readHeader(res.headers, "x-wp-total") || "0";
      const totalPagesStr = readHeader(res.headers, "x-wp-totalpages") || "1";
      console.log(totalStr)
      console.log(totalPagesStr)
 const parsedTotal = parseInt(totalStr, 10) || 0;
    const parsedTotalPages = parseInt(totalPagesStr, 10) || 1;

    setTotalPosts(parsedTotal);
    setTotalPages(parsedTotalPages);

      // Format articles for BlogCard
      const processedArticles = res.data.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title.rendered,
        description: post.excerpt.rendered.replace(/<[^>]+>/g, ""), 
        image:
          post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
          "https://placehold.co/600x400/png",
        category: post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Uncategorized",
        url: post.link,
      }));

      if (page === 1) {
        setArticles(processedArticles);
      } else {
        setArticles((prev) => [...prev, ...processedArticles]);
      }


    if (!Number.isNaN(parsedTotalPages)) {
      setHasMore(page < parsedTotalPages);
    } else {
      // fallback: if we got a full page, there *might* be more
      setHasMore(processedArticles.length === PAGE_LIMIT);
    }


      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  const handleSeeMore = () => {
    fetchArticles(currentPage + 1);
  };



  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Tabs */}
      <CategoryTabs
        categories={categories.map((cat) => cat.name)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Articles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <BlogCardLoader key={index} />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-12">
          No Blog found
          {selectedCategory && selectedCategory !== "All" && (
            <> for <span className="font-semibold">{selectedCategory}</span></>
          )}
          .
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link key={article.id} href={`/nature-news/${article.slug}`}>
              <div
          
                className="cursor-pointer !min-h-[368px]"
              >
                <BlogCard
                  category={article.category}
                  title={article.title}
                  description={article.description}
                  image={article.image}
                />
              </div>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={handleSeeMore}
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogSection;

// Skeleton Loader Component
const BlogCardLoader = () => {
  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-pulse">
      <div className="relative h-48 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
        </div>
        <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};
