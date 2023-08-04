import { getImages } from './api';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';

const el = {
    searchForm: document.querySelector('.search-form'),
    wrapperCards: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
};

let keyword = '';
let totalHits;
let page = 1;
let totalPages = 1;
const quantityPerPage = 100;

el.searchForm.addEventListener('submit', handlerSearch);
el.loadMoreBtn.addEventListener('click', handlerLoadMore);

function handlerSearch(e) {
    e.preventDefault();

    el.wrapperCards.innerHTML = '';
    el.loadMoreBtn.hidden = true;
    page = 1;

    keyword = e.currentTarget.firstElementChild.value.trim();

    if (keyword === '') {
        Notify.warning('Please, enter search request.');
        return;
    }

    getImages(keyword, quantityPerPage)
        .then(data => {
            if (!data.hits.length) {
                Notify.failure(
                    'Sorry, there are no images matching your search query. Please try again.'
                );
                el.searchForm.reset();
                return;
            }

            totalHits = data.totalHits;
            totalPages = totalHits / quantityPerPage;

            createMarkup(data.hits);

            el.searchForm.reset();

            if (page >= totalPages) {
                el.loadMoreBtn.hidden = true;
                Notify.info(
                    'We are sorry, but you have reached the end of search results.'
                );
                return;
            }
            el.loadMoreBtn.hidden = false;
        })
        .catch(({ code, message }) => {
            Report.failure(
                `${message}. Code: ${code} `,
                'Oops! Something went wrong! Try reloading the page!',
                'OK'
            );
        });
}

function handlerLoadMore() {
    page += 1;

    getImages(keyword, quantityPerPage, page)
        .then(data => {
            createMarkup(data.hits);

            if (page >= totalPages) {
                el.loadMoreBtn.hidden = true;
                Notify.info(
                    'We are sorry, but you have reached the end of search results.'
                );
            }
        })
        .catch(({ code, message }) => {
            Report.failure(
                `${message}. Code: ${code} `,
                'Oops! Something went wrong! Try reloading the page!',
                'OK'
            );
        });
}

function createMarkup(arrHits) {
    el.wrapperCards.insertAdjacentHTML(
        'beforeend',
        arrHits
            .map(
                ({
                    webformatURL,
                    largeImageURL,
                    tags,
                    likes,
                    views,
                    comments,
                    downloads,
                }) => `<div class="photo-card">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300"/>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes:</b>
                            ${likes}
                        </p>
                        <p class="info-item">
                            <b>Views:</b>
                            ${views}
                        </p>
                        <p class="info-item">
                            <b>Comments:</b>
                            ${comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads:</b>
                            ${downloads}
                        </p>
                    </div>
                </div>`
            )
            .join('')
    );
}
