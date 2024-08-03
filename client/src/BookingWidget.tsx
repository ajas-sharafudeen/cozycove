import axios from "axios"
import { differenceInCalendarDays } from "date-fns"
import { useContext, useEffect, useState } from "react"
import { Navigate } from "react-router"
import { UserContext } from "./UserContext"

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [numberOfGuests, setNumberOfGuests] = useState(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [redirect, setRedirect] = useState('')
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (user) {
      setName(user.name)
    }
  }, [user])


  let numberOfNights = 0
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
  }

  async function bookThisPlace() {
    const response = await axios.post('/bookings', {
      checkIn, checkOut, numberOfGuests, name, phone,
      place: place._id,
      price: numberOfNights * place.price
    })
    const bookingId = response.data._id
    setRedirect(`/account/bookings/${bookingId}`)
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div className="bg-white text-black shadow p-4 rounded-2xl">
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
          {numberOfNights > 0 && (
            <div className="px-4 py-3 border-t">
              <label>Your full name:</label>
              <input type="text"
                value={name}
                onChange={ev => setName(ev.target.value)} />
              <label>Phone number:</label>
              <input type="tel"
                value={phone}
                onChange={ev => setPhone(ev.target.value)} />
            </div>
          )}
        </div>
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Book Now
        {numberOfNights > 0 && (
          <>
            <span> &#8377;{numberOfNights * place.price}</span>
          </>
        )}
      </button>
    </div>
  )
}