import { useRouter } from "next/router";
import { DELETE } from "@/constants/fetchConfig";
import VehicleCard, { VehicleType } from "./SettingComponents/vehiclecard";
import ProductCard, { ProductType } from "./SettingComponents/productcard";
import CountryCard, { CountryType } from "./SettingComponents/countrycard";
import BlogCard, { BlogType } from "./SettingComponents/blogcard";
import ContractTypeCard from "./SettingComponents/contractTypeCard";
import ProximityCard from "./SettingComponents/proximityCard";

export const SettingScreen = () => {
  return (
    <div className="pb-10 flex flex-col justify-center text-black">
      <div className="pl-4 pt-4">
        <p className="mb-3 font-semibold text-2xl">Parametres</p>
        <div className="flex flex-row">
          <ProductCard />
          <BlogCard />
        </div>
        <div className="mt-4 flex flex-row">
          <VehicleCard />
          <CountryCard />
        </div>
        <div className="mt-4 flex flex-row">
          <ContractTypeCard />
          <ProximityCard />
        </div>
      </div>
    </div>
  );
};
