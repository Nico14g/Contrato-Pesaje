import React, { useState, useEffect, useRef } from "react";
import { FormularioServicio } from "../formularios/FormularioServicio";
import { TituloSwitch } from "./TituloSwitch";
import { db } from "../../api/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Servicio(props) {
  const { setIndex } = props;
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [servicios, setServicios] = useState("");
  const componentMounted = useRef(true);

  useEffect(() => {
    if (componentMounted.current) {
      consulta();
    }
    return () => {
      componentMounted.current = false;
    };
  }, []);

  async function consulta() {
    let data = [];
    const querySnapshot = await getDocs(collection(db, "Servicios"));
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    setServicios(data);
  }
  return (
    <>
      <TituloSwitch
        isEnabled={isEnabled}
        toggleSwitch={toggleSwitch}
        title="Datos Servicio"
      />
      <FormularioServicio
        servicios={servicios}
        setServicios={setServicios}
        setIndex={setIndex}
      />
    </>
  );
}
