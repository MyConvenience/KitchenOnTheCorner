import {Carousel, Placeholder} from 'react-bootstrap';
import {useContent} from '@/hooks';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useHistory } from 'react-router';

const Rotator = ({showActiveOnly = true, editCallback = null}) => {
  const {rotatorPages} = useContent(showActiveOnly);
  const history = useHistory();

  const onSelectedIndexChanged = (selectedIndex, e) => {
    if (editCallback) {
      editCallback(selectedIndex);
    }
  } 

  const onPanelClick = (args, navigate) => {
    if (navigate && !editCallback) {
      history.push(navigate);
    }
  }

  return (
      <Carousel interval={editCallback ? null : 5000} onSelect={onSelectedIndexChanged} variant='dark'>
          {rotatorPages.map(p => 
            <Carousel.Item onClick={(args) => onPanelClick(args, p.navigate)} key={p.name}>
                <div className='banner'>
                  {(p.header || '').length > 0 ? <div className='banner-header'>{p.header}</div> : null}                  
                  {(p.image || '').length > 0 ? <img className="banner-image" variant="left" src={p.image}/> : null}
                  {(p.isOverlay
                  ? <div className='banner-overlay'>
                        <div className='banner-title'>{p.title}</div>
                        <div className='banner-desc'><ReactMarkdown children={p.body} remarkPlugins={[remarkGfm]}/></div>
                    </div> 
                  : <div>
                        <div className='banner-title'>{p.title}</div>
                      <div className='banner-desc'><ReactMarkdown children={p.body} remarkPlugins={[remarkGfm]}/></div>
                  </div>)}
              </div>
          </Carousel.Item>)}
      </Carousel>
  );
};

export default Rotator;
