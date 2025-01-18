export const createGalleryCardsTemplate = picturesArr => {
  return picturesArr.reduce((acc, pictureInfo) => {
    return (
      acc +
      `
      <li class="gallery__item">
        <a class="gallery__link" href="${pictureInfo.original}" >
          <img src="${pictureInfo.preview}" alt="${pictureInfo.description}" />
        </a>
      </li>
    `
    );
  }, '');
};
