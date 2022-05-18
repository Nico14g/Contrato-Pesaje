import React, { useState, useEffect, useRef } from "react";
import { FormularioEmpleado } from "../formularios/FormularioEmpleado";
import { TituloSwitch } from "./TituloSwitch";
import { db } from "../../api/firebase";
import { collection, getDocs } from "firebase/firestore";
import firestore from "@react-native-firebase/firestore";

export default function Empleado(props) {
  const { setIndex, user } = props;
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [empleados, setEmpleados] = useState("");
  const [empleado, setEmpleado] = useState({
    nombreEmpleado: "",
    numeroDocumento: "",
    direccion: "",
    nacionalidad: "",
    fechaNacimiento: "",
    rut: "",
    profesionOficio: "",
    estadoCivil: "",
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
    const cuid = user.rol === "company" ? user.uid : user.cuid;
    firestore()
      .collection("Empleados")
      .where("cuid", "==", cuid)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setEmpleados(data);
      });
    // const querySnapshot = await getDocs(collection(db, "Empleados"));
    // querySnapshot.forEach((doc) => {
    //   data.push(doc.data());
    // });
    // setEmpleados(data);
  }
  return (
    <>
      <TituloSwitch
        isEnabled={isEnabled}
        toggleSwitch={toggleSwitch}
        title="Datos Empleado"
      />
      <FormularioEmpleado
        cuid={user.rol === "company" ? user.uid : user.cuid}
        isEnabled={isEnabled}
        empleados={empleados}
        setEmpleados={setEmpleados}
        empleado={empleado}
        setEmpleado={setEmpleado}
        setIndex={setIndex}
      />
    </>
  );
}
