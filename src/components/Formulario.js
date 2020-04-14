import React, {useState} from "react";
import styled from '@emotion/styled';
import PropTypes from 'prop-types'
import {obtenerDiferenciaYear, calcularMarca, obtenerPlan} from '../helper'

const Campo = styled.div`
    display: flex;
    margin-bottom: 1rem;
    align-items: center;
`;

const Label = styled.label`
    flex: 0 0 100px;
`;

const Select = styled.select`
    display: block;
    width: 100%;
    padding: 1rem;
    border: 1px solid #e1e1e1;
    -webkit-appearance: none;
`;

const InputRadio = styled.input`
    margin: 0 1rem;
`;

const Button = styled.input`
    background-color: transparent;
    font-size: 16px;
    width: 100%;
    padding: 1rem;
    color: #26C6DA;
    text-transform: uppercase;
    font-weight: bold;
    border: 2px solid #e1e1e1;
    border-radius: 15px;
    margin-top: 2rem;
    &:hover{
        background-color: #26C6DA;
        cursor: pointer;
        transition: background-color .3s ease;
        color:#fff
    }
`;

const Error= styled.div`
  background-color: rgb(96.9%, 18.8%, 0%); 
  color:white;
  padding:1rem;
  width:100%;
  text-align:center;
  border-radius:15px;
  margin-bottom:1rem;
`;

const Formulario = ({guardarResumen, guardarCargando}) => {
  const [datos, guardarDatos]=useState({
      marca: '',
      year: '',
      plan: ''
  });  
  const [error,guardarError]=useState(false);
  const {marca,year,plan}= datos;

  const obtenerInformacion= e => {
    guardarDatos({
      ...datos,
      [e.target.name] : e.target.value
    })
    guardarError(false);
  }

  const cotizarSeguro = e =>{
    e.preventDefault();
    if(marca.trim()==='' || year.trim()==='' || plan.trim()=== ''){
      guardarError(true)
      return
    }
    guardarError(false);

    let resultado=2000;

    //obtener diferncia de años
    const diferencia = obtenerDiferenciaYear(year)
    
    //por cada año restarr 3%
    resultado -=((diferencia * 3) * resultado) / 100;
    //americano 15, asiatico 5, europeo 30.
    resultado=calcularMarca(marca) * resultado;
    //basico aumenta 20%, completo 50 %
    const incremento = obtenerPlan(plan);
    resultado = parseFloat(incremento*resultado).toFixed(2);
    
    //Total
    guardarCargando(true);

    setTimeout(()=>{
      guardarCargando(false)
      guardarResumen({
        cotizacion : Number(resultado),
        datos:datos
      })
    },3000)


  }

  return (
    <form 
      onSubmit={cotizarSeguro}
    >
      {error ? <Error>Todos los campos son requeridos</Error>:null}
      <Campo>
        <Label>Marca</Label>
        <Select
          name="marca"
          value={marca}
          onChange={obtenerInformacion}
        >
          <option value="">-- Selecciona --</option>
          <option value="americano">Americano</option>
          <option value="europeo">Europeo</option>
          <option value="asiatico">Asiatico</option>
        </Select>
      </Campo>

      <Campo>
        <Label>Año</Label>
        <Select
        name="year"
        value={year}
        onChange={obtenerInformacion}
        >
          <option value="">-- Selecciona --</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
          <option value="2017">2017</option>
          <option value="2016">2016</option>
          <option value="2015">2015</option>
          <option value="2014">2014</option>
          <option value="2013">2013</option>
          <option value="2012">2012</option>
        </Select>
      </Campo>
      <Campo>
        <Label>Plan</Label>
        <InputRadio 
        type="radio"
        name="plan"
        value="basico"
        checked={plan==="basico"}
        onChange={obtenerInformacion}
        /> Basico
        <InputRadio 
        type="radio"
        name="plan"
        value="completo"
        checked={plan==="completo"}
        onChange={obtenerInformacion}
        /> Completo
      </Campo>
      <Button type="submit" value="Cotizar"/>
      
    </form>
  );
};

Formulario.propTypes = {
  guardarResumen: PropTypes.func.isRequired,
  guardarCargando: PropTypes.func.isRequired
}

export default Formulario;
