import { useState } from "react"

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [numberOfGuests, setNumberOfGuests] = useState(1)
  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: &#8377; {place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="px-4 py-3">
            <label>Check in: </label>
            <input type="date"
              value={checkIn}
              onChange={ev => setCheckIn(ev.target.value)} />
          </div>
          <div className="px-4 py-3 border-l">
            <label>Check out: </label>
            <input type="date"
              value={checkOut}
              onChange={ev => setCheckOut(ev.target.value)} />
          </div>
        </div>
        <div>
          <div className="px-4 py-3 border-t">
            <label>Number of guests:</label>
            <input type="number"
              value={numberOfGuests}
              onChange={ev => setNumberOfGuests(ev.target.value)} />
          </div>
        </div>
      </div>
      <button className="primary mt-4">Book this place</button>
    </div>
  )
}