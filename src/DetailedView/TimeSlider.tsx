import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLatency } from '../reducers/dataSlice';
import { RootState } from '../../store';

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
    console.log(halfRatio);
    red = Math.floor(255 * halfRatio);
    green = 255;
  } else {
    halfRatio = ((num - max / 2) / max) * 2;
    console.log(halfRatio);
    red = 255;
    green = Math.floor(255 - 255 * halfRatio);
  }
  return `rgb(${red}, ${green}, 0)`;
};

function TimeSlider() {
  // Define state to hold the value of the slider
  const [sliderValue, setSliderValue] = useState(50);
  const dispatch = useDispatch();

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
        max='23'
        value={sliderValue}
        className='slider'
        onChange={handleSliderChange}
      />
      <p>
        Hour: <span>{sliderValue}</span>
      </p>
    </div>
  );
}

export default TimeSlider;
