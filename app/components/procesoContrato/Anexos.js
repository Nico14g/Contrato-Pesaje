import React, { useState, useEffect, useRef } from "react";
import { FormularioAnexos } from "../formularios/FormularioAnexos";
import { TituloSwitch } from "./TituloSwitch";
import { db } from "../../api/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Anexos() {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [anexos, setAnexos] = useState("");
  const componentMounted = useRef(true);
  const [anexo, setAnexo] = useState({
    fechaActual: "",
    fechaInicioFaenas: "",
    beneficios: "",
    regimenPension: "",
    regimenSalud: "",
    cantidadEjemplares: "",
  });

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
    const querySnapshot = await getDocs(collection(db, "Anexos"));
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    setAnexos(data);
  }
  return (
    <>
      <TituloSwitch
        isEnabled={isEnabled}
        toggleSwitch={toggleSwitch}
        title="Otros Datos"
      />
      <FormularioAnexos
        isEnabled={isEnabled}
        anexos={anexos}
        anexo={anexo}
        setAnexo={setAnexo}
      />
    </>
  );
}
