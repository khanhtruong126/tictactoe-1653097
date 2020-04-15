import React from 'react'

export default function Square({value, onClick, highlight}) {
    let squareStyle = {
        backgroundColor: highlight ? '#9be68a' : 'white'
    };

    return (
        <button className="square" onClick={onClick} style={squareStyle}>
            {value}
        </button>
    );
}
