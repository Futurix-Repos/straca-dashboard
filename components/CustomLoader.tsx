import {Loader2} from "lucide-react";


export default function CustomLoader() {

    return (<div className=" flex items-center justify-center min-h-[calc(60vh)]"><Loader2 className="animate-spin" color="black" size={50}/></div>)
}