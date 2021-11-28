import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateRut, formatRut } from "@fdograph/rut-utilities";
import { Formik } from "formik";

export const FormularioEmpresa = (props) => {
  const { empresas, setEmpresas } = props;
  const [validateRutRazon, setValidateRutRazon] = useState(false);
  const [validateRutRepresentante, setValidateRutRepresentante] =
    useState(false);
  return (
    <Formik
      initialValues={{
        razonSocial: "",
        rutRazonSocial: "",
        ciudad: "",
        representante: "",
        rutRepresentante: "",
        cargoRepresentante: "",
        direccion: "",
      }}
      onSubmit={(values) => console.log(values)}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        getFieldProps,
        setFieldValue,
        values,
      }) => (
        <>
          <ScrollView style={styles.scrollView}>
            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Razón Social"
              onChangeText={handleChange("razonSocial")}
              onBlur={handleBlur("razonSocial")}
              value={values.razonSocial}
            />

            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Rut Razón Social"
              onChangeText={handleChange("rutRazonSocial")}
              onBlur={() => {
                setValidateRutRazon(
                  !validateRut(getFieldProps("rutRazonSocial").value)
                );
                setFieldValue(
                  "rutRazonSocial",
                  formatRut(getFieldProps("rutRazonSocial").value)
                );
              }}
              errorMessage={validateRutRazon && "Rut no válido"}
              value={values.rutRazonSocial}
            />

            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Ciudad"
              onChangeText={handleChange("ciudad")}
              onBlur={handleBlur("ciudad")}
              value={values.ciudad}
            />

            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Representante Legal"
              onChangeText={handleChange("representante")}
              onBlur={handleBlur("representante")}
              value={values.representante}
            />

            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Rut Representante Legal"
              onChangeText={handleChange("rutRepresentante")}
              onBlur={() => {
                setValidateRutRepresentante(
                  !validateRut(getFieldProps("rutRepresentante").value)
                );
                setFieldValue(
                  "rutRazonSocial",
                  formatRut(getFieldProps("rutRazonSocial").value)
                );
              }}
              errorMessage={validateRutRepresentante && "Rut no válido"}
              value={values.rutRepresentante}
            />

            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Cargo del Representante"
              onChangeText={handleChange("cargoRepresentante")}
              onBlur={handleBlur("cargoRepresentante")}
              value={values.cargoRepresentante}
            />

            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Dirección Empresa"
              onChangeText={handleChange("direccion")}
              onBlur={handleBlur("direccion")}
              value={values.direccion}
            />
          </ScrollView>
          <View style={styles.view}>
            <Button
              onPress={handleSubmit}
              buttonStyle={styles.boton}
              icon={
                <Icon
                  type="material-community"
                  name="arrow-right"
                  size={16}
                  color="white"
                />
              }
              iconRight
              titleStyle={{ fontSize: 14 }}
              title="Siguiente"
            />
          </View>
        </>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: "70%",
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
  view: {
    marginTop: 10,
    marginBottom: 10,
    marginRight: "8%",
    alignItems: "flex-end",
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
});
