import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateRut, formatRut } from "@fdograph/rut-utilities";
import { useFormik, FormikProvider } from "formik";
import { db } from "../../api/firebase";
import { doc, setDoc } from "firebase/firestore";
import { DatePicker } from "../../utilidades/datePicker";
import { FormularioAutocompleteEmpleado } from "./FormularioAutocompleteEmpleado";

export const FormularioEmpleado = (props) => {
  const { isEnabled, empleados, empleado, setEmpleado, setIndex } = props;
  const [validateRutEmpleado, setValidateRutEmpleado] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [selectedDay, setSelectedDay] = useState("1");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedYear, setSelectedYear] = useState("1960");

  const validar = () => {
    setIsPressed(true);
    setIsValid(validarEntradas());
    if (validarEntradas() && !validateRutEmpleado) {
      almacenarDatosBD();
      setIndex(3);
    }
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

  const { handleBlur, getFieldProps, setFieldValue, setValues, values } =
    formik;

  const actualizarEstado = (e, key) => {
    setValues({ ...values, [key]: e });
    setEmpleado({ ...empleado, [key]: e });
  };

  return (
    <FormikProvider value={formik}>
      <>
        {!isEnabled ? (
          <ScrollView style={styles.scrollView}>
            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Nombre Empleado"
              onChangeText={(e) => actualizarEstado(e, "nombreEmpleado")}
              onBlur={handleBlur("nombreEmpleado")}
              value={values.nombreEmpleado}
            />

            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Rut"
              onChangeText={(e) => actualizarEstado(e, "rut")}
              onBlur={() => {
                setValidateRutEmpleado(
                  !validateRut(getFieldProps("rut").value)
                );
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
              onChangeText={(e) => actualizarEstado(e, "numeroDocumento")}
              onBlur={handleBlur("numeroDocumento")}
              value={values.numeroDocumento}
            />

            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Nacionalidad"
              onChangeText={(e) => actualizarEstado(e, "nacionalidad")}
              onBlur={handleBlur("nacionalidad")}
              value={values.nacionalidad}
            />

            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Profesión u Oficio"
              onChangeText={(e) => actualizarEstado(e, "profesionOficio")}
              onBlur={handleBlur("profesionOficio")}
              value={values.profesionOficio}
            />

            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Estado Civil"
              onChangeText={(e) => actualizarEstado(e, "estadoCivil")}
              onBlur={handleBlur("estadoCivil")}
              value={values.estadoCivil}
            />

            <Input
              containerStyle={styles.container}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Dirección"
              onChangeText={(e) => actualizarEstado(e, "direccion")}
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
              width="90%"
            />
          </ScrollView>
        ) : (
          <FormularioAutocompleteEmpleado
            empleados={empleados}
            empleado={empleado}
            setEmpleado={setEmpleado}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            setValues={setValues}
            values={values}
            setValidateRutEmpleado={setValidateRutEmpleado}
          />
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
    bottom: 0,
    position: "absolute",
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
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
