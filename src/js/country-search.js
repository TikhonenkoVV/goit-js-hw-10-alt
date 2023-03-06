import debounce from 'lodash.debounce';
import { fetchCountries } from './fetch.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchField: document.querySelector('#search-box'),
    countriesList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

const cleanMarkup = () => {
    refs.countriesList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
};

const renderCountrisName = countryName =>
    (refs.countriesList.innerHTML = countryName
        .map(({ name, flags }) => {
            return `
            <li class="country-list__item">
                <img src="${flags.svg}" alt="${flags.alt}" width="100" height="50">
                <p>${name.official}</p>
            </li>`;
        })
        .join(''));

const renderCountryInfo = countryInfo =>
    (refs.countryInfo.innerHTML = countryInfo.map(
        ({ name, flags, capital, population, languages }) => {
            return `
            <img src="${flags.svg}" alt="${flags.alt}" width="200" height="100">
            <h2 class="country-info__title">${name.official}</H2>
            <p>Capital: ${capital}</p>
            <p>Population: ${population}</p>
            <p>Languages: ${Object.values(languages).join(', ')}</p>`;
        }
    ));

const onSearchInput = e => {
    cleanMarkup();
    const country = e.target.value.trim();
    if (!country) return;
    fetchCountries(country)
        .then(countries => {
            if (countries.length > 10)
                Notify.info(
                    'Too many matches found. Please enter a more specific name.'
                );
            else {
                if (countries.length === 1) renderCountryInfo(countries);
                else renderCountrisName(countries);
            }
        })
        .catch(() =>
            Notify.failure('Oops, there is no country with that name')
        );
};

refs.searchField.addEventListener(
    'input',
    debounce(onSearchInput, DEBOUNCE_DELAY)
);
