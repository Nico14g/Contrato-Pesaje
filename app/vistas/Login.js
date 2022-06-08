import React, { useState } from "react";
import { StyleSheet, Image, Dimensions, ActivityIndicator } from "react-native";
import { TextInput, Button, Card, Title, Paragraph } from "react-native-paper";
import auth from "@react-native-firebase/auth";

export default function Login() {
  const [correo, setCorreo] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);

  const [show, setShow] = useState(true);

  function passwordValidator(password) {
    if (!password) return "La contraseña es requerida";
    return "";
  }

  function emailValidator(correo) {
    const re = /\S+@\S+\.\S+/;
    if (!correo) return "El Correo es requerido";
    if (!re.test(correo)) return "Ingrese un correo valido";
    return "";
  }
  const onLoginPressed = () => {
    const emailError = emailValidator(correo.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...correo, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    setCargando(true);
    loguear();
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Dashboard' }],
    // })
  };

  const loguear = () => {
    setError(false);
    auth()
      .signInWithEmailAndPassword(correo.value, password.value)
      .then(() => setCargando(false))
      .catch((e) => {
        setCargando(false);
        setError(true);
      });
  };
  return (
    <Card style={styles.row}>
      <Card.Content style={{ backgroundColor: "#E8E8E7" }}>
        <Title style={styles.title}>Gestión de Cosecha</Title>
        <Image
          source={require("../../assets/imagenes/agricultura.png")}
          resizeMode="contain"
          style={styles.logo}
        />
        <Title style={styles.title}>Iniciar Sesión</Title>
        <TextInput
          label="Correo"
          returnKeyType="next"
          value={correo.value}
          onChangeText={(text) => setCorreo({ value: text, error: "" })}
          error={!!correo.error}
          errorMessage={correo.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          mode="outlined"
          activeOutlineColor="#2f3bc7"
        />
        {!!correo.error && (
          <Paragraph style={{ left: 2, color: "#d32f2f" }}>
            {correo.error}
          </Paragraph>
        )}

        <TextInput
          label="Contraseña"
          returnKeyType="done"
          mode="outlined"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: "" })}
          error={!!password.error}
          errorMessage={password.error}
          secureTextEntry={show}
          activeOutlineColor="#2f3bc7"
          right={
            show ? (
              <TextInput.Icon
                name="eye-off"
                onPress={() => setShow((show) => !show)}
              />
            ) : (
              <TextInput.Icon
                name="eye"
                onPress={() => setShow((show) => !show)}
              />
            )
          }
        />
        {!!password.error && (
          <Paragraph style={{ left: 2, color: "#d32f2f" }}>
            {password.error}
          </Paragraph>
        )}
        {error && (
          <Paragraph style={{ left: 2, color: "#d32f2f" }}>
            Correo o contraseña incorrecta
          </Paragraph>
        )}

        {cargando ? (
          <ActivityIndicator
            color="blue"
            size="large"
            style={{ marginTop: 20 }}
          />
        ) : (
          <Button
            mode="contained"
            style={{ backgroundColor: "#2f3bc7", marginTop: 20 }}
            onPress={onLoginPressed}
          >
            Ingresar
          </Button>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  row: {
    backgroundColor: "#E8E8E7",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    flexDirection: "column",
    marginTop: 30,
  },
  forgot: {
    fontSize: 13,
    color: "#99c781",
  },
  link: {
    fontWeight: "bold",
    color: "#f1f3f9",
  },
  logo: {
    width: "100%",
    height: 150,
    marginTop: 40,
  },
  title: {
    color: "#2f3bc7",
    alignSelf: "center",
    marginTop: 40,
    fontSize: 25,
  },
});
