import React, { useState, useEffect } from "react";
import { FormularioEmpleado } from "../formularios/FormularioEmpleado";
import { TituloSwitch } from "./TituloSwitch";
import { db } from "../../api/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Empleado(props) {
  const { empleado, setEmpleado, setIndex } = props;
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [empleados, setEmpleados] = useState("");

  useEffect(() => {
    async function consulta() {
      let data = [];
      const querySnapshot = await getDocs(collection(db, "Empleados"));
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setEmpleados(data);
    }
    consulta();
  }, []);
  return (
    <>
      <TituloSwitch
        isEnabled={isEnabled}
        toggleSwitch={toggleSwitch}
        title="Datos Empleado"
      />
      <FormularioEmpleado
        empleados={empleados}
        setEmpleados={setEmpleados}
        empleado={empleado}
        setEmpleado={setEmpleado}
        setIndex={setIndex}
      />
    </>
  );
}
