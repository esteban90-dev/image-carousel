const nextBtn = document.querySelector('#next');
const previousBtn = document.querySelector('#previous');
const images = document.querySelectorAll('.carousel-image');
const imageDotContainer = document.querySelector('.image-dot-container');
let intervalId;
let imageDirection;

function getNextImage() {
  // return the image after the current image
  const currentImage = document.querySelector('.active');
  const index = [...images].indexOf(currentImage);
  const imageArr = [...images];

  if (index === imageArr.length - 1) {
    return imageArr[0];
  }
  return imageArr[index + 1];
}

function getPreviousImage() {
  // return the image after the current image
  const currentImage = document.querySelector('.active');
  const index = [...images].indexOf(currentImage);
  const imageArr = [...images];
  
  if (index === 0) {
    return imageArr[(imageArr.length) - 1];
  }
  return imageArr[index - 1];
}

function unhideImages() {
  const imageArr = [...images];

  imageArr.forEach((image) => {
    if (image.classList.contains('hide')) {
      image.classList.toggle('hide');
    }
  });
}

function afterNextSlideCenterEnd() {
  const currentImage = document.querySelector('.active');
  const nextImage = document.querySelector('#requested');

  currentImage.classList.toggle('active');
  currentImage.classList.toggle('slide-left');
  nextImage.classList.toggle('active');
  nextImage.classList.toggle('slide-center');
  nextImage.classList.toggle('right');

  // unhide all images 
  unhideImages();

  // remove transition listeners
  currentImage.removeEventListener('transitionstart',afterSlideLeftStart);
  nextImage.removeEventListener('transitionend',afterNextSlideCenterEnd);

  // restore button listeners
  enableListeners();

  // clear the requested id
  nextImage.setAttribute('id','');

  // restart the slide show
  playSlideShow();

  updateDots();
}

function afterPreviousSlideCenterEnd() {
  const currentImage = document.querySelector('.active');
  const nextImage = document.querySelector('#requested');

  currentImage.classList.toggle('active');
  currentImage.classList.toggle('slide-right');
  nextImage.classList.toggle('active');
  nextImage.classList.toggle('slide-center');
  nextImage.classList.toggle('left');

  // unhide all images 
  unhideImages();

  // remove transition listeners
  currentImage.removeEventListener('transitionstart', afterSlideRightStart);
  nextImage.removeEventListener('transitionend', afterPreviousSlideCenterEnd);

  // restore button listeners
  enableListeners();

  // clear the requested id
  nextImage.setAttribute('id','');

  // restart the slide show
  playSlideShow();

  updateDots();
}

function afterSlideLeftStart() {
  const nextImage = document.querySelector('#requested');

  nextImage.addEventListener('transitionend', afterNextSlideCenterEnd);
  nextImage.classList.toggle('slide-center');
}

function afterSlideRightStart() {
  const nextImage = document.querySelector('#requested');

  nextImage.addEventListener('transitionend', afterPreviousSlideCenterEnd);
  nextImage.classList.toggle('slide-center');
}

function hideOtherImagesNext() {
  const currentImage = document.querySelector('.active');
  const nextImage = document.querySelector('#requested');
  const imageArr = [...images];

  imageArr.forEach((image) => {
    if (!((image === currentImage) || (image === nextImage))) {
      image.classList.toggle('hide');
    }
  });
}

function handleClickNext() {
  const currentImage = document.querySelector('.active');

  // remove button listeners until all transitions are complete
  disableListeners();

  // set direction to forward
  imageDirection = 'forward';

  // set the requested image
  const nextImage = getNextImage();
  nextImage.setAttribute('id','requested');

  if (currentImage !== nextImage) {
    advanceImage();
  }
}

function getImageBySrc(src) {
  const imageArr = [...images];
  let result;

  imageArr.forEach((image) => {
    if (image.getAttribute('src') === src) {
      result = image;
    }
  });
  return result;
}

function handleDotClick(event) {
  const imageSrc = event.target.getAttribute('id');
  const nextImage = getImageBySrc(imageSrc);
  const currentImage = document.querySelector('.active');

  // remove button listeners until all transitions are complete
  disableListeners();

  // set the direction
  imageDirection = calculateDirection(currentImage, nextImage);

  // set the requested image
  nextImage.setAttribute('id','requested');

  if (currentImage !== nextImage) {
    advanceImage();
  }
}

function advanceImage() {
  const currentImage = document.querySelector('.active');
  const nextImage = document.querySelector('#requested');

  // stop the slideshow from playing automatically (will restart when transition is complete)
  stopSlideShow();

  if (imageDirection === 'forward') {
    nextImage.classList.toggle('right');
    currentImage.addEventListener('transitionstart', afterSlideLeftStart);
    currentImage.classList.toggle('slide-left');
  }

  if (imageDirection === 'reverse') {
    nextImage.classList.toggle('left');
    currentImage.addEventListener('transitionstart', afterSlideRightStart);
    currentImage.classList.toggle('slide-right');
  }

  // hide any images that are not current or next
  hideOtherImagesNext();
}

function handleClickPrevious() {
  const currentImage = document.querySelector('.active');

  // remove button listeners until all transitions are complete
  disableListeners();

  // set direction to reverse
  imageDirection = 'reverse';

  // set the requested image
  const nextImage = getPreviousImage();
  nextImage.setAttribute('id','requested');

  if (currentImage !== nextImage) {
    advanceImage();
  }
}

function playSlideShow() {
  if (!intervalId) {
    intervalId = setInterval(handleClickNext, 5000);
  }
}

function stopSlideShow() {
  clearInterval(intervalId);
  intervalId = null;
}

function createDot() {
  const dot = document.createElement('i');
  dot.classList.add('far');
  dot.classList.add('fa-circle');
  return dot;
}

function displayDots() {
  const imageArr = [...images];

  imageArr.forEach((image) => {
    const dot = createDot();
    dot.setAttribute("id", image.getAttribute('src'));
    if (image.classList.contains('active')) {
      dot.classList.toggle('far');
      dot.classList.toggle('fas');
    }
    imageDotContainer.appendChild(dot);
    dot.addEventListener('click',handleDotClick);
  });
}

function updateDots() {
  const imageArr = [...images];
  const dots = document.querySelectorAll('.fa-circle');

  imageArr.forEach((image) => {
    if (image.classList.contains('active')) {
      dots.forEach((dot) => {
        if (dot.getAttribute('id') === image.getAttribute('src')) {
          dot.classList = '';
          dot.classList.add('fa-circle');
          dot.classList.add('fas');
        } else {
          dot.classList = '';
          dot.classList.add('fa-circle');
          dot.classList.add('far');
        }
      });
    }
  });
}

function calculateDirection(currentImage, nextImage) {
  const imageArr = [...images];
  const currentImageIndex = imageArr.indexOf(currentImage);
  const nextImageIndex = imageArr.indexOf(nextImage);

  // return forward if current has lesser index than next
  if ((currentImageIndex - nextImageIndex) < 0) {
    return 'forward';
  }

  // return reverse if current has greater index than next
  if ((currentImageIndex - nextImageIndex) > 0) {
    return 'reverse';
  }

  return null;
}

function disableListeners() {
  const dots = document.querySelectorAll('.fa-circle');

  nextBtn.removeEventListener('click', handleClickNext);
  previousBtn.removeEventListener('click', handleClickPrevious);
  dots.forEach((dot) => {
    dot.removeEventListener('click',handleDotClick);
  });
}

function enableListeners() {
  const dots = document.querySelectorAll('.fa-circle');

  previousBtn.addEventListener('click', handleClickPrevious);
  nextBtn.addEventListener('click', handleClickNext);

  dots.forEach((dot) => {
    dot.addEventListener('click',handleDotClick);
  });
}

nextBtn.addEventListener('click', handleClickNext);
previousBtn.addEventListener('click', handleClickPrevious);
displayDots();
playSlideShow();