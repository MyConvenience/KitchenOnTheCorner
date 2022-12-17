/* eslint-disable react/jsx-props-no-spreading */
import { Boundary, Rotator } from '@/components/common';
import { useContent, useDocumentTitle, useScrollTop } from '@/hooks';
import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { HashRouter, withRouter } from 'react-router-dom';
import {ListGroup, Button, ButtonGroup} from 'react-bootstrap';
import { FileProtectOutlined } from '@ant-design/icons';
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';
import { Formik, Form, Field } from 'formik';

const Content = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const {rotatorPages} = useContent(false);
  const [markdown, setMarkdown] = useState(null);

  useDocumentTitle('User Administration | KOTC Admin');
  useScrollTop();

  useEffect(()=> {
    setMarkdown(selected?.body)
}, [selected]);

  const addPanel = () => {
    const newPage = {
      name: 'new_panel',
      title: 'My New Panel',
      header: 'Featured',
      isActive: true,
      isOverlay: false,
      navigate: null,
      sort: 1,
      image: null
    };

    rotatorPages.push(newPage);
    setIndex(rotatorPages.length - 1);
    setSelected(newPage);
  }

  const renderForm = () => {
    return (
      <Formik initialValues={selected}>
         {({ values, isLoading,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting }) => (  
        <Form>
          <fieldset>
              <legend>General</legend>
              <Field disabled={isLoading} name="name" type="text" label="Panel Name"/>
              <Field disabled={isLoading} name="header" id="header" type="text" label="Header"/> 
              <Field disabled={isLoading} name="isActive" id="isActive" type="checkbox" label="Active"/>               
              <Field disabled={isLoading} name="sort" id="sort" type="number" label="Sort Order"/>               
              <Field disabled={isLoading} name="navigate" id="navigate" type="text" label="Navigate URL"/> 
            </fieldset>                 
            <fieldset>
              <legend>Image</legend>
                <Field disabled={isLoading} name="image" type="text" label="Image URL"/>
                <Field disabled={isLoading} name="isOverlay" id="isOverlay" type="checkbox" label="Overlay"/>               
            </fieldset>
            <fieldset>
              <legend>Body</legend>
              <MDEditor value={markdown} onChange={setMarkdown}/>
            </fieldset>
        </Form>
      )}
      </Formik>
    );
  }

  return (
    <Boundary>
      <h1>Administer Site Content</h1>
      <Rotator showActiveOnly={false} editCallback={(index) => setSelected(rotatorPages[index])}/>
      <hr/>      
      <ButtonGroup>
        <Button variant="success" onClick={() =>addPanel()}>Add Panel</Button>
        <Button variant="warning" onClick={() => setSelected(rotatorPages[index])}>Edit Panel</Button>
      </ButtonGroup>
      <hr/>
      {selected ? renderForm() : null}
    </Boundary>
  );
};

export default withRouter(Content);
