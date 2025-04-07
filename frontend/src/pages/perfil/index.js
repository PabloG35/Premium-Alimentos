// src/pages/perfil/index.js
import ProtectedRoute from "@/src/components/ProtectedRoute";
import Layout from "@/src/components/Layout";
import { Tab } from "@headlessui/react";
import DatosTab from "@/src/pages/perfil/Datos";
import OrdenesTab from "@/src/pages/perfil/Ordenes";
import MascotasTab from "@/src/pages/perfil/Mascotas";

const Perfil = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="h-screen pt-8">
          {/* Título de la página */}
          <h1 className="text-3xl heading mb-4">Perfil</h1>
          {/* Tabs debajo del título */}
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-4">
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ${
                    selected
                      ? "bg-white shadow"
                      : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                  }`
                }
              >
                Datos
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ${
                    selected
                      ? "bg-white shadow"
                      : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                  }`
                }
              >
                Ordenes
              </Tab>
              <Tab
                disabled
                className={({ selected, disabled }) =>
                  disabled
                    ? "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-500 opacity-50 cursor-not-allowed"
                    : `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ${
                        selected
                          ? "bg-white shadow"
                          : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                      }`
                }
              >
                Mascotas
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel className="bg-white rounded-xl p-3">
                <DatosTab />
              </Tab.Panel>
              <Tab.Panel className="bg-white rounded-xl p-3">
                <OrdenesTab />
              </Tab.Panel>
              <Tab.Panel className="bg-white rounded-xl p-3">
                <MascotasTab />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Perfil;
