import { useEffect, useState } from "react"
import PhotosUploader from "../PhotosUploader"
import Perks from "../Perks"
import AccountNav from "../AccountNav"
import axios from "axios"
import { Navigate, useParams } from "react-router"

export default function PlacesFormPage() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [addedPhotos, setAddedPhotos] = useState([])
  const [description, setDescription] = useState('')
  const [perks, setPerks] = useState([])
  const [extraInfo, setExtraInfo] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [maxGuests, setMaxGuests] = useState(1)
  const [price, setPrice] = useState(2000)
  const [redirect, setRedirect] = useState(false)
  useEffect(() => {
    if (!id) {
      return
    }
    axios.get('/places/' + id).then(response => {
      const { data } = response
      setTitle(data.title)
      setAddress(data.address)
      setAddedPhotos(data.photos)
      setDescription(data.description)
      setPerks(data.perks)
      setExtraInfo(data.extraInfo)
      setCheckIn(data.checkIn)
      setCheckOut(data.checkout)
      setMaxGuests(data.maxGuests)
      setPrice(data.price)
    })
  }, [id])
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  function inputHeader(text) {
    return (
      <h2 className="text-2xl text-white mt-4">{text}</h2>

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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async function savePlace(ev) {
    ev.preventDefault()
    const placeData = {
      title, address, addedPhotos, description,
      perks, extraInfo, checkIn,
      checkOut, maxGuests, price
    }
    if (id) {
      // update
      await axios.put('/places', {
        id, ...placeData
      })
      setRedirect(true)
    } else {
      // new place
      await axios.post('/places', placeData)
      setRedirect(true)
    }
  }

  if (redirect) {
    return <Navigate to={'/account/places'} />
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput('Title', 'Title for your place, should be short and catchy as in advertisement')}
        <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="For example: My lovely apartment" />
        {preInput('Address', 'Address to this place')}
        <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="full address" />
        {preInput('Photos', 'more = better')}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {preInput('Description', 'description of the place')}
        <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
        {preInput('Perks', 'select all the perks of your place')}
        <div>
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preInput('Extra info', 'house rules, etc')}
        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />

        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="m-2 text-xl text-white">Check In</h3>
            <input type="text" value={checkIn}
              onChange={ev => setCheckIn(ev.target.value)} placeholder="24 hours format" />
          </div>
          <div>
            <h3 className="m-2 text-xl text-white">Check Out</h3>
            <input type="text" value={checkOut}
              onChange={ev => setCheckOut(ev.target.value)} placeholder="24 hours format" />
          </div>
          <div>
            <h3 className="m-2 text-xl text-white">Max number of guests</h3>
            <input type="number" value={maxGuests} max={50}
              onChange={ev => setMaxGuests(ev.target.value)} />
          </div>
          <div>
            <h3 className="m-2 text-xl text-white">Price per night (&#8377; INR)</h3>
            <input type="number" value={price}
              onChange={ev => setPrice(ev.target.value)} />
          </div>
        </div>
        <button className="primary my-4">Save</button>
      </form>
    </div>
  )
}