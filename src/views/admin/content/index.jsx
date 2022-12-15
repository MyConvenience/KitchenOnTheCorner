/* eslint-disable react/jsx-props-no-spreading */
import { Boundary } from '@/components/common';
import { useContent, useDocumentTitle, useScrollTop } from '@/hooks';
import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {ListGroup, Button, ButtonGroup} from 'react-bootstrap';

const Content = () => {
  const {selected, setSelected} = useState(null);
  const {rotatorPages} = useContent(false);
  useDocumentTitle('User Administration | KOTC Admin');
  useScrollTop();



  return (
    <Boundary>
      <div>Administer site content</div>
      <ListGroup as='ul'>
        {rotatorPages.map(p => <ListGroup.Item key={p.name} action onClick={alertClicked}></ListGroup.Item>)}
      </ListGroup>
    </Boundary>
  );
};

export default withRouter(Content);
