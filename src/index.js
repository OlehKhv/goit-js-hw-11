import { getImages } from './api';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const el = {
    searchForm: document.querySelector('.search-form'),
    wrapperCards: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
};
const quantityPerPage = 100;
let keyword = '';
let page = 1;
let totalPages = 1;
let gallery = null;

el.searchForm.addEventListener('submit', handlerSearch);
el.loadMoreBtn.addEventListener('click', handlerLoadMore);
console.dir(el.gallery);
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

            totalPages = data.totalHits / quantityPerPage;

            Notify.success(`Hooray! We found ${data.totalHits} images.`);

            createMarkup(data.hits);

            el.searchForm.reset();

            gallery = new SimpleLightbox('.gallery-link', {
                captionsData: 'alt',
                captionDelay: 250,
            });

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

            const { height: cardHeight } = document
                .querySelector('.gallery')
                .firstElementChild.getBoundingClientRect();

            window.scrollBy({
                top: cardHeight * 2,
                behavior: 'smooth',
            });

            if (page >= totalPages) {
                el.loadMoreBtn.hidden = true;
                Notify.info(
                    'We are sorry, but you have reached the end of search results.'
                );
            }
            gallery.refresh();
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
    console.log(arrHits);
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
                }) => `<a href=${largeImageURL} class="gallery-link"><div class="photo-card">
                    <img src=${webformatURL} alt="${tags}" loading="lazy" width="300"/>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes:</b></br>
                            <span>${likes}</span>
                        </p>
                        <p class="info-item">
                            <b>Views:</b></br>
                            <span>${views}</span>
                            
                        </p>
                        <p class="info-item">
                            <b>Comments:</b></br>
                            <span>${comments}</span>
                        </p>
                        <p class="info-item">
                            <b>Downloads:</b></br>
                            <span>${downloads}</span>
                        </p>
                    </div>
                </div></a>`
            )
            .join('')
    );
}

// Прокручування сторінки

// Зробити плавне прокручування сторінки після запиту і відтворення кожної наступної групи зображень. Ось тобі код-підказка, але розберися у ньому самостійно.

// const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });

// Нескінченний скрол

// Замість кнопки «Load more», можна зробити нескінченне завантаження зображень під час прокручування сторінки. Ми надаємо тобі повну свободу дій в реалізації, можеш використовувати будь-які бібліотеки.
