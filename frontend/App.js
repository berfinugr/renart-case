import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './App.css';

const API_BASE = 'http://localhost:5000';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/products`);
      const data = await response.json();
      setProducts(data);
      
      const defaultColors = {};
      data.forEach(product => {
        defaultColors[product.name] = 'yellow';
      });
      setSelectedColors(defaultColors);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleColorChange = (productName, color) => {
    setSelectedColors(prev => ({
      ...prev,
      [productName]: color
    }));
  };

  const getStarRating = (score) => {
    const fullStars = Math.floor(score);
    const halfStar = score % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <>
        {'★'.repeat(fullStars)}
        {halfStar && '½'}
        {'☆'.repeat(emptyStars)}
        {' '}{score}/5
      </>
    );
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Product List</h1>
      </header>
      
      <div className="products-container">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 }
          }}
        >
          {products.map(product => (
            <SwiperSlide key={product.name}>
              <div className="product-card">
                <div className="product-image">
                  <img 
                    src={product.images[selectedColors[product.name]]} 
                    alt={product.name}
                  />
                </div>
                
                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-price">${product.price} USD</p>
                  <div className="product-rating">
                    Value Gold {getStarRating(parseFloat(product.popularityScoreOutOf5))}
                  </div>
                </div>

                <div className="color-picker">
                  <div 
                    className={`color-option ${selectedColors[product.name] === 'yellow' ? 'active' : ''}`}
                    style={{ backgroundColor: '#E6CA97' }}
                    onClick={() => handleColorChange(product.name, 'yellow')}
                    title="Yellow Gold"
                  ></div>
                  <div 
                    className={`color-option ${selectedColors[product.name] === 'white' ? 'active' : ''}`}
                    style={{ backgroundColor: '#D9D9D9' }}
                    onClick={() => handleColorChange(product.name, 'white')}
                    title="White Gold"
                  ></div>
                  <div 
                    className={`color-option ${selectedColors[product.name] === 'rose' ? 'active' : ''}`}
                    style={{ backgroundColor: '#E1AA49' }}
                    onClick={() => handleColorChange(product.name, 'rose')}
                    title="Rose Gold"
                  ></div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default App;