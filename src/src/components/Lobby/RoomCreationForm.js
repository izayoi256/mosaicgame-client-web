import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Spinner from '../Icons/Spinner';
import React from 'react';

const Component = ({onSubmit, submitting}) => {

  const {register, errors, handleSubmit} = useForm({
    defaultValues: {
      size: '7',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid grid-cols-3 gap-4">
        <div className="col-span-1 text-right">
          <label htmlFor="new-room-name" className="align-middle">部屋名</label>
        </div>
        <div className="col-span-2">
          <input
            id="new-room-name"
            type="text"
            name="name"
            className={`w-full input ${errors.name ? 'error' : ''}`}
            autoComplete="off"
            maxLength={30}
            ref={register({required: true, maxLength: 30})}
          />
        </div>
        <div className="col-span-1 text-right">
          <label htmlFor="new-room-size" className="align-middle">盤面サイズ</label>
        </div>
        <div className="col-span-2">
          <select
            id="new-room-size"
            name="size"
            className={`select w-full ${errors.size ? 'error' : ''}`}
            ref={register({required: true})}
          >
            <option value={7}>7</option>
            <option value={6}>6</option>
            <option value={5}>5</option>
            <option value={4}>4</option>
            <option value={3}>3</option>
          </select>
        </div>
        <div className="col-span-1 text-right">
          <label htmlFor="new-room-password" className="align-middle">パスワード</label>
        </div>
        <div className="col-span-2">
          <input
            id="new-room-password"
            type="text"
            name="password"
            className={`w-full input ${errors.password ? 'error' : ''}`}
            autoComplete="off"
            placeholder="未設定"
            maxLength={255}
            ref={register({maxLength: 255})}
          />
        </div>
      </fieldset>
      <div className="mt-4">
        <button
          type="submit"
          disabled={submitting}
          className="btn w-full"
        >
          {submitting && (
            <Spinner className="animate-spin w-4 h-4 mr-3 -ml-1" />
          )}
          {submitting ? '作成中...' : '部屋を作成'}
        </button>
      </div>
    </form>
  );
};

Component.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default Component;
