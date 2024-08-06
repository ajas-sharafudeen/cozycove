interface Place {
  photos: string[];
}

interface PlaceImgProps {
  place: Place;
  index?: number;
  className?: string | null;
}

export default function PlaceImg({ place, index = 0, className = null }: PlaceImgProps) {
  // Check if there are no photos
  if (!place.photos?.length) {
    return ''; // Render nothing if there are no photos
  }

  if (!className) {
    className = 'object-cover'
  }

  return (
    <img
      className={className}
      src={'http://localhost:4000/uploads/' + place.photos[index]}
    />
  );
}
