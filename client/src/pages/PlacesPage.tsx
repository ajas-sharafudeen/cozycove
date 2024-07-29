import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";

export default function PlacesPage() {
  const { action } = useParams()
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [addedPhotos, setAddedPhotos] = useState([])
  const [description, setDescription] = useState('')
  const [perks, setPerks] = useState([])
  const [extraInfo, setExtraInfo] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [maxGuests, setMaxGuests] = useState(1)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  function inputHeader(text) {
    return (
      <h2 className="text-2xl mt-4">{text}</h2>

    )
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  function inputDescription(text) {
    <p className="text-gray-500 text-sm">{text}</p>

  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    )
  }

  return (
    <div>
      {action != 'new' && (
        <div className="text-center">
          <Link className='inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full' to={'/account/places/new'}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add new place
          </Link>
        </div>
      )}

      {action === 'new' && (
        <div>
          <form>
            {preInput('Title', 'Title for your place, should be short and catchy as in advertisement')}
            <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example: My lovely apartment" />
            {preInput('Address', 'Address to this place')}
            <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address" />
            {preInput('Photos', 'more = better')}
            <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
            {preInput('Description', 'description of the place')}
            <textarea value={description} onChange={ev => setDescription(ev.target.value)} className="" />
            {preInput('Perks', 'select all the perks of your place')}
            <div>
              <Perks selected={perks} onChange={setPerks} />
            </div>
            {preInput('Extra info', 'house rules, etc')}
            <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
            {preInput('Check in & out times, max guests', 'Add check in and out times. Remember to have some time window for cleaning the room between guests.')}
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <h3 className="mt-2 -mb-2">Check in time</h3>
                <input type="text" value={checkIn} onChange={ev => setCheckIn(ev.target.value)} placeholder="14" />
              </div>
              <div>
                <h3 className="mt-2 -mb-2">Check out time</h3>
                <input type="text" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} placeholder="11" />
              </div>
              <div>
                <h3 className="mt-2 -mb-2">Max number of guests</h3>
                <input type="number" value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)} />
              </div>
            </div>
            <button className="primary my-4">Save</button>
          </form>
        </div>
      )}
    </div>
  )
}