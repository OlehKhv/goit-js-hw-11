import { getImages } from './api';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';

const el = {
    searchForm: document.querySelector('.search-form'),
    wrapperCards: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
};

el.searchForm.addEventListener('submit', handlerSearch);

function handlerSearch(e) {
    e.preventDefault();

    el.wrapperCards.innerHTML = '';

    const keyword = e.currentTarget.firstElementChild.value.trim();

    if (keyword === '') {
        Notify.warning('Please, enter search request.');
        return;
    }

    getImages(keyword)
        .then(data => {
            console.log(data);
            if (!data.hits.length) {
                Notify.failure(
                    'Sorry, there are no images matching your search query. Please try again.'
                );
                el.searchForm.reset();
                return;
            }
            console.log(data.hits);
            createMarkup(data.hits);
            el.searchForm.reset();
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

// У відповіді бекенд повертає властивість totalHits - загальна кількість зображень, які відповідають критерію пошуку (для безкоштовного акаунту). Якщо користувач дійшов до кінця колекції, ховай кнопку і виводь повідомлення з текстом "We're sorry, but you've reached the end of search results.".
