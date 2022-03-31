import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Autocomplete from "react-native-autocomplete-input";
import { DatePicker } from "../../utilidades/datePicker";
import { validateRut, formatRut } from "@fdograph/rut-utilities";

export const FormularioAutocompleteEmpleado = (props) => {
  const {
    empleados,
    empleado,
    setEmpleado,
    selectedDay,
    setSelectedDay,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    setValues,
    values,
    setValidateRutEmpleado,
  } = props;

  const [hideResults, setHideResults] = useState({
    nombreEmpleado: true,
    numeroDocumento: true,
    direccion: true,
    nacionalidad: true,
    fechaNacimiento: true,
    rut: true,
    profesionOficio: true,
    estadoCivil: true,
  });

  const [options, setOptions] = useState({
    nombreEmpleado: [],
    numeroDocumento: [],
    direccion: [],
    nacionalidad: [],
    fechaNacimiento: [],
    rut: [],
    profesionOficio: [],
    estadoCivil: [],
  });

  useEffect(() => {
    let list = {
      nombreEmpleado: query("nombreEmpleado"),
      numeroDocumento: query("numeroDocumento"),
      direccion: query("direccion"),
      nacionalidad: query("nacionalidad"),
      fechaNacimiento: query("fechaNacimiento"),
      rut: query("rut"),
      profesionOficio: query("profesionOficio"),
      estadoCivil: query("estadoCivil"),
    };

    setOptions(list);
  }, [empleados]);

  function query(key) {
    let data = [];
    empleados.map((empleado) => data.push(empleado[key]));
    return data;
  }

  const seleccion = (item, key) => {
    const data = query(key);
    const index = data.indexOf(item);
    let newEmpleado = {
      nombreEmpleado: empleados[index].nombreEmpleado,
      numeroDocumento: empleados[index].numeroDocumento,
      direccion: empleados[index].direccion,
      nacionalidad: empleados[index].nacionalidad,
      fechaNacimiento: empleados[index].fechaNacimiento,
      rut: empleados[index].rut,
      profesionOficio: empleados[index].profesionOficio,
      estadoCivil: empleados[index].estadoCivil,
    };
    setSelectedDay(empleados[index].fechaNacimiento.split("-", 3)[0]);
    setSelectedMonth(empleados[index].fechaNacimiento.split("-", 3)[1]);
    setSelectedYear(empleados[index].fechaNacimiento.split("-", 3)[2]);
    setValues(newEmpleado);
    setEmpleado(newEmpleado);
  };

  return (
    <View style={styles.scrollView}>
      <Autocomplete
        style={styles.autoComplete}
        containerStyle={styles.autoCompleteContainer}
        inputContainerStyle={styles.autoCompleteInput}
        data={options.nombreEmpleado}
        placeholderTextColor="gray"
        placeholder="Nombre Empleado"
        value={empleado.nombreEmpleado}
        onChangeText={(text) => {
          setEmpleado({ ...empleado, nombreEmpleado: text });
          setValues({ ...values, nombreEmpleado: text });
          setOptions({
            ...options,
            nombreEmpleado: query("nombreEmpleado").filter((empleado) => {
              return empleado.toLowerCase().includes(text.toLowerCase());
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
      />

      <Autocomplete
        style={styles.autoComplete}
        containerStyle={styles.autoCompleteContainerRut}
        inputContainerStyle={styles.autoCompleteInput}
        data={options.rut}
        placeholderTextColor="gray"
        placeholder="Rut"
        value={empleado.rut}
        onChangeText={(text) => {
          setEmpleado({ ...empleado, rut: text });
          setValues({ ...values, rut: text });
          setValidateRutEmpleado(!validateRut(text));
          setValues({
            ...values,
            rut: formatRut(text),
          });
          setOptions({
            ...options,
            rut: query("rut").filter((empleado) => {
              return empleado.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, rut: false });
        }}
        onFocus={() => setHideResults({ ...hideResults, rut: false })}
        onEndEditing={() => {
          setValidateRutEmpleado(!validateRut(empleado.rut));
          setValues({
            ...values,
            rut: formatRut(empleado.rut),
          });
          setHideResults({ ...hideResults, rut: true });
        }}
        hideResults={hideResults.rut}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "rut");
                setOptions({
                  ...options,
                  rut: [],
                });
                setHideResults({ ...hideResults, rut: true });
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ),
        }}
      />
      {!validateRut(empleado.rut) ? (
        <Text
          style={{
            color: "red",
            alignSelf: "flex-start",
            marginBottom: 8,
            fontSize: 12,
            marginTop: 5,
            left: 7,
          }}
        >
          {" "}
          Rut no válido
        </Text>
      ) : (
        <View style={{ marginBottom: 25 }}></View>
      )}

      <Autocomplete
        style={styles.autoComplete}
        containerStyle={styles.autoCompleteContainer}
        inputContainerStyle={styles.autoCompleteInput}
        data={options.numeroDocumento}
        placeholderTextColor="gray"
        placeholder="Número de Documento"
        value={empleado.numeroDocumento}
        onChangeText={(text) => {
          setEmpleado({ ...empleado, numeroDocumento: text });
          setValues({ ...values, numeroDocumento: text });
          setOptions({
            ...options,
            numeroDocumento: query("numeroDocumento").filter((empleado) => {
              return empleado.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, numeroDocumento: false });
        }}
        onFocus={() =>
          setHideResults({ ...hideResults, numeroDocumento: false })
        }
        onEndEditing={() =>
          setHideResults({ ...hideResults, numeroDocumento: true })
        }
        hideResults={hideResults.numeroDocumento}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "numeroDocumento");
                setOptions({
                  ...options,
                  numeroDocumento: [],
                });
                setHideResults({ ...hideResults, numeroDocumento: true });
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Autocomplete
        style={styles.autoComplete}
        containerStyle={styles.autoCompleteContainer}
        inputContainerStyle={styles.autoCompleteInput}
        data={options.nacionalidad}
        placeholderTextColor="gray"
        placeholder="Nacionalidad"
        value={empleado.nacionalidad}
        onChangeText={(text) => {
          setEmpleado({ ...empleado, nacionalidad: text });
          setValues({ ...values, nacionalidad: text });
          setOptions({
            ...options,
            nacionalidad: query("nacionalidad").filter((empleado) => {
              return empleado.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, nacionalidad: false });
        }}
        onFocus={() => setHideResults({ ...hideResults, nacionalidad: false })}
        onEndEditing={() =>
          setHideResults({ ...hideResults, nacionalidad: true })
        }
        hideResults={hideResults.nacionalidad}
        flatListProps={{
          nestedScrollEnabled: true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "nacionalidad");
                setOptions({
                  ...options,
                  nacionalidad: [],
                });
                setHideResults({ ...hideResults, nacionalidad: true });
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Autocomplete
        style={styles.autoComplete}
        containerStyle={styles.autoCompleteContainer}
        inputContainerStyle={styles.autoCompleteInput}
        data={options.profesionOficio}
        placeholderTextColor="gray"
        placeholder="Profesión u Oficio"
        value={empleado.profesionOficio}
        onChangeText={(text) => {
          setEmpleado({ ...empleado, profesionOficio: text });
          setValues({ ...values, profesionOficio: text });
          setOptions({
            ...options,
            profesionOficio: query("profesionOficio").filter((empleado) => {
              return empleado.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, profesionOficio: false });
        }}
        onFocus={() =>
          setHideResults({ ...hideResults, profesionOficio: false })
        }
        onEndEditing={() =>
          setHideResults({ ...hideResults, profesionOficio: true })
        }
        hideResults={hideResults.profesionOficio}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "profesionOficio");
                setOptions({
                  ...options,
                  profesionOficio: [],
                });
                setHideResults({ ...hideResults, profesionOficio: true });
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Autocomplete
        style={styles.autoComplete}
        containerStyle={styles.autoCompleteContainer}
        inputContainerStyle={styles.autoCompleteInput}
        data={options.estadoCivil}
        placeholderTextColor="gray"
        placeholder="Estado Civil"
        value={empleado.nacionalidad}
        onChangeText={(text) => {
          setEmpleado({ ...empleado, estadoCivil: text });
          setValues({ ...values, estadoCivil: text });
          setOptions({
            ...options,
            estadoCivil: query("estadoCivil").filter((empleado) => {
              return empleado.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, estadoCivil: false });
        }}
        onFocus={() => setHideResults({ ...hideResults, estadoCivil: false })}
        onEndEditing={() =>
          setHideResults({ ...hideResults, estadoCivil: true })
        }
        hideResults={hideResults.estadoCivil}
        flatListProps={{
          nestedScrollEnabled: true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "estadoCivil");
                setOptions({
                  ...options,
                  estadoCivil: [],
                });
                setHideResults({ ...hideResults, estadoCivil: true });
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Autocomplete
        style={styles.autoComplete}
        containerStyle={styles.autoCompleteContainer}
        inputContainerStyle={styles.autoCompleteInput}
        data={options.direccion}
        placeholderTextColor="gray"
        placeholder="Dirección"
        value={empleado.direccion}
        onChangeText={(text) => {
          setEmpleado({ ...empleado, direccion: text });
          setValues({ ...values, direccion: text });
          setOptions({
            ...options,
            direccion: query("direccion").filter((empleado) => {
              return empleado.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, direccion: false });
        }}
        onFocus={() => setHideResults({ ...hideResults, direccion: false })}
        onEndEditing={() => setHideResults({ ...hideResults, direccion: true })}
        hideResults={hideResults.direccion}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "direccion");
                setOptions({
                  ...options,
                  direccion: [],
                });
                setHideResults({ ...hideResults, direccion: true });
              }}
            >
              <Text style={{ fontSize: 16 }}>{item}</Text>
            </TouchableOpacity>
          ),
        }}
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
        width={"103%"}
      />
    </View>
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
    width: Dimensions.get("window").width * 0.85,
  },
  autoCompleteContainerRut: {
    borderRadius: 7,
    width: Dimensions.get("window").width * 0.85,
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
  scrollView: {
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    maxWidth: "90%",
  },
});
