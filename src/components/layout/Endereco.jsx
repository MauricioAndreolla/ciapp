
import { useState } from "react";
import Select from 'react-select';
import _ from 'lodash';

const Endereco = (props) => {
    const [cidades, setCidades] = useState([{ value: -1, label: "Digite uma cidade" }]);
    const debouncedGetCidades = _.debounce(async (inputValue) => {
        try {
            const data = await window.api.Action({ controller: "Cidades", action: "GetCidades", params: inputValue });
            setCidades(data);
        } catch (error) {
            console.log(error);
        }
    }, 500);

    const handleInputChange = (inputValue) => {
        debouncedGetCidades(inputValue);
    }

    return (
        <>
            <div className="row form-group">

                <div className="input-form col-md-12">
                    <label htmlFor="rua">Rua</label>
                    <input
                        id="rua"
                        name="rua"
                        className="form-control shadow-none input-custom"
                        type="text"
                        placeholder=""
                        required={true}
                        value={props.endereco.rua}
                        onChange={props.handleChange}
                    />
                </div>


                <div className="input-form col-md-4">
                    <label htmlFor="numero">Número</label>
                    <input
                        id="numero"
                        name="numero"
                        className="form-control shadow-none input-custom"
                        type="number"
                        placeholder=""
                        required={true}
                        value={props.endereco.numero}
                        onChange={props.handleChange}
                    />
                </div>

                <div className="input-form col-md-8">
                    <label htmlFor="bairro">Bairro</label>
                    <input
                        id="bairro"
                        name="bairro"
                        className="form-control shadow-none input-custom"
                        type="text"
                        placeholder=""
                        required={true}
                        value={props.endereco.bairro}
                        onChange={props.handleChange}
                    />
                </div>

                <div className="input-form col-md-4">
                    <label htmlFor="cep">CEP</label>
                    <input
                        id="cep"
                        name="cep"
                        className="form-control shadow-none input-custom"
                        type="text"
                        placeholder=""
                        required={true}
                        value={props.endereco.cep}
                        onChange={props.handleChange}
                    />
                </div>

                <div className="input-form col-md-8">
                    <label htmlFor="id_cidade">Cidade</label>

                    <Select
                        options={cidades}
                        id="id_cidade"
                        name="id_cidade"
                        onChange={(evt) => { props.handleChange(evt, "id_cidade") }}
                        onInputChange={(evt) => { handleInputChange(evt) }}
                        value={cidades.find(s => s.value === props.endereco.id_cidade)}
                        required={true} />
                </div>

                <div className="input-form col-md-12">
                    <label htmlFor="complemento">Complemento</label>
                    <textarea
                        id="complemento"
                        name="complemento"
                        className="form-control shadow-none input-custom"
                        rows={7}
                        placeholder=""
                        value={props.endereco.complemento}
                        onChange={props.handleChange}
                    />
                </div>

            </div>
        </>
    );


}

export default Endereco
