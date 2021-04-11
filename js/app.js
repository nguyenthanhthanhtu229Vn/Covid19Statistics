const countries = document.querySelector('datalist');
const search = document.querySelector('#srch');
const date = document.querySelector('#date');
const nameCountry = document.querySelector('#name-country');
const confirmed = document.querySelector('.confirmed');
const deaths = document.querySelector('.deaths');
const recovered = document.querySelector('.recovered');
const chart = document.querySelector('.chart');

let dataChart = [];
const API_URL = "https://api.covid19api.com/summary";

async function covid(country) {
    countries.innerHTML = `<option value="World">World</option>`;
    resetValue(confirmed);
    resetValue(deaths);
    resetValue(recovered);
    const res = await fetch(API_URL);
    console.log(res)
    const data = await res.json();
    console.log(country)
    if (res.status === 4 || res.status === 200) {
        date.textContent = new Date(data.Date).toDateString();
        if (country === '' || country === 'World') {
            const { TotalConfirmed, TotalDeaths, TotalRecovered, NewConfirmed, NewDeaths, NewRecovered } = data.Global;
            total(TotalConfirmed, TotalDeaths, TotalRecovered);
            newUpdate(NewConfirmed, NewDeaths, NewRecovered);
            nameCountry.textContent = 'The World';
            dataChart = [TotalConfirmed, TotalDeaths, TotalRecovered];
        }

        data.Countries.forEach(item => {
            const option = document.createElement('option');
            option.value = item.Country;
            option.textContent = item.Country;
            countries.appendChild(option);
            if (country === item.Country) {
                total(item.TotalConfirmed, item.TotalDeaths, item.TotalRecovered);
                newUpdate(item.NewConfirmed, item.NewDeaths, item.NewRecovered);
                nameCountry.textContent = item.Country;
                dataChart = [item.TotalConfirmed, item.TotalDeaths, item.TotalRecovered];
            }
        })
    } else {
        chart.innerHTML = `<h2>Loading...<h2>`;
    }

    drawChart(dataChart);
}

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
};

const speed = 100;

function counting(targer, element) {
    const inc = targer / speed;
    const count = +element.textContent;
    if (count < targer) {
        element.textContent = Math.ceil(count + inc);
        setTimeout(() => {
            counting(targer, element)
        }, 1)
    } else {
        element.textContent = numberWithCommas(targer);
    }
};

function total(Confirmed, Deaths, Recoverd) {
    // Total Confirmed
    counting(Confirmed, confirmed.children[1]);
    //    Total Deaths
    counting(Deaths, deaths.children[1]);
    //    Total Recoverd
    counting(Recoverd, recovered.children[1]);
};

function newUpdate(Confirmed, Deaths, Recoverd) {
    // New Confirmed
    counting(Confirmed, confirmed.children[2]);
    //    New Deaths
    counting(Deaths, deaths.children[2]);
    //    New Recoverd
    counting(Recoverd, recovered.children[2]);
};

function resetValue(element) {
    element.children[1].textContent = 0;
    element.children[2].textContent = 0;
}

function drawChart(data) {
    chart.innerHTML = '';
    const ctx = document.createElement('canvas');
    chart.appendChild(ctx);
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            color: ['#1f373d'],
            labels: ['Total Confirmed', 'Total Deaths', 'Total Recoverd'],
            datasets: [{
                label: nameCountry.textContent,
                data: data,
                backgroundColor: [
                    '#ffcc01',
                    'crimson',
                    'green',
                ],
            }]
        },
        options: {}

    });
}

covid(search.value);

const btnSearch = document.querySelector('button');
btnSearch.addEventListener('click', (e) => {
    e.preventDefault();
    covid(search.value);
    console.log(search.value);
    search.value = '';
})

var MenuItems = document.getElementById("MenuItems");

MenuItems.style.maxHeight = "0px";

function menutoggle() {
    if (MenuItems.style.maxHeight == "0px") {
        MenuItems.style.maxHeight = "200px";
    } else {
        MenuItems.style.maxHeight = "0px";
    }
}