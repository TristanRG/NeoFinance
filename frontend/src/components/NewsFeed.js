import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';  

export default function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    api.get('/news/')           
      .then((res) => {
        setArticles(res.data.articles || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed loading news:', err);
        setError('Could not load finance news.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="py-8 text-center">Loading news…</p>;
  if (error)   return <p className="py-8 text-center text-red-500">{error}</p>;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible:{ opacity: 1, y: 0 }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">Latest Finance News</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((art, i) => (
          <motion.a
            key={i}
            href={art.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            {art.image
              ? <img src={art.image} alt="" className="w-full h-40 object-cover"/>
              : <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
            }
            <div className="p-4 space-y-2">
              <h3 className="font-semibold line-clamp-2">{art.title}</h3>
              {art.description && (
                <p className="text-sm text-gray-600 line-clamp-3">{art.description}</p>
              )}
              <div className="text-xs text-gray-500">
                {new Date(art.publishedAt).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'short', day: 'numeric'
                })} — {art.source}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
