import { useEffect, useState, FormEvent } from "react";
import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";
import AccountNav from "../AccountNav";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";

// Define types for the state variables
export interface PlacePayload {
  title: string;
  address: string;
  photos: string[];
  description: string;
  perks: string[];
  extraInfo: string;
  checkIn: number;
  checkOut: number;
  maxGuests: number;
  price: number;
}

export interface PutPlacePayload extends PlacePayload {
  id: string;
}

export default function PlacesFormPage() {
  const { id } = useParams<{ id?: string }>();
  const [title, setTitle] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [addedPhotos, setAddedPhotos] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  const [perks, setPerks] = useState<string[]>([]);
  const [extraInfo, setExtraInfo] = useState<string>('');
  const [checkIn, setCheckIn] = useState<number>(11);
  const [checkOut, setCheckOut] = useState<number>(22);
  const [maxGuests, setMaxGuests] = useState<number>(1);
  const [price, setPrice] = useState<number>(2000);
  const [redirect, setRedirect] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then(response => {
      const data: PlacePayload = response.data;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  function inputHeader(text: string) {
    return (
      <h2 className="text-2xl text-white mt-4">{text}</h2>
    );
  }

  function inputDescription(text: string) {
    return (
      <p className="text-gray-500 text-sm">{text}</p>
    );
  }

  function preInput(header: string, description: string) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const placeData: PlacePayload = {
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    if (id) {
      // Update
      await axios.put('/places', { id, ...placeData });
      setRedirect(true);
    } else {
      // New place
      await axios.post('/places', placeData);
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to='/account/places' />;
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput('Title', 'Title for your place. should be short and catchy as in advertisement')}
        <input
          type="text"
          value={title}
          onChange={ev => setTitle(ev.target.value)}
          placeholder="For example: My lovely apartment"
        />
        {preInput('Address', 'Address to this place')}
        <input
          type="text"
          value={address}
          onChange={ev => setAddress(ev.target.value)}
          placeholder="full address"
        />
        {preInput('Photos', 'more = better')}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {preInput('Description', 'description of the place')}
        <textarea
          value={description}
          onChange={ev => setDescription(ev.target.value)}
        />
        {preInput('Perks', 'select all the perks of your place')}
        <div>
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preInput('Extra info', 'house rules, etc')}
        <textarea
          value={extraInfo}
          onChange={ev => setExtraInfo(ev.target.value)}
        />

        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="m-2 text-xl text-white">Check In</h3>
            <input
              type="number"
              value={checkIn}
              onChange={ev => setCheckIn(Number(ev.target.value))}
              placeholder="24 hours format"
            />
          </div>
          <div>
            <h3 className="m-2 text-xl text-white">Check Out</h3>
            <input
              type="number"
              value={checkOut}
              onChange={ev => setCheckOut(Number(ev.target.value))}
              placeholder="24 hours format"
            />
          </div>
          <div>
            <h3 className="m-2 text-xl text-white">Max number of guests</h3>
            <input
              type="number"
              value={maxGuests}
              max={50}
              onChange={ev => setMaxGuests(Number(ev.target.value))}
            />
          </div>
          <div>
            <h3 className="m-2 text-xl text-white">Price per night (&#8377; INR)</h3>
            <input
              type="number"
              value={price}
              onChange={ev => setPrice(Number(ev.target.value))}
            />
          </div>
        </div>
        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
}
