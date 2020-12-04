import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import React from 'react';

const Component = ({onSubmit, requiresPassword}) => {

  const {register, errors, handleSubmit} = useForm();

  return (
    <form className="p-2" onSubmit={handleSubmit(onSubmit)}>
      {requiresPassword && (
        <div>
          <input
            type="text"
            name="password"
            className={`input w-full ${errors.password ? 'error' : ''}`}
            autoComplete="off"
            maxLength={255}
            placeholder="パスワード"
            ref={register({required: true, maxLength: 255})}
          />
        </div>
      )}
      <div>
        <button type="submit" className="btn w-full">入室</button>
      </div>
    </form>
  );
};

Component.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  requiresPassword: PropTypes.bool.isRequired,
};

export default Component;
