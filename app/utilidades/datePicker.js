import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

export const DatePicker = (props) => {
  const {
    title,
    selectedDay,
    setSelectedDay,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    since,
    to,
    width,
  } = props;
  return (
    <>
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={{ ...styles.viewContainer2, width: width }}>
        <View
          style={{
            backgroundColor: "white",
            width: "27%",
          }}
        >
          <Text style={styles.texto}>Día</Text>
        </View>
        <View style={{ backgroundColor: "white", width: "35%" }}>
          <Text style={styles.texto}>Mes</Text>
        </View>
        <View style={{ backgroundColor: "white", width: "32%" }}>
          <Text style={styles.texto}>Año</Text>
        </View>
      </View>
      <View style={{ ...styles.viewContainer, width: width }}>
        <View style={styles.colA}>
          <DayPicker
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
        </View>
        <View style={styles.colB}>
          <MonthPicker
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </View>
        <View style={styles.colC}>
          <YearPicker
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            since={since}
            to={to}
          />
        </View>
      </View>
    </>
  );
};
export const DayPicker = (props) => {
  const { selectedDay, setSelectedDay } = props;
  return (
    <Picker
      selectedValue={selectedDay}
      onValueChange={(itemValue, itemIndex) => setSelectedDay(itemValue)}
      mode="dropdown"
    >
      <Picker.Item label="1" value={"1"} />
      <Picker.Item label="2" value={"2"} />
      <Picker.Item label="3" value={"3"} />
      <Picker.Item label="4" value={"4"} />
      <Picker.Item label="5" value={"5"} />
      <Picker.Item label="6" value={"6"} />
      <Picker.Item label="7" value={"7"} />
      <Picker.Item label="8" value={"8"} />
      <Picker.Item label="9" value={"9"} />
      <Picker.Item label="10" value={"10"} />
      <Picker.Item label="11" value={"11"} />
      <Picker.Item label="12" value={"12"} />
      <Picker.Item label="13" value={"13"} />
      <Picker.Item label="14" value={"14"} />
      <Picker.Item label="15" value={"15"} />
      <Picker.Item label="16" value={"16"} />
      <Picker.Item label="17" value={"17"} />
      <Picker.Item label="18" value={"18"} />
      <Picker.Item label="19" value={"19"} />
      <Picker.Item label="20" value={"20"} />
      <Picker.Item label="21" value={"21"} />
      <Picker.Item label="22" value={"22"} />
      <Picker.Item label="23" value={"23"} />
      <Picker.Item label="24" value={"24"} />
      <Picker.Item label="25" value={"25"} />
      <Picker.Item label="26" value={"26"} />
      <Picker.Item label="27" value={"27"} />
      <Picker.Item label="28" value={"28"} />
      <Picker.Item label="29" value={"29"} />
      <Picker.Item label="30" value={"30"} />
      <Picker.Item label="31" value={"31"} />
    </Picker>
  );
};

export const MonthPicker = (props) => {
  const { selectedMonth, setSelectedMonth } = props;
  return (
    <Picker
      selectedValue={selectedMonth}
      onValueChange={(itemValue, itemIndex) => setSelectedMonth(itemValue)}
      mode="dropdown"
    >
      <Picker.Item label="Enero" value={"01"} />
      <Picker.Item label="Febrero" value={"02"} />
      <Picker.Item label="Marzo" value={"03"} />
      <Picker.Item label="Abril" value={"04"} />
      <Picker.Item label="Mayo" value={"05"} />
      <Picker.Item label="Junio" value={"06"} />
      <Picker.Item label="Julio" value={"07"} />
      <Picker.Item label="Agosto" value={"08"} />
      <Picker.Item label="Septiembre" value={"09"} />
      <Picker.Item label="Octubre" value={"10"} />
      <Picker.Item label="Noviembre" value={"11"} />
      <Picker.Item label="Diciembre" value={"12"} />
    </Picker>
  );
};
export const YearPicker = (props) => {
  const { selectedYear, setSelectedYear, since, to } = props;
  const [years, setYears] = useState(anios);

  function anios() {
    let years = [];
    for (let index = since; index <= to; index++) {
      years.push(index);
    }
    return years;
  }

  const pickerItems = years.map((i) => (
    <Picker.Item key={i} label={i.toString()} value={i} />
  ));

  return (
    <Picker
      selectedValue={selectedYear}
      onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}
      mode="dropdown"
    >
      {pickerItems}
    </Picker>
  );
};
const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    alignSelf: "center",
    marginLeft: "3%",
  },
  viewContainer2: {
    flexDirection: "row",
    alignItems: "flex-start",
    alignSelf: "center",
    marginLeft: "3%",
  },
  colA: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "white",
    marginRight: 2,
    width: "27%",
  },
  colB: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "white",
    marginRight: 2,
    width: "35%",
  },
  colC: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "white",
    width: "32%",
  },
  title: {
    alignSelf: "center",
    backgroundColor: "white",
  },
  texto: {
    alignSelf: "center",
    backgroundColor: "white",
  },
});
