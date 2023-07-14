import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
let gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const submit = document.querySelector('.search-form input');
const startBtn = document.querySelector('.search-form button');
let pageCounter = 1;

const API_KEY = '38253107-b25581e8f8d05da09cf98b2cc';
const API_PATH = 'https://pixabay.com/api/';

startBtn.disabled = true;
loadMoreBtn.style.visibility = 'hidden';

async function fetchImages(value) {
  try {
    let response = await axios(`${API_PATH}`, {
      params: {
        key: API_KEY,
        q: value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
        page: pageCounter,
      },
    });

    const totalHits = response.data.totalHits;
    const pages = Math.ceil(totalHits / per_page);
    if (response.data.hits.length === 0) {
      loadMoreBtn.style.visibility = 'hidden';
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (pageCounter === 1) {
      loadMoreBtn.style.visibility = 'visible';
      images(response.data.hits);
      return Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (pageCounter > 1) {
      loadMoreBtn.style.visibility = 'visible';
      images(response.data.hits);
    }

    if (pages === pageCounter) {
      loadMoreBtn.style.visibility = 'hidden';
      return Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
      return;
    }
  } catch (error) {
    Notiflix.Notify.failure(`Failed to fetch breeds: ${error}`);
  }
}

function clearGallery() {
  gallery.innerHTML = '';
}

function request(e) {
  event.preventDefault();
  pageCounter = 1;
  clearGallery();
  let requestId = submit.value.trim();
  fetchImages(requestId);
  lightbox.refresh();
  return;
}

function images(response) {
  let galleryEL = response.map(resp => {
    return `<a href = '${resp.largeImageURL}' class = "gallery__link">
        <img src = "${resp.webformatURL}" alt = "${resp.tags}" loading = "lazy"/>
        <div class = "info">
        <p class = "info-item">
        <b>Likes: ${resp.likes}</b>
        </p>
        <p class = "info-item">
        <b>Views: ${resp.views}</b>
        </p>
        <p class = "info-item">
        <b>Comments: ${resp.comments}</b>
        </p>
        <p class = "info-item">
        <b>Downloads: ${resp.downloads}</b>
        </p>
        </div>
        </a>`;
  });
  gallery.insertAdjacentHTML('beforeend', galleryEL.join(''));
  lightbox.refresh();
  return;
}

searchForm.addEventListener('submit', request);
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 100,
});

submit.addEventListener('input', event => {
  const inputValue = event.currentTarget.value.trim();
  if (inputValue.length === 0) {
    startBtn.disabled = true;
  } else if (inputValue.length > 0) {
    startBtn.disabled = false;
  }
  return;
});

loadMoreBtn.addEventListener('click', () => {
  pageCounter += 1;
  fetchImages(submit.value);
  lightbox.refresh();
  return;
});
