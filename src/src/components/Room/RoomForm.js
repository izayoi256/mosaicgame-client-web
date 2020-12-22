import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import React from 'react';

const Component = ({room, users, onSubmit}) => {

  const {register, errors, handleSubmit, reset} = useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSubmitting(false);
    reset({
      ...room,
      firstPlayer: (room.players[0] && room.players[0].id),
      secondPlayer: (room.players[1] && room.players[1].id),
    });
  }, [reset, room]);

  const onChange = (data) => {
    setSubmitting(true);
    onSubmit(data);
  };

  return (
    <form>
      <fieldset className="grid grid-cols-3 gap-4">
        <div className="col-span-1 text-right">
          <label htmlFor="room-size" className="align-middle">盤面サイズ</label>
        </div>
        <div className="col-span-2">
          <select
            id="room-size"
            name="size"
            className={`select w-full ${errors.size ? 'error' : ''}`}
            ref={register({required: true})}
            onChange={handleSubmit(onChange)}
            disabled={submitting}
          >
            <option value={7}>7</option>
            <option value={6}>6</option>
            <option value={5}>5</option>
            <option value={4}>4</option>
            <option value={3}>3</option>
          </select>
        </div>
        <div className="col-span-1 text-right">
          <label htmlFor="room-first-player" className="align-middle">先手</label>
        </div>
        <div className="col-span-2">
          <select
            id="room-first-player"
            name="firstPlayer"
            className={`select w-full ${errors.firstPlayer ? 'error' : ''}`}
            ref={register()}
            onChange={handleSubmit(onChange)}
            disabled={submitting}
          >
            <option value="">&nbsp;</option>
            {users.map((user) => (
              <option value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        <div className="col-span-1 text-right">
          <label htmlFor="room-second-player" className="align-middle">後手</label>
        </div>
        <div className="col-span-2">
          <select
            id="room-second-player"
            name="secondPlayer"
            className={`select w-full ${errors.secondPlayer ? 'error' : ''}`}
            ref={register()}
            onChange={handleSubmit(onChange)}
            disabled={submitting}
          >
            <option value="">&nbsp;</option>
            {users.map((user) => (
              <option value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
      </fieldset>
    </form>
  );
};

Component.propTypes = {
  room: PropTypes.shape({}).isRequired,
  users: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Component;
