/* eslint-disable jsx-a11y/label-has-associated-control */
import { CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import { ImageLoader } from '@/components/common';
import {
  CustomColorInput, CustomCreatableSelect, CustomInput, CustomTextarea
} from '@/components/formik';
import {
  Field, FieldArray, Formik
} from 'formik';
import { useFileHandler } from '@/hooks';
import PropType from 'prop-types';
import React, {useState} from 'react';
import * as Yup from 'yup';

import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  floatColumn,
  keyColumn,
} from 'react-datasheet-grid'

// Import the style only once in your app!
import 'react-datasheet-grid/dist/style.css'

import {Form, Button} from 'react-bootstrap';

const sizeOptions = [
  { value: 'standard', price: 1, label: 'Regular' },
  { value: 'small',   price: 0.9, label: 'Small' },
  { value: 'medium', price: 1, label: 'Medium' },
  { value: 'large', price: 1.25, label: 'Large' }
];

// Default brand names that I used. You can use what you want
const brandOptions = [
  { value: 'kotc', label: 'Kitchen on the Corner' },
  { value: 'sandking', label: 'Sandwich King' },
  { value: 'pbmill', label: 'Peanut Butter Mill' },
  { value: 'ohiocity', label: 'Ohio City Hummus' }
];






const FormSchema = Yup.object().shape({
  name: Yup.string()
    .required('Product name is required.')
    .max(60, 'Product name must only be less than 60 characters.'),
  brand: Yup.string()
    .required('Brand name is required.'),
  price: Yup.number()
    .positive('Price is invalid.')
    .integer('Price should be an integer.')
    .required('Price is required.'),
  description: Yup.string()
    .required('Description is required.'),
  maxQuantity: Yup.number()
    .positive('Max quantity is invalid.')
    .integer('Max quantity should be an integer.')
    .required('Max quantity is required.'),
  keywords: Yup.array()
    .of(Yup.string())
    .min(1, 'Please enter at least 1 keyword for this product.'),
  sizes: Yup.array()
    .of(Yup.number())
    .min(1, 'Please enter a size for this product.'),
  isFeatured: Yup.boolean(),
  isRecommended: Yup.boolean(),
  availableColors: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Please add a default color for this product.')
});

const ProductForm = ({ product, onSubmit, isLoading }) => {
  const initFormikValues = {
    name: product?.name || '',
    brand: product?.brand || '',
    variants: product?.variants || [],
    options: product?.options || [],
    description: product?.description || '',
    keywords: product?.keywords || [],
    sizes: product?.sizes || [],
    isFeatured: product?.isFeatured || false,
    isRecommended: product?.isRecommended || false,
  };

  const [ variants, setVariantData ] = useState([
    { active: true, name: 'regular', display: 'Regular', price: 0 },
    { active: false, name: 'personal', display: 'Personal', price: 0 },
    { active: false, name: 'medium', display: 'Medium', price: 0 },
    { active: false, name: 'large', display: 'Large', price: 0 }
  ]);

  const [ options, setOptionsData ] = useState([]);

  const columns = [
    { ...keyColumn('active', checkboxColumn), title: 'Active' },
    { ...keyColumn('name', textColumn), title: 'Name' },
    { ...keyColumn('display', textColumn), title: 'Display' },
    { ...keyColumn('price', floatColumn), title: 'Price' }
  ];

  const {
    imageFile,
    isFileLoading,
    onFileChange,
    removeImage
  } = useFileHandler({ image: {}, imageCollection: product?.imageCollection || [] });

  const onSubmitForm = (form) => {
    const values = {
      ...form,
      quantity: 1,
      // due to firebase function billing policy, let's add lowercase version
      // of name here instead in firebase functions
      name_lower: form.name.toLowerCase(),
      dateAdded: new Date().getTime(),
      image: imageFile?.image?.file || product.imageUrl,
      imageCollection: imageFile.imageCollection
    };
    console.log(values);
    return;

    if (imageFile.image.file || product.imageUrl) {
      onSubmit({
        ...form,
        quantity: 1,
        // due to firebase function billing policy, let's add lowercase version
        // of name here instead in firebase functions
        name_lower: form.name.toLowerCase(),
        dateAdded: new Date().getTime(),
        image: imageFile?.image?.file || product.imageUrl,
        imageCollection: imageFile.imageCollection
      });
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
                    placeholder="Enter a unique product name"
                    style={{ textTransform: 'capitalize' }}
                    component={CustomInput}
                  />
              <Field
                  disabled={isLoading}
                  name="description"
                  id="description"
                  rows={3}
                  label="Product Description"
                  component={CustomTextarea}
                />                
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
                  <div className="product-form-collection">
                <>
                  {imageFile.imageCollection.length >= 1 && (
                    imageFile.imageCollection.map((image) => (
                      <div
                        className="product-form-collection-image"
                        key={image.id}
                      >
                        <ImageLoader
                          alt=""
                          src={image.url}
                        />
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
                   <div className="product-form-field">
                  <input
                    checked={values.isFeatured}
                    className=""
                    id="featured"
                    onChange={(e) => setValues({ ...values, isFeatured: e.target.checked })}
                    type="checkbox"
                  />
                  <label htmlFor="featured">
                    <h5 className="d-flex-grow-1 margin-0">
                      &nbsp; Add to Featured &nbsp;
                    </h5>
                  </label>
                </div>
                <div className="product-form-field">
                  <input
                    checked={values.isRecommended}
                    className=""
                    id="recommended"
                    onChange={(e) => setValues({ ...values, isRecommended: e.target.checked })}
                    type="checkbox"
                  />
                  <label htmlFor="recommended">
                    <h5 className="d-flex-grow-1 margin-0">
                      &nbsp; Add to Recommended &nbsp;
                    </h5>
                  </label>
                </div>       
            </fieldset>           
            <fieldset>
              <legend>Variations</legend>
              <DataSheetGrid value={variants} onChange={setVariantData} columns={columns}/>
            </fieldset>
            <fieldset>
              <legend>Options</legend>
              <DataSheetGrid value={options} onChange={setOptionsData} columns={columns}/>
            </fieldset>
            <Button variant="primary" type="submit">
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
    brand: PropType.string,
    description: PropType.string,
    keywords: PropType.arrayOf(PropType.string),
    imageCollection: PropType.arrayOf(PropType.object),
    image: PropType.string,
    imageUrl: PropType.string,
    isFeatured: PropType.bool,
    isRecommended: PropType.bool,
    variants: PropType.arrayOf(PropType.shape({ name: PropType.string, price: PropType.number })),
    options: PropType.arrayOf(PropType.shape({name: PropType.string, price: PropType.number, markup: PropType.number})),
  }).isRequired,
  onSubmit: PropType.func.isRequired,
  isLoading: PropType.bool.isRequired
};

export default ProductForm;
