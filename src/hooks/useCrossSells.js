import { useDidMount } from '@/hooks';
import { useEffect, useState } from 'react';
import firebase from '@/services/firebase';

const useCrossSells = () => {
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const didMount = useDidMount(true);

  const fetchSuggestedProducts = async (terms, itemsCount) => {
    try {
      setLoading(true);
      setError('');

      const items = await firebase.getCrossSellProducts(terms, itemsCount);
      console.dir(items);
      setSuggestedProducts(items);
      setLoading(false);
      
    } catch (e) {
      if (didMount) {
        setError('Failed to fetch cross selling products');
        setLoading(false);
      }
    }
  };

  return {
    suggestedProducts, fetchSuggestedProducts, isLoading, error
  };
};

export default useCrossSells;
