"use client";

import React, { useEffect, useState } from "react";

type NewsItem = {
  title: string;
  url: string;
  source: { name: string };
};

type StockItem = {
  symbol: string;
  price: number;
  changesPercentage: number;
};

const Widgets = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [stocks, setStocks] = useState<StockItem[]>([]);

  // Fetch latest news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `https://api.currentsapi.services/v1/latest-news?apiKey=ee2wwMgqeQSNwpa3Pn1qq_na8DRD8rNsEYd99YNjgDT_L1rB&language=en`
        );
        const data = await res.json();
        setNews(data.news.slice(0, 5)); // ✅ fix here
      } catch (err) {
        console.error("News error:", err);
      }
    };

    fetchNews();
  }, []);

  // Fetch stock data
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch(
          `https://financialmodelingprep.com/api/v3/quote/AAPL,GOOGL,MSFT,AMZN,TSLA?apikey=DiShNfZqh4YsxDuJCI6k2HIVwZWBWjI6`
        );
        const data = await res.json();
        setStocks(data);
      } catch (err) {
        console.error("Stock error:", err);
      }
    };

    fetchStocks();
  }, []);
  console.log("Stocks:", stocks);
  console.log("News:", news);

  return (
    <div>
      {/* Right - Widgets */}
      <div className="flex-1 space-y-8 mr-20">
        {/* News Widget */}
        <div className="bg-white/30 backdrop-blur-lg border border-primary/30 p-6 rounded-2xl shadow-lg overflow-hidden h-[300px] min-w-[600px]">
          <h2 className="text-xl font-bold text-primary mb-3">
            📰 Latest News
          </h2>
          <div className="overflow-hidden h-[230px] relative">
            <div className="animate-slideUp space-y-4">
              {news.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-gray-800 hover:text-primary font-medium transition-colors duration-200"
                >
                  • {item.title}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Stocks Widget */}
        <div className="bg-white/30 backdrop-blur-lg border border-primary/30 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-primary mb-3">📈 Stocks</h2>
          <ul className="space-y-2">
            {stocks.map((stock, idx) => (
              <li
                key={idx}
                className="flex justify-between text-sm font-medium text-gray-800"
              >
                <span>{stock.symbol}</span>
                <span>
                  ${stock.price.toFixed(2)}{" "}
                  <span
                    className={
                      stock.changesPercentage >= 0
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    ({stock.changesPercentage.toFixed(2)}%)
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Slide animation */}
      <style jsx>{`
        @keyframes slideUp {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(-100%);
          }
        }

        .animate-slideUp {
          animation: slideUp 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Widgets;
