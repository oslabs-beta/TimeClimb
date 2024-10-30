import { setTimeToggle } from '../reducers/dataSlice.tsx';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store.tsx';

function TimeToggle() {
  const dispatch: AppDispatch = useDispatch();
  const data = useSelector((state: RootState) => state.data);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTimeToggle(e.target.value));
  };

  return (
    <div>
      <label htmlFor='timeToggle' className='mx-10'>
        Select Time Period:
      </label>
      <select className='times' value={data.time} onChange={handleChange}>
        <option value='hours'>Hourly</option>
        <option value='days'>Daily</option>
        <option value='weeks'>Weekly</option>
        <option value='months'>Monthly</option>
      </select>
    </div>
  );
}

export default TimeToggle;
