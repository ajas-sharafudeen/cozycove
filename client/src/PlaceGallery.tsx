import { useState } from "react"

export default function PlaceGallery({ place }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-black text-white min-h-screen">
        <div className="bg-black p-8 grid gap-4">
          <div>
            <h2 className="text-3xl mr-48">Photos of {place.title}</h2>
            <button onClick={() => setShowAllPhotos(false)} className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow-2xl shadow-black bg-white text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Close photos
            </button>
          </div>
          {place?.photos?.length > 0 && place.photos.map(photo => (
            <div>
              <img src={'http://localhost:4000/uploads/' + photo} alt="" />
            </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="relative">
      <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
        <div>
          {place.photos?.[0] && (
            <div>
              <img onClick={() => setShowAllPhotos(true)} className="cursor-pointer aspect-square object-cover" src={"http://localhost:4000/uploads/" + place.photos[0]} alt="" />
            </div>
          )}
        </div>
        <div className="grid">
          {place.photos?.[1] && (
            <img onClick={() => setShowAllPhotos(true)} className="cursor-pointer aspect-square object-cover" src={"http://localhost:4000/uploads/" + place.photos[1]} alt="" />
          )}
          <div className="border overflow-hidden">
            {place.photos?.[2] && (
              <img onClick={() => setShowAllPhotos(true)} className="cursor-pointer aspect-square object-cover relative top-2" src={"http://localhost:4000/uploads/" + place.photos[2]} alt="" />
            )}
          </div>
        </div>
      </div>
      <button onClick={() => setShowAllPhotos(true)} className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md shadow-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
        Show more photos
      </button>
    </div>
  )
}