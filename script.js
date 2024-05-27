// Função para buscar dados meteorológicos
async function fetchWeather() {
    console.log("fetchWeather() chamada!");
    const city = document.getElementById('cityInput').value;
    const openWeatherApiKey = '8b829cb8dbb712898c23f08fd4a4b603';
    const hgWeatherApiKey = 'ed7c6b5b';
    const proxyUrl = 'https://api.allorigins.win/raw?url=';

    try {
        // Obter as coordenadas da cidade usando a API de Geocodificação do OpenWeather
        const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${openWeatherApiKey}`;
        const geocodingResponse = await fetch(proxyUrl + encodeURIComponent(geocodingUrl));
        const geocodingData = await geocodingResponse.json();

        if (geocodingData.length === 0) {
            alert('Cidade não encontrada');
            return;
        }

        const { lat, lon } = geocodingData[0];

        // Usar as coordenadas para obter a previsão do tempo da API da HG Weather
        const hgWeatherUrl = `https://api.hgbrasil.com/weather?key=${hgWeatherApiKey}&lat=${lat}&lon=${lon}`;
        const hgWeatherResponse = await fetch(proxyUrl + encodeURIComponent(hgWeatherUrl));
        const hgWeatherData = await hgWeatherResponse.json();

        if (hgWeatherData.results) {
            displayWeather(hgWeatherData.results);
        } else {
            alert('Cidade não encontrada na API da HG Weather');
        }
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
    }
}

// Função para formatar a data no formato desejado
function formatarData(data) {
    const partes = data.split(' ');
    const [dia, mes, ano] = partes[0].split('/');
    return `${ano}-${mes}-${dia}`;
}

// Mapeamento das fases da lua em português
const fasesDaLua = {
    "new_moon": "Lua Nova",
    "waxing_crescent": "Crescente",
    "first_quarter": "Quarto Crescente",
    "waxing_gibbous": "Crescente Gibosa",
    "full_moon": "Lua Cheia",
    "waning_gibbous": "Minguante Gibosa",
    "last_quarter": "Quarto Minguante",
    "waning_crescent": "Minguante"
};

// Função para obter o URL do ícone da fase da lua
function getMoonIconUrl(moonPhase) {
    return `https://assets.hgbrasil.com/weather/images/moon/${moonPhase}.png`;
}

// Função para exibir o clima
function displayWeather(weather) {
    console.log("displayWeather() chamada!");
    const weatherInfo = document.getElementById('weatherInfo');

    // Verificar se a data é válida antes de tentar formatá-la
    const dataFormatada = weather.date && new Date(weather.date) !== 'Invalid Date'
        ? new Date(formatarData(weather.date)).toLocaleDateString('pt-BR')
        : 'Data não disponível';

    // Obter o nome da fase da lua em português
    const faseDaLua = fasesDaLua[weather.moon_phase] || weather.moon_phase;

    const iconUrl = `https://assets.hgbrasil.com/weather/images/${weather.img_id}.png`;
    const moonIconUrl = getMoonIconUrl(weather.moon_phase);

    weatherInfo.innerHTML = `
        <div><strong>Cidade:</strong> ${weather.city}</div>
        <div><strong>Data:</strong> ${dataFormatada}</div>
        <div><strong>Temperatura Atual:</strong> ${weather.temp} °C</div>
        <div><strong>Temperatura Máxima:</strong> ${weather.forecast[0].max} °C</div>
        <div><strong>Temperatura Mínima:</strong> ${weather.forecast[0].min} °C</div>
        <div><strong>Clima:</strong> ${weather.description} <img src="${iconUrl}" alt="Ícone do Clima"></div>
        <div><strong>Probabilidade de Chuva:</strong> ${weather.forecast[0].rain_probability}%</div>
        <div><strong>Fase da Lua:</strong> <img src="${moonIconUrl}" alt="${faseDaLua}"> ${faseDaLua}</div>
    `;

    weatherInfo.style.display = 'block';
}
