/* eslint-disable react/jsx-props-no-spreading */
import { Boundary } from '@/components/common';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import React from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

const Content = () => {
  useDocumentTitle('User Administration | KOTC Admin');
  useScrollTop();

  return (
    <Boundary>
      <div>Administer site content</div>
    </Boundary>
  );
};

export default withRouter(Content);
