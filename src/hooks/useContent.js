import { displayActionMessage } from '@/helpers/utils';
import { useDispatch, useSelector } from 'react-redux';
import {useState, useEffect} from 'react';
import {useDidMount} from '@/hooks';
import firebase from '@/services/firebase';

const useContent = (activeOnly) => {
  const [rotatorPages, setRotatorPages] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const didMount = useDidMount(true);

  const fetchRotatorPages = async () => {
    try {
      setLoading(true);
      setError('');

      const items = await firebase.getRotatorPanels(activeOnly);
      setRotatorPages(items);
      setLoading(false);
      
    } catch (e) {
      if (didMount) {
        console.error(e);
        setError('Failed to fetch rotator pages');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (rotatorPages.length === 0 && didMount) {
      fetchRotatorPages();
    }
  }, []);

  return {
    rotatorPages, fetchRotatorPages, isLoading, error
  };
};

export default useContent;
