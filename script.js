async function fetchWeather() {
    console.log("fetchWeather() chamada!");
    const city = document.getElementById('cityInput').value;
    const openWeatherApiKey = '8b829cb8dbb712898c23f08fd4a4b603';
    const hgWeatherApiKey = '3117ba2a';

    try {
        // Obter as coordenadas da cidade usando a API de Geocodificação do OpenWeather
        const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${openWeatherApiKey}`;
        console.log("geocodingUrl:", geocodingUrl); // Adicionado para depuração
        const geocodingResponse = await fetch(geocodingUrl);
        const geocodingData = await geocodingResponse.json();

        console.log("geocodingData:", geocodingData); // Adicionado para depuração

        if (geocodingData.length === 0) {
            alert('Cidade não encontrada');
            return;
        }

        const { lat, lon } = geocodingData[0];
        console.log("lat:", lat); // Adicionado para depuração
        console.log("lon:", lon); // Adicionado para depuração

        // Usar as coordenadas para obter a previsão do tempo diretamente da API da HG Weather
        const hgWeatherUrl = `https://api.hgbrasil.com/weather?key=${hgWeatherApiKey}&lat=${lat}&lon=${lon}`;
        console.log("hgWeatherUrl:", hgWeatherUrl); // Adicionado para depuração
        const hgWeatherResponse = await fetch(hgWeatherUrl);
        const hgWeatherData = await hgWeatherResponse.json();

        console.log("hgWeatherData:", hgWeatherData); // Adicionado para depuração

        if (hgWeatherData.by === 'default') {
            displayWeather(hgWeatherData.results);
        } else {
            alert('Cidade não encontrada na API da HG Weather');
        }
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
    }
}

function displayWeather(weather) {
    console.log("displayWeather() chamada!");
    const weatherInfo = document.getElementById('weatherInfo');

    const date = new Date(weather.date).toLocaleDateString('pt-BR');
    const iconUrl = `https://assets.hgbrasil.com/weather/images/${weather.img_id}.png`;
    const moonIconUrl = `https://assets.hgbrasil.com/weather/images/moon/${weather.moon_phase}.png`;

    weatherInfo.innerHTML = `
        <div><strong>Cidade:</strong> ${weather.city}</div>
        <div><strong>Data:</strong> ${date}</div>
        <div><strong>Temperatura Atual:</strong> ${weather.temp} °C</div>
        <div><strong>Temperatura Máxima:</strong> ${weather.forecast[0].max} °C</div>
        <div><strong>Temperatura Mínima:</strong> ${weather.forecast[0].min} °C</div>
        <div><strong>Clima:</strong> ${weather.description} <img src="${iconUrl}" alt="Ícone do Clima"></div>
        <div><strong>Probabilidade de Chuva:</strong> ${weather.forecast[0].rain_probability}%</div>
        <div><strong>Fase da Lua:</strong> <img src="${moonIconUrl}" alt="Ícone da Fase da Lua"> ${weather.moon_phase}</div>
    `;

    weatherInfo.style.display = 'block';
}
