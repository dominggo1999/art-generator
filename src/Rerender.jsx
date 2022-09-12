import React, { useState } from 'react';
import 'twin.macro';

const Rerender = ({ setForce, force }) => {
  return (
    <button
      tw="text-white fixed top-3 left-2 bg-blue-500 rounded-full px-10 py-2 text-lg"
      onClick={() => setForce(!force)}
    >
      Refresh
    </button>
  );
};

export default Rerender;
