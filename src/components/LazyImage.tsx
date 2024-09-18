import { useState, useEffect, useRef } from 'react';

export interface ILazyImage {
  id?: string;
  className?: string;
  src?: string;
  alt?: string;
}

const LazyImage: React.FC<ILazyImage> = ({ id, className, src, alt }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const imageElement = imgRef.current;

    if (imageElement?.complete) {
      setLoaded(true);
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          imageElement!.src = src as string;
          observer.disconnect();
        }
      });
    });

    if (imageElement) {
      observer.observe(imageElement);
    }

    return () => {
      if (imageElement) {
        observer.unobserve(imageElement);
      }
    };
  }, [src]);

  return (
    <>
      {!loaded && (
        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
          alt=""
          aria-hidden="true"
          className="img-fluid"
        />
      )}

      <img
        id={id}
        loading="lazy"
        src={src}
        alt={alt}
        ref={imgRef}
        onLoad={() => setLoaded(true)}
        className={`img-fluid ${className ?? ''} ${loaded ? 'lazyloaded' : 'lazyloading'}`}
      />
    </>
  );
};

export default LazyImage;
