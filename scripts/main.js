const nextBtn = document.querySelector('#next');
const previousBtn = document.querySelector('#previous');
const images = document.querySelectorAll('.carousel-image');
const imageDotContainer = document.querySelector('.image-dot-container');
let intervalId;

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
  const nextImage = getNextImage();

  currentImage.classList.toggle('active');
  currentImage.classList.toggle('slide-left');
  nextImage.classList.toggle('active');
  nextImage.classList.toggle('slide-center');
  nextImage.classList.toggle('right');

  // unhide all images 
  unhideImages();

  currentImage.removeEventListener('transitionstart',afterSlideLeftStart);
  nextImage.removeEventListener('transitionend',afterNextSlideCenterEnd);

  nextBtn.addEventListener('click', handleClickNext);
  playSlideShow();
  updateDots();
}

function afterPreviousSlideCenterEnd() {
  const currentImage = document.querySelector('.active');
  const previousImage = getPreviousImage();

  currentImage.classList.toggle('active');
  currentImage.classList.toggle('slide-right');
  previousImage.classList.toggle('active');
  previousImage.classList.toggle('slide-center');
  previousImage.classList.toggle('left');

  // unhide all images 
  unhideImages();

  currentImage.removeEventListener('transitionstart', afterSlideRightStart);
  previousImage.removeEventListener('transitionend', afterPreviousSlideCenterEnd);

  previousBtn.addEventListener('click', handleClickPrevious);
  playSlideShow();
  updateDots();
}

function afterSlideLeftStart() {
  const nextImage = getNextImage();

  nextImage.addEventListener('transitionend', afterNextSlideCenterEnd);
  nextImage.classList.toggle('slide-center');
}

function afterSlideRightStart() {
  const previousImage = getPreviousImage();

  previousImage.addEventListener('transitionend', afterPreviousSlideCenterEnd);
  previousImage.classList.toggle('slide-center');
}

function hideOtherImagesNext() {
  const currentImage = document.querySelector('.active');
  const nextImage = getNextImage();
  const imageArr = [...images];

  imageArr.forEach((image) => {
    if (!((image === currentImage) || (image === nextImage))) {
      image.classList.toggle('hide');
    }
  });
}

function hideOtherImagesPrevious() {
  const currentImage = document.querySelector('.active');
  const previousImage = getPreviousImage();
  const imageArr = [...images];

  imageArr.forEach((image) => {
    if (!((image === currentImage) || (image === previousImage))) {
      image.classList.toggle('hide');
    }
  });
}

function handleClickNext() {
  const currentImage = document.querySelector('.active');
  const nextImage = getNextImage();

  // stop the slideshow from playing automatically (will restart when transition is complete)
  stopSlideShow();

  // remove next button listener until all transitions are complete
  nextBtn.removeEventListener('click', handleClickNext);

  // place the next image on the right
  nextImage.classList.toggle('right');

  // hide any images that are not current or next
  hideOtherImagesNext();

  // slide the current image to the left
  currentImage.addEventListener('transitionstart', afterSlideLeftStart);
  currentImage.classList.toggle('slide-left');
}

function handleClickPrevious() {
  const currentImage = document.querySelector('.active');
  const previousImage = getPreviousImage();

  // stop the slideshow from playing automatically (will restart when transition is complete)
  stopSlideShow();

  // remove previous button listener until all transitions are complete
  previousBtn.removeEventListener('click', handleClickPrevious);

  // place the previous image on the left
  previousImage.classList.toggle('left');

  // hide any images that are not current or previous
  hideOtherImagesPrevious();

  // slide the current image to the right
  currentImage.addEventListener('transitionstart', afterSlideRightStart);
  currentImage.classList.toggle('slide-right');
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

nextBtn.addEventListener('click', handleClickNext);
previousBtn.addEventListener('click', handleClickPrevious);
displayDots();
playSlideShow();
