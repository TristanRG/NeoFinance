import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';

export default function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/news/')
      .then((res) => {
        let primary = (res.data.articles || []).filter(
          (art) => art.image && art.image.trim() !== ''
        );

        if (primary.length >= 9) {
          setArticles(primary.slice(0, 9));
          setLoading(false);
        } else {
          api.get('/news/fallback/')
            .then((fallbackRes) => {
              const fallback = (fallbackRes.data.articles || []).filter(
                (art) => art.image && art.image.trim() !== ''
              );

              const combined = [...primary];
              const seenUrls = new Set(primary.map((a) => a.url));

              for (let fb of fallback) {
                if (combined.length >= 9) break;
                if (!seenUrls.has(fb.url)) {
                  combined.push(fb);
                  seenUrls.add(fb.url);
                }
              }

              setArticles(combined);
            })
            .catch((supplementErr) => {
              console.error('Failed to supplement from fallback:', supplementErr);
              setArticles(primary); 
            })
            .finally(() => setLoading(false));
        }
      })
      .catch((err) => {
        console.error('Primary API failed, trying fallback:', err);
        api.get('/news/fallback/')
          .then((res) => {
            const fallbackFiltered = (res.data.articles || [])
              .filter((art) => art.image && art.image.trim() !== '')
              .slice(0, 9);
            setArticles(fallbackFiltered);
          })
          .catch((fallbackErr) => {
            console.error('Fallback also failed:', fallbackErr);
            setError('Could not load finance news.');
          })
          .finally(() => setLoading(false));
      });
  }, []);

  if (loading) return <p className="py-8 text-center">Loading news…</p>;
  if (error) return <p className="py-8 text-center text-red-500">{error}</p>;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
            <img src={art.image} alt="" className="w-full h-40 object-cover" />
            <div className="p-4 space-y-2">
              <h3 className="font-semibold line-clamp-2">{art.title}</h3>
              {art.description && (
                <p className="text-sm text-gray-600 line-clamp-3">{art.description}</p>
              )}
              <div className="text-xs text-gray-500">
                {new Date(art.publishedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })} — {art.source}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
