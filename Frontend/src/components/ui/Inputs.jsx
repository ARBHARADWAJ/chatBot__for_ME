
import React, { useId } from 'react';

// React.forwardRef allows this component to receive a ref and forward it to the underlying <input> element.
// This is crucial for form handling libraries to get direct access to the input DOM node.
const Input = React.forwardRef(function Input({
    label,
    type = 'text',
    className = '',
    ...props
}, ref) {
    // useId generates a unique ID for this component instance.
    // This is used to link the <label> to the <input> for accessibility.
    const id = useId();

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="inline-block mb-1 pl-1 text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id} // The unique ID is applied here
                ref={ref} // The forwarded ref is attached here
                className={`w-full px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 ${className}`}
                {...props}
            />
        </div>
    );
});

export default Input;