import React, { useState } from "react";
import { View } from "react-native";
import { useFormik, FormikProvider } from "formik";
import { Button, Dialog, Portal, Provider } from "react-native-paper";
import FormularioCategoria from "./FormularioCategoria";
import firestore from "@react-native-firebase/firestore";

export default function ModalCategoria(props) {
  const { open, setOpen, user, setOpenSnackbar, setMessage } = props;
  const [nombreValido, setNombreValido] = useState(true);
  const [fechaValida, setFechaValida] = useState(true);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      dateStart: new Date(),
    },

    onSubmit: () => guardarDatos(),
  });

  const { handleSubmit, values } = formik;

  const hideDialog = () => setOpen(false);

  const error = () => {
    setLoading(false);
    setMessage("Ha ocurrido un error.");
    setOpenSnackbar(true);
    setOpen(false);
  };

  const guardarDatos = async () => {
    setLoading(true);
    if (values.name !== "" && values.dateStart !== "") {
      setNombreValido(true);
      setFechaValida(true);
      const data = {
        ...values,
        dateEnd: "",
        cuid: user.rol === "company" ? user.uid : user.cuid,
        id: values.name,
      };
      await firestore()
        .collection("category")
        .add(data)
        .then(async (e) => {
          const info = { ...data, id: e.id };
          await firestore()
            .collection("category")
            .doc(e.id)
            .set(info)
            .then(() => {
              setLoading(false);
              setMessage("Se ha guardado correctamente en la base de datos");
              setOpenSnackbar(true);
              setOpen(false);
            })
            .catch(() => {
              error();
            });
        })
        .catch(() => {
          error();
        });
    } else {
      setLoading(false);
      if (values.name === "") {
        setNombreValido(false);
      }
      if (values.dateStart === "") {
        setFechaValida(false);
      }
    }
  };
  return (
    <Provider>
      <View>
        <Portal>
          <Dialog
            visible={open}
            onDismiss={hideDialog}
            style={{ backgroundColor: "#f2f2f2" }}
          >
            <Dialog.Title style={{ alignSelf: "center", color: "black" }}>
              {" "}
              Datos de la Nueva Categoría
            </Dialog.Title>
            <FormikProvider value={formik}>
              <Dialog.Content>
                <FormularioCategoria
                  formik={formik}
                  nombreValido={nombreValido}
                  fechaValida={fechaValida}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog} color="#2f3bc7">
                  Cancelar
                </Button>
                <Button
                  loading={loading}
                  onPress={handleSubmit}
                  color="#2f3bc7"
                >
                  Guardar
                </Button>
              </Dialog.Actions>
            </FormikProvider>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
}
