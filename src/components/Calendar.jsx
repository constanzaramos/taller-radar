export default function Calendar() {
    return (
      <div className="bg-white border rounded-xl p-4 text-sm text-center">
        <h3 className="font-semibold mb-2">April 2024</h3>
        <div className="grid grid-cols-7 gap-1">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
            <div key={d} className="text-neutral-500">{d}</div>
          ))}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`p-1.5 rounded ${i+1===15 ? "bg-sky-200 font-bold" : ""}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    );
  }
  