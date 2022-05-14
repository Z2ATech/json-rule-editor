import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button/button';

const Title = (props) => {
  return (
    <div className="header-container">
      <div>{props.title}</div>
      <Button
        label={'Log Out'}
        onConfirm={() =>
          (window.location.href =
            'https://ggd-employee-identities-dev.auth.us-east-2.amazoncognito.com/login?client_id=5dncsjfvgeuu9qmot7rgg9o202&response_type=code&scope=email+openid+profile&redirect_uri=http://localhost:8080')
        }
        classname="primary-btn"
        type="button"
      />
    </div>
  );
};

Title.defaultProps = {
  title: 'Json Rule Editor',
};

Title.propTypes = {
  title: PropTypes.string,
};

export default Title;
