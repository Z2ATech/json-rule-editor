import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button/button';

const Title = (props) => {
  return (
    <div className="header-container">
      <div>{props.title}</div>
      <Button
        label={'Log Out'}
        onConfirm={() => {
          localStorage.clear();
          window.location.href = process.env.loginUrl;
        }}
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
