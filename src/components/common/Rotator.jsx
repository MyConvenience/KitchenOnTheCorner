import Carousel from "react-bootstrap/Carousel";
import {useContent} from '@/hooks';
import ReactMarkdown from 'react-markdown';

const Rotator = () => {
  const {rotatorPages} = useContent();

  return (
    <Carousel>
      {rotatorPages.map(p => <Carousel.Item key={p.name}><Carousel.Caption><ReactMarkdown>{p.title}</ReactMarkdown></Carousel.Caption><ReactMarkdown>{p.body}</ReactMarkdown></Carousel.Item>)}
    </Carousel>
  );
};

export default Rotator;
