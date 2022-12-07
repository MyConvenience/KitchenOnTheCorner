import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { ColorChooser, ImageLoader, MessageDisplay } from '@/components/common';
import { ProductShowcaseGrid } from '@/components/product';
import { RECOMMENDED_PRODUCTS, SHOP } from '@/constants/routes';
import { displayMoney, productSizes } from '@/helpers/utils';
import {useBasket,useDocumentTitle,useProduct,useRecommendedProducts,useScrollTop} from '@/hooks';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {Popover, ButtonGroup, SplitButton, Dropdown, OverlayTrigger, Button} from 'react-bootstrap';
import _ from 'lodash';


const ViewProduct = () => {
  const { id } = useParams();
  const [ selection, setSelection ] = useState({});
  const [ total, setTotal ] = useState(0);
  const { product, isLoading, error } = useProduct(id);
  const { addToBasket, isItemOnBasket } = useBasket(id);
  useScrollTop();
  useDocumentTitle(`View ${product?.name || 'Item'}`);

  const [selectedImage, setSelectedImage] = useState(product?.image || '');
  
  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured
  } = useRecommendedProducts(6);
  
  useEffect(() => {
    var cartItem = {};
    const x = product?.sizes?.map(s => cartItem[s.size] = { qty: 1, options: product.options });
    setSelectedImage(product?.images[0]);
    setSelection(cartItem);
  }, [product]);

  useEffect(() => {
    debugger;
    var total = 0;
    Object.keys(selection).map( key => total += (selection[key].qty * selection[key].price));
    setTotal(total);
  }, [selection]);


  const handleAddToBasket = () => {
    addToBasket({ ...product });
  };

  const optionsPopover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Popover right</Popover.Header>
      <Popover.Body>
        And here's some <strong>amazing</strong> content. It's very engaging.
        right?
      </Popover.Body>
    </Popover>
  );
  
  const renderOptions = (key) => {
    if ((product.options || []).length > 0) {
      return (<OverlayTrigger key={key} trigger="click" placement="right" overlay={optionsPopover}>
      <Button variant="success">Choose Options</Button>
    </OverlayTrigger>);
    }
    return null;
  }

  const decrement = (cartItem) => {
    if (cartItem.qty >= 0) {
      cartItem.qty = cartItem.qty - 1;      
      const s = _.merge({}, selection, cartItem);
      setSelection(s);
    }
  }

  const increment = (cartItem) => {
    debugger;
    cartItem.qty = cartItem.qty + 1;
    const s = _.merge({}, selection, cartItem);
    setSelection(s);
  }

  
  const quantitySelector = (cartItem) => {
    return (
    <ButtonGroup>
      <Button variant='primary' onClick={() => decrement(cartItem)}>-</Button>
      <Button variant='primary'>{`${cartItem.qty}`}</Button>
      <Button variant='primary' onClick={()=> increment(cartItem)}>+</Button>
    </ButtonGroup>);
  }

  const renderSize = (s) => {
    const optionOverlay = (product.options || []).length > 0 ? renderOptions(`${s.size}_options`) : null;
    const cartItem = selection[s.size];

    return (<div key={s.size}>
      {`${productSizes[s.size]}: ${displayMoney(s.price)}`}
      <div>{quantitySelector(cartItem)}</div>
      {optionOverlay}
    </div>);
  }

  return (
    <main className="content">
      {isLoading && (
        <div className="loader">
          <h4>Loading Product...</h4>
          <br />
          <LoadingOutlined style={{ fontSize: '3rem' }} />
        </div>
      )}
      {error && (
        <MessageDisplay message={error} />
      )}
      {(product && !isLoading) && (
        <div className="product-view">
          <Link to={SHOP}>
            <h3 className="button-link d-inline-flex">
              <ArrowLeftOutlined />
              &nbsp; Back to shop
            </h3>
          </Link>
          <div className="product-modal">
            {product.images.length !== 0 && (
              <div className="product-modal-image-collection">
                {product.images.map((image, index) => (
                  <div
                    className="product-modal-image-collection-wrapper"
                    key={`img_${index}`}
                    onClick={() => setSelectedImage(image)}
                    role="presentation"
                  >
                    <img
                      className="product-modal-image-collection-img"
                      src={image}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="product-modal-image-wrapper">
              <img
                alt={product.name}
                className="product-modal-image"
                src={selectedImage}
              />
            </div>
            <div className="product-modal-details">
              <br />
              <h1 className="margin-top-0">{product.name}</h1>
              <span>{product.description}</span>
              <br />
              <br />
              <div className="divider" />
              <br />
              <div>
                { product ? 
                  (product.sizes || []).map(size => renderSize(size)) 
                  : null 
                }
                <br />
              </div>
              <br />
              <h1>{`Total: ${displayMoney(total)}`}</h1>
              <div className="product-modal-action">
                <button
                  className={`button button-small ${isItemOnBasket(product.id) ? 'button-border button-border-gray' : ''}`}
                  onClick={handleAddToBasket}
                  type="button"
                >
                  {isItemOnBasket(product.id) ? 'Remove From Basket' : 'Add To Basket'}
                </button>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '10rem' }}>
            <div className="display-header">
              <h1>Recommended</h1>
              <Link to={RECOMMENDED_PRODUCTS}>See All</Link>
            </div>
            {errorFeatured && !isLoadingFeatured ? (
              <MessageDisplay
                message={error}
                action={fetchRecommendedProducts}
                buttonLabel="Try Again"
              />
            ) : (
              <ProductShowcaseGrid products={recommendedProducts} skeletonCount={3} />
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default ViewProduct;
