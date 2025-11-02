export default function Filters() {
    return (
      <div className="bg-white border rounded-xl p-4 space-y-3 text-sm">
        <select className="w-full border rounded-lg p-2">
          <option>Category</option>
        </select>
        <select className="w-full border rounded-lg p-2">
          <option>Price</option>
        </select>
        <select className="w-full border rounded-lg p-2">
          <option>City</option>
        </select>
      </div>
    );
  }
  