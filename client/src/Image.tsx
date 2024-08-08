import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

const Image: React.FC<ImageProps> = ({ src, ...rest }) => {
  const processedSrc = typeof src === 'string' && src.includes('https://')
    ? src
    : `http://localhost:4000/uploads/${src}`;

  return <img {...rest} src={processedSrc} alt={rest.alt || ''} />;
};

export default Image;
