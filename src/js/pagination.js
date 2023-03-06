import { refs } from './refs.js';
import {
    BASE_URL,
    startUrl,
    pageNumber,
    startCountryCount,
    countryCount,
    renderCountriesList,
} from './country-search-pagination.js';
import { calcPageCount } from './page-count.js';

const onDotClick = e => {
    let url = startUrl;
    if (countryCount !== startCountryCount)
        url = `${BASE_URL}name/${refs.searchField.value}`;
    if (e.target.textContent !== '') {
        const page = +e.target.textContent;
        renderCountriesList(url, null, page);
    } else {
        if (e.target.tagName !== 'BUTTON') return;
        const param = {
            fields: 'name,flags,',
        };

        if (e.target.classList.contains('start'))
            renderCountriesList(url, param, 1);
        if (e.target.classList.contains('end'))
            renderCountriesList(url, param, calcPageCount(countryCount));
        if (e.target.classList.contains('next')) {
            if (pageNumber === 1)
                renderCountriesList(url, param, pageNumber + 3);
            else if (pageNumber === calcPageCount(countryCount) - 1)
                renderCountriesList(url, param, pageNumber + 1);
            else renderCountriesList(url, param, pageNumber + 2);
        }
        if (e.target.classList.contains('prev')) {
            if (pageNumber === calcPageCount(countryCount))
                renderCountriesList(url, param, pageNumber - 3);
            else if (pageNumber === 2)
                renderCountriesList(url, param, pageNumber - 1);
            else renderCountriesList(url, param, pageNumber - 2);
        }
    }
};

export const createPagination = (elementsLength, page) => {
    const pageCount = calcPageCount(elementsLength);
    refs.paginationBox.innerHTML = '';
    refs.pageCounter.textContent = `Page count: ${pageCount}`;
    refs.countryCounter.textContent = `Country count: ${elementsLength}`;
    if (elementsLength < 11) return;
    let dotsArray = [];
    if (calcPageCount(countryCount) < 8) {
        for (let i = 0; i < calcPageCount(countryCount); i += 1) {
            const el = document.createElement('button');
            el.classList.add('pagination-dot');
            el.textContent = i + 1;
            dotsArray.push(el);
        }
    } else {
        const lastPage = calcPageCount(countryCount);
        const startDot = document.createElement('button');
        startDot.classList.add('pagination-dot', 'start');
        const prevDot = document.createElement('button');
        prevDot.classList.add('pagination-dot', 'prev');
        const nextDot = document.createElement('button');
        nextDot.classList.add('pagination-dot', 'next');
        const endDot = document.createElement('button');
        endDot.classList.add('pagination-dot', 'end');
        dotsArray.push(startDot, prevDot);
        for (let i = 0; i < 3; i += 1) {
            const el = document.createElement('button');
            el.classList.add('pagination-dot');
            if (i === 0) {
                if (page === 1) el.textContent = i + 1;
                else if (page === lastPage) el.textContent = page - 2;
                else el.textContent = page - 1;
            }
            if (i === 1) {
                if (page === 1) el.textContent = i + 1;
                else if (page === lastPage) el.textContent = page - 1;
                else el.textContent = page;
            }
            if (i === 2) {
                if (page === 1) el.textContent = i + 1;
                else if (page === lastPage) el.textContent = page;
                else el.textContent = page + 1;
            }
            dotsArray.push(el);
        }
        dotsArray.push(nextDot, endDot);
        if (page === 1) {
            startDot.disabled = true;
            prevDot.disabled = true;
        }
        if (page === pageCount) {
            nextDot.disabled = true;
            endDot.disabled = true;
        }
    }
    refs.paginationBox.append(...dotsArray);
    const dots = document.querySelectorAll('.pagination-dot');
    dots.forEach(dot => {
        if (+dot.textContent.trim() === page) dot.classList.add('current');
    });
    refs.paginationBox.addEventListener('click', onDotClick);
};

console.log('Hi!');
