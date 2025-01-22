import ProductTypeTable from "@/pages/dashboard/setting/components/ProductTypeTable";
import BlogTypeTable from "@/pages/dashboard/setting/components/BlogTypeTable";
import VehicleTypeTable from "@/pages/dashboard/setting/components/VehicleTypeTable";
import ContractTypeTable from "@/pages/dashboard/setting/components/ContractTypeTable";
import ProximityTable from "@/pages/dashboard/setting/components/ProximityTable";
import VehicleSourceTable from "@/pages/dashboard/setting/components/VehicleSourceTable";
import VehicleBrandTable from "@/pages/dashboard/setting/components/VehicleBrandTable";
import VehicleModelTable from "@/pages/dashboard/setting/components/VehicleModelTable";
import LocationTable from "@/pages/dashboard/setting/components/LocationTable";

import MeasureUnitTable from "@/pages/dashboard/setting/components/MeasureUnitTable";
import { AccordionElem } from "@/components/AccordionElem";

const SettingScreen = () => {
  const params = [
    {
      id: "1",
      title: "Paramétrage type de produit",
      widget: <ProductTypeTable />,
    },
    {
      id: "2",
      title: "Paramétrage unité de mesure",
      widget: <MeasureUnitTable />,
    },
    {
      id: "3",
      title: "Paramétrage de site",
      widget: <LocationTable />,
    },
    {
      id: "4",
      title: "Paramétrage type de véhicule",
      widget: <VehicleTypeTable />,
    },
    {
      id: "5",
      title: "Paramétrage source de véhicule",
      widget: <VehicleSourceTable />,
    },
    {
      id: "6",
      title: "Paramétrage marque de véhicule",
      widget: <VehicleBrandTable />,
    },
    {
      id: "7",
      title: "Paramétrage modèle de véhicule",
      widget: <VehicleModelTable />,
    },
    {
      id: "8",
      title: "Paramétrage type de contrat",
      widget: <ContractTypeTable />,
    },
    {
      id: "9",
      title: "Paramétrage proximité de contrat",
      widget: <ProximityTable />,
    },
    {
      id: "10",
      title: "Paramètre catégorie de blog",
      widget: <BlogTypeTable />,
    },
  ];

  return (
    <div className="pb-10 flex flex-col gap-5 p-7 justify-center text-black">
      <p className=" font-semibold text-2xl">Paramètres</p>
      <div className="grid grid-cols-2 gap-5">
        {params.map((elem, index) => (
          <AccordionElem
            key={`accordion-param-${elem.id}`}
            title={elem.title}
            content={elem.widget}
          />
        ))}
      </div>
    </div>
  );
};

export default SettingScreen;
