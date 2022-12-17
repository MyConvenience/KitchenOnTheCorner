import { useDidMount } from '@/hooks';
import { useEffect, useState } from 'react';
import firebase from '@/services/firebase';

const usePopularProducts = (itemsCount = 12) => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const didMount = useDidMount(true);

  const fetchPopularProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const items = await firebase.getPopularProducts(itemsCount);
      
      setPopularProducts(items);
      setLoading(false);
    } catch (e) {
      if (didMount) {
        setError('Failed to fetch featured products');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (popularProducts.length === 0 && didMount) {
      fetchPopularProducts(itemsCount);
    }
  }, []);

  return {
    popularProducts, fetchPopularProducts, isLoading, error
  };
};

export default usePopularProducts;
