import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from "react-native";
import { Card, Icon } from "react-native-elements";
import * as Speech from "expo-speech";

import { size } from "lodash";

export default function ListaHistorial(props) {
  const { registros, setIndex } = props;
  const componentMounted = useRef(true);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    if (componentMounted.current) {
      setTimeout(() => {
        setCargado(true);
      }, 1000);
    }
    return () => {
      componentMounted.current = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {size(registros) > 0 ? (
        <FlatList
          data={registros}
          renderItem={(registro) => (
            <Lista registro={registro} setIndex={setIndex} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : cargado ? (
        <View style={styles.loaderContratos}>
          <Text style={styles.texto}>No se han encontrado categorías</Text>
          <Icon
            name="text-box-remove-outline"
            type="material-community"
            size={50}
          />
        </View>
      ) : (
        <View style={styles.loaderContratos}>
          <ActivityIndicator color="blue" size="large" />
          <Text>Cargando categorías</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

function Lista(props) {
  const { registro, setIndex } = props;

  function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
  }

  const obtenerAcumuladoDia = () => {
    let acumulado = 0;
    registro.item.registrosTemporero.map((registro) => {
      const fecha = registro.fecha.toDate();
      if (
        fecha.getFullYear() === new Date().getFullYear() &&
        fecha.getMonth() === new Date().getMonth() &&
        fecha.getDate() === new Date().getDate()
      ) {
        acumulado = acumulado + registro.peso;
      }
    });
    return acumulado;
  };

  const escuchar = () => {
    const acumuladoDia = obtenerAcumuladoDia();
    const texto =
      registro.item.nombreTemporero +
      " " +
      registro.item.apellidoTemporero +
      ", Hoy ha acumulado " +
      roundToTwo(acumuladoDia) +
      " kilogramos, y en total a pesado " +
      roundToTwo(registro.item.acumulado) +
      " kilogramos";
    Speech.stop();
    Speech.speak(texto);
  };

  return (
    <TouchableOpacity onPress={() => escuchar()}>
      <Card>
        <View style={styles.viewContainer}>
          <View style={styles.colA}>
            <Text style={styles.nombreText}>
              {registro.item.nombreTemporero +
                " " +
                registro.item.apellidoTemporero}
            </Text>
            <Text style={styles.nombreText}>{registro.item.idRegistro}</Text>
          </View>
          <View style={styles.colB}>
            <Text style={styles.nombreText}>
              Hoy: {roundToTwo(obtenerAcumuladoDia())} KG
            </Text>
            <Text style={styles.nombreText}>
              Total: {roundToTwo(registro.item.acumulado)} KG
            </Text>
          </View>
          <View style={styles.colC}>
            <Text style={styles.textoFecha}>Escuchar</Text>
            <Icon
              name="ear-hearing"
              type="material-community"
              size={30}
              style={{ marginRight: "40%" }}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    maxHeight: "70%",
    minHeight: "70%",
  },
  loaderContratos: {
    paddingTop: 20,
    alignItems: "center",
  },
  viewContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    height: 40,
    marginTop: -15,
    marginBottom: 15,
  },
  colA: {
    width: "40%",
  },
  colB: {
    width: "40%",
  },
  colC: {
    alignSelf: "center",
    width: "30%",
    marginTop: 12,
  },
  textoFecha: {
    marginTop: "7%",
  },
  nombreText: {
    fontWeight: "bold",
    marginTop: "7%",
  },
  texto: {
    fontSize: 18,
    marginBottom: 20,
  },
});
