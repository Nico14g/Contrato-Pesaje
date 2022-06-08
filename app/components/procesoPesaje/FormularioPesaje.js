import React, { useState } from "react";
import { StyleSheet, Dimensions, Text, View } from "react-native";
import { TextInput, Paragraph } from "react-native-paper";
import { Icon } from "react-native-elements";
import { FormikProvider } from "formik";
import { Picker } from "@react-native-picker/picker";

export default function FormularioPesaje(props) {
  const { formik, bandejas, errorPeso, setErrorPeso } = props;
  const [selectedBandeja, setSelectedBandeja] = useState();
  const [isSelected, setIsSelected] = useState(true);
  const { setValues, values } = formik;

  function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
  }

  const handleValueChange = (itemValue) => {
    setSelectedBandeja(itemValue);
    if (itemValue !== "") {
      const bandeja = bandejas.find((bandeja) => bandeja.id === itemValue);

      if (parseFloat(values.pesoOriginal) >= 0) {
        const resta = parseFloat(values.pesoOriginal) - bandeja.dcto;
        setValues({
          ...values,
          peso: roundToTwo(resta),
          cuid: bandeja.cuid,
          dcto: bandeja.dcto,
          id: bandeja.id,
          nombre: bandeja.nombre,
        });
      } else {
        setValues({
          ...values,
          cuid: bandeja.cuid,
          dcto: bandeja.dcto,
          id: bandeja.id,
          nombre: bandeja.nombre,
        });
      }

      setIsSelected(false);
    }
  };

  const actualizarEstado = (e, key) => {
    const str = e.replace(",", ".");
    setValues({ ...values, [key]: str });
    if (key === "pesoOriginal") {
      const valor = /^(?:[1-9]\d*|0)?(?:\.\d+)?$/gm.test(str);
      setErrorPeso(!valor);
      values.pesoOriginal = str;
      if (valor && str !== "") {
        setValues({
          ...values,
          peso: roundToTwo(parseFloat(str) - values.dcto),
          bluetooth: false,
        });
      } else {
        setValues({
          ...values,
          peso: "",
          bluetooth: false,
        });
      }
    }
  };

  return (
    <FormikProvider value={formik}>
      <View style={styles.viewPicker}>
        <Picker
          selectedValue={selectedBandeja}
          onValueChange={(itemValue, itemIndex) => handleValueChange(itemValue)}
          placeholder="Seleccione un Tipo de Bandeja"
          mode="dropdown"
          style={styles.pickerContainer}
        >
          {isSelected && (
            <Picker.Item label="Seleccione un Tipo de Bandeja" value="" />
          )}
          {bandejas.map((bandeja) => (
            <Picker.Item
              key={bandeja.id}
              label={bandeja.nombre}
              value={bandeja.id}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.containerTextFields}>
        <TextInput
          mode="outlined"
          style={styles.textInput}
          outlineColor="lightgrey"
          placeholder="Peso Bruto"
          onChangeText={(e) => actualizarEstado(e, "pesoOriginal")}
          keyboardType="number-pad"
          value={values.pesoOriginal.toString()}
          activeOutlineColor="lightgrey"
          right={<TextInput.Affix text="KG" />}
        />
        <View>
          <Icon name="arrow-right" type="material-community" />
        </View>
        <TextInput
          mode="outlined"
          style={styles.textInput}
          outlineColor="lightgrey"
          activeOutlineColor="lightgrey"
          placeholder="Peso Neto"
          keyboardType="numeric"
          value={values.peso.toString()}
          right={<TextInput.Affix text="KG" />}
        />
      </View>
      {errorPeso && (
        <Paragraph style={{ left: "7%", color: "#d32f2f" }}>
          Peso ingresado no válido
        </Paragraph>
      )}
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
    alignSelf: "center",
    borderRadius: 7,
    marginTop: 15,
    marginBottom: 25,
    width: Dimensions.get("window").width * 0.85,
  },
  autoCompleteInput: {
    borderRadius: 7,
    borderWidth: 1,
    backgroundColor: "white",
  },
  pickerContainer: {
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.85,
    backgroundColor: "white",
  },
  viewPicker: {
    paddingVertical: 2,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 7,
    marginTop: 10,
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.86,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  containerTextFields: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
  },
  container: {
    left: 0,
    marginTop: 15,
    alignSelf: "center",
    maxWidth: Dimensions.get("window").width * 0.45,
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
  textInput: {
    width: Dimensions.get("window").width * 0.37,
    backgroundColor: "white",
    height: 50,
    margin: 10,
  },
});
