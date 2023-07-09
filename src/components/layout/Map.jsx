import { useEffect, useState } from "react";

export default function Map({ endereco }) {
    const [mapRequest, setMapRequest] = useState();

    const srcBase = "https://www.google.com/maps/embed/v1/place?";
    const key = "key=AIzaSyCojRKsj8D0It2bQehsnhBGcmp0JcRFl-o";
    const zoom = "&zoom=17"
    let address = "&q=Rua Dr. Montaury, 2107 - Madureira, Caxias do Sul - RS, 95020-190"; // Fórum

    const GetCidadeById = async (id_cidade) => {
        return await window.api.Action({ controller: "Cidades", action: "GetCidadeById", params: id_cidade });
    }

    useEffect( () =>{
        if (endereco.rua !== '' && endereco.cep !== '' && endereco.bairro !== '' && endereco.numero !== '' && endereco.id_cidade !== "" ) {
            const cidade = GetCidadeById(endereco.id_cidade);
            address = `&q=${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${cidade}, ${endereco.cep} `;
        }
        
        setMapRequest(srcBase + key + address + zoom);
        
    },[endereco]);


    return (

        <div className="row">

            <iframe
                height="450"
                loading="lazy"
                title="Endereco"
                // allowfullscreenreferrerpolicy="no-referrer-when-downgrade"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapRequest}
                >
            </iframe>

        </div>
    )
}
