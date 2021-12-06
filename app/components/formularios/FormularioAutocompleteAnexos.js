import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Autocomplete from "react-native-autocomplete-input";
import { DatePicker } from "../../utilidades/datePicker";
import { Picker } from "@react-native-picker/picker";

export const FormularioAutocompleteAnexos = (props) => {
  const {
    anexos,
    anexo,
    setAnexo,
    selectedDay,
    setSelectedDay,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    selectedPension,
    setSelectedPension,
    selectedSalud,
    setSelectedSalud,
    setValues,
    values,
  } = props;

  const [hideResults, setHideResults] = useState({
    fechaActual: true,
    fechaInicioFaenas: true,
    beneficios: true,
    regimenPension: true,
    regimenSalud: true,
    cantidadEjemplares: true,
  });

  const [options, setOptions] = useState({
    fechaActual: [],
    fechaInicioFaenas: [],
    beneficios: [],
    regimenPension: [],
    regimenSalud: [],
    cantidadEjemplares: [],
  });

  useEffect(() => {
    let list = {
      fechaActual: query("fechaActual"),
      fechaInicioFaenas: query("fechaInicioFaenas"),
      beneficios: query("beneficios"),
      regimenPension: query("regimenPension"),
      regimenSalud: query("regimenSalud"),
      cantidadEjemplares: query("cantidadEjemplares"),
    };

    setOptions(list);
  }, [anexos]);

  function query(key) {
    let data = [];
    anexos.map((anexo) => data.push(anexo[key]));
    return data;
  }

  const seleccion = (item, key) => {
    const data = query(key);
    const index = data.indexOf(item);
    let newAnexo = {
      fechaActual: anexos[index].fechaActual,
      fechaInicioFaenas: anexos[index].fechaInicioFaenas,
      beneficios: anexos[index].beneficios,
      regimenPension: anexos[index].regimenPension,
      regimenSalud: anexos[index].regimenSalud,
      cantidadEjemplares: anexos[index].cantidadEjemplares,
    };
    setSelectedPension(anexos[index].regimenPension);
    setSelectedSalud(anexos[index].regimenSalud);
    setSelectedDay(anexos[index].fechaInicioFaenas.split("-", 3)[0]);
    setSelectedMonth(anexos[index].fechaInicioFaenas.split("-", 3)[1]);
    setSelectedYear(anexos[index].fechaInicioFaenas.split("-", 3)[2]);
    setValues(newAnexo);
    setAnexo(newAnexo);
  };

  return (
    <ScrollView horizontal={false} style={styles.ScrollViewA}>
      <ScrollView horizontal={true}>
        <View>
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
            width="103%"
          />
          <View style={{ marginTop: 20 }}></View>
          <Autocomplete
            style={styles.autoComplete}
            containerStyle={styles.autoCompleteContainer}
            inputContainerStyle={styles.autoCompleteInput}
            data={options.beneficios}
            placeholderTextColor="gray"
            placeholder="Beneficios"
            value={anexo.beneficios}
            onChangeText={(text) => {
              setAnexo({ ...anexo, beneficios: text });
              setValues({ ...values, beneficios: text });
              setOptions({
                ...options,
                beneficios: query("beneficios").filter((anexo) => {
                  return anexo.toLowerCase().includes(text.toLowerCase());
                }),
              });
              setHideResults({ ...hideResults, beneficios: false });
            }}
            onFocus={() =>
              setHideResults({ ...hideResults, beneficios: false })
            }
            onEndEditing={() =>
              setHideResults({ ...hideResults, beneficios: true })
            }
            hideResults={hideResults.beneficios}
            flatListProps={{
              nestedScrollEnabled: () => true,
              keyExtractor: (_, idx) => idx,
              renderItem: ({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    seleccion(item, "beneficios");
                    setOptions({
                      ...options,
                      beneficios: [],
                    });
                    setHideResults({ ...hideResults, beneficios: true });
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{item}</Text>
                </TouchableOpacity>
              ),
            }}
          />

          <View style={styles.picker}>
            <Picker
              selectedValue={selectedPension}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedPension(itemValue)
              }
              mode="dropdown"
            >
              <Picker.Item label="Regimen Antiguo" value={"Regimen Antiguo"} />
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

          <Autocomplete
            style={styles.autoComplete}
            containerStyle={styles.autoCompleteContainer}
            inputContainerStyle={styles.autoCompleteInput}
            data={options.cantidadEjemplares}
            placeholderTextColor="gray"
            placeholder="Cantidad Ejemplares"
            value={anexo.cantidadEjemplares}
            onChangeText={(text) => {
              setAnexo({ ...anexo, cantidadEjemplares: text });
              setValues({ ...values, cantidadEjemplares: text });
              setOptions({
                ...options,
                cantidadEjemplares: query("cantidadEjemplares").filter(
                  (anexo) => {
                    return anexo.toLowerCase().includes(text.toLowerCase());
                  }
                ),
              });
              setHideResults({ ...hideResults, cantidadEjemplares: false });
            }}
            onFocus={() =>
              setHideResults({ ...hideResults, cantidadEjemplares: false })
            }
            onEndEditing={() =>
              setHideResults({ ...hideResults, cantidadEjemplares: true })
            }
            hideResults={hideResults.cantidadEjemplares}
            flatListProps={{
              nestedScrollEnabled: () => true,
              keyExtractor: (_, idx) => idx,
              renderItem: ({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    seleccion(item, "cantidadEjemplares");
                    setOptions({
                      ...options,
                      cantidadEjemplares: [],
                    });
                    setHideResults({
                      ...hideResults,
                      cantidadEjemplares: true,
                    });
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ),
            }}
          />
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    position: "absolute",
    right: "10%",
    left: "10%",
  },
  autoComplete: {
    paddingHorizontal: 10,
    height: 50,
    fontSize: 16,
  },
  autoCompleteContainer: {
    borderRadius: 7,
    marginBottom: 25,
    width: 350,
  },
  autoCompleteInput: {
    borderRadius: 7,
    borderWidth: 1,
    backgroundColor: "white",
  },
  ScrollViewA: {
    alignSelf: "center",
    maxHeight: "70%",
  },
  picker: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "lightgrey",
    maxWidth: "100%",
    backgroundColor: "white",

    marginBottom: 20,
  },
});
