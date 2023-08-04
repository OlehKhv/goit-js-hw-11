import { getImages } from './api';

const el = {
    searchForm: document.querySelector('.search-form'),
    wrapperCards: document.querySelector('.gallery'),
};

el.searchForm.addEventListener('submit', handlerSearch);

function handlerSearch(e) {
    e.preventDefault();
    const keyword = e.currentTarget.firstElementChild.value;
    getImages(keyword);
    console.dir(getImages(keyword));
}

function createMarkup() {
    const markup = `<div class="photo-card">
  <img src="" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>`;
}
