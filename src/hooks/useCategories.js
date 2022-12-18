import { displayActionMessage } from '@/helpers/utils';
import { useDispatch, useSelector } from 'react-redux';
import {useState, useEffect} from 'react';
import {useDidMount} from '@/hooks';
import firebase from '@/services/firebase';

const useCategories = (activeOnly) => {
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const didMount = useDidMount(true);

  const fetchCategoryProducts = async (id) => {
    try {
      setLoading(true);
      setError('');

      const {products, category} = await firebase.getCategoryProducts(id);
      setProducts(products);
      setCategory(category);

      setLoading(false); 
    } catch (e) {
      if (didMount) {
        console.error(e);
        setError('Failed to fetch category products');
        setLoading(false);
      }
    }
  }

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');

      const items = await firebase.getCategories(activeOnly);
      setCategories(items);
      setLoading(false);
      
    } catch (e) {
      if (didMount) {
        console.error(e);
        setError('Failed to fetch categories');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (categories.length === 0 && didMount) {
      fetchCategories();
    }
  }, []);

  return {
    categories, fetchCategories, fetchCategoryProducts, category, products, isLoading, error
  };
};

export default useCategories;
