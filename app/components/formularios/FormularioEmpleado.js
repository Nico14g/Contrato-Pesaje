import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateRut, formatRut } from "@fdograph/rut-utilities";
import { useFormik, FormikProvider } from "formik";
import { db } from "../../api/firebase";
import { doc, setDoc } from "firebase/firestore";
import { DatePicker } from "../../utilidades/datePicker";

export const FormularioEmpleado = (props) => {
  const { empleados, setEmpleados, empleado, setEmpleado, setIndex } = props;
  const [validateRutEmpleado, setValidateRutEmpleado] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const validar = () => {
    setIndex(3);
    /*setIsPressed(true);
    setIsValid(validarEntradas());
    if (isValid && !validateRutEmpleado) {
      almacenarDatosBD();
      setIndex(3);
    }*/
  };

  const almacenarDatosBD = async () => {
    let data = {
      ...values,
      fechaNacimiento: selectedDay + "-" + selectedMonth + "-" + selectedYear,
    };
    await setDoc(doc(db, "Empleados", getFieldProps("rut").value), data);
  };

  const validarEntradas = () => {
    if (
      getFieldProps("nombreEmpleado").value !== "" &&
      getFieldProps("rut").value !== "" &&
      getFieldProps("numeroDocumento").value !== "" &&
      getFieldProps("nacionalidad").value !== "" &&
      getFieldProps("fechaNacimiento").value !== "" &&
      getFieldProps("profesionOficio").value !== "" &&
      getFieldProps("estadoCivil").value !== "" &&
      getFieldProps("direccion").value !== ""
    ) {
      return true;
    }
    return false;
  };

  const formik = useFormik({
    initialValues: {
      nombreEmpleado: "",
      rut: "",
      numeroDocumento: "",
      nacionalidad: "",
      fechaNacimiento: "",
      profesionOficio: "",
      estadoCivil: "",
      direccion: "",
    },
  });

  const { handleChange, handleBlur, getFieldProps, setFieldValue, values } =
    formik;

  return (
    <FormikProvider value={formik}>
      <>
        <ScrollView style={styles.scrollView}>
          <Input
            containerStyle={styles.container}
            inputContainerStyle={styles.inputContainer}
            style={styles.input}
            placeholderTextColor="gray"
            placeholder="Nombre Empleado"
            onChangeText={handleChange("nombreEmpleado")}
            onBlur={handleBlur("nombreEmpleado")}
            value={values.nombreEmpleado}
          />

          <Input
            containerStyle={styles.container}
            inputContainerStyle={styles.inputContainer}
            style={styles.input}
            placeholderTextColor="gray"
            placeholder="Rut"
            onChangeText={handleChange("rut")}
            onBlur={() => {
              setValidateRutEmpleado(!validateRut(getFieldProps("rut").value));
              setFieldValue("rut", formatRut(getFieldProps("rut").value));
            }}
            errorMessage={validateRutEmpleado && "Rut no válido"}
            value={values.rut}
          />

          <Input
            containerStyle={styles.container}
            inputContainerStyle={styles.inputContainer}
            style={styles.input}
            placeholderTextColor="gray"
            placeholder="Número de documento"
            onChangeText={handleChange("numeroDocumento")}
            onBlur={handleBlur("numeroDocumento")}
            value={values.numeroDocumento}
          />

          <Input
            containerStyle={styles.container}
            inputContainerStyle={styles.inputContainer}
            style={styles.input}
            placeholderTextColor="gray"
            placeholder="Nacionalidad"
            onChangeText={handleChange("nacionalidad")}
            onBlur={handleBlur("nacionalidad")}
            value={values.nacionalidad}
          />

          <Input
            containerStyle={styles.container}
            inputContainerStyle={styles.inputContainer}
            style={styles.input}
            placeholderTextColor="gray"
            placeholder="Profesión u Oficio"
            onChangeText={handleChange("profesionOficio")}
            onBlur={handleBlur("profesionOficio")}
            value={values.profesionOficio}
          />

          <Input
            containerStyle={styles.container}
            inputContainerStyle={styles.inputContainer}
            style={styles.input}
            placeholderTextColor="gray"
            placeholder="Estado Civil"
            onChangeText={handleChange("estadoCivil")}
            onBlur={handleBlur("estadoCivil")}
            value={values.estadoCivil}
          />

          <Input
            containerStyle={styles.container}
            inputContainerStyle={styles.inputContainer}
            style={styles.input}
            placeholderTextColor="gray"
            placeholder="Dirección"
            onChangeText={handleChange("direccion")}
            onBlur={handleBlur("direccion")}
            value={values.direccion}
          />

          <DatePicker
            title="Fecha de Nacimiento"
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            since={1960}
            to={2007}
          />
        </ScrollView>
        <View style={styles.bottomContainer}>
          <View style={styles.item}>
            {
              //isPressed && !isValid && (
              //<Text style={{ color: "red" }}>Faltan campos por completar</Text>)
            }
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
    flexDirection: "row",
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
