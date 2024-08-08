import Image from "./Image"

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
    <Image className={className} src={place.photos[index]} alt=""/>
  );
}
