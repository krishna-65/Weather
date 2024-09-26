console.log('hello');
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector('.weather-container');
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector(".form-container");
const loadingScreen = document.querySelector('.loading-container');
const userInfoContainer = document.querySelector(".user-info-container");

// initially variable required
const API_KEY = '09c92779e901afedfde8f9349a8a46f8';
let oldTab = userTab;
oldTab.classList.add("current-tab");
getfromSessionStorage();

function  switchTab(newtab)
{
    if(newtab != oldTab)
    {
        oldTab.classList.remove("current-tab");
        oldTab = newtab;
        oldTab.classList.add("current-tab");
        if(!searchForm.classList.contains('active')){
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add('active')
        }
        else
        {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove('active');
            getfromSessionStorage();
        }
    }
}

function getfromSessionStorage()
{
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        grantAccessContainer.classList.add('active');
    }
    else
    {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates)
{
    const {lat, lon} = coordinates;
    grantAccessContainer.classList.remove('active');
    loadingScreen.classList.add('active')

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&unit=metric`);
        const data = await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);


    }
    catch(err)
    {
        loadingScreen.classList.remove('active');
    }
}


function renderWeatherInfo(weatherInfo)
{
    console.log("inside render");
    const cityName = document.querySelector("[data-cityName]");
    const coutryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //featch value from

    cityName.innerText = weatherInfo?.name;
    coutryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    console.log("middle render");
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText =`${weatherInfo?.clouds?.all} %`;
    console.log("end render");
    
    
 
}

const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click", getLocation);

userTab.addEventListener("click", () => {
    switchTab(userTab);
});
searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

// grantAccessButton.addEventListener("click", getLocation());


function getLocation()
{
    console.log('inside grant location');
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        //hw show an alert forno geolocation support
        console.log("Geolocation is not supported by this browser.");
    }
}
function showPosition(position)
{
    console.log('show position');
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
   
    

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const searchInput = document.querySelector("[ data-searchInput]");
searchForm.addEventListener("submit", (e) =>
{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
    return ;
    else
    fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city)
{
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove("active");

    try{
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            const data = await response.json();
            loadingScreen.classList.remove('active');
            userInfoContainer.classList.add('active');
            renderWeatherInfo(data);
    }
    catch(err)
    {

    }
}


