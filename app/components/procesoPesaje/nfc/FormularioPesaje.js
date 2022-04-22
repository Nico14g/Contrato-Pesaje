import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { FormikProvider } from "formik";

export default function FormularioPesaje(props) {
  const { formik } = props;
  c;

  const { handleBlur, getFieldProps, setValues, values } = formik;

  const actualizarEstado = (e, key) => {
    setValues({ ...values, [key]: e });
  };

  return (
    <FormikProvider value={formik}>
      {/* <Autocomplete
        style={styles.autoComplete}
        containerStyle={styles.autoCompleteContainer}
        inputContainerStyle={styles.autoCompleteInput}
        data={options.nombreEmpleado}
        placeholderTextColor="gray"
        placeholder="Seleccione Tipo de Bandeja"
        value={values.nombreBandeja}
        onChangeText={(text) => {
          setBandeja({ ...bandeja, nombre: text });
          setValues({ ...values, nombre: text });
          setOptions({
            ...options,
            nombre: query("nombre").filter((bandeja) => {
              return bandeja.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, nombreEmpleado: false });
        }}
        onFocus={() =>
          setHideResults({ ...hideResults, nombreEmpleado: false })
        }
        onEndEditing={() =>
          setHideResults({ ...hideResults, nombreEmpleado: true })
        }
        hideResults={hideResults.nombreEmpleado}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "nombreEmpleado");
                setOptions({
                  ...options,
                  nombreEmpleado: [],
                });
                setHideResults({
                  ...hideResults,
                  nombreEmpleado: true,
                });
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ),
        }}
      /> */}
    </FormikProvider>
  );
}

const styles = StyleSheet.create({
  autoComplete: {
    paddingHorizontal: 10,
    height: 50,
    fontSize: 16,
  },
  autoCompleteContainer: {
    borderRadius: 7,
    marginBottom: 25,
    width: Dimensions.get("window").width * 0.85,
  },
  autoCompleteInput: {
    borderRadius: 7,
    borderWidth: 1,
    backgroundColor: "white",
  },
});
