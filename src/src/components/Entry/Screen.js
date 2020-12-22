import React, { useCallback, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import ApiContext from '../../contexts/Api';
import { Exclamation, Spinner } from '../Icons';

const Component = ({onTokenFetched}) => {

  const api = useContext(ApiContext);
  const [entering, setEntering] = useState(false);
  const [entryFailed, setEntryFailed] = useState(false);

  const {register, errors, handleSubmit} = useForm();

  const onSubmit = useCallback((data) => {
    if (entering) {
      return;
    }
    setEntryFailed(false);
    setEntering(true);
    api.entry(data.name)
      .then((token) => {
        onTokenFetched(token);
      })
      .catch((_) => {
        setEntryFailed(true);
      })
      .finally(() => {
        setEntering(false);
      });
  }, [api, entering, onTokenFetched]);

  return (
    <div className="flex h-full">
      <div className="m-auto">
        <div className="bg-opacity-80 bg-white rounded p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-auto mb-4">
              <input
                type="text"
                name="name"
                placeholder="プレイヤー名"
                maxLength={20}
                ref={register({required: true, maxLength: 20})}
                autoComplete="off"
                disabled={entering}
                className={`w-full input ${errors.name ? 'error' : ''}`}
              />
            </div>
            <div className="w-auto">
              <button type="submit" disabled={entering} className="btn py-2 px-4 w-full">
                {entering && (
                  <Spinner className="animate-spin w-4 h-4 mr-3 -ml-1" />
                )}
                {entering ? '参加中...' : 'サーバーに参加'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {entryFailed && (
        <div className="overlay bg-opacity-30 bg-black flex cursor-pointer" onClick={() => setEntryFailed(false)}>
          <div className="m-auto bg-white rounded p-4 text-xl font-medium">
            <Exclamation className="w-8 h-8 mr-3" />
            <span className="align-middle">サーバーへの参加に失敗しました。</span>
          </div>
        </div>
      )}
    </div>
  );
};

Component.propTypes = {
  onTokenFetched: PropTypes.func.isRequired,
};

export default Component;
