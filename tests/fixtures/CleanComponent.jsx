// Example with clean code - no unused items
import React from 'react';

export default function CleanComponent({ name, age }) {
    const greeting = `Hello, ${name}!`;

    const calculateYears = () => {
        return new Date().getFullYear() - age;
    };

    return (
        <div>
            <h1>{greeting}</h1>
            <p>Born in: {calculateYears()}</p>
        </div>
    );
}
