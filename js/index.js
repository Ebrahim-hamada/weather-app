const inputSearch = document.querySelector(".search");
const api = {
  baseUrl: "https://api.weatherapi.com/v1",
  endpoint:"v1/forecast.json",
  apiKey:  "ee8681ee95f04fa1be6135415240512",
  day: 3
};


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


// Add event listener to search input
inputSearch.addEventListener("input", function(event) {
  getSearchWeather(event.target.value);
});

// Add event listener to clear button
document.querySelector(".btnClicked").addEventListener("click", clearInput);

// Fetch weather data for the specified city
async function getSearchWeather(value) {
  try {
    var request = await fetch(`${api.baseUrl}/${api.endpoint}?key=${api.apiKey}&q=${value}&days=${api.day}`);
    
    if (!request.ok) {
      throw new Error(`Error: ${request.status} ${request.statusText}`);
    }
    var data = await request.json();
    displayCurrentToDay(data.location , data.current);
    displayForecastDay(data.forecast.forecastday);
  } catch (error) {
    // Display an error message to the user
    document.querySelector(".today-forecast").innerHTML = `<div class="error text-center py-5">Failed to fetch weather data. Please try again later.</div>`;
  }
}

// Initial fetch for Cairo weather
getSearchWeather("cairo");

// Display current weather data
function displayCurrentToDay(location, current) {
  var date = new Date(current.last_updated);
  var currentWeather = `
    <div class="forecast-header d-flex justify-content-between p-2 ">
      <span class="day">${days[date.getDay()]}</span>
      <span class="date">${date.getDate()} ${monthNames[date.getMonth()]}</span>
    </div>
    <div class="forecast-content pb-3 ps-3">
      <div class="location">${location.name}</div>
      <div class="degree text-white">
        <div class="number">${current.temp_c}<sup>o</sup>C</div>
        <div class="forecast-icon">
          <img src="https:${current.condition.icon}" alt="" width="80">
        </div>
      </div>
      <div class="custom pb-4 text-info">${current.condition.text}</div>
      <span><img src="./image/icon-umberella@2x.png" alt=""> 20%</span>
      <span><img src="./image/icon-compass@2x.png" alt=""> East</span>
      <span><img src="./image/icon-wind@2x.png" alt=""> 18km/h</span>
    </div>
  `;
  document.querySelector(".today-forecast").innerHTML = currentWeather;
}

// Display weather forecast for the next days
function displayForecastDay(forecastDay) {
  var forecast = "";
  for (var i = 1; i < forecastDay.length; i++) {
    var data = new Date(forecastDay[i].date);
    forecast += `
      <div class="col-lg-6 forecast pb-5">
        <div class="forecast-next">
          <div class="forecast-header text-center p-2">
            <span class="day">${days[data.getDay()]}</span>
            </span>
          </div>
          <div class="py-5 d-flex text-center justify-content-center flex-column align-items-center">

            <div class="forecast-icon pt-4">
                <img src="https:${forecastDay[i].day.condition.icon}" alt="" width="60">
              </div>

            <div class="degree text-white">
              <div class="number pt-3">
                ${forecastDay[i].day.maxtemp_c}<sup>o</sup>c
                <br>
                <small class="lead text-secondary">${forecastDay[i].day.mintemp_c}<sup>o</sup>c</small>
              </div>
            </div>

            <div class="custom pt-4 pb-5 text-info">${forecastDay[i].day.condition.text}</div>
          </div>
        </div>
      </div>
    `;
  }
  document.querySelector(".row-2").innerHTML = forecast;
}

// Function to get location using Geolocation API
function getLocation() {
  const api = "https://api.bigdatacloud.net/data/reverse-geocode-client";


  navigator.geolocation.getCurrentPosition(
      (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          
          const apiUrl = `${api}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

          fetch(apiUrl)
              .then(response =>response.json())  
              .then(data => {

                if (data.city) {

                  function normalize(input) {
                    return input.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                  }
                  
                  let name = data.city;
                  let updatedName = normalize(name);
                  
                  getSearchWeather(updatedName)
                  
                  } else {
                    document.querySelector(".today-forecast").innerHTML = `<div class="error text-center py-5">City not found!</div>`;
                  }
              })
              .catch(err => {
                document.querySelector(".today-forecast").innerHTML = `<div class="error text-center py-5">Error retrieving location. Please try again later.</div>`;
              });
        }
   )
}


// Clear search input
function clearInput() {
  inputSearch.value = '';
}