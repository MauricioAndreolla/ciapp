
import Select from 'react-select';

const InputDiasSemana = (props) => {

    const diasSemana = [
        { value: 0, label: "Segunda-feira" },
        { value: 1, label: "Terça-feira" },
        { value: 2, label: "Quarta-feira" },
        { value: 3, label: "Quinta-feira" },
        { value: 4, label: "Sexta-feira" },
        { value: 5, label: "Sábado" },
        { value: 6, label: "Domingo" }
    ]

    return (


        <Select
            options={diasSemana}
            id={props.id}
            name={props.name}
            onChange={(evt) => { props.handleChange(evt, props.name) }}
            value={props.value}
            readOnly={props.readOnly}
            isDisabled={props.disabled}
            isMulti
        />

    )


}

export default InputDiasSemana