import {Carousel, Card, Placeholder} from 'react-bootstrap';
import {useContent} from '@/hooks';
import ReactMarkdown from 'react-markdown';

const Rotator = () => {
  const {rotatorPages} = useContent();

  return (
      <Carousel variant='dark'>
          {rotatorPages.map(p => 
            <Carousel.Item key={p.name}>
                <Card>
                  {(p.header || '').length > 0 ? <Card.Header>{p.header}</Card.Header> : null}                  
                  {(p.image || '').length > 0 ? <Card.Img className="rotator-image" variant="left" src={p.image}/> : null}
                  {(p.isOverlay 
                  ? <Card.ImgOverlay>
                        <Card.Title>{p.title}</Card.Title>
                        <Card.Text><ReactMarkdown>{p.body}</ReactMarkdown></Card.Text>
                    </Card.ImgOverlay> 
                  : <Card.Body>
                      <Card.Title>{p.title}</Card.Title>
                      <Card.Subtitle>{p.subtitle}</Card.Subtitle>
                      <Card.Text><ReactMarkdown>{p.body}</ReactMarkdown></Card.Text>
                  </Card.Body>)}
              </Card>
          </Carousel.Item>)}
      </Carousel>
  );
};

export default Rotator;
