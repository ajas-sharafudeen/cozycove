import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

interface Place {
  _id: string;
  title: string;
  address: string;
  description: string;
  checkIn: string;
  checkOut: string;
  maxGuests: number;
  extraInfo: string;
  photos?: string[]; 
  price: number;
}

export default function PlacePage() {
  const { id } = useParams<{ id: string }>();
  const [place, setPlace] = useState<Place | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then(response => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) return null;

  return (
    <div className="mt-4 -mx-8 px-8 pt-8 text-white">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place} />
      <div className="mt-8 mb-8 text-xl grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="my-4 font-semibold text-2xl">Description</h2>
            {place.description}
          </div>
          Check-in: {place.checkIn}<br />
          Check-out: {place.checkOut}<br />
          Max number of guests: {place.maxGuests}
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="-mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl text-white">Extra Information</h2>
        </div>
      </div>
      <div className="mb-4 mt-2 text-lg text-white leading-5">{place.extraInfo}</div>
    </div>
  );
}
