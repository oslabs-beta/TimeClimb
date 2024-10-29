import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLatency } from '../reducers/dataSlice';
import { RootState } from '../../store';
import selectData, { setTimeToggle } from '../reducers/dataSlice.tsx';

const getColor = (num: number, max: number = 100): string => {
  //the score form green to red is between 1 and max
  //colors in rgb
  let red: number;
  let green: number;
  let halfRatio: number;
  //red starts at zero and increases to the half way point remains at 255
  //green starts a 255, starts decreaseing at the half way point
  //const latencies = useSelector((state: RootState) => state.data.latencies);
  if (num <= max / 2) {
    halfRatio = num / (max / 2);

    red = Math.floor(255 * halfRatio);
    green = 255;
  } else {
    halfRatio = ((num - max / 2) / max) * 2;

    red = 255;
    green = Math.floor(255 - 255 * halfRatio);
  }
  return `rgb(${red}, ${green}, 0)`;
};

function TimeSlider() {
  // Define state to hold the value of the slider
  const [sliderValue, setSliderValue] = useState(50);
  const [max, setMax] = useState(23);
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.data);

  useEffect(() => {
    switch (data.time) {
      case 'hours':
        setMax(23);
        break;
      case 'days':
        setMax(6);
        break;
      case 'weeks':
        setMax(11);
        break;
      case 'months':
        setMax(11);
        break;
      default:
        setMax(23);
    }
  }, [data.time]);

  // Update the state when the slider value changes
  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
    dispatch(setLatency(event.target.value));
    //dispatch(setLatency(getColor(event.target.value, 100)));
  };

  return (
    <div className='slidecontainer'>
      <input
        type='range'
        min='0'
        max={max}
        value={sliderValue}
        className='slider'
        onChange={handleSliderChange}
      />
      {/* <p>Value: <span>{sliderValue}</span></p> */}
    </div>
  );
}

export default TimeSlider;
