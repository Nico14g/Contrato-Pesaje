import React, { useState, useEffect, useRef } from "react";
import { FormularioAnexos } from "../formularios/FormularioAnexos";
import { TituloSwitch } from "./TituloSwitch";
import { db } from "../../api/firebase";
import { collection, getDocs } from "firebase/firestore";
import firestore from "@react-native-firebase/firestore";

export default function Anexos(props) {
  const { user } = props;
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

  const [firmas, setFirmas] = useState({
    firmaEmpleador: "",
    firmaTrabajador: "",
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
    const cuid = user.rol === "company" ? user.uid : user.cuid;
    firestore()
      .collection("Anexos")
      .where("cuid", "==", cuid)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setAnexos(data);
      });
    //const querySnapshot = await getDocs(collection(db, "Anexos"));
  }
  return (
    <>
      <TituloSwitch
        isEnabled={isEnabled}
        toggleSwitch={toggleSwitch}
        title="Otros Datos"
      />
      <FormularioAnexos
        cuid={user.rol === "company" ? user.uid : user.cuid}
        isEnabled={isEnabled}
        anexos={anexos}
        anexo={anexo}
        setAnexo={setAnexo}
        firmas={firmas}
        setFirmas={setFirmas}
      />
    </>
  );
}
