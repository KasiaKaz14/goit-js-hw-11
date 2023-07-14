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
const perPage = 40;

const API_KEY = '38253107-b25581e8f8d05da09cf98b2cc';
const API_PATH = 'https://pixabay.com/api/';

startBtn.disabled = true;
loadMoreBtn.style.visibility = 'hidden';

async function fetchImages(value) {
  try {
    let photos = await axios(`${API_PATH}`, {
      params: {
        key: API_KEY,
        q: value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: perPage,
        page: pageCounter,
      },
    });

    const totalHits = response.data.totalHits;
    const pages = Math.ceil(totalHits / perPage);
    if (photos.data.hits.length === 0) {
      loadMoreBtn.style.visibility = 'hidden';
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (pageCounter === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      loadMoreBtn.style.visibility = 'visible';
      images(photos.data.hits);
    }

    if (pageCounter > 1) {
      loadMoreBtn.style.visibility = 'visible';
      images(photos.data.hits);
    }

    if (pages === pageCounter) {
      loadMoreBtn.style.visibility = 'hidden';
      Notiflix.Notify.failure(
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

function images(photos) {
  let galleryEL = photos.map(photo => {
    return `<a href = '${photo.largeImageURL}' class = "gallery__link">
        <img src = "${photo.webformatURL}" alt = "${photo.tags}" loading = "lazy"/>
        <div class = "info">
        <p class = "info-item">
        <b>Likes: ${photo.likes}</b>
        </p>
        <p class = "info-item">
        <b>Views: ${photo.views}</b>
        </p>
        <p class = "info-item">
        <b>Comments: ${photo.comments}</b>
        </p>
        <p class = "info-item">
        <b>Downloads: ${photo.downloads}</b>
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
