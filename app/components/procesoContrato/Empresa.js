import React, { useState, useEffect, useRef } from "react";
import { FormularioEmpresa } from "../formularios/FormularioEmpresa";
import { TituloSwitch } from "./TituloSwitch";
import { db } from "../../api/firebase";
import { collection, getDocs } from "firebase/firestore";
import firestore from "@react-native-firebase/firestore";

export default function Empresa(props) {
  const { setIndex, user } = props;
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [empresas, setEmpresas] = useState([]);
  const [idEmpresas, setIdEmpresas] = useState([]);
  const componentMounted = useRef(true);

  useEffect(() => {
    if (componentMounted.current) {
      let data = [];
      let id = [];
      const cuid = user.rol === "company" ? user.uid : user.cuid;

      firestore()
        .collection("Empresa")
        .where("cuid", "==", cuid)
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            data.push(doc.data());
            id.push(doc.id);
          });
          setEmpresas(data);
          console.log(data);
          setIdEmpresas(id);
        });
      // getDocs(collection(db, "Empresa")).then((documentos) => {
      //   documentos.docs.forEach((doc) => {
      //     data.push(doc.data());
      //     id.push(doc.id);
      //   });
      //   setEmpresas(data);
      //   setIdEmpresas(id);
      // });
    }
    return () => {
      componentMounted.current = false;
    };
  }, []);

  // const consulta = async () => {
  //   try {
  //     let data = [];
  //     getDocs(collection(db, "Empresa")).then((documentos) => {
  //       documentos.docs.forEach((doc) => data.push(doc.data()));
  //       setEmpresas(data);
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  /*let data = [];
      const querySnapshot = await getDocs(collection(db, "Empresa"));
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setEmpresas(data); */
  return (
    <>
      <TituloSwitch
        isEnabled={isEnabled}
        toggleSwitch={toggleSwitch}
        title="Datos Empresa"
      />
      <FormularioEmpresa
        cuid={user.rol === "company" ? user.uid : user.cuid}
        isEnabled={isEnabled}
        empresas={empresas}
        setEmpresas={setEmpresas}
        setIndex={setIndex}
      />
    </>
  );
}

/*<View style={styles.container}>
        <View style={styles.item}>
          <Text style={styles.subtitulo}>Datos Empresa</Text>
        </View>
        <View style={styles.nuevo}>
          <Switch
            thumbColor="#f4f3f4"
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleSwitch()}
            value={isEnabled}
          />
          <Text>Existente</Text>
        </View>
      </View>*/
