export default function WorkshopCard({ title, date, city, price, image }) {
    return (
      <div className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition">
        <img src={image} alt={title} className="w-full h-40 object-cover" />
        <div className="p-4">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-neutral-600">{date}</p>
          <p className="text-sm text-neutral-600">{city}</p>
          <p className="text-sm font-medium mt-1">${price}</p>
        </div>
      </div>
    );
  }
  