import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { ColorChooser, ImageLoader, MessageDisplay } from '@/components/common';
import { ProductShowcaseGrid } from '@/components/product';
import { RECOMMENDED_PRODUCTS, SHOP } from '@/constants/routes';
import { displayMoney, displayPercent, productSizes } from '@/helpers/utils';
import { useBasket, useDocumentTitle, useProduct, useRecommendedProducts, useScrollTop, useCrossSells} from '@/hooks';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Popover, ButtonGroup, SplitButton, Dropdown, OverlayTrigger, Button, Form} from 'react-bootstrap';
import _ from 'lodash';
import { Formik, Field } from 'formik';
import { defaultProps } from 'react-select/creatable/dist/react-select.cjs.prod';

const ViewProduct = () => {
  const { id } = useParams();
  const [options, setOptions] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [ total, setTotal ] = useState(0);
  const [ quantity, setQuantity ] = useState(1);
  const { product, isLoading, error } = useProduct(id);
  const { addToBasket } = useBasket(id);

  useScrollTop();
  useDocumentTitle(`View ${product?.name || 'Item'}`);

  const [selectedImage, setSelectedImage] = useState(product?.image || '');
    
  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured
  } = useRecommendedProducts(6);
  
  const {
    suggestedProducts,
    fetchSuggestedProducts,
    isLoading: isSuggestedLoading,
    error: errorSuggested
  } = useCrossSells();

  useEffect(() => {
    if (product) {
      fetchSuggestedProducts(product.crossSells);
      setSelectedSize(product.sizes[0].size);
      setSelectedImage(product.images[0]);
      setTotal(product.sizes[0].price);  
    }
  }, [product]);

  useEffect(()=> {
    if (product && selectedSize) {
      const productSize = product.sizes.filter(s => s.size === selectedSize)[0];
      const itemTotal = productSize.price * quantity;

      const optionTotal = options ? 
        _.sum(Object.keys(options)
            .map(optionName =>  { return { ...product.options.filter(o => o.name === optionName)[0], checked: options[optionName]}})
            .filter(x => x.checked)
            .map(x => x.price 
              ? x.price 
              : x.margin ? itemTotal * x.margin : 0))
        : 0;
  
      setTotal(itemTotal + optionTotal);  
    }
  }, [options, selectedSize, quantity]);

  const handleAddToBasket = () => {
    const basketItem =  { 
      productId: product.id, 
      productName: product.name,
      image: product.images[0],
      size: selectedSize,
      quantity,
      total,
      options
    };

    console.dir(basketItem);
    addToBasket(basketItem);    
};

  const formatSize = (s) => `${productSizes[s.size]}: ${displayMoney(s.price)}`;
  const formatOption = (o) => {
    if (o.price) {
      return `${o.label}: ${displayMoney(o.price)}`;
    }
    if (o.margin) {
      return `${o.label}: ${displayPercent(o.margin)}`;
    }
    return `${o.label}: FREE`;
  } 

  const hasMultipleSizes = (product?.sizes || []).length > 1;
  const hasOptions = (product?.options || []).length > 0;


  const onCheckChanged = ({target:{name, checked}}) => {
    console.log(`${name} checked:${checked}`);

    let update = {};
    update[name] = checked;
    const newOptions = _.merge({}, options, update);
    setOptions(newOptions);
  }

  const onQuantityChanged = ({target:{name, value}}) => {
    setQuantity(value);
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
                <Form>
                  <select name="size" value={selectedSize} onChange={({target:{value}}) => setSelectedSize(value)}>
                    {product.sizes.map(s => <option key={s.size} value={s.size} label={formatSize(s)}/>)}
                  </select>
                  <select name="quantity" value={quantity} onChange={({target:{value}})=> setQuantity(value)}>
                    <option value={1} label="1"/>
                    <option value={2} label="2"/>
                    <option value={3} label="3"/>
                    <option value={4} label="4"/>
                    <option value={5} label="5"/>
                    <option value={6} label="6"/>
                    <option value={7} label="7"/>
                    <option value={8} label="8"/>
                    <option value={9} label="9"/>
                    <option value={10} label="10"/>
                  </select>
                  <div>
                    <div>Options</div>
                    {
                      product.options.map(o =>
                        <div htmlFor={o.name} key={o.name}>
                          <input name={o.name} value={o.name} onChange={onCheckChanged} type="checkbox"/>{formatOption(o)}
                        </div>)
                    }
                  </div>                           
                  <h1>{`Total: ${displayMoney(total)}`}</h1>
                  <button type="submit" className='button button-small' onClick={handleAddToBasket}>
                    Add To Cart
                  </button>
                </Form>
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
