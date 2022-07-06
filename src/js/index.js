import './../css/styles.css';
import { Notify } from 'notiflix';
import { GetPixabayApi } from './getPixabay';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css"

const galleryRef = document.querySelector('.gallery');
const formRef = document.querySelector('.search-form');
const loadMoreButton = document.querySelector('.load-more');

formRef.addEventListener('submit', onFormSubmit);
loadMoreButton.addEventListener('click', onLoadMoreButtonClick);

const getPixabayApi = new GetPixabayApi();
showLoading(false);


function makeGallaryMarkup(searchedImages) {
    return searchedImages.map(({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
    }) => `<div class="photo-card"><a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes:${likes}</b>
    </p>
    <p class="info-item">
      <b>Views:${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`).join('')
}

function renderGallery(searchedImages) {
    galleryRef.insertAdjacentHTML('beforeend', makeGallaryMarkup(searchedImages))
}

async function onFormSubmit(event) {
    event.preventDefault();
    showLoading(true);
    cleanGallery();
    getPixabayApi.resetPage();
    const request = event.target.elements.searchQuery.value.trim();
    if (!request) { return Notify.info("Input text to search") };
    getPixabayApi.searchQuery1 = request;
    try {
        const { hits, totalHits } = await getPixabayApi.fetchImages();
      
        if (!totalHits) {
             showLoading(false);
            return Notify.warning("Sorry, there are no images matching your search query. Please try again.")
        }
    Notify.success(`Hooray! We found ${totalHits} images.`)
        renderGallery(hits);
        lightbox.refresh();
    } catch (error) {
        console.log(error.message)
    }
    event.target.reset();
}

async function onLoadMoreButtonClick() {
    showLoading(true)
    try {
        const { hits, totalHits } = await getPixabayApi.fetchImages();
        if (galleryRef.childElementCount >= totalHits) {
            showLoading(false);
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
        renderGallery(hits); 
        lightbox.refresh();
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
}); 
    } catch (error) {
     console.log(error.message)
    }
}

function cleanGallery() {
    galleryRef.innerHTML = '';
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 300, 
});


function showLoading(status) {
  loadMoreButton.style.display = status ? 'block' : 'none';
}


