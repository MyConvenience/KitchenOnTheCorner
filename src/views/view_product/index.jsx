import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { ColorChooser, ImageLoader, MessageDisplay } from '@/components/common';
import { ProductShowcaseGrid } from '@/components/product';
import { RECOMMENDED_PRODUCTS, SHOP } from '@/constants/routes';
import { displayMoney, productSizes } from '@/helpers/utils';
import {useBasket,useDocumentTitle,useProduct,useRecommendedProducts, useCrossSells, useScrollTop} from '@/hooks';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {Popover, ButtonGroup, SplitButton, Dropdown, OverlayTrigger, Button, Form} from 'react-bootstrap';
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
    suggestedProducts,
    fetchSuggestedProducts,
    isLoading: isLoadingSuggested,
    error: errorSuggested
  } = useCrossSells(6);

  const createCartDefaults = () => {
    var cartItem = {};
    var options = {};

    (product?.options || []).map(o => options[o.name] = { price: o.price, margin: o.margin, checked: false, notes:  ''});
    product?.sizes?.map(s => cartItem[s.size] = { qty: 1, price: s.price, options: options });

    // console.dir(cartItem);
    return cartItem;
  }

  useEffect(() => {
    setSelectedImage(product?.images[0]);
    setSelection(createCartDefaults());
    if (product?.crossSells?.length > 0) {
      fetchSuggestedProducts(product.crossSells, 6);
    }
  }, [product]);


  const computeItemTotal = (item) => {
    const extPrice = item.qty * item.price;
    let optionTotal = 0;

    Object.keys(item.options).forEach( name => {
      const option = item.options[name];
      if (option.checked) {
        if (option.margin) {
          optionTotal += (extPrice * option.margin * item.qty);
        } else {
          optionTotal += (option.price * item.qty);
        }
      }
    });

    return extPrice + optionTotal;
  }

  useEffect(() => {
    var total = 0;
    Object.keys(selection).map( key => total += computeItemTotal(selection[key]));
    setTotal(total);
  }, [selection]);


  const handleAddToBasket = () => {
    const order = Object.keys(selection)
        .filter(sizeName => selection[sizeName].qty > 0)
        .map(sizeName => _.merge({ size: sizeName}, selection[sizeName]) );

      if (order.length > 0) {
        const basketItem =  { 
          productId: product.id, 
          productName: product.name,
          image: product.images[0],
          order
        };
        console.dir(basketItem);
        addToBasket(basketItem);    
      }
  };

  const toggleOption = (size, option) => {
    var sizeEntry = _.merge({}, selection[size]);
    sizeEntry.options[option].checked = !sizeEntry.options[option].checked;
    var update = _.merge({}, selection);
    update[size] = sizeEntry;

    // console.dir(update);
    setSelection(update);
  }

  const optionsPopover = (size) => (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Product Options</Popover.Header>
      <Popover.Body>
        Please select from among these options
        <Form>
          {product.options.map(o => {
            const isChecked = selection[size].options[o.name].checked;
            return (            
            <div>
              <input key={o.name} type='checkbox' value={isChecked} onChange={() => toggleOption(size, o.name)} />
              <span>{`${o.label}: ${displayMoney(o.price)}`}</span>
            </div>);
          })}
        </Form>
      </Popover.Body>
    </Popover>
  );
  
  const renderOptions = (size) => {
    if ((product.options || []).length > 0) {
      return (<OverlayTrigger key={size} trigger="click" placement="right" overlay={optionsPopover(size)}>
      <Button variant="default">Choose Options</Button>
    </OverlayTrigger>);
    }
    return null;
  }

  const decrement = (size, cartItem) => {
    if (cartItem.qty >= 0) {
      cartItem.qty--;
      var update = {};      
      update[size] = cartItem;
      const s = _.merge({}, selection, update);
        setSelection(s);
    }
  }

  const increment = (size, cartItem) => {
    cartItem.qty++;
    var update = {};
    update[size] = cartItem;
    const s = _.merge({}, selection, update);
    // console.dir(s);
    setSelection(s);
  }

  
  const quantitySelector = (size, cartItem) => {
    return (
    <ButtonGroup>
      <Button variant='primary' onClick={() => decrement(size, cartItem)}>-</Button>
      <Button variant='primary'>{`${cartItem.qty}`}</Button>
      <Button variant='primary' onClick={()=> increment(size, cartItem)}>+</Button>
    </ButtonGroup>);
  }

  const renderSize = (s) => {
    const optionOverlay = (product.options || []).length > 0 ? renderOptions(s.size) : null;
    const cartItem = selection[s.size];

    return (<div key={s.size}>
      {`${productSizes[s.size]}: ${displayMoney(s.price)}`}
      {quantitySelector(s.size, cartItem)}
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
              <h1>May We Suggest...</h1>
              <Link to={RECOMMENDED_PRODUCTS}>See All</Link>
            </div>
            {errorSuggested && !isLoadingSuggested ? (
              <MessageDisplay
                message={error}
                action={fetchSuggestedProducts}
                buttonLabel="Try Again"
              />
            ) : (
              <ProductShowcaseGrid products={suggestedProducts} skeletonCount={3} />
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default ViewProduct;
