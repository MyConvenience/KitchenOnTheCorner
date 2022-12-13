/* eslint-disable react/jsx-props-no-spreading */
import { Boundary } from '@/components/common';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import React from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

const Users = () => {
  useDocumentTitle('User Administration | KOTC Admin');
  useScrollTop();

  return (
    <Boundary>
      <div>Administer User Accounts</div>
    </Boundary>
  );
};

export default withRouter(Users);
