/* eslint-disable jsx-a11y/label-has-associated-control */
import { CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import { ImageLoader } from '@/components/common';
import { CustomColorInput, CustomCreatableSelect, CustomInput, CustomTextarea } from '@/components/formik';
import { Field, FieldArray, Formik } from 'formik';
import { useFileHandler } from '@/hooks';
import PropType from 'prop-types';
import React, {useState} from 'react';
import * as Yup from 'yup';
import { DataSheetGrid, checkboxColumn, textColumn, floatColumn, keyColumn } from 'react-datasheet-grid';
import { selectColumn } from '@/components/datasheet';
import _ from 'lodash';
import 'react-datasheet-grid/dist/style.css';
import {Form, Button} from 'react-bootstrap';
import slugify from 'slugify';
import { productSizes } from '@/helpers/utils';

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .required('Product name is required.')
    .max(60, 'Product name must be less than 60 characters.'),
  description: Yup.string()
    .required('Description is required.'),
  keywords: Yup.array()
    .of(Yup.string())
    .min(1, 'Please enter at least 1 keyword for this product.'),
  isFeatured: Yup.boolean(),
  isRecommended: Yup.boolean(),
  isTaxable: Yup.boolean(),
  sizes: Yup.array()
    .min(1, 'Please enter at least one size for this product.'),
  options: Yup.array()
});

const ProductForm = ({ product, onSubmit, isLoading }) => {
  const initFormikValues = {
    name: product?.name || '',
    sizes: product?.sizes || [ { size: 'regular', price: 0 }],
    options: product?.options || [],
    description: product?.description || '',
    keywords: product?.keywords || [],
    crossSells: product?.crossSells || [],
    isFeatured: product?.isFeatured || false,
    isRecommended: product?.isRecommended || false,
    isTaxable : product?.isTaxable || false,
  };

  const [ sizes, setSizes ] = useState(product?.sizes || [
    { size: 'regular', price: 0 }
  ]);

  const [ options, setOptions ] = useState(product?.options || []);

  const optionColumns = [
    { ...keyColumn('name', textColumn), title: 'Name' },
    { ...keyColumn('label', textColumn), title: 'Display Label' },
    { ...keyColumn('price', floatColumn), title: 'Price' },
    { ...keyColumn('markup', floatColumn), title: 'Markup' }
  ];

  const makeSizeSelection = (size) => {
    return { value: size, label: productSizes[size]};
  }

  const sizeColumns = [
    {
      ...keyColumn('size', selectColumn({ 
                            choices: 
                              Object.keys(productSizes).map(makeSizeSelection)
                          })
        ),
    title: 'Size'},
    { ...keyColumn('price', floatColumn), title: 'Price' }
  ];

  const {
    imageFile,
    isFileLoading,
    onFileChange,
    removeImage
  } = useFileHandler({ image: {}, imageCollection: product?.imageCollection || [] });

  const onSubmitForm = (formValues) => {
    const imageCount = (imageFile.imageCollection || []).length;
    if (imageCount > 0 || product.imageUrl) {
      const values = {
        id: slugify(formValues.name, {lower: true}),
        ...formValues,
        dateAdded: new Date().getTime(),
        imageCollection: imageFile.imageCollection
      };
      onSubmit(values);
    } else {
      // eslint-disable-next-line no-alert
      alert('Product thumbnail image is required.');
    }
  };

  return (
    <div>
      <Formik
        initialValues={initFormikValues}
        validateOnChange
        validationSchema={FormSchema}
        onSubmit={onSubmitForm}
      >
        {({ values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting }) => (          
          <Form>
            <fieldset>
              <legend>General Information</legend>
              <Field
                    disabled={isLoading}
                    name="name"
                    type="text"
                    label="Product Name"
                    style={{ textTransform: 'capitalize' }}
                    component={CustomInput}
                  />
              <Field
                  disabled={isLoading}
                  name="description"
                  id="description"
                  type="text"
                  label="Product Description"
                  component={CustomInput}
                />            
                <div className="product-form-collection">
                <>
                  {imageFile.imageCollection.length >= 1 && (
                    imageFile.imageCollection.map((image) => (
                      <div className="product-form-collection-image" key={image.id}>
                        <ImageLoader alt="" src={image.url}/>
                        <button
                          className="product-form-delete-image"
                          onClick={() => removeImage({ id: image.id, name: 'imageCollection' })}
                          title="Delete Image"
                          type="button"
                        >
                          <i className="fa fa-times-circle" />
                        </button>
                      </div>
                    ))
                  )}
                </>
              </div>
              <label htmlFor="product-input-file-collection">
                    <input
                      disabled={isLoading}
                      hidden
                      id="product-input-file-collection"
                      multiple
                      onChange={(e) => onFileChange(e, { name: 'imageCollection', type: 'multiple' })}
                      readOnly={isLoading}
                      type="file"
                    />
                    Choose Images
                  </label>
            </fieldset>
            <fieldset>
              <legend>Catalog</legend>    
              <CustomCreatableSelect
                    defaultValue={values.keywords.map((key) => ({ value: key, label: key }))}
                    name="keywords"
                    iid="keywords"
                    isMulti
                    disabled={isLoading}
                    placeholder="Create/Select Keywords"
                    label="Keywords"
                  />
                <CustomCreatableSelect
                    defaultValue={values.crossSells.map((key) => ({ value: key, label: key }))}
                    name="crossSells"
                    iid="crossSells"
                    isMulti
                    disabled={isLoading}
                    placeholder="Create/Select Cross Sell Keys"
                    label="Cross Sells"
                  />
                  <label><Field type="checkbox" name="isFeatured"/>Is Featured</label>
                  <label><Field type="checkbox" name="isRecommended"/>Is Recommended</label>
                  <label><Field type="checkbox" name="isAgeRestricted"/>Age Restricted</label>
                  <label><Field type="checkbox" name="isTaxable"/>Taxable</label>
            </fieldset>           
            <fieldset>
              <legend>Sizes</legend>
              <DataSheetGrid value={sizes} onChange={setSizes} columns={sizeColumns}/>
            </fieldset>
            <fieldset>
              <legend>Options</legend>
              <DataSheetGrid value={options} onChange={setOptions} columns={optionColumns}/>
            </fieldset>
            <Button variant="primary" onClick={() => onSubmitForm(
                  _.merge({options: options, sizes: sizes, name_lower: values.name.toLowerCase()}, values))}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};


ProductForm.propTypes = {
  product: PropType.shape({
    name: PropType.string,
    description: PropType.string,
    keywords: PropType.arrayOf(PropType.string),
    crossSell: PropType.arrayOf(PropType.string),
    imageCollection: PropType.arrayOf(PropType.object),
    image: PropType.string,
    imageUrl: PropType.string,
    isFeatured: PropType.bool,
    popularity: PropType.number,
    isRecommended: PropType.bool,
    isTaxable: PropType.bool,
    sizes: PropType.arrayOf(PropType.shape({ name: PropType.string, price: PropType.number })),
    options: PropType.arrayOf(PropType.shape({name: PropType.string, label: PropType.string, price: PropType.number, markup: PropType.number})),
  }).isRequired,
  onSubmit: PropType.func.isRequired,
  isLoading: PropType.bool.isRequired
};

export default ProductForm;
