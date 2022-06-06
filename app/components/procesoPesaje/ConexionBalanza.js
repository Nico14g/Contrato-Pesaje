import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, View, Platform } from "react-native";
import { Icon, Button } from "react-native-elements";
import { FormikProvider, useFormik } from "formik";
import { Picker } from "@react-native-picker/picker";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import { request, PERMISSIONS } from "react-native-permissions";

export default function ConexionBalanza(props) {
  const { permiso, setOpenSnackbar, setMessage, formik, valores } = props;
  const [pairedDevices, setPairedDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [conectedDevice, setConectedDevice] = useState(false);
  const [loading, setLoading] = useState(false);

  const formikBalanza = useFormik({
    initialValues: {
      name: "",
      id: "",
    },
  });
  const { values } = formikBalanza;

  const { setFieldValue } = formik;

  const getPairedDevices = async () => {
    Promise.resolve(RNBluetoothClassic.getBondedDevices()).then((paired) => {
      setPairedDevices(paired);
      if (paired.length > 0) {
        setSelectedDevice(paired[0].id);
        values.name = paired[0].name;
        values.id = paired[0].id;
      } else {
        values.name = "";
        values.id = "";
      }
    });
  };
  const getDeviceName = async () => {
    if (permiso) {
      const OsVer = Platform.constants["Release"];
      if (OsVer >= 12) {
        request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT).then(async (result) => {
          if (result === "granted") {
            await getPairedDevices();
          }
        });
      } else {
        await getPairedDevices();
      }
    } else {
      values.name = "";
      values.id = "";
    }
  };

  useEffect(() => {
    getDeviceName();
  }, [permiso]);

  const handleValueChange = (itemValue) => {
    setSelectedDevice(itemValue);
    if (itemValue !== "") {
      const device = pairedDevices.find((device) => device.id === itemValue);
      values.name = device.name;
      values.id = device.id;
    } else {
      values.name = "";
      values.id = "";
    }
  };

  const recibirPeso = async (device) => {
    try {
      let messages = await device.available();
      if (messages > 0) {
        let data = await device.read();
        while (messages > 10) {
          data = await device.read();
          messages--;
        }
        const pesoOriginal = data.replace(/\s/g, "").split("+", 2)[1];
        setFieldValue("pesoOriginal", pesoOriginal.split("kg", 2)[0]);
        setFieldValue(
          "peso",
          parseFloat(pesoOriginal.split("kg", 2)[0]) - valores.dcto
        );
        setFieldValue("bluetooth", true);

        await device.clear();
      } else {
        recibirPeso(device);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const conectarDispositivo = async () => {
    try {
      setLoading(true);
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();
      if (enabled) {
        const device = await RNBluetoothClassic.connectToDevice(
          selectedDevice,
          {
            DELIMITER: "\n",
          }
        );
        const conected = await device.isConnected();
        setConectedDevice(conected);
        if (conected) {
          const peso = await recibirPeso(device);
        } else {
          setLoading(false);
          setConectedDevice(false);
          setMessage("Error al conectar con el dispositivo Bluetooth");
          setOpenSnackbar(true);
        }
      } else {
        setLoading(false);
        setMessage(
          "Por Favor Active el Bluetooth Para Recibir los Datos de la Balanza"
        );
        setOpenSnackbar(true);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
      setConectedDevice(false);
      setMessage("Error al conectar con el dispositivo Bluetooth");
      setOpenSnackbar(true);
    }
  };

  return (
    <FormikProvider value={formikBalanza}>
      <View style={styles.containerTextFields}>
        <View style={styles.viewPicker}>
          <Picker
            selectedValue={selectedDevice}
            onValueChange={(itemValue, itemIndex) =>
              handleValueChange(itemValue)
            }
            placeholder="Seleccione un Dispositivo Bluetooth"
            mode="dropdown"
            style={styles.pickerContainer}
          >
            {pairedDevices.map((device) => (
              <Picker.Item
                key={device.id}
                label={device.name}
                value={device.id}
              />
            ))}
          </Picker>
        </View>
        <Button
          onPress={() => conectarDispositivo()}
          buttonStyle={styles.boton}
          icon={
            <Icon
              type="material-community"
              name="bluetooth-connect"
              size={20}
              color="white"
            />
          }
          titleStyle={{ fontSize: 14 }}
          title=" Recibir Peso"
          loading={loading}
        />
      </View>
    </FormikProvider>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.5,
    backgroundColor: "white",
  },
  viewPicker: {
    paddingVertical: 2,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 7,
    marginTop: 10,
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.51,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  container: {
    left: 0,
    marginTop: 15,
    alignSelf: "center",
    maxWidth: Dimensions.get("window").width * 0.45,
    borderColor: "gray",
  },

  boton: {
    width: Dimensions.get("window").width * 0.3,
    height: 46,
    backgroundColor: "#99c781",
    borderColor: "#3f9d2f",
    shadowOffset: { width: -1, height: 3 },
    shadowRadius: 4,
    shadowColor: "gray",
    marginLeft: 20,
    marginTop: 10,
  },
  containerTextFields: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
  },
});
