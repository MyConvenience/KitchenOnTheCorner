/* eslint-disable react/jsx-props-no-spreading */
import { Boundary } from '@/components/common';
import { useContent, useDocumentTitle, useScrollTop } from '@/hooks';
import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { HashRouter, withRouter } from 'react-router-dom';
import {ListGroup, Button, ButtonGroup, Form, Carousel} from 'react-bootstrap';
import { FileProtectOutlined } from '@ant-design/icons';
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';

const Content = () => {
  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState(null);
  const {rotatorPages} = useContent(false);
  useDocumentTitle('User Administration | KOTC Admin');
  useScrollTop();

  const renderForm = () => {
    return (
    <Form>
      <Form.Group className="mb-3" controlId="panelName">
        <Form.Label>Panel Name</Form.Label>
        <Form.Control placeholder="Name" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="panelName">
        <Form.Label>Title</Form.Label>
        <Form.Control as={() => <MDEditor value={title} onChange={setTitle}/>}/>
      </Form.Group>
    </Form>);
  }

  console.dir(rotatorPages);

  return (
    <Boundary>
      <h1>Administer site content</h1>
      <h2>Rotator Panels</h2>
      <Carousel>
          {rotatorPages.map(p => 
            <Carousel.Item key={p.name}>
              <h4>{p.name}</h4>
              <h3>{p.title}</h3>
              <ReactMarkdown>{p.body}</ReactMarkdown>
            </Carousel.Item>)}
      </Carousel>
      <hr/>      
      <ButtonGroup>
        <Button variant="success">Insert Panel</Button>
        <Button variant="info">Add Panel</Button>
      </ButtonGroup>
      <hr/>
      {selected ? renderForm() : null}
    </Boundary>
  );
};

export default withRouter(Content);
