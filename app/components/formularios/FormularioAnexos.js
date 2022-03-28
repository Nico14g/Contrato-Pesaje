import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { useFormik, FormikProvider } from "formik";
import { db } from "../../api/firebase";
import { collection, addDoc } from "firebase/firestore";
import { DatePicker } from "../../utilidades/datePicker";
import { Picker } from "@react-native-picker/picker";
import { FormularioAutocompleteAnexos } from "./FormularioAutocompleteAnexos";
import { useNavigation } from "@react-navigation/native";
import { storeData } from "../../utilidades/variablesGlobales";

export const FormularioAnexos = (props) => {
  const { isEnabled, anexos, anexo, setAnexo } = props;
  //validar horas y sueldo
  const navigation = useNavigation();
  const [isValid, setIsValid] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [selectedDay, setSelectedDay] = useState("1");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear() + ""
  );
  const [selectedPension, setSelectedPension] = useState("Regimen de Pensión");
  const [selectedSalud, setSelectedSalud] = useState("Regimen de Salud");

  const validar = () => {
    // enviar a edicion
    setIsPressed(true);
    setIsValid(validarEntradas());
    if (validarEntradas()) {
      almacenarDatosBD();

      navigation.navigate("EdicionContrato");
    }
  };

  const almacenarDatosBD = async () => {
    let date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let fechaActual = "";
    if (month < 10) {
      fechaActual = `${day}-0${month}-${year}`;
    } else {
      fechaActual = `${day}-${month}-${year}`;
    }
    let data = {
      ...values,
      fechaInicioFaenas: selectedDay + "-" + selectedMonth + "-" + selectedYear,
      fechaActual: fechaActual,
      regimenPension: selectedPension,
      regimenSalud: selectedSalud,
    };
    storeData(data, "@datosAnexos");
    //const docRef = await addDoc(collection(db, "Anexos"), data);
  };

  const validarEntradas = () => {
    if (
      getFieldProps("beneficios").value !== "" &&
      getFieldProps("cantidadEjemplares").value !== ""
    ) {
      return true;
    }
    return false;
  };

  const formik = useFormik({
    initialValues: {
      fechaActual: "",
      fechaInicioFaenas: "",
      beneficios: "",
      regimenPension: "",
      regimenSalud: "",
      cantidadEjemplares: "",
    },
  });

  const { handleBlur, getFieldProps, setValues, values } = formik;

  const actualizarEstado = (e, key) => {
    setValues({ ...values, [key]: e });
    setAnexo({ ...anexo, [key]: e });
  };

  return (
    <FormikProvider value={formik}>
      <>
        {!isEnabled ? (
          <ScrollView style={styles.scrollView}>
            <View style={{ marginBottom: 20 }}>
              <DatePicker
                title="Fecha de Inicio de Faenas"
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                since={new Date().getFullYear()}
                to={new Date().getFullYear() + 1}
                width="90%"
              />
            </View>
            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Beneficios"
              onChangeText={(e) => actualizarEstado(e, "beneficios")}
              onBlur={handleBlur("beneficios")}
              value={values.beneficios}
            />
            <View style={styles.picker}>
              <Picker
                selectedValue={selectedPension}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedPension(itemValue)
                }
                mode="dropdown"
              >
                <Picker.Item
                  label="Regimen Antiguo"
                  value={"Regimen Antiguo"}
                />
                <Picker.Item
                  label="Regimen Nuevo A.F.P"
                  value={"Regimen Nuevo A.F.P"}
                />
              </Picker>
            </View>
            <View style={styles.picker}>
              <Picker
                selectedValue={selectedSalud}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedSalud(itemValue)
                }
                mode="dropdown"
              >
                <Picker.Item label="Fonasa" value={"Fonasa"} />
                <Picker.Item label="Isapre" value={"Isapre"} />
              </Picker>
            </View>
            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Cantidad de ejemplares"
              onChangeText={(e) => actualizarEstado(e, "cantidadEjemplares")}
              onBlur={handleBlur("cantidadEjemplares")}
              value={values.cantidadEjemplares}
            />
          </ScrollView>
        ) : (
          <FormularioAutocompleteAnexos
            anexos={anexos}
            anexo={anexo}
            setAnexo={setAnexo}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedPension={selectedPension}
            setSelectedPension={setSelectedPension}
            selectedSalud={selectedSalud}
            setSelectedSalud={setSelectedSalud}
            setValues={setValues}
            values={values}
          />
        )}
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
                name="content-save"
                size={16}
                color="white"
              />
            }
            titleStyle={{ fontSize: 14 }}
            title=" Generar Contrato"
          />
        </View>
      </>
    </FormikProvider>
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
  boton: {
    backgroundColor: "#99c781",
    borderColor: "#3f9d2f",
    shadowOffset: { width: -1, height: 3 },
    shadowRadius: 4,
    shadowColor: "gray",
    borderRadius: 20,
  },
  bottomContainer: {
    flexDirection: "row",
  },
  item: {
    alignSelf: "center",
    alignItems: "center",
    width: "65%",
  },
  item2: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  picker: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "lightgrey",
    maxWidth: "84%",
    backgroundColor: "white",
    marginLeft: "8%",
    marginBottom: 20,
  },
});
