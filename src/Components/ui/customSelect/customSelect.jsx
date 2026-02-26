"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomSelect({ options, value, onChange, name }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const selected = options.find((o) => o.value === value);

    // close when click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!ref.current?.contains(e.target)) setOpen(false);
        };
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative w-full">

            {/* selected */}
            <div
                onClick={() => setOpen(!open)}
                className={`form-control flex justify-between items-center cursor-pointer
        transition-all duration-200
        border focus-within:ring-2 focus-within:ring-primary-400
        ${open ? "ring-2 ring-primary-400" : ""}
        `}
            >
                <span className={`${!value && "text-gray-400"}`}>
                    {selected?.text || "Select option"}
                </span>

                <span
                    className={`transition-transform duration-300 text-xs ${open ? "rotate-180" : ""
                        }`}
                >
                    ▼
                </span>
            </div>

            {/* dropdown */}
            <div
                className={`absolute left-0 w-full mt-2 bg-white border rounded-2xl shadow-lg
        overflow-hidden transition-all duration-200 origin-top z-50
        ${open
                        ? "scale-y-100 opacity-100"
                        : "scale-y-95 opacity-0 pointer-events-none"
                    }`}
            >
                <div className="max-h-60 overflow-y-auto custom-scroll">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                onChange({
                                    target: { name, value: option.value },
                                });
                                setOpen(false);
                            }}
                            className={`px-4 py-2 cursor-pointer transition flex items-center justify-between
              hover:bg-primary-50
              ${value === option.value && "bg-primary-100 text-primary-700 font-medium"}
              `}
                        >
                            <div className="flex items-center justify-between w-full">
                                <p>{option.text}</p>

                                <p>{value === option.value && "✓"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}