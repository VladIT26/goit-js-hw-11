import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// import throttle from 'lodash.throttle';

class PictureApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.isLoading = false;
    this.shouldLoad = true;
  }
  async getCarts() {
    const KEY_PIXABAY = `28328300-6db152c443a389b785b4f18e6`;
    const pagination = `&per_page=40&page=${this.page}`;
    const optionsSearch = `&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`;
    const url = `https://pixabay.com/api/?key=${KEY_PIXABAY}${optionsSearch}${pagination}`;
    console.log(url);
    try {
      const response = await axios.get(url);
      console.log(response);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }

  resetIsLoading() {
    this.isLoading = false;
  }

  resetShouldLoad() {
    this.shouldLoad = true;
  }
}

const pictureApiService = new PictureApiService();
const lightbox = new SimpleLightbox('.gallery a', {});

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadmoreBtn = document.querySelector('.load-more');

formEl.addEventListener('submit', onSearchPicture);
loadmoreBtn.addEventListener('click', onLoadMore);
loadmoreBtn.classList.add('visually-hidden');

function onSearchPicture(event) {
  event.preventDefault();
  clearGallery();
  loadmoreBtn.classList.add('visually-hidden');
  pictureApiService.resetIsLoading();
  pictureApiService.resetShouldLoad();
  pictureApiService.query =
    event.currentTarget.elements.searchQuery.value.trim();
  if (pictureApiService.query === '') {
    return Notiflix.Notify.info('Please enter search data.');
  }
  pictureApiService.resetPage();
  pictureApiService.getCarts().then(response => {
    const picturesArray = response.data.hits;
    if (picturesArray.length === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    const totalCards = response.data.totalHits;
    Notiflix.Notify.success(`Hooray! We found ${totalCards} images.`);
    event.target.reset();
    const markup_cards = createCards(picturesArray);
    galleryEl.insertAdjacentHTML('beforeend', markup_cards);
    const cardsEl = document.querySelectorAll('.photo-card');
    lightbox.refresh();
    if (cardsEl.length !== totalCards) {
      loadmoreBtn.classList.remove('visually-hidden');
    } else {
      pictureApiService.shouldLoad = false;
    }
  });
}

function createCards(data) {
  return data
    .map(
      ({
        likes,
        tags,
        views,
        downloads,
        comments,
        webformatURL,
        largeImageURL,
      }) => {
        return `<div class="photo-card">
      <a class="gallery__item" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
    </div>
  </div>
    `;
      }
    )
    .join('');
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function onLoadMore() {
  if (pictureApiService.isLoading || !pictureApiService.shouldLoad)
    return (pictureApiService.isLoading = true);
  pictureApiService.incrementPage();
  pictureApiService.getCarts().then(response => {
    const picturesMoreArray = response.data.hits;
    const markupMore_cards = createCards(picturesMoreArray);
    galleryEl.insertAdjacentHTML('beforeend', markupMore_cards);
    lightbox.refresh();
    const cardsEl = document.querySelectorAll('.photo-card');
    const totalCards = response.data.totalHits;

    if (cardsEl.length >= totalCards) {
      pictureApiService.shouldLoad = false;
      loadmoreBtn.classList.add('visually-hidden');
      setTimeout(function () {
        return Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results.",
          { timeout: 3000 }
        );
      }, 1000);
    }
  });
}