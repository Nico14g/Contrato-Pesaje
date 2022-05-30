import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { FormikProvider } from "formik";
import { db } from "../../api/firebase";
import { doc, setDoc } from "firebase/firestore";
import { validateRut, formatRut } from "@fdograph/rut-utilities";

export default function FormularioEnlace(props) {
  const { formik, nombreValido, validateRutEmpleado, setValidateRutEmpleado } =
    props;

  const almacenarDatosBD = async () => {};

  const { handleBlur, getFieldProps, setValues, setFieldValue, values } =
    formik;

  const actualizarEstado = (e, key) => {
    setValues({ ...values, [key]: e });
  };

  return (
    <FormikProvider value={formik}>
      <Input
        containerStyle={styles.container}
        inputContainerStyle={styles.inputContainer}
        style={styles.input}
        placeholderTextColor="gray"
        placeholder="Nombre"
        onChangeText={(e) => actualizarEstado(e, "name")}
        onBlur={handleBlur("name")}
        errorMessage={!nombreValido && "Nombre requerido"}
        value={values.name}
      />

      <Input
        containerStyle={styles.container}
        inputContainerStyle={styles.inputContainer}
        style={styles.input}
        placeholderTextColor="gray"
        placeholder="Rut"
        onChangeText={(e) => actualizarEstado(e, "rut")}
        onBlur={() => {
          setValidateRutEmpleado(!validateRut(getFieldProps("rut").value));
          values.rut = formatRut(values.rut);
        }}
        errorMessage={validateRutEmpleado && "Rut no válido"}
        value={values.rut}
      />
    </FormikProvider>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: "60%",
  },
  container: {
    alignSelf: "center",
    maxWidth: "90%",
    borderColor: "gray",
  },
  inputContainer: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "white",
    height: 50,
  },
  input: {
    height: 49,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  boton: {
    width: 90,
    height: 36,
    backgroundColor: "#99c781",
    borderColor: "#3f9d2f",
    shadowOffset: { width: -1, height: 3 },
    shadowRadius: 4,
    shadowColor: "gray",
    borderRadius: 20,
  },
  bottomContainer: {
    bottom: 0,
    position: "absolute",
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    width: "100%",
    height: 60,
  },
  item: {
    alignSelf: "center",
    alignItems: "center",
    width: "65%",
  },
  item2: {
    width: "27%",
    flexDirection: "row-reverse",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});
