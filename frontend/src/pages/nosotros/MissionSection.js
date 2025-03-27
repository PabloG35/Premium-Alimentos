// src/pages/nosotrs/MissionSection.js
import React from "react";

const MissionSection = () => (
  <section className="h-[50vh] flex flex-col justify-center text-center">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-4">Nuestra misión</h2>
      <p className="text-lg text-gray-700 mb-8">
        Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem...
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-bold">44 million</h3>
          <p className="text-gray-600">Transactions every 24 hours</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold">$119 trillion</h3>
          <p className="text-gray-600">Assets under holding</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold">46,000</h3>
          <p className="text-gray-600">New users annually</p>
        </div>
      </div>
    </div>
  </section>
);

export default MissionSection;
