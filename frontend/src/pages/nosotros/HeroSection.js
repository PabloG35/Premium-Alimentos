import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden h-[calc(100vh-112px)]">
      <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="text-4xl heading tracking-tight text-gray-900 sm:text-6xl">
              Cambiamos la forma en que cuidas a tu perro
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              No solo vendemos alimento. Creamos un espacio donde puedes
              sentirte seguro de que estás haciendo lo correcto por quien más
              amas.
            </p>
          </div>
          <div className="mt-10">
            <div
              aria-hidden="true"
              className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
            >
              <div className="absolute transform sm:top-0 sm:left-1/2 sm:translate-x-8 lg:top-1/2 lg:left-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                    <div className="relative h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100 bg-lime-100">
                      <Image
                        alt=""
                        src="/Dogs/dog2.png"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-64 w-44 overflow-hidden rounded-lg bg-teal-100">
                      <Image
                        alt=""
                        src="/Dogs/dog3.png"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                    <div className="relative h-64 w-44 overflow-hidden rounded-lg bg-sky-100">
                      <Image
                        alt=""
                        src="/Dogs/dog4.png"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-64 w-44 overflow-hidden rounded-lg bg-fuchsia-100">
                      <Image
                        alt=""
                        src="/Dogs/dog6.png"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-64 w-44 overflow-hidden rounded-lg bg-pink-100">
                      <Image
                        alt=""
                        src="/Dogs/dog1.png"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                    <div className="relative h-64 w-44 overflow-hidden rounded-lg bg-red-100">
                      <Image
                        alt=""
                        src="/Dogs/dog5.png"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-64 w-44 overflow-hidden rounded-lg bg-amber-100">
                      <Image
                        alt=""
                        src="/Dogs/dog7.png"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Link
              href="/tienda"
              className="inline-block rounded-md border border-transparent bg-pm-azul px-8 py-3 text-center font-medium text-white hover:bg-pm-azulFuerte"
            >
              Tienda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
