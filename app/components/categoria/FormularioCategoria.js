import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { FormikProvider } from "formik";
import { db } from "../../api/firebase";
import { doc, setDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function FormularioCategoria(props) {
  const { formik, nombreValido, fechaValida } = props;
  const [validateRutEmpleado, setValidateRutEmpleado] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [stringDate, setStringDate] = useState(formatDate(new Date()));

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function formatDate(date) {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join("/");
  }
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    actualizarEstado(currentDate, "dateStart");
    setStringDate(formatDate(currentDate));
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const validar = () => {
    setIsPressed(true);
    setIsValid(validarEntradas());
    if (validarEntradas() && !validateRutEmpleado) {
    }
  };

  const almacenarDatosBD = async () => {};

  const { handleBlur, getFieldProps, setValues, values } = formik;

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
        placeholder="Fecha Inicio"
        onFocus={showDatepicker}
        rightIcon={
          <Icon
            name="calendar"
            type="material-community"
            onPress={showDatepicker}
          />
        }
        errorMessage={!fechaValida && "Fecha requerida"}
        value={stringDate}
      />

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
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
