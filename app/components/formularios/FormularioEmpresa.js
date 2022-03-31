import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text, FlatList } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateRut, formatRut } from "@fdograph/rut-utilities";
import { useFormik, FormikProvider } from "formik";
import { db } from "../../api/firebase";
import { doc, setDoc } from "firebase/firestore";
import { FormularioAutocompleteEmpresa } from "./FormularioAutocompleteEmpresa";
import { storeData } from "../../utilidades/variablesGlobales";
import { useKeyboard } from "@react-native-community/hooks";

export const FormularioEmpresa = (props) => {
  const { isEnabled, empresas, setEmpresas, setIndex } = props;
  const [validateRutRazon, setValidateRutRazon] = useState(false);
  const [validateRutRepresentante, setValidateRutRepresentante] =
    useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [empresa, setEmpresa] = useState({
    cargoRepresentante: "",
    ciudad: "",
    direccion: "",
    razonSocial: "",
    representante: "",
    rutRazonSocial: "",
    rutRepresentante: "",
  });
  const keyboard = useKeyboard();

  const validar = () => {
    setIsPressed(true);
    setIsValid(validarEntradas());
    if (validarEntradas() && !validateRutRazon && !validateRutRepresentante) {
      //almacenarDatosBD();
      storeData(empresa, "@datosEmpresa");
      setIndex(2);
    }
  };

  const almacenarDatosBD = async () => {
    await setDoc(
      doc(db, "Empresa", getFieldProps("rutRazonSocial").value),
      values
    );
  };

  const validarEntradas = () => {
    if (
      getFieldProps("razonSocial").value !== "" &&
      getFieldProps("rutRazonSocial").value !== "" &&
      getFieldProps("ciudad").value !== "" &&
      getFieldProps("representante").value !== "" &&
      getFieldProps("rutRepresentante").value !== "" &&
      getFieldProps("cargoRepresentante").value !== "" &&
      getFieldProps("direccion").value !== ""
    ) {
      return true;
    }
    return false;
  };

  const formik = useFormik({
    initialValues: {
      razonSocial: "",
      rutRazonSocial: "",
      ciudad: "",
      representante: "",
      rutRepresentante: "",
      cargoRepresentante: "",
      direccion: "",
    },
  });

  const { handleBlur, getFieldProps, setFieldValue, setValues, values } =
    formik;

  const actualizarEstado = (e, key) => {
    setValues({ ...values, [key]: e });
    setEmpresa({ ...empresa, [key]: e });
  };

  return (
    <FormikProvider value={formik}>
      <>
        {!isEnabled && (
          <ScrollView
            style={[
              styles.scrollView,
              keyboard.keyboardShown
                ? { maxHeight: "68%" }
                : { maxHeight: "80%" },
            ]}
            keyboardShouldPersistTaps="always"
          >
            {/* <TextInput
                mode="outlined"
                label="Razón Social"
                value={values.razonSocial}
                onChangeText={(e) => actualizarEstado(e, "razonSocial")}
                style={styles.textInput}
                selectionColor="blue"
                activeOutlineColor="blue"
                outlineColor="blue"
              /> */}
            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Razón Social"
              onChangeText={(e) => actualizarEstado(e, "razonSocial")}
              onBlur={handleBlur("razonSocial")}
              value={values.razonSocial}
            />

            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Rut Razón Social"
              onChangeText={(e) => actualizarEstado(e, "rutRazonSocial")}
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
              onChangeText={(e) => actualizarEstado(e, "ciudad")}
              onBlur={handleBlur("ciudad")}
              value={values.ciudad}
            />

            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Representante Legal"
              onChangeText={(e) => actualizarEstado(e, "representante")}
              onBlur={handleBlur("representante")}
              value={values.representante}
            />

            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Rut Representante Legal"
              onChangeText={(e) => actualizarEstado(e, "rutRepresentante")}
              onBlur={() => {
                setValidateRutRepresentante(
                  !validateRut(getFieldProps("rutRepresentante").value)
                );
                setFieldValue(
                  "rutRepresentante",
                  formatRut(getFieldProps("rutRepresentante").value)
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
              onChangeText={(e) => actualizarEstado(e, "cargoRepresentante")}
              onBlur={handleBlur("cargoRepresentante")}
              value={values.cargoRepresentante}
            />

            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Dirección Empresa"
              onChangeText={(e) => actualizarEstado(e, "direccion")}
              onBlur={handleBlur("direccion")}
              value={values.direccion}
            />
          </ScrollView>
        )}

        {isEnabled && (
          <View
            style={
              keyboard.keyboardShown
                ? { maxHeight: "68%" }
                : { maxHeight: "80%" }
            }
          >
            <FlatList
              // other FlatList props
              keyboardShouldPersistTaps="always"
              data={[]}
              ListFooterComponent={
                <FormularioAutocompleteEmpresa
                  empresas={empresas}
                  empresa={empresa}
                  setEmpresa={setEmpresa}
                  setValues={setValues}
                  values={values}
                  setValidateRutRazon={setValidateRutRazon}
                  setValidateRutRepresentante={setValidateRutRepresentante}
                />
              }
            />
          </View>
        )}
        <View style={styles.bottomContainer}>
          <View style={styles.item}>
            {isPressed && !isValid && (
              <Text style={{ color: "red" }}>Faltan campos por completar</Text>
            )}
          </View>
          <View style={styles.item2}>
            <Button
              onPress={() => validar()}
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
        </View>
      </>
    </FormikProvider>
  );
};

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
  autocompleteContainer: {
    top: 40,
    position: "absolute",
    zIndex: 10,
  },
  textInput: {
    left: "5%",
    width: "90%",
  },
});
/*
<View style={styles.autocompleteContainer}>
            <Autocomplete
              data={options.razonSocial}
              placeholder="razon social"
              onChangeText={(text) => {
                setOptions({
                  ...options,
                  razonSocial: query("razonSocial").filter((razon) =>
                    razon.toLowerCase().includes(text.toLowerCase())
                  ),
                });
                setEmpresa({ ...empresa, razonSocial: text });
              }}
              onFocus={() =>
                setHideResults({ ...hideResults, razonSocial: false })
              }
              onEndEditing={() =>
                setHideResults({ ...hideResults, razonSocial: true })
              }
              value={empresa.razonSocial}
              hideResults={hideResults.razonSocial}
              flatListProps={{
                keyExtractor: (_, idx) => idx,
                renderItem: ({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setEmpresa({ ...empresa, razonSocial: item });
                      setOptions({
                        ...options,
                        razonSocial: [],
                      });
                      setHideResults({ ...hideResults, razonSocial: true });
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ),
              }}
            />
          </View>





          <View style={styles.autocompleteContainer}>
            <Autocomplete
              data={options.razonSocial}
              placeholder="razon social"
              onChangeText={(text) => {
                setOptions({
                  ...options,
                  razonSocial: query("razonSocial").filter((razon) =>
                    razon.toLowerCase().includes(text.toLowerCase())
                  ),
                });
                setEmpresa({ ...empresa, razonSocial: text });
              }}
              onFocus={() =>
                setHideResults({ ...hideResults, razonSocial: false })
              }
              onEndEditing={() =>
                setHideResults({ ...hideResults, razonSocial: true })
              }
              defaultValue={empresa.razonSocial}
              value={empresa.razonSocial}
              hideResults={hideResults.razonSocial}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={Math.random()}
                  onPress={() => {
                    setEmpresa({ ...empresa, razonSocial: item });
                    setOptions({
                      ...options,
                      razonSocial: [],
                    });
                    setHideResults({ ...hideResults, razonSocial: true });
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
*/
