import { Link, useNavigate } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";

interface Place {
  _id: string;
  title: string;
  address: string;
  description: string;
  checkIn: string;
  checkOut: string;
  maxGuests: number;
  extraInfo: string;
  photos: string[];
  price: number;
}

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('/user-places').then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  const deletePlace = async (placeId: string) => {
    try {
      await axios.delete(`/places/${placeId}`);
      setPlaces((prevPlaces) => prevPlaces.filter((place) => place._id !== placeId));
      navigate('/account/places');
    } catch (error) {
      console.error("Failed to delete the place:", error);
    }
  };

  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link className='inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full' to={'/account/places/new'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add new place
        </Link>
      </div>
      <div className="mt-4">
        {places.length > 0 && places.map(place => (
          <Link
            key={place._id}
            to={`/account/places/${place._id}`}
            className="flex cursor-pointer gap-4 my-4 bg-gray-100 p-4 rounded-2xl"
          >
            <div className="flex w-32 h-32 bg-gray-300 shrink-0">
              <PlaceImg place={place} />
            </div>
            <div className="grow">
              <h2 className="text-xl">{place.title}</h2>
              <p className="text-sm mt-2">{place.description}</p>
            </div>
            <button onClick={() => deletePlace(place._id)} className="flex my-auto py-4 px-4 rounded-2xl shadow-md bg-red-500 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
