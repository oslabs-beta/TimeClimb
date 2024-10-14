import { useState } from 'react';

const getColor = (num: number): string => {
  //the score form green to red is between 1 and max
  let max: number = 100;
  //colors in rgb
  let red: number;
  let green: number;
  let halfRatio: number;
  //red starts at zero and increases to the half way point remains at 255
  //green starts a 255, starts decreaseing at the half way point
  if(num <= max/2){
    halfRatio = num/(max/2)
    console.log(halfRatio)
    red = Math.floor(255 * halfRatio)
    green = 255 
  } else {
    halfRatio = (num  - max/2)/max*2
    console.log(halfRatio)
    red = 255
    green = Math.floor(255 - (255 * halfRatio))
  }
  console.log(`rgb(${red}, ${green}, 0)`)
  return `rgb(${red}, ${green}, 0)`
}

function TimeSlider() {
//   const slider = document.getElementById("myRange");
//   const output = document.getElementById("demo");
//   output.innerHTML = slider.value;

// slider.oninput = function() {
//   output.innerHTML = this.value;
// }
//   return <div className="slidecontainer">
//   <input type="range" min="1" max="100" value="50" className="slider" id="myRange"/>
//   <p>Value: <span id="demo"></span></p>
// </div>;

  // Define state to hold the value of the slider
  const [sliderValue, setSliderValue] = useState(50);

  // Update the state when the slider value changes
  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
    document.body.style.backgroundColor = getColor(event.target.value)
  };

  return (
    <div className="slidecontainer">
      <input 
        type="range" 
        min="1" 
        max="100" 
        value={sliderValue} 
        className="slider" 
        onChange={handleSliderChange}
      />
      <p>Value: <span>{sliderValue}</span></p>
    </div>
  );
}

export default TimeSlider;
