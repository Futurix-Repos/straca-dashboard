import { Permission } from "@/components/dashboard_components/users-permissions/UsersPermissionsList";

// export const BaseUrl: string = 'http://18.130.232.167:3000';
export const BaseUrl: string = 'http://localhost:3001';

export type TemplateInput = {
    id: string;
    label: string;
    placeholder: string;
    type: "text" | "textarea" | "select" | "password" | "file";
    options?: string[];
};
export type SettingsTemplateInput = {
    id: string,
    label: string,
    placeholder: string,
}
export const LOGIN_INPUTS: TemplateInput[] = [
    {
        id: "email",
        label: "Email",
        placeholder: "johndoe@gmail.com",
        type: "text",
    },
    {
        id: "password",
        label: "Mot de passe",
        placeholder: "*******",
        type: "password",
    },
];

export const BLOG_INPUTS: TemplateInput[] = [
    {
        id: "title",
        label: "Titre de l'article",
        placeholder: "titre",
        type: "text",
    },
    {
        id: "category",
        label: "Catégorie",
        placeholder: "Catégorie",
        type: "select",
        options: [],
    },
    {
        id: "image",
        label: "Image",
        placeholder: "Image mis en avant",
        type: "file",
    },
    {
        id: "description",
        label: "Description",
        placeholder: "This is the description of the blog",
        type: "text",
    },
];


export const TRACKING_INPUT: TemplateInput[] = [
    {
        id: "name",
        label: "Nom",
        placeholder: "John Doe",
        type: "text",
    },
    {
        id: "brand",
        label: "Marque",
        placeholder: "Nissan",
        type: "text",
    },
    {
        id: "type",
        label: "Type",
        placeholder: "Truck,Ship.....",
        type: "text",
    },
    {
        id: "orderId",
        label: "Commande Id",
        placeholder: "",
        type: "text",
    },
    {
        id: "registrationNumber",
        label: "Numéro d'enregistrement",
        placeholder: "",
        type: "text",
    },
];

export const JOB_INPUTS: TemplateInput[] = [
    {
        id: "post",
        label: "Poste",
        placeholder: "Chef de chantier",
        type: "text",
    },
    {
        id: "salary",
        label: "Salaire",
        placeholder: "500000",
        type: "text",
    },
    {
        id: "location",
        label: "Proximité",
        placeholder: "Benin",
        type: "text",
    },
    {
        id: "type",
        label: "Type de contract",
        placeholder: "Foley",
        type: "text",
    },
    {
        id: "description",
        label: "Description",
        placeholder: "this is the description",
        type: "textarea",
    },
];

export const SIGN_UP_INPUTS: TemplateInput[] = [
    {
        id: "email",
        label: "Email",
        placeholder: "johndoe@gmail.com",
        type: "text",
    },
    {
        id: "phone",
        label: "Numero de Télephone",
        placeholder: "12345678",
        type: "text",
    },
    {
        id: "password",
        label: "Mot de passe",
        placeholder: "*******",
        type: "text",
    },
    {
        id: "cpassword",
        label: "Confirmer votre mot de passe",
        placeholder: "*******",
        type: "text",
    },
]

export const FORGOT_PASSWORD_INPUTS: TemplateInput[] = [
    {
        id: "email",
        label: "Address e-mail",
        placeholder: "johndoe@gmail.com",
        type: "text",
    },
]

export const USER_CONFIG_INPUTS: TemplateInput[] = [
    {
        id: "email",
        label: "Email",
        placeholder: "johndoe@gmail.com",
        type: "text",
    },
    {
        id: "phone",
        label: "Numéro de téléphone",
        placeholder: "(+237) 696 88 77 55",
        type: "text",
    },
    {
        id: "nom",
        label: "Nom",
        placeholder: "John",
        type: "text",
    },
    {
        id: "prenom",
        label: "Prénom",
        placeholder: "Doe",
        type: "text",
    },
    {
        id: "title",
        label: "Titre",
        placeholder: "Manager",
        type: "text",
    },
    {
        id: "password",
        label: "Mot de passe",
        placeholder: "*******",
        type: "password",
    },
];
export const CLIENTS_CONFIG_INPUTS: TemplateInput[] = [
    {
        id: "email",
        label: "Email",
        placeholder: "johndoe@gmail.com",
        type: "text",
    },
    {
        id: "phone",
        label: "Numéro de téléphone",
        placeholder: "(+237) 696 88 77 55",
        type: "text",
    },
    {
        id: "nom",
        label: "Nom",
        placeholder: "John",
        type: "text",
    },
    {
        id: "prenom",
        label: "Prénom",
        placeholder: "Doe",
        type: "text",
    },
    {
        id: "entreprise",
        label: "Entreprise",
        placeholder: "Benin, Cotonou",
        type: "text",
    },
    {
        id: "password",
        label: "Mot de passe",
        placeholder: "*******",
        type: "password",
    },
];
export const PRODUCT_CONFIG_INPUTS: SettingsTemplateInput[] = [
    {
        id: "label",
        label: "Libelle",
        placeholder: "-------",
      
    },
    {
        id: "description",
        label: "Description",
        placeholder: "-------",
      
    },
]

export const ADD_ORDER_INPUTS: TemplateInput[] = [
    {
        id: "startDate",
        label: "Date début",
        placeholder: "08/10",
        type: "text",
    },
    {
        id: "serviceType",
        label: "Type de service ou produit",
        placeholder: "Transport de gravas",
        // type: "select",
        type: "text",
    },
    {
        id: "vehicle",
        label: "Véhicule de transport",
        placeholder: "BATEAU",
        // type: "select",
        type: "text",
    },
    {
        id: "endDate",
        label: "Date de fin",
        placeholder: "08/12",
        type: "text",
    },
    {
        id: "weight",
        label: "Poids (kg)",
        placeholder: "5kg",
        type: "text",
    },
    {
        id: "volume",
        label: "Volume (m3)",
        placeholder: "1m3",
        type: "text",
    },
    {
        id: "price",
        label: "Tarif (XOF)",
        placeholder: "10500",
        type: "text",
    },

    {
        id: "status",
        label: "Statut de la commande",
        placeholder: "En cours",
        // type: "select",
        type: "text",
    },
    {
        id: "description",
        label: "Description",
        placeholder: "Transport de gravas",
        type: "text",
    },
    // Order Client fields
    {
        id: "client",
        label: "Client",
        placeholder: "Veridian Junction",
        // type: "select",
        type: "text",
    },
    {
        id: "countryCode",
        label: "Country code",
        placeholder: "+229",
        type: "text",
    },
    {
        id: "phone",
        label: "Phone",
        placeholder: "99249702",
        type: "text",
    },
    {
        id: "email",
        label: "Email",
        placeholder: "michaelolusegun357@gmail.com",
        type: "text",
    },
    // Address de départ
    {
        id: "siteAddress",
        label: "Adresse de départ du site",
        placeholder: "Rue poisson",
        type: "text",
    },
    {
        id: "searchKeyword1",
        label: "Search for a geographical position",
        placeholder: "Placeholder",
        type: "text",
    },
    {
        id: "lat1",
        label: "Latitude",
        placeholder: "Placeholder",
        type: "text",
    },
    {
        id: "lon1",
        label: "Longitude",
        placeholder: "Placeholder",
        type: "text",
    },
    // Address du client
    {
        id: "clientAddress",
        label: "Adresse du client",
        placeholder: "Rue poisson",
        type: "text",
    },
    {
        id: "searchKeyword2",
        label: "Search for a geographical position",
        placeholder: "Placeholder",
        type: "text",
    },
    {
        id: "lat2",
        label: "Latitude",
        placeholder: "Placeholder",
        type: "text",
    },
    {
        id: "lon2",
        label: "Longitude",
        placeholder: "Placeholder",
        type: "text",
    },
];

export const ADD_PRICING_INPUTS: TemplateInput[] = [
    {
        id: "price",
        label: "Prix",
        placeholder: "200",
        type: "text",
    },
    {
        id: "typeColis",
        label: "Type de colis",
        placeholder: "Batterie",
        type: "select",
    },
    {
        id: "transportType",
        label: "Type de transport",
        placeholder: "avion",
        type: "select",
    },
    {
        id: "unit",
        label: "Unité",
        placeholder: "kg",
        type: "select",
    },
    {
        id: "description",
        label: "Description",
        placeholder: "Alex",
        type: "text",
    },
    {
        id: "quantity",
        label: "Quantité",
        placeholder: "2",
        type: "text",
    },
];

export const ADD_TRANSPORT_INPUTS: TemplateInput[] = [
    {
        id: "label",
        label: "Label",
        placeholder: "",
        type: "text",
    },
    {
        id: "description",
        label: "Description",
        placeholder: "",
        type: "text",
    },
];

export const validPermissionNames = [
    "employee",
    "client",
    "commande",
    "country",
    "measureUnit",
    "packageType",
    "pricing",
    "product",
    "transportType",
    "user",
    "permission",
];

export function checkPermissionNameToDisplay(permission: Permission) {
    let name = "";

    if (permission.name === "employee") name = "employé";
    else if (permission.name === "country") name = "pays";
    else if (permission.name === "measureUnit") name = "unité-de-mesure";
    else if (permission.name === "packageType") name = "type-de-packet";
    else if (permission.name === "pricing") name = "tarification";
    else if (permission.name === "product") name = "produit";
    else if (permission.name === "transportType") name = "type-de-transport";
    else if (permission.name === "user") name = "utilisateur";
    else name = permission.name;

    return name;
}

export function checkPermissionActionToDisplay(permission: Permission) {
    let action = "";

    if (permission.action === "update") action = "modifier";
    else if (permission.action === "delete") action = "supprimer";
    else if (permission.action === "read") action = "lire";
    else if (permission.action === "create") action = "créer";
    else action = permission.action;

    return action;
}
