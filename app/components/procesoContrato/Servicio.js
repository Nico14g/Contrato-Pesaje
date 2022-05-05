import React, { useState, useEffect, useRef } from "react";
import { FormularioServicio } from "../formularios/FormularioServicio";
import { TituloSwitch } from "./TituloSwitch";
import { db } from "../../api/firebase";
import { collection, getDocs } from "firebase/firestore";
import firestore from "@react-native-firebase/firestore";

export default function Servicio(props) {
  const { setIndex } = props;
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [servicios, setServicios] = useState("");

  const [servicio, setServicio] = useState({
    nombreServicio: "",
    ubicacion: "",
    faenas: "",
    temporada: "",
    horasJornada: "",
    distribucionHoras: "",
    sueldo: "",
    labor: "",
  });
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
    firestore()
      .collection("Servicios")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setServicios(data);
      });
    //const querySnapshot = await getDocs(collection(db, "Servicios"));
  }
  return (
    <>
      <TituloSwitch
        isEnabled={isEnabled}
        toggleSwitch={toggleSwitch}
        title="Datos Servicio"
      />
      <FormularioServicio
        isEnabled={isEnabled}
        servicios={servicios}
        servicio={servicio}
        setServicio={setServicio}
        setIndex={setIndex}
      />
    </>
  );
}
