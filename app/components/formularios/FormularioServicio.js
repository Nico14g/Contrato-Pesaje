import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { useFormik, FormikProvider } from "formik";
import { db } from "../../api/firebase";
import { collection, addDoc } from "firebase/firestore";

export const FormularioServicio = (props) => {
  const { servicios, setServicios, setIndex } = props;
  //validar horas y sueldo
  const [isValid, setIsValid] = useState(true);
  const [isPressed, setIsPressed] = useState(false);

  const validar = () => {
    setIndex(4);
    //almacenarDatosBD();
    /*setIsPressed(true);
    setIsValid(validarEntradas());
    if (isValid) {
      almacenarDatosBD();
      setIndex(3);
    }*/
  };

  const almacenarDatosBD = async () => {
    const docRef = await addDoc(collection(db, "Servicios"), values);
  };

  const validarEntradas = () => {
    if (
      getFieldProps("nombreServicio").value !== "" &&
      getFieldProps("ubicacion").value !== "" &&
      getFieldProps("faenas").value !== "" &&
      getFieldProps("temporada").value !== "" &&
      getFieldProps("horasJornada").value !== "" &&
      getFieldProps("distribucionHoras").value !== "" &&
      getFieldProps("sueldo").value !== "" &&
      getFieldProps("labor").value !== ""
    ) {
      return true;
    }
    return false;
  };

  const formik = useFormik({
    initialValues: {
      nombreServicio: "",
      ubicacion: "",
      faenas: "",
      temporada: "",
      horasJornada: "",
      distribucionHoras: "",
      sueldo: "",
      labor: "",
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
            placeholder="Nombre Servicio"
            onChangeText={handleChange("nombreServicio")}
            onBlur={handleBlur("nombreServicio")}
            value={values.nombreServicio}
          />

          <Input
            containerStyle={styles.container}
            inputContainerStyle={styles.inputContainer}
            style={styles.input}
            placeholderTextColor="gray"
            placeholder="Ubicación"
            onChangeText={handleChange("ubicacion")}
            onBlur={handleBlur("ubicacion")}
            value={values.ubicacion}
          />

          <Input
            containerStyle={styles.container}
            inputContainerStyle={styles.inputContainer}
            style={styles.input}
            placeholderTextColor="gray"
            placeholder="Faenas"
            onChangeText={handleChange("faenas")}
            onBlur={handleBlur("faenas")}
            value={values.faenas}
          />

          <Input
            containerStyle={styles.container}
            inputContainerStyle={styles.inputContainer}
            style={styles.input}
            placeholderTextColor="gray"
            placeholder="Temporada"
            onChangeText={handleChange("temporada")}
            onBlur={handleBlur("temporada")}
            value={values.temporada}
          />

          <Input
            containerStyle={styles.container}
            inputContainerStyle={styles.inputContainer}
            style={styles.input}
            placeholderTextColor="gray"
            placeholder="Horas por Jornada"
            onChangeText={handleChange("horasJornada")}
            onBlur={handleBlur("horasJornada")}
            value={values.horasJornada}
          />

          <Input
            containerStyle={styles.container}
            inputContainerStyle={styles.inputContainer}
            style={styles.input}
            placeholderTextColor="gray"
            placeholder="Distribución de Horas"
            onChangeText={handleChange("distribucionHoras")}
            onBlur={handleBlur("distribucionHoras")}
            value={values.distribucionHoras}
          />

          <Input
            containerStyle={styles.container}
            inputContainerStyle={styles.inputContainer}
            style={styles.input}
            placeholderTextColor="gray"
            placeholder="Sueldo"
            onChangeText={handleChange("sueldo")}
            onBlur={handleBlur("sueldo")}
            value={values.sueldo}
          />

          <Input
            containerStyle={styles.container}
            inputContainerStyle={styles.inputContainer}
            style={styles.input}
            placeholderTextColor="gray"
            placeholder="Labor"
            onChangeText={handleChange("labor")}
            onBlur={handleBlur("labor")}
            value={values.labor}
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