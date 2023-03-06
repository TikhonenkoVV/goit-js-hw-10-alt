import debounce from 'lodash.debounce';
import { createPagination } from './pagination.js';
import { refs } from './refs.js';
import '../css/pagination.css';

export const BASE_URL = 'https://restcountries.com/v3.1/';
const DEBOUNCE_DELAY = 300;
export const startUrl = BASE_URL + 'all';
export let pageNumber = 1;
export let startCountryCount = 0;
export let countryCount = 0;

const pageReset = () => {
    refs.countryCounter.textContent = '';
    refs.pageCounter.textContent = '';
    refs.paginationBox.innerHTML = '';
};

class Api {
    static #request(url, options) {
        return fetch(url, options)
            .then(res => {
                if (!res.ok) {
                    throw new Error('ERROR');
                }
                return res.json();
            })
            .catch(e => {
                pageReset();
            });
    }
    static get(url, params) {
        return Api.#request(
            url + (params ? `?${new URLSearchParams(params)}` : '')
        );
    }
}

const createCountryCards = e => {
    return `<a class="card">
                <img src="${e.flags.svg}" alt="${e.flags.alt}" width="100" height="50">
                <p>${e.name.official}</p>
            </a>`;
};

const createCountryCard = e => {
    return `<div class="country-card"><img src="${e.flags.svg}" alt="${
        e.flags.alt
    }" width="200" height="100">
    <div>
            <h2 class="country-info__title">${e.name.official}</H2>
            <p>Capital: ${e.capital}</p>
            <p>Population: ${e.population}</p>
            <p>Languages: ${Object.values(e.languages).join(', ')}</p>
            </div>
            </div>`;
};

const onCardsClick = e => {
    if (e.target.tagName !== 'A') return;
    const countryName = e.target.querySelector('p').textContent.trim();
    const url = `${BASE_URL}name/${countryName}`;
    const param = {
        fields: 'name,capital,population,flags,languages,',
    };
    refs.searchField.value = countryName;
    renderCountriesList(url, param, 1);
};

export const renderCountriesList = (url, params, page) => {
    Api.get(url, params).then(data => {
        if (data) {
            if (!refs.errorOverlay.classList.contains('is-none')) {
                refs.errorOverlay.classList.add('is-none');
            }
            if (startCountryCount === 0) startCountryCount = data.length;
            countryCount = data.length;
            const firstElement = page * 10 - 10;
            const elementsCount = page * 10;
            pageNumber = page;
            const curData = data.slice(firstElement, elementsCount);
            if (countryCount === null) countryCount = data.length;
            if (countryCount > 1) {
                if (!refs.countriesList.classList.contains('grid'))
                    refs.countriesList.classList.add('grid');
                refs.countriesList.innerHTML = curData
                    .map(createCountryCards)
                    .join('');
                refs.countriesList.addEventListener('click', onCardsClick);
            } else {
                refs.countriesList.classList.remove('grid');
                refs.countriesList.innerHTML = createCountryCard(...curData);
            }
            createPagination(countryCount, pageNumber);
        } else {
            refs.errorOverlay.classList.remove('is-none');
            refs.countriesList.innerHTML = '';
        }
    });
};

const onSearchInput = e => {
    const country = e.target.value.trim();
    if (!country) {
        startPage();
        return;
    }
    const param = {
        fields: 'name,capital,population,flags,languages,',
    };
    const url = `${BASE_URL}name/${e.target.value.trim()}`;
    renderCountriesList(url, param, 1);
};

const startPage = () => {
    const param = {
        fields: 'name,flags,',
    };
    renderCountriesList(startUrl, param, 1);
};
startPage();

refs.searchField.addEventListener(
    'input',
    debounce(onSearchInput, DEBOUNCE_DELAY)
);
